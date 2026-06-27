import { executeSimulation } from "@/lib/simulation/executeSimulation";

export async function POST(request) {
  try {
    const { simulationId } = await request.json();

    if (!simulationId) {
      return Response.json(
        { success: false, error: "simulationId is required" },
        { status: 400 }
      );
    }

    // Trigger execution asynchronously in the background so we don't block the request.
    // The frontend will poll for status and progress.
    executeSimulation(simulationId).catch(console.error);

    return Response.json({
      success: true,
      message: "Simulation execution started.",
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}