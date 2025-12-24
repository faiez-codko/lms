import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const user = token ? verifyAuthToken(token) : null;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, url, courseId, chapterId, topicId } = await req.json();

    if (!title || !url) {
      return new NextResponse("Title and URL are required", { status: 400 });
    }

    if (!courseId && !chapterId && !topicId) {
      return new NextResponse("At least one association (course, chapter, or topic) is required", { status: 400 });
    }

    // Authorization check
    let authorized = false;
    if (user.role === "SUPER_ADMIN") {
      authorized = true;
    } else {
      // Check ownership
      if (courseId) {
        const course = await db.course.findUnique({
          where: { id: courseId, userId: user.sub },
        });
        if (course) authorized = true;
      }
      
      if (!authorized && chapterId) {
        const chapter = await db.chapter.findUnique({
          where: { id: chapterId },
          include: { course: true },
        });
        if (chapter && chapter.course.userId === user.sub) authorized = true;
      }

      if (!authorized && topicId) {
        const topic = await db.topic.findUnique({
          where: { id: topicId },
          include: { chapter: { include: { course: true } } },
        });
        if (topic && topic.chapter.course.userId === user.sub) authorized = true;
      }
    }

    if (!authorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        title,
        description,
        url,
        courseId,
        chapterId,
        topicId,
        userId: user.sub,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[ATTACHMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
