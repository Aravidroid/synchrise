import { remove } from "@/lib/github/remove";

export async function POST(request) {
  try {
    // ---------------------------------
    // Internal API Authentication
    // ---------------------------------
    const apiKey = request.headers.get("x-api-key");

    if (apiKey !== process.env.INTERNAL_API_KEY) {
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

    // ---------------------------------
    // Read Request
    // ---------------------------------
    const body = await request.json();

if (!body) {
  return Response.json(
    {
      success: false,
      error: "Request body is required",
    },
    {
      status: 400,
    }
  );
}

const username = body.username?.trim();

if (!username) {
  return Response.json(
    {
      success: false,
      error: "GitHub username is required",
    },
    {
      status: 400,
    }
  );
}

    if (!username) {
      return Response.json(
        {
          success: false,
          error: "GitHub username is required",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------
    // Execute GitHub Offboarding
    // ---------------------------------
    const result = await remove(username);

    return Response.json(result);

  } catch (error) {
    console.error("GitHub Remove Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}