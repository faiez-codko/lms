import { CourseSidebar } from "@/components/CourseSidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseMobileSidebar } from "@/components/CourseMobileSidebar";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { getCourseWithChapters } from "@/actions/get-course-with-chapters";
import { redirect } from "next/navigation";
import { db } from "@/lib/prismadb";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;
  const userId = payload?.sub;

  if (!userId) {
    return redirect("/");
  }

  const course = await getCourseWithChapters(userId, courseId);

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      {/* Header for Mobile / Back Button */}
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50 bg-background border-b flex items-center px-6">
         <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-x-2 md:hidden">
                <CourseMobileSidebar />
            </div>
            <div className="hidden md:flex">
                {/* Maybe breadcrumbs or title */}
            </div>
            <Link href="/" className="flex items-center text-sm font-medium hover:opacity-75 transition ml-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to courses
            </Link>
         </div>
      </div>

      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={course.progress || 0} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
}
