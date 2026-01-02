import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { EnrollForm } from "./_components/enroll-form";
import { UnenrollButton } from "./_components/unenroll-button";
import { NameForm } from "./_components/name-form";
import { EmailForm } from "./_components/email-form";
import { PasswordForm } from "./_components/password-form";
import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgress } from "@/actions/get-progress";
import { Progress } from "@/components/ui/progress";

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

  // Fetch progress for each purchased course
  const purchasedCoursesWithProgress = await Promise.all(
    student.purchase.map(async (purchase) => {
      const progress = await getProgress(student.id, purchase.course.id);
      return {
        ...purchase,
        progress,
      };
    })
  );

  const allCourses = await db.course.findMany({
    orderBy: { title: "asc" }
  });

  // Filter out courses already purchased
  const purchasedCourseIds = student.purchase.map(p => p.courseId);
  const availableCourses = allCourses.filter(c => !purchasedCourseIds.includes(c.id));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 m-6">
       <div className="flex items-center gap-x-2 mb-6">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to students
          </Button>
        </Link>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-x-2 mb-4">
               <UserCog className="h-6 w-6" />
               <h2 className="text-xl font-semibold">Student Details</h2>
            </div>
            <NameForm initialData={{ name: student.name || "" }} studentId={student.id} />
            <EmailForm initialData={{ email: student.email || "" }} studentId={student.id} />
            <PasswordForm studentId={student.id} />
          </div>

          <div className="space-y-6">
             <div>
               <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
            {purchasedCoursesWithProgress.length === 0 ? (
               <p className="text-muted-foreground">No enrolled courses.</p>
            ) : (
               <ul className="space-y-2">
                 {purchasedCoursesWithProgress.map((purchase) => (
                   <li key={purchase.id} className="p-3 border rounded-md bg-white dark:bg-slate-900 flex gap-3 items-center justify-between">
                     <div className="flex gap-3 items-center w-full">
                        {purchase.course?.imageUrl && <img src={purchase.course?.imageUrl } alt={purchase.course.title} className="w-12 h-12 rounded-md" />}
                        <div className="flex flex-col w-full">
                        <Link href={`/admin/students/${student.id}/courses/${purchase.course.id}`} className="font-medium hover:underline cursor-pointer">
                            {purchase.course.title}
                        </Link>
                        <div className="flex items-center gap-x-2 w-full max-w-[200px] mt-1">
                            <Progress value={purchase.progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">{Math.round(purchase.progress)}%</span>
                        </div>
                        </div>
                     </div>
                     <UnenrollButton studentId={student.id} courseId={purchase.course.id} />
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
    </div>
  );
}
