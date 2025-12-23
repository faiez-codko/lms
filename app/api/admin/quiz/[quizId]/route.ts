import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
     const { quizId } = await params;
    const values = await req.json();

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const quiz = await db.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
