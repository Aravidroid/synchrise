import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function POST(request) {
  try {
    const body = await request.json();

    const eventId = crypto.randomUUID();

    const event = {
      id: eventId,
      employeeName: body.employeeName,
      employeeEmail: body.employeeEmail,
      tools: body.tools || [],
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // Save event
    await db.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_EVENTS_TABLE,
        Item: event,
      })
    );

    // Create one task per tool
    for (const tool of body.tools || []) {
      await db.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_TASKS_TABLE,
          Item: {
            eventId,
            taskId: crypto.randomUUID(),
            tool,
            status: "Pending",
            createdAt: new Date().toISOString(),
          },
        })
      );
    }

    return Response.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_EVENTS_TABLE,
      })
    );

    return Response.json(result.Items || []);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}