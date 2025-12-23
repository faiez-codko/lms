"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Pencil, Trash, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { option } from "@prisma/client";

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
import { Checkbox } from "@/components/ui/checkbox";

interface OptionsFormProps {
  initialData: {
      options: option[]
  };
  quizId: string;
  questionId: string;
}

const formSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

export const OptionsForm = ({
  initialData,
  quizId,
  questionId
}: OptionsFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      isCorrect: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/admin/quiz/${quizId}/questions/${questionId}/options`, values);
      toast.success("Option created");
      toggleCreating();
      router.refresh();
      form.reset();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setIsUpdating(true);
      await axios.delete(`/api/admin/quiz/${quizId}/questions/${questionId}/options/${id}`);
      toast.success("Option deleted");
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
        Question Options
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an option
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
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Paris'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="isCorrect"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <p>
                        Correct Answer
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Check if this is the correct answer for the question.
                    </p>
                  </div>
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
          !initialData.options.length && "text-slate-500 italic"
        )}>
          {!initialData.options.length && "No options"}
          <div className="space-y-2">
            {initialData.options.map((option) => (
                <div
                    key={option.id}
                    className={cn(
                        "flex items-center justify-between p-3 w-full border rounded-md",
                         option.isCorrect ? "bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" : "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    )}
                >
                    <div className="flex items-center gap-x-2">
                        {option.isCorrect && <Check className="h-4 w-4" />}
                        <span className="truncate">{option.text}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                         <Button
                            onClick={() => onDelete(option.id)}
                            disabled={isUpdating}
                            variant="ghost"
                            size="sm"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
