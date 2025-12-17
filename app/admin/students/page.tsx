import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function StudentsPage() {
  const students = await db.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
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
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
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
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem asChild>
                          <Link href={`/admin/students/${student.id}`} className="flex items-center w-full cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
