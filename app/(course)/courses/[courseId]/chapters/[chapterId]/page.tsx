import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, MessageCircle, Github, Download, ArrowRight, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentsList } from "@/components/CommentsList";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";

export default async function ChapterPage({ params }: { params: Promise<{ courseId: string; chapterId: string }> }) {
  const { chapterId, courseId } = await params;
  
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;
  const userId = payload?.sub;

  if (!userId) {
    return redirect("/");
  }

  // Fetch course and chapters
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
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  // Find current chapter
  const currentChapterIndex = course.chapter.findIndex((c) => c.id === chapterId);
  const currentChapter = course.chapter[currentChapterIndex];

  if (!currentChapter) {
    return redirect("/");
  }

  const nextChapter = course.chapter[currentChapterIndex + 1];

  // Check access: Admin OR Purchased OR Free Chapter
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

  const isLocked = !currentChapter.isFree && !purchase && !isAdmin;

  if (isLocked) {
      return (
          <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
              <div className="bg-slate-100 p-8 rounded-full">
                  <Lock className="h-12 w-12 text-slate-500" />
              </div>
              <h1 className="text-2xl font-bold">Chapter Locked</h1>
              <p className="text-muted-foreground text-center max-w-md">
                  You need to purchase this course to access this chapter.
              </p>
              <Link href={`/courses/${courseId}`}>
                  <Button size="lg">
                      View Course Details
                  </Button>
              </Link>
          </div>
      )
  }

  // Get User Progress for this chapter
  const userProgress = await db.userprogress.findUnique({
      where: {
          userId_chapterId: {
              userId,
              chapterId
          }
      }
  });

  const isCompleted = userProgress?.isCompleted;

  return (
    <div className="flex flex-col max-w-5xl mx-auto pb-20">
      {/* Video Player Section */}
      <div className="p-4">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-lg border">
            {currentChapter.videoUrl ? (
                // In a real app, use a real video player (Mux, Youtube, etc)
                // For now, simple video tag or iframe logic
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <video src={currentChapter.videoUrl} controls />
              
                </div>
            ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <PlayCircle className="h-20 w-20 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                        <p className="text-white font-medium">Start watching: {currentChapter.title}</p>
                    </div>
                </div>
            )}
           
          
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold mb-2">{currentChapter.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> Lesson {currentChapterIndex + 1}</span>
                    {isCompleted && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle className="h-4 w-4" /> Completed
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" />
                    Source Code
                 </Button>
                 {nextChapter ? (
                   <Link href={`/courses/${courseId}/chapters/${nextChapter.id}`}>
                      <Button className="gap-2 group">
                          Next Lesson
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                   </Link>
                 ) : (
                    <Button className="gap-2" disabled>
                        Course Completed
                    </Button>
                 )}
            </div>
        </div>
        
        <div className="h-px bg-border w-full" />

        {/* Tabs / Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 w-[300px]">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6">
                        <div className="bg-card border rounded-lg p-6">
                            <h3 className="font-semibold mb-4 text-lg">About this chapter</h3>
                            <div className="text-muted-foreground leading-relaxed">
                                {currentChapter.description || "No description provided."}
                            </div>
                        </div>
                        
                        <div className="bg-card border rounded-lg p-6">
                            <h3 className="font-semibold mb-4 text-lg">Resources</h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Installation Guide.pdf</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Github className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Starter Project</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="comments">
                        <div className="bg-card border rounded-lg p-6">
                             <CommentsList />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            
            <div className="space-y-6">
                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-blue-700 mb-4">
                        Join our Discord community to get help from instructors and fellow students.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Join Discord
                    </Button>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}
