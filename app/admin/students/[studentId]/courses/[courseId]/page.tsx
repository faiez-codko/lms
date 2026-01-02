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
              comments: {
                where: {
                   userId: studentId,
                },
                orderBy: {
                  createdAt: "desc"
                }
              }
            }
          },
          comments: {
              where: {
                 userId: studentId,
              },
              orderBy: {
                createdAt: "desc"
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
    //@ts-ignore
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

            {chapter.comments.length > 0 && (
                <div className="mb-4 pl-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-r-md">
                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Student Comments on Chapter:</h4>
                    <div className="space-y-2">
                        {chapter.comments.map(comment => (
                            <div key={comment.id} className="text-sm bg-white dark:bg-slate-800 p-2 rounded border border-blue-100 dark:border-blue-900">
                                <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
                                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="pl-4 space-y-2 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
               {chapter.topics.length === 0 ? (
                 <p className="text-sm text-muted-foreground italic">No topics in this chapter</p>
               ) : (
                 chapter.topics.map((topic) => (
                    <div key={topic.id}>
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition">
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
                            {topic.comments.length > 0 ? `(${topic.comments.length} comments)` : ''}
                        </div>
                    </div>
                    {topic.comments.length > 0 && (
                        <div className="ml-8 mb-3 pl-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-r-md">
                            <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Student Comments on Topic:</h4>
                             <div className="space-y-1">
                                {topic.comments.map(comment => (
                                    <div key={comment.id} className="text-sm">
                                        <p className="text-slate-700 dark:text-slate-300 italic">"{comment.text}"</p>
                                        <span className="text-[10px] text-muted-foreground block text-right">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
