import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { QuestionTextForm } from "@/components/quiz-setup/question-text-form";
import { QuestionImageForm } from "@/components/quiz-setup/question-image-form";
import { OptionsForm } from "@/components/quiz-setup/options-form";

export default async function TopicQuestionIdPage({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string; topicId: string; quizId: string; questionId: string }>
}) {
  const { courseId, chapterId, topicId, quizId, questionId } = await params;

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;

  if (payload?.role !== "SUPER_ADMIN") {
    return redirect("/");
  }

  const question = await db.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
        options: true,
    }
  });

  if (!question) {
    return redirect("/");
  }

  const requiredFields = [
    question.text,
    question.options.length > 1, // At least 2 options for a valid question
    question.options.some(opt => opt.isCorrect), // At least one correct option
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
              href={`/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}/quiz/${quizId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to quiz setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Question Setup
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
                  Question Details
                </h2>
              </div>
              <QuestionTextForm
                initialData={question}
                quizId={quizId}
                questionId={questionId}
              />
              <QuestionImageForm
                initialData={question}
                quizId={quizId}
                questionId={questionId}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Answer Options
                </h2>
              </div>
              <OptionsForm
                initialData={question}
                quizId={quizId}
                questionId={questionId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
