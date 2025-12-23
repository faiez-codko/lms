import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string; questionId: string }> }
) {
  try {
     const { questionId } = await params;
    const { text, isCorrect } = await req.json();

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const option = await db.option.create({
      data: {
        text,
        isCorrect,
        questionId,
      }
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[OPTIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
