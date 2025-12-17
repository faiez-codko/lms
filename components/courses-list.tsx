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
      const newCourses = await getCourses({
        page,
        pageSize: 8,
        categoryId: selectedCategory === "All" ? undefined : selectedCategory,
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
