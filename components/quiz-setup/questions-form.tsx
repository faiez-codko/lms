"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { question, option } from "@prisma/client";
import { OptionsForm } from "@/components/quiz-setup/options-form";
import { QuestionImageForm } from "@/components/quiz-setup/question-image-form";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface QuestionsFormProps {
  initialData: {
      questions: (question & { options: option[] })[]
  };
  quizId: string;
  routePrefix: string;
}

const formSchema = z.object({
  text: z.string().min(1),
});

export const QuestionsForm = ({
  initialData,
  quizId,
  routePrefix
}: QuestionsFormProps) => {
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
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/admin/quiz/${quizId}/questions`, values);
      toast.success("Question created");
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
      await axios.delete(`/api/admin/quiz/${quizId}/questions/${id}`);
      toast.success("Question deleted");
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
        Quiz Questions
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a question
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
                      placeholder="e.g. 'What is the capital of France?'"
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
          !initialData.questions.length && "text-slate-500 italic"
        )}>
          {!initialData.questions.length && "No questions"}
          <div className="space-y-2">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {initialData.questions.map((question, index) => (
              <AccordionItem key={question.id} value={question.id} className="bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 px-2">
                 <div className="flex items-center justify-between w-full">
                    <AccordionTrigger className="hover:no-underline py-3 flex-1 text-left pr-4">
                        <span className="truncate font-medium">{index + 1}. {question.text}</span>
                    </AccordionTrigger>
                    <div className="flex items-center gap-x-2">
                         <Button
                            onClick={() => onDelete(question.id)}
                            disabled={isUpdating}
                            variant="ghost"
                            size="sm"
                            className="hover:bg-sky-200 dark:hover:bg-slate-700"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                        <a href={`${routePrefix}/${question.id}`} className="p-2 hover:bg-sky-200 dark:hover:bg-slate-700 rounded-md transition">
                            <Pencil className="h-4 w-4" />
                        </a>
                    </div>
                 </div>
                 <AccordionContent className="border-t border-sky-200 dark:border-slate-700 pt-2 pb-4 px-2">
                      <div className="bg-white dark:bg-slate-900 rounded-md p-2 space-y-4">
                        <QuestionImageForm
                          initialData={question}
                          quizId={quizId}
                          questionId={question.id}
                        />
                        <OptionsForm
                            initialData={{ options: question.options }}
                            quizId={quizId}
                            questionId={question.id}
                        />
                      </div>
                 </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}
