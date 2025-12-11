"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Music" },
  { id: "3", name: "Fitness" },
  { id: "4", name: "Photography" },
  { id: "5", name: "Accounting" },
  { id: "6", name: "Engineering" },
  { id: "7", name: "Filming" },
];

export default function CategoriesPage() {
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-x-2 p-3 border rounded-md bg-slate-100 dark:bg-slate-900"
          >
            <div className="truncate font-medium">{category.name}</div>
            <div className="ml-auto flex items-center gap-x-2">
                <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
