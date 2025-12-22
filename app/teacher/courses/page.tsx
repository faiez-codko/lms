import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { db } from "@/lib/prismadb";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const session = await getCurrentUser();
  
  if (!session) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
        category: true,
    }
  });

  return (
    <div className="p-6 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground text-sm">Manage your courses and view their performance</p>
        </div>
        <Link href="/teacher/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Link href={`/teacher/courses/${course.id}`} key={course.id}>
            <Card className="group hover:shadow-lg transition-all cursor-pointer h-full flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 p-0 gap-0">
              <div className="relative aspect-video w-full overflow-hidden">
                 {course.imageUrl ? (
                    <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                 ) : (
                    <div className="flex items-center justify-center h-full w-full bg-slate-200 dark:bg-slate-800">
                        <Users className="h-10 w-10 text-slate-500" />
                    </div>
                 )}
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="font-normal text-xs bg-slate-100 dark:bg-slate-800">
                        {course.category?.name || "Uncategorized"}
                    </Badge>
                     <Badge variant={course.isPublished ? "default" : "secondary"} className={course.isPublished ? "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20" : "bg-slate-100 text-slate-500"}>
                        {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                </div>
                <CardTitle className="text-base font-bold line-clamp-2 leading-tight">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                 <div className="flex items-center gap-x-2 text-xs text-muted-foreground mt-2">
                    <Users className="h-3 w-3" />
                    <span>0 Students enrolled</span>
                 </div>
              </CardContent>
              <CardFooter className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t flex items-center justify-between">
                 <div className="font-bold text-lg text-slate-700 dark:text-slate-200">
                    {course.price ? `$${course.price}` : "Free"}
                 </div>
                 <div className="text-xs font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">
                    Edit Details →
                 </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
        {courses.length === 0 && (
            <div className="text-center text-sm text-muted-foreground mt-10 col-span-full">
                No courses found
            </div>
        )}
      </div>
    </div>
  );
}
