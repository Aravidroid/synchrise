import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function GET() {
  const result = await db.send(
    new ScanCommand({
      TableName: process.env.DYNAMODB_AUDIT_TABLE,
    })
  );

  return Response.json(result.Items || []);
}