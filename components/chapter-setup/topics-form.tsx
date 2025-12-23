"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { topic, chapter } from "@prisma/client";

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
import { Badge } from "@/components/ui/badge";

interface TopicsFormProps {
  initialData: chapter & { topics: topic[] };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const TopicsForm = ({
  initialData,
  courseId,
  chapterId
}: TopicsFormProps) => {
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
      await axios.post(`/api/admin/courses/${courseId}/chapters/${chapterId}/topics`, values);
      toast.success("Topic created");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setIsUpdating(true);
      await axios.delete(`/api/admin/courses/${courseId}/chapters/${chapterId}/topics/${id}`);
      toast.success("Topic deleted");
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
        Chapter Topics
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a topic
            </>
          )}
        </Button>
      </div>
      
      {isCreating && (
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
                      placeholder="e.g. 'Introduction to the topic'"
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
          !initialData.topics.length && "text-slate-500 italic"
        )}>
          {!initialData.topics.length && "No topics"}
          <div className="space-y-2">
            {initialData.topics.map((topic) => (
                <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                >
                    <span className="truncate">{topic.title}</span>
                    <div className="flex items-center gap-x-2">
                        {topic.isFree && (
                            <Badge>Free</Badge>
                        )}
                        <Badge className={cn("bg-slate-500", topic.isPublished && "bg-sky-700")}>
                            {topic.isPublished ? "Published" : "Draft"}
                        </Badge>
                         <Button
                            onClick={() => onDelete(topic.id)}
                            disabled={isUpdating}
                            variant="ghost"
                            size="sm"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                        <a href={`/admin/courses/${courseId}/chapters/${chapterId}/topics/${topic.id}`}>
                            <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" />
                        </a>
                    </div>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
