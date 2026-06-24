import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const installationId =
    searchParams.get("installation_id");

  if (!installationId) {
    return NextResponse.json(
      {
        error: "Missing installation ID",
      },
      { status: 400 }
    );
  }

  await db.send(
    new PutCommand({
      TableName: "synchrise-integrations",
      Item: {
        integrationId: "github",
        installationId,
        connected: true,
        connectedAt: new Date().toISOString(),
      },
    })
  );

  return NextResponse.redirect(
    new URL(
      "/dashboard/integrations",
      request.url
    )
  );
}