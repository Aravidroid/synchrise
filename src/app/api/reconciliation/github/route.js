import crypto from "crypto";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";
import { getInstallationOctokit } from "@/lib/github/auth";

export async function POST() {
  try {
    const timestamp = new Date().toISOString();
    const findings = [];

    // -------------------------
    // Load Employees (HR State)
    // -------------------------
    const employeesResult = await db.send(
      new ScanCommand({
        TableName: "synchrise-employees",
      })
    );
    const activeEmployees = (employeesResult.Items || []).filter(emp => emp.status === "Active");
    const employeeMap = new Map();
    for (const emp of activeEmployees) {
      if (emp.githubUsername) {
        employeeMap.set(emp.githubUsername.toLowerCase(), emp);
      }
    }

    // -------------------------
    // Load Offboarding Events
    // -------------------------
    const eventsResult = await db.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_EVENTS_TABLE || "synchrise-events",
      })
    );
    const offboardingEvents = (eventsResult.Items || []).filter(
      event => event.status === "Completed" && event.githubUsername
    );

    // -------------------------
    // Fetch Actual GitHub Members
    // -------------------------
    const octokit = await getInstallationOctokit();
    const repos = await octokit.request("GET /installation/repositories");
    const org = repos.data.repositories[0].owner.login;

    const membersRes = await octokit.request("GET /orgs/{org}/members", {
      org,
      per_page: 100,
    });
    
    // Map of active GitHub member usernames (lowercase)
    const githubMembersMap = new Set(
      membersRes.data.map(member => member.login.toLowerCase())
    );

    // -------------------------
    // 1. Offboarding Verification
    // -------------------------
    for (const event of offboardingEvents) {
      const usernameLower = event.githubUsername.toLowerCase();
      const isStillMember = githubMembersMap.has(usernameLower);
      
      findings.push({
        id: crypto.randomUUID(),
        provider: "GitHub",
        username: event.githubUsername,
        type: "Offboarding Verification",
        expectedState: "Removed",
        actualState: isStillMember ? "Active" : "Removed",
        verificationStatus: isStillMember ? "Mismatch" : "Verified",
        reason: isStillMember ? "User was offboarded but remains active in GitHub" : "User successfully removed",
        lastChecked: timestamp,
      });
    }

    // -------------------------
    // 2. Orphaned Accounts
    // -------------------------
    for (const member of membersRes.data) {
      const usernameLower = member.login.toLowerCase();
      
      // If member is in GitHub but not in Active HR list
      if (!employeeMap.has(usernameLower)) {
        // Also ensure they aren't already flagged in offboarding verification as a Mismatch
        const alreadyFlagged = findings.some(f => f.type === "Offboarding Verification" && f.username.toLowerCase() === usernameLower && f.verificationStatus === "Mismatch");
        
        if (!alreadyFlagged) {
          findings.push({
            id: crypto.randomUUID(),
            provider: "GitHub",
            username: member.login,
            type: "Orphaned Account",
            expectedState: "Removed",
            actualState: "Active",
            verificationStatus: "Mismatch",
            reason: "User exists in GitHub but is not an active HR employee",
            lastChecked: timestamp,
          });
        }
      }
    }

    return Response.json({
      success: true,
      organization: org,
      membersCount: membersRes.data.length,
      findings,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}