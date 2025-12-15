"use server";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/**
 * Returns the currently authenticated user based on the auth cookie.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user }, { status: 200 });
}

