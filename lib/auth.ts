import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./prismadb";

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Returns the JWT secret from environment variables.
 * Throws when missing to prevent insecure defaults.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return secret;
}

/**
 * Hashes a plaintext password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a plaintext password against a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs an auth token containing subject and role claims.
 */
export function signAuthToken(payload: { sub: string; role: string }): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: TOKEN_MAX_AGE_SECONDS,
  });
}

/**
 * Verifies an auth token and returns its payload, or null if invalid/expired.
 */
export function verifyAuthToken(
  token: string
): { sub: string; role: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { sub: string; role: string };
  } catch {
    return null;
  }
}

/**
 * Sets the auth cookie on the current request using Next.js cookies() API.
 */
// Cookie setting is handled in route handlers using NextResponse.cookies.set

/**
 * Returns the currently authenticated user based on the auth cookie.
 * When the token is valid, fetches the user by id. Returns null otherwise.
 */
export async function getCurrentUser() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyAuthToken(token);
  if (!payload) return null;
  try {
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true, image: true },
    });
    return user;
  } catch {
    return null;
  }
}
