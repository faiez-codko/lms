import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";

export const dynamic = "force-dynamic";

interface TeachersPageProps {
  searchParams: Promise<{
    page?: string;
    title?: string;
  }>;
}

export default async function TeachersPage({ searchParams }: TeachersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const title = resolvedSearchParams.title;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = {
    role: "TEACHER"
  };

  if (title) {
    where.OR = [
      { name: { contains: title } },
      { email: { contains: title } },
    ];
  }

  const [teachers, count] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.user.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <div className="flex items-center gap-x-2">
          <SearchInput placeholder="Search teachers..." />
          <Link href="/admin/teachers/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary text-primary-foreground dark:bg-slate-800 dark:text-slate-100">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-t hover:bg-muted/50 transition">
                <td className="p-4 font-medium">{teacher.name || "N/A"}</td>
                <td className="p-4">{teacher.email}</td>
                <td className="p-4">
                  {new Date(teacher.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-muted-foreground">
                  No teachers found.
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
