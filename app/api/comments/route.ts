import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text, chapterId, topicId, parentId } = await req.json();

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
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            role: true,
          }
        }
      }
    });

    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
        select: { userId: true }
      });

      if (parentComment && parentComment.userId !== user.id) {
        await db.notification.create({
          data: {
            userId: parentComment.userId,
            title: "New Reply",
            message: `${user.name || "User"} replied to your comment: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`,
            type: "Reply"
          }
        });
      }
    }

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
    const cursor = searchParams.get("cursor"); // Use cursor-based pagination if simpler, or limit/offset
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!chapterId && !topicId) {
      return new NextResponse("Chapter ID or Topic ID is required", { status: 400 });
    }

    const where: any = {
      parentId: null, // Only fetch top-level comments
    };
    
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
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            name: true,
            image: true,
            role: true,
          }
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                role: true,
              }
            }
          },
          orderBy: {
            createdAt: "asc", // Replies usually ascending
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
