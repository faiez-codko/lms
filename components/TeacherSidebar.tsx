"use client";

import Link from "next/link";
import { BarChart, List, Compass, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: BarChart, label: "Analytics", href: "/teacher" },
  { icon: List, label: "Courses", href: "/teacher/courses" },
  { icon: List, label: "Categories", href: "/teacher/categories" },
];

export const TeacherSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="p-6">
        <Link href="/">
             <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">Quantum</span>
            </div>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-emerald-700 bg-emerald-200/20 hover:bg-emerald-200/20 hover:text-emerald-700 dark:text-emerald-400 dark:bg-slate-800"
              )}
              asChild
            >
              <Link href={item.href}>
                <div className="flex items-center gap-x-2 py-4">
                  <item.icon
                    size={22}
                    className={cn(
                      "text-slate-500",
                      isActive && "text-emerald-700 dark:text-emerald-400"
                    )}
                  />
                  {item.label}
                </div>
              </Link>
            </Button>
          );
        })}
      </div>
      <div className="mt-auto p-6">
        <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/">
                <LogOut className="h-4 w-4 mr-2" />
                Exit Teacher Mode
            </Link>
        </Button>
      </div>
    </div>
  );
};
