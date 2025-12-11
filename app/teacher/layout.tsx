import { TeacherSidebar } from "@/components/TeacherSidebar";
import { TeacherMobileSidebar } from "@/components/TeacherMobileSidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { AuthModal } from "@/components/AuthModal";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-64 fixed inset-y-0 w-full z-50">
        <div className="h-full border-b flex items-center bg-background shadow-sm px-6">
            <TeacherMobileSidebar />
            <div className="flex items-center ml-auto gap-x-2">
                <ModeToggle />
                <AuthModal />
            </div>
        </div>
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
