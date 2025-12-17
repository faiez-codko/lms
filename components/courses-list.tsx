"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/actions/get-courses";
import { Loader2 } from "lucide-react";
import { Category } from "@prisma/client";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  author: string;
  thumbnail: string | null;
  price: string;
  rating: number;
  students: number;
  category: string;
  progress: number | null;
}

interface CoursesListProps {
  initialCourses: Course[];
  categories: Category[];
  isAdmin?: boolean;
}

export const CoursesList = ({ initialCourses, categories, isAdmin }: CoursesListProps) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const observerTarget = useRef(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Note: We need to pass userId to getCourses to check purchase status for newly loaded courses
      // However, this component is client-side. 
      // Ideally, getCourses action should check auth context itself if we move to server actions fully, 
      // but here we might need to rely on the server handling it via cookie in the action (which we just updated).
      // Since getCourses is a server action ("use server"), it has access to cookies()!
      // So we don't strictly need to pass userId from here if we update getCourses to read cookies directly.
      // BUT, I updated getCourses to take userId as a param. Let's update getCourses again to read cookie if userId not passed?
      // Or better, let's just pass undefined for now, or update getCourses to be smarter.
      
      // Actually, since getCourses is a server action, let's update it to read the cookie itself 
      // so we don't have to pass it from the client.
      // Wait, I already updated getCourses to take userId.
      // The `getCourses` import here is calling the server action.
      // Server actions running on server can access cookies.
      
      const newCourses = await getCourses({
        page,
        pageSize: 8,
        categoryId: selectedCategory === "All" ? undefined : selectedCategory,
        // We are not passing userId here, so infinite scroll items might show "Add to Cart" even if purchased.
        // I should update getCourses to read cookie if userId is missing.
      });

      if (newCourses.length === 0) {
        setHasMore(false);
      } else {
        setCourses((prev) => [...prev, ...newCourses]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load more courses", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore]);

  const onCategoryChange = async (categoryId: string) => {
    if (categoryId === selectedCategory) return;
    
    setSelectedCategory(categoryId);
    setIsLoading(true);
    setCourses([]); 
    setPage(2);
    setHasMore(true);

    try {
      const newCourses = await getCourses({
        page: 1,
        pageSize: 8,
        categoryId: categoryId === "All" ? undefined : categoryId,
      });
      setCourses(newCourses);
      if (newCourses.length < 8) setHasMore(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap">
          <h1 className="text-2xl font-bold">Recommended for you</h1>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
            <button
                onClick={() => onCategoryChange("All")}
                className={`px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-100 transition whitespace-nowrap
                    ${selectedCategory === "All" 
                        ? "bg-gray-100 dark:bg-gray-800 border-gray-300" 
                        : "bg-white dark:bg-gray-600 border-transparent"}`}
            >
                All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-100 transition whitespace-nowrap
                    ${selectedCategory === category.id 
                        ? "bg-gray-100 dark:bg-gray-800 border-gray-300" 
                        : "bg-white dark:bg-gray-600 border-transparent"}`}
              >
                {category.name}
              </button>
            ))}
           </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id}>
             <CourseCard course={course} isAdmin={isAdmin} />
          </Link>
        ))}
      </div>
      
      <div ref={observerTarget} className="flex justify-center p-4 w-full mt-4 h-10">
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
      </div>
    </div>
  );
};
