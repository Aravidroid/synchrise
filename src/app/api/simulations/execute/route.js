export async function POST(request) {
  try {
    const body = await request.json();

    return Response.json({
      success: true,
      message: "Simulation execution will be implemented next.",
      received: body,
    });

  } catch (error) {

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