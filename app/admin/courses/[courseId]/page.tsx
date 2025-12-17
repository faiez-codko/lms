import { db } from "@/lib/prismadb";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, ListChecks, CircleDollarSign, File, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TitleForm } from "@/components/course-setup/title-form";
import { DescriptionForm } from "@/components/course-setup/description-form";
import { ImageForm } from "@/components/course-setup/image-form";
import { CategoryForm } from "@/components/course-setup/category-form";
import { PriceForm } from "@/components/course-setup/price-form";
import { ChaptersForm } from "@/components/course-setup/chapters-form";

export default async function CourseIdPage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapter: {
        orderBy: {
          position: "asc",
        },
      },
      attachment: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  console.log(course)

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapter.some(chapter => chapter.isPublished), 
  ];

  // Adjust logic: Check if chapters exist
  const hasChapters = course.chapter.length > 0;
  
  // Re-evaluate required fields for progress
  const fields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    hasChapters,
  ];

  const totalFields = fields.length;
  const completedFields = fields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <Link
        href="/admin/courses"
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to courses
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">
            Course setup
          </h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
          <TitleForm
            initialData={course}
            courseId={course.id}
            apiUrl="/api/admin/courses"
          />
          <DescriptionForm
            initialData={course}
            courseId={course.id}
            apiUrl="/api/admin/courses"
          />
          <ImageForm
            initialData={course}
            courseId={course.id}
            apiUrl="/api/admin/courses"
          />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            apiUrl="/api/admin/courses"
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">
                Course chapters
              </h2>
            </div>
            <ChaptersForm
              initialData={course}
              courseId={course.id}
              apiUrl="/api/admin/courses"
              editPagePrefix="/admin/courses"
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">
                Sell your course
              </h2>
            </div>
            <PriceForm
              initialData={course}
              courseId={course.id}
              apiUrl="/api/admin/courses"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
