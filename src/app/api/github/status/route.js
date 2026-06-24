import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function GET() {
  const result = await db.send(
    new GetCommand({
      TableName: "synchrise-integrations",
      Key: {
        integrationId: "github",
      },
    })
  );

  return Response.json(
    result.Item || {
      connected: false,
    }
  );
}