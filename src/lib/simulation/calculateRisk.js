export function calculateRisk(simulation) {
  const factors = [];
  let score = 0;

  for (const step of simulation.steps) {
    switch (step.provider) {
      case "GitHub":
        score += 40;
        factors.push({
          id: "github-code",
          severity: "High",
          icon: "🔐",
          title: "Source Code Access",
          desc: "User has write access to repositories. Delayed revocation risks intellectual property exposure.",
          points: 40,
          provider: "GitHub",
        });
        break;

      case "Slack":
        score += 20;
        factors.push({
          id: "slack-comms",
          severity: "Medium",
          icon: "💬",
          title: "Internal Communications",
          desc: "User can access private channels containing sensitive business discussions and shared credentials.",
          points: 20,
          provider: "Slack",
        });
        break;

      case "Google Workspace":
        score += 35;
        factors.push({
          id: "google-email",
          severity: "High",
          icon: "📧",
          title: "Email & Drive Access",
          desc: "User has access to corporate email, shared drives, and confidential documents. Requires ownership transfer.",
          points: 35,
          provider: "Google Workspace",
        });
        break;

      case "Notion":
        score += 15;
        factors.push({
          id: "notion-kb",
          severity: "Medium",
          icon: "📝",
          title: "Knowledge Base Access",
          desc: "User can view and edit internal documentation, runbooks, and product roadmaps.",
          points: 15,
          provider: "Notion",
        });
        break;

      case "Jira":
        score += 15;
        factors.push({
          id: "jira-pm",
          severity: "Medium",
          icon: "📋",
          title: "Project Management Data",
          desc: "User has access to sprint boards, backlog items, and internal project timelines.",
          points: 15,
          provider: "Jira",
        });
        break;

      default:
        score += 10;
        factors.push({
          id: `unknown-${step.provider}`,
          severity: "Low",
          icon: "⚙️",
          title: `${step.provider} Access`,
          desc: `User has access to ${step.provider}. Review permissions manually.`,
          points: 10,
          provider: step.provider,
        });
    }
  }

  let severity = "Low";
  if (score >= 80) severity = "Critical";
  else if (score >= 50) severity = "High";
  else if (score >= 25) severity = "Medium";

  return {
    score,
    severity,
    factors,
  };
}