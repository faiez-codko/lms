import Link from "next/link";
import { Search, LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  return (
    <div className="h-20 fixed top-0 right-0 left-0 md:left-64 bg-background border-b z-40 flex items-center px-6 gap-4">
      
      {/* Mobile Menu Toggle (Only visible on small screens) */}
      <Button variant="ghost" size="icon" className="md:hidden mr-2">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-2xl mx-auto hidden md:block">
        <div className="relative group">
            <Input 
                placeholder="Search for a course" 
                className="pl-4 pr-12 h-12 rounded-full border-border/60 bg-secondary/20 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
            />
            <Button 
                size="icon" 
                className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
            >
                <Search className="h-4 w-4 text-white" />
            </Button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="gap-2 rounded-lg border-border/60 font-medium px-4 h-10 hover:bg-secondary/50">
            <LogIn className="h-4 w-4" />
            Login
        </Button>
      </div>
    </div>
  );
};
