import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
     const { quizId } = await params;
    const { text } = await req.json();

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const question = await db.question.create({
      data: {
        text,
        quizId,
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUESTIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
