"use server";

import { db } from "@/lib/prismadb";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export const getCourses = async ({
  userId,
  title,
  categoryId,
  page = 1,
  pageSize = 8,
}: {
  userId?: string;
  title?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}) => {
  try {
    // If userId is not explicitly passed, try to get it from the cookie
    if (!userId) {
        const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
        const payload = token ? verifyAuthToken(token) : null;
        userId = payload?.sub;
    }

    const skip = (page - 1) * pageSize;

    const whereClause: any = {
      isPublished: true,
    };

    if (title) {
      whereClause.title = {
        contains: title,
      };
    }

    if (categoryId && categoryId !== "All") {
      whereClause.categoryId = categoryId;
    }

    const courses = await db.course.findMany({
      where: whereClause,
      include: {
        category: true,
        user: true,
        chapter: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchase: {
            where: {
                userId: userId,
            }
        },
        _count: {
            select: {
                purchase: true
            }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      author: course.user.name || "Unknown Author",
      thumbnail: course.imageUrl,
      price: course.price ? `$${course.price}` : "Free",
      rating: 4.5, // Mock rating as we don't have reviews system yet
      students: course._count.purchase,
      category: course.category?.name || "Uncategorized",
      progress: course.purchase.length > 0 ? 0 : null, // If purchased, return 0 (or actual progress if we fetch it), else null
    }));

    return formattedCourses;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
