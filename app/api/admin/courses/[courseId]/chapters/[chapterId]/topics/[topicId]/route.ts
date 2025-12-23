import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string; topicId: string }> }
) {
  try {
    const { courseId, chapterId, topicId } = await params;

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const topic = await db.topic.findUnique({
      where: {
        id: topicId,
        chapterId: chapterId,
      },
    });

    if (!topic) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedTopic = await db.topic.delete({
      where: {
        id: topicId,
      },
    });

    const publishedTopicsInChapter = await db.topic.findMany({
      where: {
        chapterId: chapterId,
        isPublished: true,
      },
    });

    if (!publishedTopicsInChapter.length) {
      // Check if there are other published content in chapter before unpublishing?
      // For now, let's keep it simple. If the chapter relies on topics for completion, this might be needed.
      // But typically a chapter might be valid without topics if it has its own video.
    }

    return NextResponse.json(deletedTopic);
  } catch (error) {
    console.log("[TOPIC_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string; topicId: string }> }
) {
  try {
     const { courseId, chapterId, topicId } = await params;
    const values = await req.json();

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const topic = await db.topic.update({
      where: {
        id: topicId,
        chapterId: chapterId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.log("[TOPIC_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
