"use client";

import { useState } from "react";
import { Trash, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface CategoryActionsProps {
  id: string;
}

export const CategoryActions = ({ id }: CategoryActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success("Category deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onEdit = () => {
    router.push(`/admin/categories/${id}`);
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onEdit} variant="ghost" size="sm">
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} variant="destructive" size="sm">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </ConfirmModal>
    </div>
  );
};
