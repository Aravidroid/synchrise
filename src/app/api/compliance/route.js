import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function GET() {
  const events = await db.send(
    new ScanCommand({
      TableName: process.env.DYNAMODB_EVENTS_TABLE,
    })
  );

  const tasks = await db.send(
    new ScanCommand({
      TableName: process.env.DYNAMODB_TASKS_TABLE,
    })
  );

  const audits = await db.send(
    new ScanCommand({
      TableName: process.env.DYNAMODB_AUDIT_TABLE,
    })
  );

  return Response.json({
    totalEmployees: events.Items?.length || 0,

    completedEmployees:
      events.Items?.filter(
        (e) => e.status === "Completed"
      ).length || 0,

    totalTasks: tasks.Items?.length || 0,

    completedTasks:
      tasks.Items?.filter(
        (t) => t.status === "Completed"
      ).length || 0,

    totalAuditLogs:
      audits.Items?.length || 0,
  });
}