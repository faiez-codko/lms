"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export default function EditCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = use(params);
  const router = useRouter();
  
  // Mock data - In a real app, fetch this from API
  const category = {
    id: categoryId,
    name: "Computer Science",
    description: "Learn programming, algorithms, and system design.",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=computer%20science%20code%20abstract&image_size=landscape_4_3"
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Updating category:", values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/teacher/categories`);
    } catch (error) {
        console.log("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center min-h-screen p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p className="text-sm text-slate-500">
          Update your category details.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <div className="space-y-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                        <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Data Science'"
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea
                        disabled={isSubmitting}
                        placeholder="e.g. 'This category covers...'"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                        <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'https://example.com/image.png'"
                        {...field}
                        />
                    </FormControl>
                     <FormDescription>
                        You can use an external image URL for the category cover.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="flex items-center gap-x-2">
              <Link href="/teacher/categories">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
