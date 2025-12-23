import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { QuizPlayer } from "@/components/quiz-player";

export default async function QuizIdPage({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string; quizId: string }>
}) {
  const { courseId, chapterId, quizId } = await params;

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;
  const userId = payload?.sub;

  if (!userId) {
    return redirect("/");
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: {
        orderBy: {
            createdAt: "asc",
        },
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    return redirect(`/courses/${courseId}/chapters/${chapterId}`);
  }

  const course = await db.course.findUnique({
    where: {
        id: courseId,
    },
    include: {
        chapter: {
            where: {
                id: chapterId,
            },
            include: {
                topics: true
            }
        }
    }
  });
  
  const chapter = course?.chapter[0];

  if (!chapter) {
      return redirect("/");
  }

  const isAdmin = payload?.role === "SUPER_ADMIN";
  let purchase = null;
  
  if (!isAdmin) {
      purchase = await db.purchase.findUnique({
          where: {
              userId_courseId: {
                  userId,
                  courseId
              }
          }
      });
  }

  let isLocked = !purchase && !isAdmin;

  let isContextFree = chapter.isFree;
  
  if (quiz.topicId) {
      const topic = chapter.topics.find(t => t.id === quiz.topicId);
      if (topic && topic.isFree) {
          isContextFree = true;
      }
  }

  if (isLocked && isContextFree) {
      isLocked = false;
  }

  if (isLocked) {
      return redirect(`/courses/${courseId}/chapters/${chapterId}`);
  }

  return (
    <QuizPlayer 
        quiz={quiz} 
        courseId={courseId}
        chapterId={chapterId}
    />
  );
}
