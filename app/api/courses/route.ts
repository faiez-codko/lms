import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    
    if (!payload || !payload.sub) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const course = await db.course.create({
      data: {
        userId: payload.sub,
        title,
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
