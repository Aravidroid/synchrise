const installation =
  await octokit.request(
    "GET /installation"
  );

const org =
  installation.data.account.login;

const members =
  await octokit.request(
    "GET /orgs/{org}/members",
    {
      org,
    }
  );