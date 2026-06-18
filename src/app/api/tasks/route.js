import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function GET() {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_TASKS_TABLE,
      })
    );

    return Response.json(result.Items || []);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}