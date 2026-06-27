export function calculateRisk(simulation) {

  let score = 0;

  for (const step of simulation.steps) {

    switch (step.provider) {

      case "GitHub":

        score += 40;

        break;

      case "Slack":

        score += 20;

        break;

      default:

        score += 10;

    }

  }

  let severity = "Low";

  if (score >= 80)
    severity = "Critical";
  else if (score >= 50)
    severity = "High";
  else if (score >= 25)
    severity = "Medium";

  return {

    score,

    severity,

  };

}