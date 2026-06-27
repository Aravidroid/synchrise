import crypto from "crypto";
import {
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { db } from "@/lib/dynamo";

export async function POST(request) {
  try {

    const body = await request.json();

    const employee = {

      employeeId:
        crypto.randomUUID(),

      name:
        body.name,

      email:
        body.email,

      githubUsername:
        body.githubUsername,

      department:
        body.department,

      designation:
        body.designation,

      status:
        "Active",

      joinedAt:
        new Date().toISOString(),

    };

    await db.send(
      new PutCommand({
        TableName:
          "synchrise-employees",
        Item: employee,
      })
    );

    return Response.json({
      success: true,
      employee,
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

export async function GET() {

  const employees =
    await db.send(
      new ScanCommand({
        TableName:
          "synchrise-employees",
      })
    );

  return Response.json(
    employees.Items || []
  );

}