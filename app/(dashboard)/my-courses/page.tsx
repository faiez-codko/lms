import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { redirect } from "next/navigation";

import { AuthModal } from "@/components/AuthModal";

export default async function MyCoursesPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;
  const userId = payload?.sub;

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <div className="bg-secondary/50 p-6 rounded-full">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Not logged in</h3>
          <p className="text-muted-foreground max-w-sm">
            Please log in to view your purchased courses.
          </p>
        </div>
        <AuthModal 
            trigger={
                <Button>
                    Login to Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            }
        />
      </div>
    );
  }

  const purchasedCourses = await getDashboardCourses(userId);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Learning</h1>
        <p className="text-muted-foreground mt-2">
            Continue where you left off.
        </p>
      </div>
      
      {purchasedCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
             <div className="bg-secondary/50 p-6 rounded-full">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold text-lg">No courses yet</h3>
                <p className="text-muted-foreground max-w-sm">
                    You haven't enrolled in any courses yet. Browse our catalog to get started.
                </p>
            </div>
            <Link href="/browse">
                <Button>
                    Browse Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchasedCourses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id}>
                <CourseCard course={course} />
                {/* We could add a progress bar here if CourseCard doesn't support it yet, 
                    but for now standard card is fine. */}
            </Link>
            ))}
        </div>
      )}
    </div>
  );
}
