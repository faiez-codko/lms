"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-20 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-between">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/">
            <div className="flex items-center gap-2">
                <div className="h-8 rounded-lg flex items-center justify-center">
                    <Image src="/logo-white.png" alt="Quantum" width={150} height={32} />
                </div>
           
            </div>
        </Link>
        <div className="hidden md:flex items-center gap-x-6 mr-6 text-slate-300">
                <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
                <Link href="/browse" className="hover:text-emerald-400 transition">Course</Link>
                <Link href="/about" className="hover:text-emerald-400 transition">About Us</Link>
            </div>
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-auto">
            
            <div className="flex items-center gap-x-2">
      
                <AuthModal />
            </div>
        </div>
      </div>
    </div>
  );
};
