"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash, ImageIcon } from "lucide-react";
import { category } from "@prisma/client";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmModal } from "@/components/modals/confirm-modal";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

interface CategoryFormProps {
  initialData: category;
}

export const CategoryForm = ({
  initialData
}: CategoryFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description || "",
      imageUrl: initialData.imageUrl || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/categories/${initialData.id}`, values);
      toast.success("Category updated");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/admin/categories/${initialData.id}`);
      toast.success("Category deleted");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="w-full md:w-[600px]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Category</h1>
          <ConfirmModal onConfirm={onDelete}>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          </ConfirmModal>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Computer Science"
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
                      placeholder="e.g. This category covers..."
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. https://example.com/image.png"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a direct link to an image. 16:9 aspect ratio recommended.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("imageUrl") && (
                <div className="relative aspect-video mt-2 bg-slate-100 rounded-md overflow-hidden">
                    <img
                        alt="Category image"
                        
                        className="object-cover"
                        src={form.watch("imageUrl") || ""}
                    />
                </div>
            )}

            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
