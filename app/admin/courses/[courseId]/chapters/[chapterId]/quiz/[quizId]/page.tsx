import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { QuizTitleForm } from "@/components/quiz-setup/quiz-title-form";
import { QuestionsForm } from "@/components/quiz-setup/questions-form";

export default async function QuizIdPage({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string; quizId: string }>
}) {
  const { courseId, chapterId, quizId } = await params;

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;

  if (payload?.role !== "SUPER_ADMIN") {
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
            }
        },
    }
  });

  if (!quiz) {
    return redirect("/");
  }

  const requiredFields = [
    quiz.title,
    quiz.questions.length > 0,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <>
      <div className="p-6 m-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/admin/courses/${courseId}/chapters/${chapterId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to chapter setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Quiz Setup
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your quiz
                </h2>
              </div>
              <QuizTitleForm
                initialData={quiz}
                quizId={quiz.id}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Quiz Questions
                </h2>
              </div>
              <QuestionsForm
                initialData={quiz}
                quizId={quiz.id}
                routePrefix={`/admin/courses/${courseId}/chapters/${chapterId}/quiz/${quiz.id}/questions`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
