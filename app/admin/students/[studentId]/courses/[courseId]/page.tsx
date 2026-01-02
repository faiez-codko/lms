import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudentCourseAnalyticsPageProps {
  params: Promise<{
    studentId: string;
    courseId: string;
  }>;
}

export default async function StudentCourseAnalyticsPage({
  params
}: StudentCourseAnalyticsPageProps) {
  const { studentId, courseId } = await params;

  const student = await db.user.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return redirect("/admin/students");
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapter: {
        orderBy: { position: "asc" },
        include: {
          topics: {
            orderBy: { position: "asc" },
            include: {
              muxData: true,
            }
          }
        }
      }
    }
  });

  if (!course) {
    return redirect(`/admin/students/${studentId}`);
  }

  // Fetch all progress records for this user and course
  const progress = await db.userprogress.findMany({
    where: {
      userId: studentId,
      chapter: {
        courseId: courseId
      }
    }
  });

  const completedChapterIds = new Set(
    progress.filter(p => p.isCompleted && p.chapterId).map(p => p.chapterId)
  );

  const completedTopicIds = new Set(
    progress.filter(p => p.isCompleted && p.topicId).map(p => p.topicId)
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <Link href={`/admin/students/${studentId}`}>
          <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to student details
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-y-4 mb-8">
        <h1 className="text-2xl font-bold">
          Analytics: {course.title}
        </h1>
        <p className="text-muted-foreground">
          Student: <span className="font-semibold text-foreground">{student.name}</span>
        </p>
      </div>

      <div className="space-y-6">
        {course.chapter.map((chapter) => (
          <div key={chapter.id} className="border rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-x-2">
                Chapter: {chapter.title}
                {completedChapterIds.has(chapter.id) ? (
                    <Badge className="bg-emerald-600">Completed</Badge>
                ) : (
                    <Badge variant="secondary">In Progress</Badge>
                )}
              </h3>
            </div>

            <div className="pl-4 space-y-2 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
               {chapter.topics.length === 0 ? (
                 <p className="text-sm text-muted-foreground italic">No topics in this chapter</p>
               ) : (
                 chapter.topics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center gap-x-3">
                            {completedTopicIds.has(topic.id) ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                            )}
                            <span className={completedTopicIds.has(topic.id) ? "text-slate-700 dark:text-slate-200 line-through" : "text-slate-700 dark:text-slate-200"}>
                                {topic.title}
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {topic.type}
                        </div>
                    </div>
                 ))
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
