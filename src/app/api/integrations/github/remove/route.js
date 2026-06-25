import { remove } from "@/lib/github/remove";

export async function POST(request) {
  try {
    console.log("========== REMOVE ROUTE START ==========");

    // -----------------------------
    // API Key
    // -----------------------------
    const apiKey = request.headers.get("x-api-key");

    console.log(
      "Received API Key:",
      apiKey ? "Present" : "Missing"
    );

    console.log(
      "Expected API Key:",
      process.env.INTERNAL_API_KEY ? "Present" : "Missing"
    );

    if (apiKey !== process.env.INTERNAL_API_KEY) {
      console.log("API KEY FAILED");

      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    console.log("API KEY PASSED");

    // -----------------------------
    // Body
    // -----------------------------
    const body = await request.json();

    console.log("Request Body:");
    console.log(JSON.stringify(body, null, 2));

    const username = body.username?.trim();

    console.log("Username:", username);

    if (!username) {
      return Response.json(
        {
          success: false,
          error: "GitHub username missing",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Calling remove()...");

    const result = await remove(username);

    console.log("remove() completed");

    console.log(JSON.stringify(result, null, 2));

    return Response.json(result);

  } catch (error) {

    console.error("========== REMOVE ROUTE ERROR ==========");

    console.error(error);

    console.error("Status:", error.status);

    console.error("Message:", error.message);

    console.error(
      "GitHub Response:",
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    );

    console.error(error.stack);

    return Response.json(
      {
        success: false,
        status: error.status,
        message: error.message,
        github: error.response?.data,
      },
      {
        status: 500,
      }
    );
  }
}