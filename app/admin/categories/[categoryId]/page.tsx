import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { CategoryForm } from "./_components/category-form";

export default async function CategoryIdPage({
  params
}: {
  params: Promise<{ categoryId: string }>
}) {

  const {categoryId} = await params;

  const category = await db.category.findUnique({
    where: {
      id: categoryId
    }
  });

  if (!category) {
    return redirect("/admin/categories");
  }

  return (
    <div className="p-6">
      <CategoryForm initialData={category} />
    </div>
  );
}
