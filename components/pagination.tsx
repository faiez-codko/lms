"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import qs from "query-string";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export const Pagination = ({
  page,
  totalPages,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onNext = () => {
    const current = qs.parse(searchParams.toString());
    const query = {
      ...current,
      page: page + 1,
    };
    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    });
    router.push(url);
  };

  const onPrevious = () => {
    const current = qs.parse(searchParams.toString());
    const query = {
      ...current,
      page: page - 1,
    };
    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    });
    router.push(url);
  };


  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <div className="text-sm font-medium">
        Page {page} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
