import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const simulationId = searchParams.get("id"); // this corresponds to eventId

    if (!simulationId) {
      return Response.json(
        { success: false, error: "Missing simulation id" },
        { status: 400 }
      );
    }

    const { Items } = await db.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_AUDIT_TABLE,
        FilterExpression: "eventId = :sid",
        ExpressionAttributeValues: {
          ":sid": simulationId,
        },
      })
    );

    const timeline = Items || [];
    
    // Sort chronologically and format properties to match what the frontend expects
    const formattedTimeline = timeline
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(log => ({
        ...log,
        createdAt: log.timestamp, // Maps for UI component
      }));

    return Response.json({
      success: true,
      timeline: formattedTimeline,
    });

  } catch (error) {
    console.error("Replay Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}