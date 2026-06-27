import crypto from "crypto";
import { GetCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";
import { remove } from "@/lib/github/remove";
import { buildSimulation } from "@/lib/simulation/buildSimulation";

async function logAudit(eventId, employeeName, action, eventName, details = {}) {
  await db.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_AUDIT_TABLE,
      Item: {
        auditId: crypto.randomUUID(),
        eventId,
        employeeName,
        action,
        eventName,
        details,
        timestamp: new Date().toISOString(),
      },
    })
  );
}

export async function executeSimulation(eventId) {
  // Fetch Event from synchrise-events
  const { Item: event } = await db.send(
    new GetCommand({
      TableName: process.env.DYNAMODB_EVENTS_TABLE,
      Key: { id: eventId },
    })
  );

  if (!event) {
    throw new Error("Event not found");
  }

  // Update Status to Running in synchrise-events
  await db.send(
    new UpdateCommand({
      TableName: process.env.DYNAMODB_EVENTS_TABLE,
      Key: { id: eventId },
      UpdateExpression: "SET #status = :s",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":s": "Running" },
    })
  );

  await logAudit(eventId, event.employeeName, "Started offboarding", "Simulation Started");

  let allSuccess = true;
  const executionResults = [];
  
  // Re-build simulation dynamically to get steps
  const mockTasks = (event.tools || []).map(tool => ({ tool }));
  const simulation = buildSimulation(event, mockTasks);

  for (const step of simulation.steps) {
    let success = false;
    let result = null;
    let error = null;

    try {
      if (step.provider === "GitHub" && step.action === "Remove Organization Member") {
        if (!event.githubUsername) {
          throw new Error("GitHub username is missing from event data.");
        }
        result = await remove(event.githubUsername);
        success = result.success;
      } else {
        // Fallback for mock or unknown steps
        success = true;
        result = { mock: true, message: "Simulated success" };
        // Simulate wait
        await new Promise(r => setTimeout(r, step.estimatedSeconds * 1000));
      }
    } catch (e) {
      success = false;
      error = e.message;
    }

    if (!success) {
      allSuccess = false;
    }

    executionResults.push({
      step,
      success,
      result,
      error,
    });

    const actionMessage = `${step.provider} Access Removed${success ? "" : ` (Failed: ${error})`}`;
    await logAudit(eventId, event.employeeName, actionMessage, "Step Executed", {
      step,
      success,
      result,
      error,
    });
  }

  const finalStatus = allSuccess ? "Completed" : "Failed";

  await db.send(
    new UpdateCommand({
      TableName: process.env.DYNAMODB_EVENTS_TABLE,
      Key: { id: eventId },
      UpdateExpression: "SET #status = :s",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":s": finalStatus },
    })
  );

  const finalMessage = finalStatus === "Completed" ? "Completed offboarding" : "Failed offboarding";
  await logAudit(eventId, event.employeeName, finalMessage, `Simulation ${finalStatus}`, {
    results: executionResults,
  });

  return {
    success: allSuccess,
    status: finalStatus,
    results: executionResults,
  };
}
