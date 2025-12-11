"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";

import { ChapterTitleForm } from "@/components/chapter-title-form";
import { ChapterDescriptionForm } from "@/components/chapter-description-form";
import { ChapterAccessForm } from "@/components/chapter-access-form";
import { ChapterVideoForm } from "@/components/chapter-video-form";

export default function ChapterIdPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = use(params);
  const router = useRouter();

  // Mock Data - In a real app, this would be fetched from an API/Database
  const chapter = {
    id: chapterId,
    title: "Introduction",
    description: "Welcome to the course!",
    isFree: false,
    videoUrl: null,
  };

  // Calculate completion text
  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-500">
                Complete all fields {completionText}
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                <LayoutDashboard className="h-6 w-6 text-sky-700" />
              </div>
              <h2 className="text-xl font-medium">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                <Eye className="h-6 w-6 text-sky-700" />
              </div>
              <h2 className="text-xl font-medium">Access Settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
              <Video className="h-6 w-6 text-sky-700" />
            </div>
            <h2 className="text-xl font-medium">Add a video</h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>
      </div>
    </div>
  );
}
