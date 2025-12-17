import { db } from "@/lib/prismadb";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export default async function BrowsePage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    page: 1,
    pageSize: 8,
  });

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyAuthToken(token) : null;
  const isAdmin = payload?.role === "SUPER_ADMIN";

  return (
    <div className="p-6">
      <CoursesList initialCourses={courses} categories={categories} isAdmin={isAdmin} />
    </div>
  );
}
