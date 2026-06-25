import { getInstallationOctokit } from "@/lib/github/auth";

export async function GET() {
  try {
    // Get authenticated GitHub client
    const octokit = await getInstallationOctokit();

    // Get installation details
    const installation = await octokit.request(
      "GET /installation"
    );

    const organization = installation.data.account.login;

    return Response.json({
      success: true,
      organization,
      installationId: installation.data.id,
      accountType: installation.data.account.type,
      accountId: installation.data.account.id,
    });

  } catch (error) {
    console.error("GitHub Org Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}