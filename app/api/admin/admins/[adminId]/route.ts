import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  try {
    const { adminId } = await params;
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    
    // Only SUPER_ADMIN can delete admins
    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Prevent deleting self
    if (payload.sub === adminId) {
        return new NextResponse("Cannot delete yourself", { status: 400 });
    }

    const admin = await db.user.delete({
      where: {
        id: adminId,
        role: {
            in: ["ADMIN", "SUPER_ADMIN"]
        }
      }
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.log("[ADMIN_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
