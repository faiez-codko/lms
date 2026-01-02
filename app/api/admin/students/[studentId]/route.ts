import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    
    if (!payload?.role || !["ADMIN", "SUPER_ADMIN"].includes(payload.role)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { studentId } = await params;

    const student = await db.user.delete({
      where: {
        id: studentId,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.log("[STUDENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
