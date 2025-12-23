"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

interface TopicActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  topicId: string;
  isPublished: boolean;
}

export const TopicActions = ({
  disabled,
  courseId,
  chapterId,
  topicId,
  isPublished
}: TopicActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onStatusChange = async (value: string) => {
    try {
      setIsLoading(true);

      if (value === "published") {
        await axios.patch(`/api/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}`, { isPublished: true });
        toast.success("Topic published");
      } else {
        await axios.patch(`/api/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}`, { isPublished: false });
        toast.success("Topic unpublished");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/admin/courses/${courseId}/chapters/${chapterId}/topics/${topicId}`);
      toast.success("Topic deleted");
      router.refresh();
      router.push(`/admin/courses/${courseId}/chapters/${chapterId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Select
        disabled={disabled || isLoading}
        onValueChange={onStatusChange}
        defaultValue={isPublished ? "published" : "draft"}
        >
        <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published" >Published</SelectItem>
        </SelectContent>
        </Select>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" variant="destructive" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
