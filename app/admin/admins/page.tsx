import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminActions } from "@/components/admin/admin-actions";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";

export const dynamic = "force-dynamic";

interface AdminsPageProps {
  searchParams: Promise<{
    page?: string;
    title?: string;
  }>;
}

export default async function AdminsPage({ searchParams }: AdminsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const title = resolvedSearchParams.title;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = {
    role: {
      in: ["ADMIN", "SUPER_ADMIN"]
    }
  };

  if (title) {
    where.OR = [
      { name: { contains: title } },
      { email: { contains: title } },
    ];
  }

  const [admins, count] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.user.count({
      where,
    })
  ]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admins & Moderators</h1>
        <div className="flex items-center gap-x-2">
          <SearchInput placeholder="Search admins..." />
          <Link href="/admin/admins/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
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
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Created At</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t hover:bg-muted/50 transition">
                <td className="p-4 font-medium">{admin.name || "N/A"}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">
                  <Badge variant={admin.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                    {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Moderator"}
                  </Badge>
                </td>
                <td className="p-4">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <AdminActions id={admin.id} />
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No admins found.
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
