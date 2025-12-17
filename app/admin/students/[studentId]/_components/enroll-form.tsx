"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnrollFormProps {
  studentId: string;
  courses: { id: string; title: string }[];
}

export const EnrollForm = ({ studentId, courses }: EnrollFormProps) => {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onEnroll = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/admin/students/${studentId}/enroll`, { courseId });
      toast.success("Enrolled successfully");
      router.refresh();
      setCourseId("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Select 
        value={courseId} 
        onValueChange={setCourseId}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onEnroll} disabled={!courseId || isLoading}>
        Enroll
      </Button>
    </div>
  );
};
