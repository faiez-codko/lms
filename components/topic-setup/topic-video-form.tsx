"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { topic } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";

interface TopicVideoFormProps {
  initialData: topic;
  courseId: string;
  chapterId: string;
  topicId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const TopicVideoForm = ({
  initialData,
  courseId,
  chapterId,
  topicId,
}: TopicVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}`, values);
      toast.success("Topic updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
      <div className="font-medium flex items-center justify-between">
        Topic video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md dark:bg-slate-800">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
             <div className="flex items-center justify-center h-full w-full bg-slate-900 text-white rounded-md">
                <video src={initialData.videoUrl} controls className="h-full w-full"></video>
             </div>
          </div>
        )
      )}
      {isEditing && (
         <Form {...form}>
         <form
           onSubmit={form.handleSubmit(onSubmit)}
           className="space-y-4 mt-4"
         >
           <FormField
             control={form.control}
             name="videoUrl"
             render={({ field }) => (
               <FormItem>
                 <FormControl>
                   <Input
                     disabled={isSubmitting}
                     placeholder="e.g. 'https://youtube.com/...'"
                     {...field}
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <div className="flex items-center gap-x-2">
             <Button disabled={!isValid || isSubmitting} type="submit">
               Save
             </Button>
           </div>
         </form>
       </Form>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};
