"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl: string | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
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
      // await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      console.log("Mock update:", values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      // toast.error("Something went wrong");
      console.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
      <div className="font-medium flex items-center justify-between">
        Chapter video
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
            {/* Mock Video Player */}
             <div className="flex items-center justify-center h-full w-full bg-slate-900 text-white rounded-md">
                 <p className="text-sm">Video Player Placeholder for: {initialData.videoUrl}</p>
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
