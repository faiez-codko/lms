import { db } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ImageIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryActions } from "./_components/category-actions";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

interface CategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    title?: string;
  }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const title = resolvedSearchParams.title;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  
  if (title) {
    where.name = {
      contains: title,
    };
  }

  const [categories, count] = await Promise.all([
    db.category.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    db.category.count({ where }),
  ]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex items-center gap-x-2">
          <SearchInput placeholder="Search categories..." />
          <Link href="/admin/categories/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-slate-900">
        <Table>
          <TableHeader className=" dark:bg-slate-800 dark:text-slate-100">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.imageUrl ? (
                    <div className="relative h-10 w-16 overflow-hidden rounded-md">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-16 bg-slate-200 rounded-md flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-slate-500" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">
                   {category.description ? (
                     <span className="line-clamp-1">{category.description}</span>
                   ) : (
                     <span className="italic">No description</span>
                   )}
                </TableCell>
                <TableCell>
                  <CategoryActions id={category.id} />
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
