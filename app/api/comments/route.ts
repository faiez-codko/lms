import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prismadb";
import { sendMail } from "@/lib/mail";

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

    let courseTitle = "";
    let courseOwnerEmail: string | null = null;
    if (chapterId) {
      const ch = await db.chapter.findUnique({
        where: { id: chapterId },
        include: { course: { include: { user: true } } }
      });
      if (ch?.course) {
        courseTitle = ch.course.title;
        courseOwnerEmail = ch.course.user?.email || null;
      }
    } else if (topicId) {
      const tp = await db.topic.findUnique({
        where: { id: topicId },
        include: { chapter: { include: { course: { include: { user: true } } } } }
      });
      const course = tp?.chapter?.course;
      if (course) {
        courseTitle = course.title;
        courseOwnerEmail = course.user?.email || null;
      }
    }

    const adminUsers = await db.user.findMany({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
      select: { email: true }
    });
    
    // To: Course Owner + Commenter
    const toRecipients = [
      ...(courseOwnerEmail ? [courseOwnerEmail] : []),
      user.email,
    ].filter((email): email is string => !!email);

    // CC: Admins (excluding those already in To list)
    const adminEmails = adminUsers
      .map((u) => u.email)
      .filter((e): e is string => !!e && !toRecipients.includes(e));

    const uniqueTo = Array.from(new Set(toRecipients));
    const uniqueCc = Array.from(new Set(adminEmails));

    if (uniqueTo.length > 0 || uniqueCc.length > 0) {
      const isReply = !!parentId;
      const subject = `New ${isReply ? "reply" : "comment"} on "${courseTitle || "Course"}"`;
      const preview = `${text.substring(0, 120)}${text.length > 120 ? "..." : ""}`;
      const author = user.name || "User";
      
      const html = `<div style="font-family:Arial,sans-serif;">
        <h2 style="margin:0 0 12px 0;">${subject}</h2>
        <p style="margin:0 0 8px 0;"><strong>${author}</strong> posted:</p>
        <blockquote style="border-left: 4px solid #ccc; margin: 12px 0; padding-left: 12px; color: #555;">
          ${preview}
        </blockquote>
        <p style="font-size: 12px; color: #888;">You are receiving this notification because you are the author, an admin, or the poster of this comment.</p>
      </div>`;
      
      await sendMail({ 
        to: uniqueTo, 
        cc: uniqueCc,
        subject, 
        text: `${author}: ${preview}`, 
        html 
      });
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
