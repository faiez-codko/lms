import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
     const { courseId, chapterId } = await params;
    const { title } = await req.json();

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if quiz already exists for this chapter
    const existingQuiz = await db.quiz.findUnique({
      where: {
        chapterId: chapterId,
      }
    });

    if (existingQuiz) {
        return new NextResponse("Quiz already exists", { status: 400 });
    }

    const quiz = await db.quiz.create({
      data: {
        title,
        chapterId: chapterId,
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[CHAPTER_QUIZ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
  ) {
    try {
      const { courseId, chapterId } = await params;
  
      const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
      const payload = token ? verifyAuthToken(token) : null;
  
      if (payload?.role !== "SUPER_ADMIN") {
          return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const courseOwner = await db.course.findUnique({
        where: {
          id: courseId,
        }
      });
  
      if (!courseOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const quiz = await db.quiz.findUnique({
        where: {
          chapterId: chapterId,
        }
      });
  
      if (!quiz) {
        return new NextResponse("Not Found", { status: 404 });
      }
  
      const deletedQuiz = await db.quiz.delete({
        where: {
          id: quiz.id,
        }
      });
  
      return NextResponse.json(deletedQuiz);
    } catch (error) {
      console.log("[CHAPTER_QUIZ_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
