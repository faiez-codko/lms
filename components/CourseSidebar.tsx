"use client";

import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { chapters } from "@/lib/mock-data";
import { useParams, useRouter } from "next/navigation";

interface CourseSidebarProps {
    className?: string;
}

export const CourseSidebar = ({ className }: CourseSidebarProps) => {
  const params = useParams();
  const router = useRouter();
  
  // Handle potential array params (though courseId/chapterId should be strings)
  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId;
  const chapterId = Array.isArray(params?.chapterId) ? params?.chapterId[0] : params?.chapterId;

  const onClick = (id: string) => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className={cn("h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm", className)}>
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold mb-4">
          Prisma & Free Databases (MySQL, Postgres & Mongo)
        </h1>
        <div className="flex items-center gap-x-2 mb-2">
            <span className="text-xs font-medium text-emerald-700">75% Complete</span>
        </div>
        <Progress value={75} className="h-2" indicatorClassName="bg-emerald-700" />
      </div>
      <div className="flex flex-col w-full">
        {chapters.map((chapter) => {
          const isActive = chapterId === chapter.id;
          const isLocked = chapter.isLocked;

          return (
            <button
              key={chapter.id}
              onClick={() => onClick(chapter.id)}
              type="button"
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
                chapter.isCompleted && "text-emerald-700 hover:text-emerald-700",
                chapter.isCompleted && isActive && "bg-emerald-200/20"
              )}
            >
              <div className="flex items-center gap-x-2 py-4">
                {isLocked ? (
                  <Lock className="text-slate-500" size={22} />
                ) : chapter.isCompleted ? (
                  <CheckCircle className="text-emerald-700" size={22} />
                ) : (
                  <PlayCircle className={cn("text-slate-500", isActive && "text-slate-700")} size={22} />
                )}
                {chapter.title}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};
