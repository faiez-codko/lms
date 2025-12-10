import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, MessageCircle, Github, Download, ArrowRight } from "lucide-react";
import { chapters } from "@/lib/mock-data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentsList } from "@/components/CommentsList";

export default async function ChapterPage({ params }: { params: { courseId: string; chapterId: string } }) {
  const { chapterId  , courseId} = await params;
  const currentChapterIndex = chapters.findIndex((c) => c.id === chapterId);
  const currentChapter = chapters[currentChapterIndex];
  
  const nextChapter = chapters[currentChapterIndex + 1];

  return (
    <div className="flex flex-col max-w-5xl mx-auto pb-20">
      {/* Video Player Section */}
      <div className="p-4">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-lg border">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                     <PlayCircle className="h-20 w-20 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                     <p className="text-white font-medium">Start watching: {currentChapter?.title || `Chapter ${chapterId}`}</p>
                </div>
            </div>
            {/* Video Controls Mock */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-4">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold mb-2">{currentChapter?.title || "Introduction to Databases"}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> 12 Lessons</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> 3 Comments</span>
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
                            <p className="text-muted-foreground leading-relaxed">
                                In this chapter, we will cover the fundamentals of database management systems. We will explore the differences between SQL and NoSQL databases, and when to use each. By the end of this lesson, you will have a clear understanding of how to set up your local development environment for MySQL, PostgreSQL, and MongoDB.
                            </p>
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
