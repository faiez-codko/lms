import { db } from "@/lib/prismadb";
import { getProgress } from "@/actions/get-progress";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Lock, Github, PartyPopper, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { CourseEnrollButton } from "./_components/course-enroll-button";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

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
      category: true,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;
  const userId = payload?.sub;

  let purchase = null;
  let progress = 0;
  let completedChapters = new Set<string>();

  if (userId) {
    purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });

    if (purchase) {
        progress = await getProgress(userId, courseId);
    }
    
    // Fetch completed chapters
    const userProgress = await db.userprogress.findMany({
        where: {
            userId: userId,
            chapterId: {
                in: course.chapter.map(c => c.id)
            },
            isCompleted: true
        },
        select: {
            chapterId: true
        }
    });
    
    completedChapters = new Set(userProgress.map(p => p.chapterId));
  }

  const isPurchased = !!purchase;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column (Left/Center) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Section */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-sm group">
            {course.imageUrl ? (
                <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                />
            ) : (
                <div className="flex items-center justify-center h-full w-full bg-slate-200">
                    <BookOpen className="h-12 w-12 text-slate-500" />
                </div>
            )}
          </div>

          {/* Course Details Card */}
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 px-3 py-1">
                    <BookOpen className="h-3 w-3" />
                    {course.chapter.length} {course.chapter.length === 1 ? "Chapter" : "Chapters"}
                </Badge>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
                {course.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
                {course.category && (
                    <span className="px-3 py-1 bg-secondary text-xs font-medium rounded-full text-secondary-foreground">
                        {course.category.name}
                    </span>
                )}
            </div>
            
            {isPurchased && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-blue-600">{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-blue-100"  />
                </div>
            )}
          </div>

          {/* Course Chapters List */}
          <div className="bg-background border rounded-xl shadow-sm overflow-hidden">
             <div className="p-6 border-b bg-slate-50/50">
                 <h3 className="font-semibold text-lg">Course Content</h3>
             </div>
             <div className="divide-y">
                 {course.chapter.map((chapter) => {
                     const isLocked = !chapter.isFree && !isPurchased;
                     const isCompleted = completedChapters.has(chapter.id);
                     
                     return (
                         <Link 
                            key={chapter.id} 
                            href={`/courses/${courseId}/chapters/${chapter.id}`}
                            className={cn(
                                "flex items-center gap-x-3 p-4 hover:bg-slate-50 transition-colors",
                                isLocked && "pointer-events-none opacity-70"
                            )}
                         >
                            {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            ) : isLocked ? (
                                <Lock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                            ) : (
                                <PlayCircle className="h-5 w-5 text-slate-500 flex-shrink-0" />
                            )}
                            
                            <span className="text-sm font-medium line-clamp-1">
                                {chapter.title}
                            </span>
                            
                            {chapter.isFree && !isPurchased && (
                                <Badge variant="outline" className="ml-auto bg-emerald-50 text-emerald-600 border-emerald-200">
                                    Free Preview
                                </Badge>
                            )}
                         </Link>
                     )
                 })}
             </div>
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
            
            {/* Start Watching Card */}
            {isPurchased ? (
                <div className="bg-[#0f172a] text-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold mb-2">Ready to start building?</h3>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                        Track your progress, watch with subtitles, change quality & speed, and more.
                    </p>
                    <Link href={`/courses/${courseId}/chapters/${course.chapter[0]?.id}`} className="w-full">
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold h-11 rounded-full" disabled={course.chapter.length === 0}>
                            <PlayCircle className="mr-2 h-4 w-4 fill-slate-900 text-white" />
                            {course.chapter.length > 0 ? "Start watching" : "No chapters yet"}
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-background border rounded-xl p-6 shadow-sm text-center">
                    <div className="mx-auto bg-secondary/50 h-10 w-10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-5 w-5" />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold">Unlock Course</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            Get full access to all chapters and resources
                        </p>
                    </div>
                    
                    <CourseEnrollButton 
                        price={course.price || 0}
                        courseId={courseId}
                        course={course}
                    />

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border-t pt-4">
                        <span>30-day money-back guarantee</span>
                        <PartyPopper className="h-3 w-3 text-yellow-500" />
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
