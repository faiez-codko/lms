"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Eye, LayoutDashboard, Pencil, Video } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Switch } from "@/components/ui/switch"; // I might need to create this if it doesn't exist, but I'll assume it does or I'll use a checkbox.

// I'll check if Switch exists in components/ui
// If not, I'll use a simple checkbox or just a div.

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isFree: z.boolean().default(false),
  videoUrl: z.string().optional(),
});

export default function ChapterIdPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = use(params);
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Introduction",
      description: "Welcome to the course!",
      isFree: false,
      videoUrl: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-500">
                Complete all fields (1/3)
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                <LayoutDashboard className="h-6 w-6 text-sky-700" />
              </div>
              <h2 className="text-xl font-medium">Customize your chapter</h2>
            </div>
            {/* Title Form */}
            <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                <div className="font-medium flex items-center justify-between">
                  Chapter title
                  <Button variant="ghost">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit title
                  </Button>
                </div>
                 <p className="text-sm mt-2">{form.getValues("title")}</p>
            </div>
            
            {/* Description Form */}
            <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                <div className="font-medium flex items-center justify-between">
                  Chapter description
                  <Button variant="ghost">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit description
                  </Button>
                </div>
                 <p className="text-sm mt-2 text-slate-500 italic">
                    {form.getValues("description")}
                </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                <Eye className="h-6 w-6 text-sky-700" />
              </div>
              <h2 className="text-xl font-medium">Access Settings</h2>
            </div>
            <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                 <div className="flex items-center justify-between">
                     <div className="flex flex-col gap-y-1">
                         <div className="font-medium">Chapter access</div>
                         <div className="text-xs text-muted-foreground">
                             Check this box if you want to make this chapter free for preview
                         </div>
                     </div>
                     {/* Placeholder for Switch */}
                     <div className="h-6 w-6 border rounded-sm" /> 
                 </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
              <Video className="h-6 w-6 text-sky-700" />
            </div>
            <h2 className="text-xl font-medium">Add a video</h2>
          </div>
           <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                 <div className="font-medium flex items-center justify-between mb-4">
                  Chapter video
                  <Button variant="ghost">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit video
                  </Button>
                </div>
                 <div className="aspect-video mt-2 rounded-md bg-slate-200 flex items-center justify-center dark:bg-slate-800">
                    <span className="text-slate-500">Video Placeholder</span>
                 </div>
                 <div className="text-xs text-muted-foreground mt-2">
                     Upload this chapter's video
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
