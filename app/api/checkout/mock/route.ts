import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const user = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = user ? verifyAuthToken(user) : null;

    if (!payload || !payload.sub) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseIds } = await req.json();

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return new NextResponse("Course IDs are required", { status: 400 });
    }

    const userId = payload.sub;

    const purchases = await Promise.all(
      courseIds.map(async (courseId: string) => {
        // Check if already purchased
        const existingPurchase = await db.purchase.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        });

        if (existingPurchase) {
          return existingPurchase;
        }

        return await db.purchase.create({
          data: {
            userId,
            courseId,
          },
        });
      })
    );

    return NextResponse.json(purchases);
  } catch (error) {
    console.log("[CHECKOUT_MOCK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
