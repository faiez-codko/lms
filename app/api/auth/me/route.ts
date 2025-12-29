"use server";

import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { db } from "@/lib/prismadb";
import { updateProfileSchema } from "@/schema/auth";

/**
 * Returns the currently authenticated user based on the auth cookie.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user }, { status: 200 });
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedFields = updateProfileSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields" },
        { status: 400 }
      );
    }

    const { name, image, password } = validatedFields.data;
    
    const updateData: any = {
      name,
    };

    if (image !== undefined) {
      updateData.image = image;
    }

    if (password) {
      const hashedPassword = await hashPassword(password);
      updateData.password = hashedPassword;
    }

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
    });

    // We don't return the password
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.log("[PROFILE_UPDATE]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
