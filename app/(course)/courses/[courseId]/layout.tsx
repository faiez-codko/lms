import { CourseSidebar } from "@/components/CourseSidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {/* Header for Mobile / Back Button */}
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50 bg-background border-b flex items-center px-6">
         <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-x-2 md:hidden">
                {/* Mobile Sidebar Toggle would go here */}
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
        <CourseSidebar />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
}
