"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { attachment, course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AttachmentFormProps {
  initialData: attachment[];
  courseId?: string;
  chapterId?: string;
  topicId?: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  url: z.string().min(1, {
    message: "URL is required",
  }),
  description: z.string().optional(),
});

export const AttachmentForm = ({
  initialData,
  courseId,
  chapterId,
  topicId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/attachments`, {
        ...values,
        courseId,
        chapterId,
        topicId,
      });
      toast.success("Attachment added");
      toggleEdit();
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
      <div className="font-medium flex items-center justify-between">
        Resources & Attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.length > 0 && (
            <div className="space-y-2 mt-2">
              {initialData.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-xs line-clamp-1 font-semibold">
                      {attachment.title}
                    </p>
                    {attachment.description && (
                         <p className="text-xs text-slate-500 truncate dark:text-slate-400">{attachment.description}</p>
                    )}
                    <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline truncate"
                    >
                        {attachment.url}
                    </a>
                  </div>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
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
                  <FormLabel>File Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Course Guidelines'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'https://example.com/file.pdf'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Add a short description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Add Attachment
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
