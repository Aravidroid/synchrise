import { getInstallationOctokit } from "./auth";

export async function verifyRemoval(username, org) {
  const octokit = await getInstallationOctokit();

  try {
    await octokit.request(
      "GET /orgs/{org}/members/{username}",
      {
        org,
        username,
      }
    );

    // If request succeeds,
    // user is STILL a member.

    return {
      verified: false,
      message: "User still exists in organization",
    };

  } catch (error) {

    if (error.status === 404) {

      return {
        verified: true,
        message: "User successfully removed",
      };

    }

    throw error;
  }
}