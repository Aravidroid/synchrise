import { App } from "@octokit/app";

export async function getInstallationOctokit() {
  const app = new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
  });

  return await app.getInstallationOctokit(
    Number(process.env.GITHUB_INSTALLATION_ID)
  );
}