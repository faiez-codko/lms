"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { registerSchema } from "@/schema/auth";
import { hashPassword, signAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

/**
 * Handles user registration with email and password.
 * - Validates input using Zod
 * - Ensures unique email
 * - Hashes password and creates user with default role
 * - Issues JWT and sets auth cookie
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "USER",
      },
      select: { id: true, name: true, email: true, role: true, image: true },
    });

    const token = signAuthToken({ sub: user.id, role: user.role });
    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
