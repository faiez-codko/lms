import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { EnrollForm } from "./_components/enroll-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function StudentIdPage({
  params
}: {
  params: Promise<{ studentId: string }>
}) {

  const {studentId} = await params;

  if (!studentId) {
    return redirect("/admin/students");
  }

  const student = await db.user.findUnique({
    where: { id: studentId },
    include: {
      purchase: {
        include: {
          course: true
        }
      }
    }
  });

  if (!student) {
    return redirect("/admin/students");
  }

  const allCourses = await db.course.findMany({
    orderBy: { title: "asc" }
  });

  // Filter out courses already purchased
  const purchasedCourseIds = student.purchase.map(p => p.courseId);
  const availableCourses = allCourses.filter(c => !purchasedCourseIds.includes(c.id));

  return (
    <div className="p-6">
       <div className="flex items-center gap-x-2 mb-6">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to students
          </Button>
        </Link>
      </div>

       <div className="mb-8">
         <h1 className="text-2xl font-bold">{student.name}</h1>
         <p className="text-muted-foreground">{student.email}</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
            {student.purchase.length === 0 ? (
               <p className="text-muted-foreground">No enrolled courses.</p>
            ) : (
               <ul className="space-y-2">
                 {student.purchase.map((purchase) => (
                   <li key={purchase.id} className="p-3 border rounded-md bg-white dark:bg-slate-900">
                     {purchase.course.title}
                   </li>
                 ))}
               </ul>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Enroll in Course</h2>
            <EnrollForm 
              studentId={student.id} 
              courses={availableCourses} 
            />
          </div>
       </div>
    </div>
  );
}
