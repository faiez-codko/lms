"use client";

import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";
import { chapter, course, userprogress } from "@prisma/client";

interface CourseSidebarProps {
  course: course & {
    chapter: (chapter & {
      userprogress: userprogress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = ({ course, progressCount }: CourseSidebarProps) => {
  const params = useParams();
  const router = useRouter();

  // Handle potential array params (though courseId/chapterId should be strings)
  const chapterId = Array.isArray(params?.chapterId) ? params?.chapterId[0] : params?.chapterId;

  const onClick = (id: string) => {
    router.push(`/courses/${course.id}/chapters/${id}`);
  }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-background shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold mb-4">
          {course.title}
        </h1>
        <div className="flex items-center gap-x-2 mb-2">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-500">
            {Math.round(progressCount)}% Complete
          </span>
        </div>
        <Progress value={progressCount} className="h-2" indicatorClassName="bg-emerald-700 dark:bg-emerald-500" />
      </div>
      <div className="flex flex-col w-full overflow-x-hidden">
        {course.chapter.map((chapter) => {
          const isActive = chapterId === chapter.id;
          const isCompleted = !!chapter.userprogress?.[0]?.isCompleted;
          const isLocked = !chapter.isFree && !isCompleted && progressCount < 100; // Simplified lock logic, refine as needed

          return (
            <button
              key={chapter.id}
              onClick={() => onClick(chapter.id)}
              type="button"
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700 dark:text-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800/50",
                isCompleted && "text-emerald-700 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-500",
                isCompleted && isActive && "bg-emerald-200/20 dark:bg-emerald-900/20"
              )}
            >
              <div className="flex items-center gap-x-2 py-4">
                {isCompleted ? (
                  <CheckCircle className="text-emerald-700 dark:text-emerald-500" size={22} />
                ) : (
                  <PlayCircle className={cn("text-slate-500", isActive && "text-slate-700 dark:text-slate-200")} size={22} />
                )}
                <span className="truncate line-clamp-1">
                  {chapter.title.length > 35 ? chapter.title.substring(0, 35) + "..." : chapter.title}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};
