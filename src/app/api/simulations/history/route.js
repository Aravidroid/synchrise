import {
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { db } from "@/lib/dynamo";

export async function GET() {

  const result = await db.send(
    new ScanCommand({
      TableName:
        process.env.DYNAMODB_SIMULATIONS_TABLE,
    })
  );

  const simulations =
    result.Items || [];

  simulations.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return Response.json(simulations);

}