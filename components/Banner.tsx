import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Banner = () => {
  return (
    <div className="w-full h-auto px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col lg:flex-row justify-between bg-white">
      {/* Mobile Image at Top - Only visible on mobile */}
      <div className="w-full lg:hidden relative h-48 md:h-56 mb-6 md:mb-8">
        <img
          src="/media/Q-Colored.svg"
          alt="Decoration"
          className="object-contain w-full h-full"
        />
      </div>

      {/* Left Content */}
      <div className="w-full lg:w-1/2 h-full flex flex-col gap-4 py-6 md:py-12 lg:py-24">
        <h1 className="text-[#383838] font-moderniz text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-tight">
          Start your profitable journey today.
        </h1>

        <button className="rounded-full bg-[#99ED43] h-auto text-sm sm:text-base w-fit text-black flex justify-center py-2 px-4 sm:py-2 sm:px-4 md:py-2 md:px-4">
          <Link
            href="/browse"
            className="flex items-center justify-center font-poppins"
          >
            Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </button>

        <p className="text-[#6C6C6C] text-base sm:text-lg font-poppins">
          No credits required for preview lessons.
        </p>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-1/2 h-full relative py-6 md:py-12 lg:py-24 flex justify-center">
        {/* Background Image - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block absolute inset-0 z-0 top-0 right-0">
          <img src="/media/Q-Colored.svg" alt="" className="object-cover" />
        </div>

        <div className="w-full md:w-[80%] lg:w-[60%] relative flex flex-col gap-6 md:gap-8 lg:gap-10">
          <p className="text-[#6C6C6C] text-base sm:text-lg font-poppins mx-auto text-center lg:text-left">
            Join the #1 platform for traders who treat this as a business, not a
            hobby. 14-day free trial, cancel anytime.{" "}
          </p>

          <div className="pointer-events-auto bg-white p-4 sm:p-4 md:p-5 lg:p-5 lg:pr-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col 2xl:flex-row items-center justify-around gap-4 sm:gap-6 lg:gap-8 border border-slate-100 mb-6 sm:mb-8 lg:mb-10 w-full lg:mr-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-col gap-2 items-center sm:items-start">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white ring-2 ring-slate-50"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${i + 20}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm font-bold text-slate-600">
                100k+ Best Teacher
              </span>
            </div>

            <button className="rounded-3xl border border-[#99ED43] h-auto text-sm sm:text-base w-fit text-black flex justify-center py-2 px-4 sm:py-2 sm:px-4 md:py-2 md:px-4">
              <Link
                href="/browse"
                className="flex items-center justify-center font-poppins"
              >
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
