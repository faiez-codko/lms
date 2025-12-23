import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ quizId: string; questionId: string }> }
) {
  try {
    const { questionId } = await params;

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedQuestion = await db.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json(deletedQuestion);
  } catch (error) {
    console.log("[QUESTION_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ quizId: string; questionId: string }> }
) {
  try {
     const { questionId } = await params;
    const values = await req.json();

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const question = await db.question.update({
      where: {
        id: questionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUESTION_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
