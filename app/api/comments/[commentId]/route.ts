import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      }
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== user.id && user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedComment = await db.comment.delete({
      where: {
        id: commentId,
      }
    });

    return NextResponse.json(deletedComment);
  } catch (error) {
    console.log("[COMMENT_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const user = await getCurrentUser();
    const { text } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      }
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedComment = await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text,
      }
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.log("[COMMENT_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
