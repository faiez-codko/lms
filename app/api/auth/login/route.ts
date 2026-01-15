"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { loginSchema } from "@/schema/auth";
import { verifyPassword, signAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { sendMail } from "@/lib/mail";

/**
 * Handles user login with email and password.
 * - Validates input
 * - Verifies credentials
 * - Issues JWT and sets auth cookie
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, image: true, password: true },
    });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    
    if (safeUser.email) {
      const subject = "New Login Detected - QuantumAcademy";
      const time = new Date().toLocaleString();
      const html = `<div style="font-family:Arial,sans-serif;">
        <h2 style="margin:0 0 12px 0;">New Login Alert</h2>
        <p>Hello ${safeUser.name || "User"},</p>
        <p>We detected a new login to your account on <strong>${time}</strong>.</p>
        <p>If this was you, you can safely ignore this email.</p>
        <p style="color: red;">If you did not log in, please contact support immediately.</p>
      </div>`;
      // Fire and forget email to not block login response
      sendMail({ to: [safeUser.email], subject, text: `New login detected on your account at ${time}`, html }).catch(console.error);
    }

    const token = signAuthToken({ sub: user.id, role: user.role });
    const res = NextResponse.json({ user: safeUser }, { status: 200 });
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
