import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/teacher/categories/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-video w-full overflow-hidden">
                 {category.imageUrl ? (
                    <Image 
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                 ) : (
                    <div className="flex items-center justify-center h-full w-full bg-slate-200 dark:bg-slate-800">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                 )}
            </div>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg line-clamp-1">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 h-16">
                 <p className="text-sm text-muted-foreground line-clamp-2">
                     {category.description || "No description"}
                 </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
                <Link href={`/teacher/categories/${category.id}`}>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                </Link>
                 <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
          </Card>
        ))}
        {categories.length === 0 && (
             <div className="text-center text-sm text-muted-foreground mt-10 col-span-full">
                 No categories found
             </div>
        )}
      </div>
    </div>
  );
}
