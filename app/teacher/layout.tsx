import { TeacherSidebar } from "@/components/TeacherSidebar";
import { TeacherNavbar } from "@/components/TeacherNavbar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-64 fixed inset-y-0 w-full z-50">
        <TeacherNavbar />
      </div>
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <TeacherSidebar />
      </div>
      <main className="md:pl-64 pt-[80px] h-full bg-slate-100 dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}
