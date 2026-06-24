import { getInstallationOctokit }
  from "@/lib/github/auth";

export async function GET() {
  try {
    const octokit =
      await getInstallationOctokit();

    const response =
      await octokit.request(
        "GET /installation/repositories"
      );

    return Response.json({
      success: true,
      repositories:
        response.data.repositories,
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}