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
import { CourseProgressButton } from "./_components/course-progress-button";
import { CourseQuizCard } from "@/components/course-quiz-card";

export default async function ChapterPage({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ courseId: string; chapterId: string }>;
    searchParams: Promise<{ topicId?: string }>;
}) {
    const { chapterId, courseId } = await params;
    const { topicId } = await searchParams;

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
                include: {
                    quiz: true,
                    topics: {
                        where: {
                            isPublished: true,
                        },
                        include: {
                            quiz: true,
                            attachments: {
                                orderBy: {
                                    createdAt: "desc",
                                },
                            },
                        },
                        orderBy: {
                            position: "asc",
                        }
                    },
                    attachments: {
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
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

    const currentTopic = topicId ? currentChapter.topics.find((t) => t.id === topicId) : null;

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

    let isLocked = !purchase && !isAdmin;

    if (isLocked) {
        if (currentTopic) {
            if (currentTopic.isFree) {
                isLocked = false;
            }
        } else if (currentChapter.isFree) {
            isLocked = false;
        }
    }

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

    // Determine relevant attachments
    const attachments = currentTopic 
        ? currentTopic.attachments 
        : currentChapter.attachments;

    const title = currentTopic ? currentTopic.title : currentChapter.title;
    const description = currentTopic ? currentTopic.description : currentChapter.description;
    const videoUrl = currentTopic ? currentTopic.videoUrl : currentChapter.videoUrl;
    const quiz = currentTopic ? currentTopic.quiz : currentChapter.quiz;

    let nextLessonUrl = "";

    if (currentTopic) {
        // Find next topic
        const currentTopicIndex = currentChapter.topics.findIndex((t) => t.id === topicId);
        const nextTopic = currentChapter.topics[currentTopicIndex + 1];
        
        if (nextTopic) {
             nextLessonUrl = `/courses/${courseId}/chapters/${chapterId}?topicId=${nextTopic.id}`;
        } else if (nextChapter) {
             // Check if next chapter has topics
             if (nextChapter.topics && nextChapter.topics.length > 0) {
                 nextLessonUrl = `/courses/${courseId}/chapters/${nextChapter.id}?topicId=${nextChapter.topics[0].id}`;
             } else {
                 nextLessonUrl = `/courses/${courseId}/chapters/${nextChapter.id}`;
             }
        }
    } else {
        // On Chapter Page
        if (currentChapter.topics && currentChapter.topics.length > 0) {
            nextLessonUrl = `/courses/${courseId}/chapters/${chapterId}?topicId=${currentChapter.topics[0].id}`;
        } else if (nextChapter) {
             if (nextChapter.topics && nextChapter.topics.length > 0) {
                 nextLessonUrl = `/courses/${courseId}/chapters/${nextChapter.id}?topicId=${nextChapter.topics[0].id}`;
             } else {
                 nextLessonUrl = `/courses/${courseId}/chapters/${nextChapter.id}`;
             }
        }
    }

    return (
        <div className="flex flex-col max-w-5xl mx-auto pb-20">
            {/* Video Player Section */}
            <div className="p-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-lg border">
                    {videoUrl ? (
                        // In a real app, use a real video player (Mux, Youtube, etc)
                        // For now, simple video tag or iframe logic
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            {/* <video src={videoUrl} controls /> */}
                         
                                <iframe src={videoUrl} 
                                frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin" style={{position:"absolute",top:"0",left:"0",width:"100%",height:"100%"}} title="file_example_MP4_1920_18MG"></iframe>
             
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <PlayCircle className="h-20 w-20 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                                <p className="text-white font-medium">Start watching: {title}</p>
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
                        <h1 className="text-2xl font-bold mb-2">{title}</h1>
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


                        <CourseProgressButton
                            chapterId={chapterId}
                            courseId={courseId}
                            nextChapterId={nextChapter?.id}
                            isCompleted={!!isCompleted}
                        />




                        {
                            nextLessonUrl && (
                                <Link href={nextLessonUrl}>
                                    <Button className="gap-2 group">
                                        Next Lesson
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            )
                        }
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
                                        {description || "No description provided."}
                                    </div>
                                </div>

                                <div className="bg-card border rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 text-lg">Resources</h3>
                                    {attachments.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No resources available for this section.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {attachments.map((attachment) => (
                                                <div key={attachment.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{attachment.title}</span>
                                                            {attachment.description && (
                                                                <span className="text-xs text-muted-foreground">{attachment.description}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="sm">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="comments">
                                <div className="bg-card border rounded-lg p-6">
                                    <CommentsList 
                                        chapterId={chapterId} 
                                        topicId={topicId} 
                                        currentUserId={userId}
                                        isCurrentUserAdmin={isAdmin}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        {quiz && (
                            <CourseQuizCard
                                courseId={courseId}
                                chapterId={chapterId}
                                quizId={quiz.id}
                                title={quiz.title}
                            />
                        )}
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
