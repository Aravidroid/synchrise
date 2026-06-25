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
      repositoryCount:
        response.data.total_count,
      repositories:
        response.data.repositories.map(
          (repo) => ({
            name: repo.name,
            private: repo.private,
          })
        ),
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}