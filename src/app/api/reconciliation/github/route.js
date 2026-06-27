import crypto from "crypto";

import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";

import { getInstallationOctokit } from "@/lib/github/auth";

export async function POST() {
  try {

    // -------------------------
    // Load Employees
    // -------------------------

    const employees = await db.send(
      new ScanCommand({
        TableName:"synchrise-employees",
      })
    );

    const activeEmployees =
      employees.Items || [];

    const employeeMap = new Map();

    for (const emp of employees.Items || []) {

  if (emp.status !== "Active") {
    continue;
  }

  employeeMap.set(
    emp.githubUsername.toLowerCase(),
    emp
  );

}

    // -------------------------
    // GitHub Members
    // -------------------------

    const octokit =
      await getInstallationOctokit();

    const repos =
      await octokit.request(
        "GET /installation/repositories"
      );

    const org =
      repos.data.repositories[0].owner.login;

    const members =
      await octokit.request(
        "GET /orgs/{org}/members",
        {
          org,
          per_page: 100,
        }
      );

    const findings = [];

    // -------------------------
    // Compare
    // -------------------------

    for (const member of members.data) {

      if (
        !employeeMap.has(
          member.login.toLowerCase()
        )
      ) {

        const finding = {

          scanId: crypto.randomUUID(),

          provider: "GitHub",

          username: member.login,

          status: "Orphaned",

          severity: "High",

          reason:
            "User exists in GitHub but not HR",

          createdAt:
            new Date().toISOString(),

        };

        findings.push(finding);

        await db.send(
          new PutCommand({
            TableName:
              "synchrise-reconciliation",
            Item: finding,
          })
        );

      }

    }

    return Response.json({

      success: true,

      organization: org,

      members: members.data.length,

      orphaned: findings.length,

      findings,

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