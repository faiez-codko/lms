import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StudentStatusToggle } from "./_components/student-status-toggle";
import { StudentActions } from "./_components/student-actions";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

interface StudentsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [students, count] = await Promise.all([
    db.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.user.count({
      where: { role: "USER" },
    }),
  ]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Link href="/admin/students/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary text-primary-foreground dark:bg-slate-800 dark:text-slate-100">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Created At</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t hover:bg-muted/50 transition">
                <td className="p-4 font-medium">{student.name || "N/A"}</td>
                <td className="p-4">{student.email}</td>
                <td className="p-4">
                  <StudentStatusToggle studentId={student.id} isActive={student.isActive} />
                </td>
                <td className="p-4">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <StudentActions id={student.id} />
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
