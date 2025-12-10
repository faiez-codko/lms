import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Lock, Github, PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  // In a real app, I would fetch course data based on params.courseId
  // For now, I'll mock the specific course from the image
 
  const { courseId } = await params;
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column (Left/Center) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Section */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-sm group">
            <Image
              src="https://utfs.io/f/7696b4d9-c2fe-4436-a4f6-c4cf83661223-6rrk66.png"
              alt="Course Hero"
              fill
              className="object-cover"
            />
          </div>

          {/* Course Details Card */}
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 px-3 py-1">
                    <BookOpen className="h-3 w-3" />
                    31 Chapters
                </Badge>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Build And Deploy An AI Automation SaaS</h2>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
                In this tutorial, we're building Nodebase, a complete workflow automation platform from scratch. You'll learn how to create a visual drag-and-drop canvas for building workflows, integrate multiple triggers and AI providers, handle background job execution, and build a full SaaS business layer with authentication, subscriptions, and paywalls. We'll also cover error tracking with AI monitoring and a professional Git workflow with AI-powered code reviews.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
                {["Tailwind", "React.js", "Next.js", "Prisma"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-secondary text-xs font-medium rounded-full text-secondary-foreground">
                        {tag}
                    </span>
                ))}
            </div>
            
            <div className="space-y-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span className="text-blue-600">0% Complete</span>
                 </div>
                 <Progress value={50} className="h-2 bg-blue-100"  />
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
            
            {/* Start Watching Card */}
            <div className="bg-[#0f172a] text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-2">Ready to start building?</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Track your progress, watch with subtitles, change quality & speed, and more.
                </p>
                <Link href={`/courses/${courseId}/chapters/1`} className="w-full">
                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold h-11 rounded-full">
                        <PlayCircle className="mr-2 h-4 w-4 fill-slate-900 text-white" />
                        Start watching
                    </Button>
                </Link>
            </div>

            {/* Unlock Source Code Card */}
            <div className="bg-background border rounded-xl p-6 shadow-sm text-center">
                <div className="mx-auto bg-secondary/50 h-10 w-10 rounded-full flex items-center justify-center mb-4">
                    <Github className="h-5 w-5" />
                </div>
                <Button variant="secondary" className="w-full mb-4 h-10 font-medium">
                    Unlock Source Code
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border-t pt-4">
                    <span>50% discount applied</span>
                    <PartyPopper className="h-3 w-3 text-yellow-500" />
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
