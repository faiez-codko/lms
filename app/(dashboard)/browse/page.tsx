import { db } from "@/lib/prismadb";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    title: string;
    categoryId: string;
  }>;
}) {
  const { title, categoryId } = await searchParams;

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(payload?.role || "");
  const userId = payload?.sub;
  const isAuthenticated = userId !== undefined;

  const courses = await getCourses({
    userId,
    title,
    categoryId,
    page: 1,
    pageSize: 8,
  });

  return (
    <div className="p-6">
      <CoursesList initialCourses={courses} categories={categories} isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
    </div>
  );
}
