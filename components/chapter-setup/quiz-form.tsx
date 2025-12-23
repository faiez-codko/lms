"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { quiz, chapter, topic } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface QuizFormProps {
  initialData: (chapter & { quiz: quiz | null }) | (topic & { quiz: quiz | null });
  courseId: string;
  chapterId: string;
  topicId?: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const QuizForm = ({
  initialData,
  courseId,
  chapterId,
  topicId
}: QuizFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = topicId 
        ? `/api/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}/quiz`
        : `/api/admin/courses/${courseId}/chapters/${chapterId}/quiz`;
        
      await axios.post(url, values);
      toast.success("Quiz created");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async () => {
    try {
      setIsUpdating(true);
       const url = topicId 
        ? `/api/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}/quiz`
        : `/api/admin/courses/${courseId}/chapters/${chapterId}/quiz`;

      await axios.delete(url);
      toast.success("Quiz deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
        setIsUpdating(false);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
      <div className="font-medium flex items-center justify-between">
        Quiz
        {!initialData.quiz && (
             <Button onClick={toggleCreating} variant="ghost">
             {isCreating ? (
               <>Cancel</>
             ) : (
               <>
                 <PlusCircle className="h-4 w-4 mr-2" />
                 Add a quiz
               </>
             )}
           </Button>
        )}
       
      </div>
      
      {isCreating && !initialData.quiz && (
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
                      disabled={isSubmitting}
                      placeholder="e.g. 'Chapter Quiz'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.quiz && "text-slate-500 italic"
        )}>
          {!initialData.quiz && "No quiz"}
          {initialData.quiz && (
             <div
             className="flex items-center justify-between p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            >
             <span className="truncate">{initialData.quiz.title}</span>
             <div className="flex items-center gap-x-2">
                 <Button
                     onClick={onDelete}
                     disabled={isUpdating}
                     variant="ghost"
                     size="sm"
                 >
                     <Trash className="h-4 w-4" />
                 </Button>
                  <a href={topicId 
                      ? `/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}/quiz/${initialData.quiz.id}` 
                      : `/admin/courses/${courseId}/chapters/${chapterId}/quiz/${initialData.quiz.id}`
                  }>
                     <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" />
                 </a>
             </div>
         </div>
          )}
        </div>
      )}
    </div>
  );
}
