import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const admins = await db.user.findMany({
    where: { 
        role: {
            in: ["ADMIN", "SUPER_ADMIN"]
        }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admins & Moderators</h1>
        <Link href="/admin/admins/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </Link>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       {/* Add edit/delete actions here later if needed */}
                       <DropdownMenuItem disabled className="text-muted-foreground">
                            No actions available
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
    </div>
  );
}
