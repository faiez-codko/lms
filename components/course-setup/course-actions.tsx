"use client";

import axios from "axios";
import { MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "../ui/button";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const CourseActions = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onStatusChange = async (value: string) => {
    if (value === "delete") return;
    
    try {
      setIsLoading(true);

      if (value === "published") {
        await axios.patch(`/api/admin/courses/${courseId}`, { isPublished: true });
        toast.success("Course published");
      } else {
        await axios.patch(`/api/admin/courses/${courseId}`, { isPublished: false });
        toast.success("Course unpublished");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/admin/courses/${courseId}`);

      toast.success("Course deleted");
      router.refresh();
      router.push(`/admin/courses`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Select
        disabled={isLoading}
        onValueChange={onStatusChange}
        defaultValue={isPublished ? "published" : "draft"}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published" disabled={disabled}>Published</SelectItem>
        </SelectContent>
      </Select>
      
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" variant="destructive" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
