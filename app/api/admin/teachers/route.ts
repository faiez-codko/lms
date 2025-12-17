import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { hashPassword, verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    
    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "TEACHER",
        isActive: true, 
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[TEACHERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
