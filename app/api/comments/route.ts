import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text, chapterId, topicId } = await req.json();

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    if (!chapterId && !topicId) {
      return new NextResponse("Chapter ID or Topic ID is required", { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        text,
        userId: user.id,
        chapterId: chapterId || null,
        topicId: topicId || null,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.log("[COMMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");
    const topicId = searchParams.get("topicId");

    if (!chapterId && !topicId) {
      return new NextResponse("Chapter ID or Topic ID is required", { status: 400 });
    }

    const where: any = {};
    
    if (chapterId) {
      where.chapterId = chapterId;
    }
    
    if (topicId) {
      where.topicId = topicId;
    } else {
      where.topicId = null;
    }

    const comments = await db.comment.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.log("[COMMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
