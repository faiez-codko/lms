import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;
    
    if (!payload || !payload.sub) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: payload.sub,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log("[NOTIFICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
