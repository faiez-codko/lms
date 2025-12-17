import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth_token";

async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as { sub?: string; role?: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/teacher")) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const url = new URL("/", req.url);
      url.searchParams.set("unauthorized", "1");
      return NextResponse.redirect(url);
    }

    const payload = await verifyToken(token);
    if (!payload?.role || !["TEACHER", "SUPER_ADMIN"].includes(payload.role)) {
      const url = new URL("/", req.url);
      url.searchParams.set("forbidden", "teacher");
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const url = new URL("/", req.url);
      url.searchParams.set("unauthorized", "1");
      return NextResponse.redirect(url);
    }

    const payload = await verifyToken(token);
    if (payload?.role !== "SUPER_ADMIN") {
      const url = new URL("/", req.url);
      url.searchParams.set("forbidden", "admin");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/admin/:path*"],
};

