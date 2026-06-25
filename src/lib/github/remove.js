import { getInstallationOctokit } from "./auth";

export async function remove(username) {
  if (!username) {
    throw new Error("GitHub username is required");
  }

  const octokit = await getInstallationOctokit();

  // Get installation details
const repos = await octokit.request(
  "GET /installation/repositories"
);

  if (repos.data.repositories.length === 0) {
    throw new Error(
      "No repositories found for this installation. Add at least one repository to the GitHub App installation."
  );
}

  const org =
    repos.data.repositories[0].owner.login;

  console.log("Organization:", org);

  const result = {
    organization: org,
    username,
    actions: [],
  };

  // ----------------------------------------------------
  // STEP 1 - Remove Organization Membership
  // ----------------------------------------------------
  try {
    await octokit.request(
      "DELETE /orgs/{org}/members/{username}",
      {
        org,
        username,
      }
    );

    result.actions.push({
      action: "Organization Membership",
      success: true,
    });

  } catch (error) {
  console.error("GitHub Remove Error");
  console.error("Status:", error.status);
  console.error("Message:", error.message);
  console.error("Response:", error.response?.data);

  result.actions.push({
    action: "Organization Membership",
    success: false,
    status: error.status,
    error: error.message,
    details: error.response?.data,
  });
}

  // ----------------------------------------------------
  // STEP 2 - Remove Repository Access
  // (Coming Next)
  // ----------------------------------------------------

  /*
  const repositories =
    await octokit.request(
      "GET /orgs/{org}/repos",
      { org }
    );

  for (const repo of repositories.data) {

    try {

      await octokit.request(
        "DELETE /repos/{owner}/{repo}/collaborators/{username}",
        {
          owner: org,
          repo: repo.name,
          username,
        }
      );

      result.actions.push({
        action: `Repository ${repo.name}`,
        success: true,
      });

    } catch (error) {

      result.actions.push({
        action: `Repository ${repo.name}`,
        success: false,
        error: error.message,
      });

    }

  }
  */

  // ----------------------------------------------------
  // STEP 3 - Remove Team Membership
  // (Coming Later)
  // ----------------------------------------------------

  /*
  List Teams

  Remove User

  Save Result
  */

  // ----------------------------------------------------
  // Overall Status
  // ----------------------------------------------------

  result.success =
    result.actions.every(
      (action) => action.success
    );

  return result;
}