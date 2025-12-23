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

    const lastTopic = await db.topic.findFirst({
      where: {
        chapterId: chapterId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastTopic ? lastTopic.position + 1 : 1;

    const topic = await db.topic.create({
      data: {
        title,
        chapterId: chapterId,
        position: newPosition,
      }
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.log("[TOPICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
