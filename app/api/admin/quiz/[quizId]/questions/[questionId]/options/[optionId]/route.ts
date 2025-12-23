import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ quizId: string; questionId: string; optionId: string }> }
) {
  try {
    const { optionId } = await params;

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedOption = await db.option.delete({
      where: {
        id: optionId,
      },
    });

    return NextResponse.json(deletedOption);
  } catch (error) {
    console.log("[OPTION_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ quizId: string; questionId: string; optionId: string }> }
) {
  try {
     const { optionId } = await params;
    const values = await req.json();

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const option = await db.option.update({
      where: {
        id: optionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[OPTION_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
