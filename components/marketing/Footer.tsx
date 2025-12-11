"use client";

import { Twitter, Instagram, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GravityFooter } from "@/components/marketing/GravityFooter";

export const Footer = () => {
  const brandName = "QUANTUM";

  return (
    <footer className="bg-black text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
            {/* Logo Icon */}
            <div className="mb-8 md:mb-0">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                     <span className="text-black font-bold text-lg">T</span>
                </div>
            </div>

            {/* Links Columns */}
            <div className="flex flex-wrap gap-12 md:gap-24">
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-gray-500 mb-2">Terms</h4>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link>
                </div>
                
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-gray-500 mb-2">Resources</h4>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Docs</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Blog</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Changelog</Link>
                </div>
                
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-gray-500 mb-2">Connect</h4>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Feedback</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Discord</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Reddit</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Partnerships</Link>
                </div>
            </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 gap-4">
            <div className="text-gray-500 text-sm">
                © 2025 {brandName}. All rights reserved.
            </div>
            
            <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                </Link>
                 <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                </Link>
            </div>
            
             <Link href="#" className="text-gray-500 text-sm hover:text-white flex items-center gap-1">
                Back to top
            </Link>
        </div>
      </div>
      
      {/* Big Brand Text with Scatter Animation */}
      <div className="w-full bg-emerald-500 overflow-hidden cursor-default group relative h-[30vh] lg:h-auto">
          <GravityFooter />
          <motion.h1 
            className="text-[15vw] leading-none font-black text-center tracking-tighter text-black hover:text-yellow-400 transition-all hover:cursor-pointer select-none flex justify-center w-full relative z-10"
            initial="initial"
            whileHover="hover"
          >
              {brandName.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={{
                        initial: { y: 0, rotate: 0 },
                        hover: { 
                            y: Math.random() * -20 - 10, 
                            rotate: Math.random() * 10 - 5,
                            transition: { 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 10 
                            }
                        }
                    }}
                    className="inline-block"
                  >
                      {letter}
                  </motion.span>
              ))}
          </motion.h1>
      </div>
    </footer>
  );
};
