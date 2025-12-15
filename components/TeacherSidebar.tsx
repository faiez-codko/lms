"use client";

import Link from "next/link";
import { BarChart, List, LogOut, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: BarChart, label: "Analytics", href: "/teacher" },
  { icon: List, label: "Courses", href: "/teacher/courses" },
  { icon: List, label: "Categories", href: "/teacher/categories" },
  { icon: LogOut, label: "Exit Teacher Mode", href: "/" },
];

interface TeacherSidebarProps {
  className?: string;
}

export const TeacherSidebar = ({ className }: TeacherSidebarProps) => {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full border-r bg-background", className)}>
      {/* Brand Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                <Image 
                    src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=developer%20avatar%20cartoon%20man%20coding&image_size=square"
                    alt="Logo"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight text-primary">Quantum</span>
                <span className="text-xs text-muted-foreground">Teacher Dashboard</span>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-1 px-4 mt-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/teacher" && pathname?.startsWith(`${item.href}/`));
          
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "justify-start gap-4 px-4 h-12 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-primary",
                isActive && "bg-secondary/50 text-primary"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-auto p-6 border-t">
        <div className="text-[10px] text-muted-foreground">
          © 2024 BRNA d.o.o.
        </div>
        <div className="flex gap-1 mt-1">
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
        </div>
      </div>
    </div>
  );
};
