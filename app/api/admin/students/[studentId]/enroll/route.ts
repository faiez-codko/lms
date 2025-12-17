import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    
    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return new NextResponse("Missing courseId", { status: 400 });
    }

    const purchase = await db.purchase.create({
      data: {
        userId: params.studentId,
        courseId: courseId,
      }
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.log("[ENROLL_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
