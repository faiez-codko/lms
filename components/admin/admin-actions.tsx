"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface AdminActionsProps {
  id: string;
}

export const AdminActions = ({ id }: AdminActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/admin/admins/${id}`);
      toast.success("Admin deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ConfirmModal onConfirm={onDelete}>
            <DropdownMenuItem 
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onSelect={(e) => e.preventDefault()}
            >
                <Trash className="h-4 w-4 mr-2" />
                Delete
            </DropdownMenuItem>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
