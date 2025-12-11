"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { ModeToggle } from "@/components/ModeToggle";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-20 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-between">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="font-bold text-xl text-white">TradeMastery</span>
            </div>
        </Link>
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
            <div className="hidden md:flex items-center gap-x-6 mr-6 text-slate-300">
                <Link href="#features" className="hover:text-emerald-400 transition">Features</Link>
                <Link href="#testimonials" className="hover:text-emerald-400 transition">Success Stories</Link>
                <Link href="#pricing" className="hover:text-emerald-400 transition">Pricing</Link>
            </div>
            <div className="flex items-center gap-x-2">
                <ModeToggle />
                <AuthModal />
                <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                    Get Started
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};
