import crypto from "crypto";

import {
  GetCommand,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { db } from "@/lib/dynamo";

import { buildSimulation } from "@/lib/simulation/buildSimulation";

import { calculateRisk } from "@/lib/simulation/calculateRisk";

export async function POST(request) {

  try {

    const { eventId } =
      await request.json();

    // -------------------------
    // Event
    // -------------------------

    const event =
      await db.send(
        new GetCommand({

          TableName:
            process.env.DYNAMODB_EVENTS_TABLE,

          Key: {
            id: eventId,
          },

        })
      );

    if (!event.Item) {

      return Response.json(
        {
          success: false,
          error: "Event not found",
        },
        {
          status: 404,
        }
      );

    }

    // -------------------------
    // Tasks
    // -------------------------

    const tasks =
      await db.send(
        new QueryCommand({

          TableName:
            process.env.DYNAMODB_TASKS_TABLE,

          KeyConditionExpression:
            "eventId = :eventId",

          ExpressionAttributeValues: {
            ":eventId": eventId,
          },

        })
      );

    const simulation =
      buildSimulation(
        event.Item,
        tasks.Items || []
      );

    const risk =
      calculateRisk(
        simulation
      );

    const item = {

      simulationId:
        crypto.randomUUID(),

      ...simulation,

      risk,

      status:
        "Draft",

      createdAt:
        new Date().toISOString(),

    };

    await db.send(
      new PutCommand({

        TableName:
          process.env.DYNAMODB_SIMULATIONS_TABLE,

        Item: item,

      })
    );

    return Response.json({

      success: true,

      simulation: item,

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