"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Grip, LayoutDashboard, ListChecks, Pencil, PlusCircle, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock data
const categories = [
    { id: "1", name: "Computer Science" },
    { id: "2", name: "Music" },
    { id: "3", name: "Fitness" },
    { id: "4", name: "Photography" },
    { id: "5", name: "Accounting" },
    { id: "6", name: "Engineering" },
    { id: "7", name: "Filming" },
  ];

const chapters = [
  { id: "1", title: "Introduction", isPublished: true },
  { id: "2", title: "Setup Environment", isPublished: false },
  { id: "3", title: "First Project", isPublished: false },
];

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.coerce.number().optional(),
});

export default function CourseIdPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Advanced Web Development",
      description: "Learn how to build modern web applications...",
      price: 99.99,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsEditingTitle(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-500">
            Complete all fields (2/6)
          </span>
        </div>
        <div className="flex items-center gap-x-2">
            <Button variant="outline" size="sm">
                Discard
            </Button>
            <Button size="sm">
                Publish
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                <LayoutDashboard className="h-6 w-6 text-sky-700" />
            </div>
            <h2 className="text-xl font-medium">Customize your course</h2>
          </div>
          
          {/* Title Form */}
          <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course title
              <Button onClick={() => setIsEditingTitle((prev) => !prev)} variant="ghost">
                {isEditingTitle ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit title
                  </>
                )}
              </Button>
            </div>
            {!isEditingTitle && (
              <p className="text-sm mt-2">{form.getValues("title")}</p>
            )}
            {isEditingTitle && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={false}
                            placeholder="e.g. 'Advanced Web Development'"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-x-2">
                    <Button
                      disabled={false}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>

          {/* Description Form (Placeholder) */}
          <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course description
              <Button variant="ghost">
                <Pencil className="h-4 w-4 mr-2" />
                Edit description
              </Button>
            </div>
            <p className="text-sm mt-2 text-slate-500 italic">
                {form.getValues("description")}
            </p>
          </div>
          
          {/* Image Form (Placeholder) */}
          <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course image
              <Button variant="ghost">
                <Pencil className="h-4 w-4 mr-2" />
                Edit image
              </Button>
            </div>
             <div className="aspect-video mt-2 rounded-md bg-slate-200 flex items-center justify-center dark:bg-slate-800">
                <span className="text-slate-500">No image</span>
             </div>
          </div>

           {/* Category Form (Placeholder) */}
           <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course category
              <Button variant="ghost">
                <Pencil className="h-4 w-4 mr-2" />
                Edit category
              </Button>
            </div>
             <p className="text-sm mt-2 text-slate-500 italic">
                No category selected
            </p>
          </div>

        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
                <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                    <ListChecks className="h-6 w-6 text-sky-700" />
                </div>
                <h2 className="text-xl font-medium">Course chapters</h2>
            </div>
            <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                <div className="font-medium flex items-center justify-between mb-4">
                  Course chapters
                  <Button variant="ghost">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add chapter
                  </Button>
                </div>
                
                <div className="flex flex-col gap-2">
                    {chapters.map((chapter) => (
                        <div key={chapter.id} 
                            className="flex items-center gap-x-2 bg-background border-slate-200 border text-slate-700 rounded-md mb-2 text-sm p-2 cursor-pointer hover:bg-slate-200/20 transition dark:text-slate-300 dark:border-slate-800"
                            onClick={() => router.push(`/teacher/courses/${courseId}/chapters/${chapter.id}`)}
                        >
                            <div className="px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition">
                                <Grip className="h-5 w-5" />
                            </div>
                            {chapter.title}
                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                                <Badge variant={chapter.isPublished ? "default" : "secondary"}>
                                    {chapter.isPublished ? "Published" : "Draft"}
                                </Badge>
                                <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" />
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            </div>
          </div>
          
           <div>
            <div className="flex items-center gap-x-2">
                <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                    <span className="text-sky-700 font-bold">$</span>
                </div>
                <h2 className="text-xl font-medium">Sell your course</h2>
            </div>
             <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                <div className="font-medium flex items-center justify-between">
                  Course price
                  <Button variant="ghost">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit price
                  </Button>
                </div>
                 <p className="text-sm mt-2 text-slate-500">
                    ${form.getValues("price")}
                </p>
            </div>
           </div>

        </div>
      </div>
    </div>
  );
}
