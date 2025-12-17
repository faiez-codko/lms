"use server";

import { db } from "@/lib/prismadb";

export const getCourses = async ({
  title,
  categoryId,
  page = 1,
  pageSize = 8,
}: {
  title?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}) => {
  try {
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

    // Transform to match CourseCard expected props roughly
    // We will do final mapping in the component or here.
    // CourseCard expects:
    // id, title, author, thumbnail, price, rating, students, category, progress
    
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      author: course.user.name || "Unknown Author",
      thumbnail: course.imageUrl,
      price: course.price ? `$${course.price}` : "Free",
      rating: 4.5, // Mock rating as we don't have reviews system yet
      students: course._count.purchase,
      category: course.category?.name || "Uncategorized",
      progress: null, // Browse page usually doesn't show progress unless logged in user specific logic is added
    }));

    return formattedCourses;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
