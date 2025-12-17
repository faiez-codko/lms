import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/admin/categories/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="p-4 border rounded-md bg-white dark:bg-slate-900 flex items-center justify-between">
            <span className="font-medium">{category.name}</span>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center text-muted-foreground col-span-full">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
