import { getInstallationOctokit } from "@/lib/github/auth";

export async function GET() {
  try {
    const octokit = await getInstallationOctokit();

    const installation = await octokit.request(
      "GET /installation"
    );

    const org = installation.data.account.login;

    const members = await octokit.request(
      "GET /orgs/{org}/members",
      {
        org,
      }
    );

    return Response.json({
      success: true,
      organization: org,
      members: members.data,
    });

  } catch (error) {
    console.error(error);

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