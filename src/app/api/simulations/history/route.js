import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamo";
import { buildSimulation } from "@/lib/simulation/buildSimulation";
import { calculateRisk } from "@/lib/simulation/calculateRisk";

export async function GET() {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_EVENTS_TABLE,
      })
    );

    const events = result.Items || [];

    const simulations = events.map(event => {
      // Create mock tasks from event.tools
      const mockTasks = (event.tools || []).map(tool => ({ tool }));
      
      const simulationData = buildSimulation(event, mockTasks);
      const risk = calculateRisk(simulationData);

      return {
        simulationId: event.id,
        ...simulationData,
        risk,
        status: event.status, // synchrise-events.status as single source of truth
        createdAt: event.createdAt,
      };
    });

    simulations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return Response.json(simulations);
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}