export function buildSimulation(event, tasks) {
  const steps = [];
  let estimatedSeconds = 0;

  for (const task of tasks) {
    switch (task.tool) {
      case "GitHub":
        steps.push({
          provider: "GitHub",
          action: "Remove Organization Member",
          status: "Pending",
          estimatedSeconds: 2,
        });
        estimatedSeconds += 2;
        break;

      case "Slack":
        steps.push({
          provider: "Slack",
          action: "Deactivate User Account",
          status: "Pending",
          estimatedSeconds: 2,
        });
        estimatedSeconds += 2;
        break;

      case "Google Workspace":
        steps.push({
          provider: "Google Workspace",
          action: "Suspend Account & Transfer Ownership",
          status: "Pending",
          estimatedSeconds: 3,
        });
        estimatedSeconds += 3;
        break;

      case "Notion":
        steps.push({
          provider: "Notion",
          action: "Remove Workspace Membership",
          status: "Pending",
          estimatedSeconds: 2,
        });
        estimatedSeconds += 2;
        break;

      case "Jira":
        steps.push({
          provider: "Jira",
          action: "Revoke Project Access & Unassign Issues",
          status: "Pending",
          estimatedSeconds: 2,
        });
        estimatedSeconds += 2;
        break;

      default:
        steps.push({
          provider: task.tool,
          action: "Revoke Access",
          status: "Pending",
          estimatedSeconds: 1,
        });
        estimatedSeconds += 1;
    }
  }

  return {
    employeeName: event.employeeName,
    employeeEmail: event.employeeEmail,
    githubUsername: event.githubUsername,
    eventId: event.id,
    providers: [...new Set(tasks.map((t) => t.tool))],
    estimatedSeconds,
    steps,
  };
}