import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const { title } = await req.json();
    
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (!payload || !payload.sub) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: payload.sub,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: courseId,
        position: newPosition,
      }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
