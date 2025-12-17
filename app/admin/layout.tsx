import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminNavbar } from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-64 fixed inset-y-0 w-full z-50">
        <AdminNavbar />
      </div>
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>
      <main className="md:pl-64 pt-[80px] h-full bg-slate-100 dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}
