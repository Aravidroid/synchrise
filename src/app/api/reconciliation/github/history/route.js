import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function GET() {

  const result = await db.send(
    new ScanCommand({
      TableName:
        "synchrise-reconciliation",
    })
  );

  return Response.json(
    result.Items || []
  );

}