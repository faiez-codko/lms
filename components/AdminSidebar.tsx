"use client";

import Link from "next/link";
import { BarChart, Users, GraduationCap, List, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: GraduationCap, label: "Teachers", href: "/admin/teachers" },
  { icon: List, label: "Courses", href: "/admin/courses" },
  { icon: List, label: "Categories", href: "/admin/categories" },
  { icon: LogOut, label: "Exit Admin Mode", href: "/" },
];

interface AdminSidebarProps {
  className?: string;
}

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full border-r bg-background", className)}>
      {/* Brand Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                <Image
                    src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=admin%20avatar%20shield%20security&image_size=square"
                    alt="Logo"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight text-primary">Quantum</span>
                <span className="text-xs text-muted-foreground">Admin Portal</span>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-1 px-4 mt-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(`${item.href}/`));

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
      </div>
    </div>
  );
};
