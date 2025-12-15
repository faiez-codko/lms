"use server";

import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

/**
 * Logs out the current user by clearing the auth cookie.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
