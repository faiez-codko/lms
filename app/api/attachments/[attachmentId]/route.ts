import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const { attachmentId } = await params;
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const user = token ? verifyAuthToken(token) : null;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
      },
      include: {
        course: true,
        chapter: {
          include: {
            course: true,
          }
        },
        topic: {
          include: {
            chapter: {
              include: {
                course: true,
              }
            }
          }
        }
      }
    });

    if (!attachment) {
      return new NextResponse("Not Found", { status: 404 });
    }

    let authorized = false;

    // 1. Admin
    if (user.role === "SUPER_ADMIN") {
      authorized = true;
    }
    // 2. Owner of attachment
    else if (attachment.userId === user.sub) {
      authorized = true;
    }
    // 3. Owner of the associated course (if applicable)
    else if (attachment.course && attachment.course.userId === user.sub) {
      authorized = true;
    }
    else if (attachment.chapter && attachment.chapter.course.userId === user.sub) {
      authorized = true;
    }
    else if (attachment.topic && attachment.topic.chapter.course.userId === user.sub) {
      authorized = true;
    }

    if (!authorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedAttachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json(deletedAttachment);
  } catch (error) {
    console.log("[ATTACHMENT_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
