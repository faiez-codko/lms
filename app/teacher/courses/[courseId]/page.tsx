"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Grip, LayoutDashboard, ListChecks, Pencil, PlusCircle, ImageIcon, DollarSign, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react";
import { ChaptersList } from "@/components/ChaptersList";

// Mock data
const categories = [
    { label: "Computer Science", value: "1" },
    { label: "Music", value: "2" },
    { label: "Fitness", value: "3" },
    { label: "Photography", value: "4" },
    { label: "Accounting", value: "5" },
    { label: "Engineering", value: "6" },
    { label: "Filming", value: "7" },
  ];

const chapters = [
  { id: "1", title: "Introduction", isPublished: true },
  { id: "2", title: "Setup Environment", isPublished: false },
  { id: "3", title: "First Project", isPublished: false },
];

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
});

export default function CourseIdPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  
  // Edit States
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Advanced Web Development",
      description: "Learn how to build modern web applications...",
      price: 99.99,
      categoryId: "",
      imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=coding%20course%20cover&image_size=landscape_16_9",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setIsEditingPrice(false);
    setIsEditingCategory(false);
    setIsEditingImage(false);
  };

  const onChapterCreate = () => {
      // Simulate creating a chapter
      setIsCreatingChapter(false);
      router.push(`/teacher/courses/${courseId}/chapters/new-chapter-id`);
  }

  const onReorder = (updateData: { id: string; position: number }[]) => {
    console.log("Reordering chapters:", updateData);
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-500">
            Complete all fields (2/6)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                <LayoutDashboard className="h-6 w-6 text-sky-700" />
            </div>
            <h2 className="text-xl font-medium">Customize your course</h2>
          </div>
          
          {/* Title Form */}
          <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course title
              <Button onClick={() => setIsEditingTitle((prev) => !prev)} variant="ghost">
                {isEditingTitle ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit title
                  </>
                )}
              </Button>
            </div>
            {!isEditingTitle && (
              <p className="text-sm mt-2">{form.getValues("title")}</p>
            )}
            {isEditingTitle && (
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
                            disabled={false}
                            placeholder="e.g. 'Advanced Web Development'"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-x-2">
                    <Button
                      disabled={false}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>

          {/* Description Form */}
          <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course description
              <Button onClick={() => setIsEditingDescription((prev) => !prev)} variant="ghost">
                {isEditingDescription ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit description
                  </>
                )}
              </Button>
            </div>
            {!isEditingDescription && (
                <p className={cn("text-sm mt-2", !form.getValues("description") && "text-slate-500 italic")}>
                    {form.getValues("description") || "No description"}
                </p>
            )}
            {isEditingDescription && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={false}
                                            placeholder="e.g. 'This course is about...'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={false} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
          </div>
          
          {/* Image Form */}
          <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course image
              <Button onClick={() => setIsEditingImage((prev) => !prev)} variant="ghost">
                {isEditingImage ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit image
                  </>
                )}
              </Button>
            </div>
            {!isEditingImage && (
                !form.getValues("imageUrl") ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2 dark:bg-slate-800">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={form.getValues("imageUrl") || ""}
                        />
                    </div>
                )
            )}
             {isEditingImage && (
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {/* Simplified Image Input (Text URL for now) */}
                                        <Input
                                            disabled={false}
                                            placeholder="Paste image URL here"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="text-xs text-muted-foreground">
                            16:9 aspect ratio recommended
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button disabled={false} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
             )}
          </div>

           {/* Category Form */}
           <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
              Course category
              <Button onClick={() => setIsEditingCategory((prev) => !prev)} variant="ghost">
                {isEditingCategory ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit category
                  </>
                )}
              </Button>
            </div>
            {!isEditingCategory && (
                <p className={cn("text-sm mt-2", !form.getValues("categoryId") && "text-slate-500 italic")}>
                    {categories.find(category => category.value === form.getValues("categoryId"))?.label || "No category selected"}
                </p>
            )}
            {isEditingCategory && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                         <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value
                                                ? categories.find(
                                                    (category) => category.value === field.value
                                                )?.label
                                                : "Select category"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search category..." />
                                            <CommandList>
                                                <CommandEmpty>No category found.</CommandEmpty>
                                                <CommandGroup>
                                                {categories.map((category) => (
                                                    <CommandItem
                                                    value={category.label}
                                                    key={category.value}
                                                    onSelect={() => {
                                                        form.setValue("categoryId", category.value);
                                                    }}
                                                    >
                                                    <Check
                                                        className={cn(
                                                        "mr-2 h-4 w-4",
                                                        category.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                    />
                                                    {category.label}
                                                    </CommandItem>
                                                ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={false} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
          </div>

        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
                <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                    <ListChecks className="h-6 w-6 text-sky-700" />
                </div>
                <h2 className="text-xl font-medium">Course chapters</h2>
            </div>
            <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                <div className="font-medium flex items-center justify-between mb-4">
                  Course chapters
                  <Button onClick={() => setIsCreatingChapter((prev) => !prev)} variant="ghost">
                    {isCreatingChapter ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add chapter
                        </>
                    )}
                  </Button>
                </div>

                {isCreatingChapter && (
                     <div className="mb-4">
                        <Form {...form}>
                            <form className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    disabled={false}
                                                    placeholder="e.g. 'Introduction to the course'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={false} onClick={onChapterCreate} type="button">
                                    Create
                                </Button>
                            </form>
                        </Form>
                     </div>
                )}
                
                <div className={cn("text-sm mt-2", !chapters.length && "text-slate-500 italic")}>
                    {!chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={chapters || []}
                    />
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            </div>
          </div>
          
           <div>
            <div className="flex items-center gap-x-2">
                <div className="rounded-full flex items-center justify-center bg-sky-100 p-2">
                    <span className="text-sky-700 font-bold">$</span>
                </div>
                <h2 className="text-xl font-medium">Sell your course</h2>
            </div>
             <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
                <div className="font-medium flex items-center justify-between">
                  Course price
                  <Button onClick={() => setIsEditingPrice((prev) => !prev)} variant="ghost">
                    {isEditingPrice ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                  </Button>
                </div>
                {!isEditingPrice && (
                    <p className={cn("text-sm mt-2", !form.getValues("price") && "text-slate-500 italic")}>
                        {form.getValues("price") ? `$${form.getValues("price")}` : "No price"}
                    </p>
                )}
                {isEditingPrice && (
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                          {/* @ts-ignore */}
                                            <Input
                                                type="number"
                                                step="0.01"
                                                disabled={false}
                                                placeholder="Set a price for your course"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button disabled={false} type="submit">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </div>
           </div>

        </div>
      </div>
    </div>
  );
}
