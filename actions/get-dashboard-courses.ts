import { db } from "@/lib/prismadb";
import { getProgress } from "@/actions/get-progress";

type DashboardCourses = {
  id: string;
  title: string;
  author: string;
  thumbnail: string | null;
  price: string;
  rating: number;
  students: number;
  category: string;
  progress: number | null;
  createdAt: Date;
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses[]> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            user: true,
            chapter: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((purchase) => purchase.course) as any[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    // Flatten and map to expected structure
    const formattedCourses = courses.map((course) => ({
        id: course.id,
        title: course.title,
        author: course.user.name || "Unknown Author",
        thumbnail: course.imageUrl,
        price: course.price ? `$${course.price}` : "Free",
        rating: 4.5, // Mock rating
        students: 0, // Not needed for my courses view really
        category: course.category?.name || "Uncategorized",
        progress: course.progress,
        createdAt: course.createdAt
    }));

    return formattedCourses;

  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return [];
  }
};
