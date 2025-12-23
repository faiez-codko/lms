import { db } from "@/lib/prismadb";
import { getProgress } from "@/actions/get-progress";
import { chapter, course, userprogress, topic } from "@prisma/client";

type ChapterWithProgress = chapter & {
  userprogress: userprogress[] | null;
  topics: topic[];
};

type CourseWithProgressWithCategory = course & {
  chapter: ChapterWithProgress[];
  progress: number | null;
};

export const getCourseWithChapters = async (
  userId: string,
  courseId: string
): Promise<CourseWithProgressWithCategory | null> => {
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapter: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
          include: {
            userprogress: {
              where: {
                userId,
              },
            },
            topics: {
              where: {
                isPublished: true,
              },
              orderBy: {
                position: "asc",
              }
            }
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    const progress = await getProgress(userId, courseId);

    return {
      ...course,
      progress,
    };
  } catch (error) {
    console.log("[GET_COURSE_WITH_CHAPTERS]", error);
    return null;
  }
};
