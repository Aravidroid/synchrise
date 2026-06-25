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
        success: false,
        error: "Missing installation ID",
      },
      { status: 400 }
    );
  }

  try {
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

    return NextResponse.json({
      success: true,
      message:
        "GitHub installation saved successfully",
      installationId,
    });

  } catch (error) {
    console.error(
      "GitHub callback error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}