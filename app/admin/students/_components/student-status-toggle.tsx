"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";

interface StudentStatusToggleProps {
  studentId: string;
  isActive: boolean;
}

export const StudentStatusToggle = ({ studentId, isActive }: StudentStatusToggleProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = async (checked: boolean) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/admin/students/${studentId}`, { isActive: checked });
      toast.success(checked ? "Account enabled" : "Account disabled");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={onToggle}
      disabled={isLoading}
    />
  );
};
