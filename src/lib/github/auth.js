import { App } from "@octokit/app";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

export async function getInstallationOctokit() {
  // Get GitHub integration from DynamoDB
  const result = await db.send(
    new GetCommand({
      TableName: "synchrise-integrations",
      Key: {
        integrationId: "github",
      },
    })
  );

  if (!result.Item) {
    throw new Error(
      "GitHub integration not found in DynamoDB"
    );
  }

  const installationId =
    result.Item.installationId;

  if (!installationId) {
    throw new Error(
      "GitHub installationId missing"
    );
  }

  // Create GitHub App instance
  const app = new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
  });

  // Create installation-scoped Octokit
  const octokit =
    await app.getInstallationOctokit(
      Number(installationId)
    );

  return octokit;
}