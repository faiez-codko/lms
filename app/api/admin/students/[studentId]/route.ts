import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { hashPassword, verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const values = await req.json();
    
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // If updating password, hash it
    if (values.password) {
      values.password = await hashPassword(values.password);
    }

    const user = await db.user.update({
      where: {
        id: studentId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[STUDENT_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
