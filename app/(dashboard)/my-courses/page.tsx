import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

// Mock data for purchased courses
const purchasedCourses = [
  {
    id: 1,
    title: "Complete React.js Masterclass 2024",
    author: "Code With Faiez",
    thumbnail: "https://utfs.io/f/7696b4d9-c2fe-4436-a4f6-c4cf83661223-6rrk66.png",
    price: "$19.99",
    rating: 4.8,
    students: 12500,
    category: "Development",
    progress: 45 // Add progress for purchased courses
  },
  {
    id: 3,
    title: "Advanced Tailwind CSS Patterns",
    author: "UI Labs",
    thumbnail: "https://utfs.io/f/539a30f8-2ecd-45b3-aa68-ebbc83f236f9-36lslp.png",
    price: "$14.99",
    rating: 4.7,
    students: 5400,
    category: "Design",
    progress: 12
  }
];

export default function MyCoursesPage() {
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
