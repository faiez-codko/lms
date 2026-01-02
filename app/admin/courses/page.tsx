import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [courses, count] = await Promise.all([
    db.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        chapter: true,
      },
      skip,
      take: limit,
    }),
    db.course.count(),
  ]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link href="/admin/courses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary text-primary-foreground dark:bg-slate-800 dark:text-slate-100">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t hover:bg-muted/50 transition">
                <td className="p-4 font-medium">{course.title}</td>
                <td className="p-4">
                  {course.price 
                    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(course.price) 
                    : "Free"}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-4">{course.category?.name || "Uncategorized"}</td>
                <td className="p-4">
                   <Link href={`/courses/${course.id}/chapters/${course.chapter[0]?.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                   </Link>
                   <Link href={`/admin/courses/${course.id}`}>
                      <Button variant="link" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                   </Link>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No courses found.
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
