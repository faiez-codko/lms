"use client";

import { CheckCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const SuccessAlert = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message === "course_placed") {
      setIsVisible(true);
      // Remove the query param after showing the message
      const timer = setTimeout(() => {
        setIsVisible(false);
        router.replace("/my-courses");
      }, 10000); // Hide after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [message, router]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="mb-6">
      <Alert className="bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-500/50 dark:text-emerald-200">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Course purchased successfully. You can now access your content.
        </AlertDescription>
      </Alert>
    </div>
  );
};
