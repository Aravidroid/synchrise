import { NextResponse } from "next/server";

export async function GET() {

  const url =
    `https://github.com/apps/synchrise/installations/new`;

  return NextResponse.redirect(url);
}