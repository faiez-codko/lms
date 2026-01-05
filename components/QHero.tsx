"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const QHero = () => {
  return (
    <section className="relative w-full min-h-screen  md:min-h-[70vh] xl:min-h-[calc(100vh)] bg-white text-slate-900 overflow-hidden flex flex-col justify-center">
      
      {/* Background Graphic - Q */}
      {/* We position it absolutely on the right side. 
          Based on the SVG, it seems to have a lot of whitespace or specific positioning.
          We'll try to position it to match the reference.
      */}
      <div className="absolute top-0 right-0 h-[70%] w-[55%] pointer-events-none lg:block overflow-hidden">
         <Image 
           src="/media/Q.svg" 
           alt="Background Q" 
           fill
          //  className="object-left-top scale-110 translate-x-10"
           priority
         />
         {/* Left-bottom mist overlay - Adjust width/height/opacity as needed */}
         <div className="absolute bottom-0 left-0 w-[100%] h-full bg-gradient-to-tr from-white via-white/30 to-transparent" />
      </div>

      <div className="max-w-[90%] mx-auto px-6 w-full z-10 grid lg:grid-cols-2 gap-12 items-end flex-1 pt-10 pb-20">
        {/* Left Content */}
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl md:text-6xl 2xl:text-8xl font-black tracking-tighter uppercase text-slate-900 font-moderniz">
            Turn Your <br/>
            Trading <br/>
            Into A <br/>
            Business.
          </h1>
          
          <p className="text-md md:text-xl text-slate-500 max-w-4xl leading-relaxed font-poppins font-regular">
            The all-in-one platform to master technical analysis, manage risk, and build a profitable trading career. No noise, just results.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Button 
              asChild 
              size="lg" 
              className="bg-[#99ed43] hover:bg-[#88d63b] text-slate-900  rounded-full px-8 py-7 text-lg transition-transform hover:scale-105"
            >
              <Link href="/register">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Content / Spacer */}
        <div className="relative hidden lg:flex h-full items-end justify-end min-h-[600px] pointer-events-none">
           {/* Floating Card - re-enable pointer events for buttons */}
           <div className="pointer-events-auto bg-white p-5 pr-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-8 border border-slate-100 mb-10 mr-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="flex flex-col gap-2">
               <div className="flex -space-x-4 pl-2">
                 {[1,2,3,4].map(i => (
                   <Avatar key={i} className="w-12 h-12 border-2 border-white ring-2 ring-slate-50">
                     <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 20}`} />
                     <AvatarFallback>U{i}</AvatarFallback>
                   </Avatar>
                 ))}
               </div>
               <span className="text-sm font-bold text-slate-600 pl-2">100k+ Best Teacher</span>
             </div>
             
             <Button variant="outline" className="rounded-full border-2 border-[#99ED43] h-auto text-base " asChild>
                <Link href="/browse">
                  Courses <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
             </Button>
           </div>
        </div>
      </div>

      {/* Mouse Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-300 hidden md:block">
        <Mouse className="w-8 h-8" strokeWidth={1.5} />
      </div>
    </section>
  )
}
