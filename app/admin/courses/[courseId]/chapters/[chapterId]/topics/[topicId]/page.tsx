import { db } from "@/lib/prismadb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { TopicTitleForm } from "@/components/topic-setup/topic-title-form";
import { TopicDescriptionForm } from "@/components/topic-setup/topic-description-form";
import { TopicAccessForm } from "@/components/topic-setup/topic-access-form";
import { TopicVideoForm } from "@/components/topic-setup/topic-video-form";
import { TopicActions } from "@/components/topic-setup/topic-actions";
import { QuizForm } from "@/components/chapter-setup/quiz-form";

export default async function TopicIdPage({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string; topicId: string }>
}) {
  const { courseId, chapterId, topicId } = await params;

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;

  if (payload?.role !== "SUPER_ADMIN") {
    return redirect("/");
  }

  const topic = await db.topic.findUnique({
    where: {
      id: topicId,
      chapterId: chapterId,
    },
    include: {
      muxdata: true,
      quiz: true,
    },
  });

  if (!topic) {
    return redirect("/");
  }

  const requiredFields = [
    topic.title,
    topic.description,
    topic.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

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
                  Topic Creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <TopicActions
                disabled={false}
                courseId={courseId}
                chapterId={chapterId}
                topicId={topicId}
                isPublished={topic.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your topic
                </h2>
              </div>
              <TopicTitleForm
                initialData={topic}
                courseId={courseId}
                chapterId={chapterId}
                topicId={topicId}
              />
              <TopicDescriptionForm
                initialData={topic}
                courseId={courseId}
                chapterId={chapterId}
                topicId={topicId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              <TopicAccessForm
                initialData={topic}
                courseId={courseId}
                chapterId={chapterId}
                topicId={topicId}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">
                  Add a video
                </h2>
              </div>
              <TopicVideoForm
                initialData={topic}
                courseId={courseId}
                chapterId={chapterId}
                topicId={topicId}
              />
            </div>
            <div>
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard} />
                    <h2 className="text-xl">
                        Topic Quiz
                    </h2>
                </div>
                <QuizForm
                    initialData={topic}
                    courseId={courseId}
                    chapterId={chapterId}
                    topicId={topicId}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
