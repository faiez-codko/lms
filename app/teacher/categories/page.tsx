"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  { 
    id: "1", 
    name: "Computer Science", 
    description: "Learn programming, algorithms, and system design.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=computer%20science%20code%20abstract&image_size=landscape_4_3"
  },
  { 
    id: "2", 
    name: "Music", 
    description: "Master instruments, theory, and production.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=musical%20instruments%20studio&image_size=landscape_4_3"
  },
  { 
    id: "3", 
    name: "Fitness", 
    description: "Workouts, nutrition, and healthy living guides.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fitness%20gym%20workout&image_size=landscape_4_3"
  },
  { 
    id: "4", 
    name: "Photography", 
    description: "Camera basics, lighting, and photo editing.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=camera%20photography%20lens&image_size=landscape_4_3"
  },
  { 
    id: "5", 
    name: "Accounting", 
    description: "Financial reporting, bookkeeping, and tax prep.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=accounting%20finance%20calculator&image_size=landscape_4_3"
  },
  { 
    id: "6", 
    name: "Engineering", 
    description: "Civil, mechanical, and electrical engineering concepts.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=engineering%20blueprint%20gear&image_size=landscape_4_3"
  },
  { 
    id: "7", 
    name: "Filming", 
    description: "Cinematography, directing, and video editing.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=filming%20camera%20movie%20set&image_size=landscape_4_3"
  },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-video w-full overflow-hidden">
                 <Image 
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                 />
            </div>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg line-clamp-1">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 h-16">
                 <p className="text-sm text-muted-foreground line-clamp-2">
                     {category.description}
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
      </div>
    </div>
  );
}
