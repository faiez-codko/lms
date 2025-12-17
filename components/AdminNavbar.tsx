import { AdminMobileSidebar } from "@/components/AdminMobileSidebar";
import { AuthModal } from "@/components/AuthModal";
import { ModeToggle } from "@/components/ModeToggle";

export const AdminNavbar = () => {
  return (
    <div className="h-20 fixed top-0 right-0 left-0 md:left-64 bg-background border-b z-40 flex items-center px-6 gap-4">
      <AdminMobileSidebar />
      
      <div className="flex-1 max-w-2xl mx-auto hidden md:block">
        {/* Search placeholder */}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <ModeToggle />
        <AuthModal />
      </div>
    </div>
  );
};
