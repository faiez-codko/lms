"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useState } from "react";

export const QHero = () => {
  const [isChanged, setIsChanged] = useState(false);
  const variants = {
    green: { stroke: "url(#chartGradient1)" },
    blue: { stroke: "url(#chartGradient2)" },
  };

  return (
    <section className="relative w-full min-h-screen  md:min-h-[70vh] xl:min-h-[calc(100vh)] bg-white text-slate-900 overflow-hidden flex flex-col justify-center">
      {/* Background Animated Chart Lines */}

      <div className="absolute opacity-50 top-[49.2%] left-[40.85%] inset-0 pointer-events-none overflow-hidden z-20">
        <svg
          width="31"
          height="31"
          viewBox="0 0 31 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="15.1517"
            cy="15.1517"
            r="15.1517"
            fill="#99ED43"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
            stroke="#99ED43" // Optional: add stroke for better visibility
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="absolute opacity-50 top-[29%] left-[30.9%] inset-0 pointer-events-none overflow-hidden z-0 ">
        <svg
          width="412"
          height="412"
          viewBox="0 0 412 412"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="" stroke="url(#paint0_radial_115_153)" />
          <defs>
            <radialGradient
              id="paint0_radial_115_153"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(205.968 205.968) rotate(90) scale(205.968)"
            >
              <stop />
              <stop offset="1" stop-opacity="0" />
            </radialGradient>
          </defs>
          {["M411.936 206.441H0M205.494 411.936V0"].map((path, i) => (
            <motion.path
              key={i}
              d={path}
              stroke="url(#paint0_radial_115_153)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2 , 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0, strokeDasharray: "2 ,2" }}
              animate={{
                strokeDasharray: "2,2",
                pathLength: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>
      <div className="absolute top-[25%] -left-[18%] inset-0 pointer-events-none overflow-hidden z-0 ">
        <svg
          width="1900"
          height="890"
          viewBox="0 0 1921 890"
          className="opacity-40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="chartGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4D7722" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#99ED43" stopOpacity="1" />
              <stop offset="1" stopColor="#4D7722" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient
              id="chartGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BD4317" />
              <stop offset="1" stopColor="#1E238A" />
            </linearGradient>
          </defs>

          {[
            "M 416 1187 L 416 1189 L 416 1190 L 497.265 884.226 L 662.134 412.803 L 827.002 381.161 L 991.871 286.237 L 1156.74 241.938 L 1321.61 450.773 L 1488.8 431.788 L 1604.99 560.359 L 1920.34 596.818 M 413 1190 L 413 1188 L 416 1190 L 523 767 L 666.262 509.822 L 833.366 560.782 L 1000.47 441.874 L 1170.07 470.186 L 1364.46 193.878 M 1157 242",
          ].map((path, i) => (
            <motion.path
              key={i}
              d={path}
              stroke={
                isChanged ? "url(#chartGradient2)" : "url(#chartGradient1)"
              }
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              // initial={{ pathLength: 0, opacity: 0 }}
              // animate={{
              //   pathLength: [0, 1, 0],
              //   opacity: [0, 1, 1],
              // }}
              // transition={{
              //   duration: 4,
              //   repeat: Infinity,
              //   ease: "linear",
              //   repeatType: "loop",
              // }}
              // onAnimationIteration={() => {
              //   setIsChanged((prev) => !prev);
              //   console.log("hello");
              // }}
            />
          ))}
        </svg>

        {/* 
        <svg
          className="w-full h-full opacity-70"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="chartGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#99ED43" stopOpacity="0" />
              <stop offset="50%" stopColor="#4D7722" />
              <stop offset="100%" stopColor=" " stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            // Line 1 - Volatile uptrend from bottom-left to top-right
            "M 0 120 L 10 82 L 20 88 L 32 75 L 45 80 L 80 -70",
            // Line 2 (ends at 45,50)
            "M 0 140 L 13 73 L 25 70 L 40 52 L 45 50 L 50 75 L 60 70 L 70 80 L 80 70 L 85 90",
          ].map((path, i) => (
            <motion.path
              key={i}
              d={path}
              stroke="url(#chartGradient)"
              strokeWidth="0.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                // times: [0, 0.5, 1],
                repeatType: "loop",
              }}
            />
          ))}
        </svg> */}
      </div>

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
            Turn Your <br />
            Trading <br />
            Into A <br />
            Business.
          </h1>

          <p className="text-md md:text-xl text-slate-500 max-w-4xl leading-relaxed font-poppins font-regular">
            The all-in-one platform to master technical analysis, manage risk,
            and build a profitable trading career. No noise, just results.
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
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    className="w-12 h-12 border-2 border-white ring-2 ring-slate-50"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${i + 20}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm font-bold text-slate-600 pl-2">
                100k+ Best Teacher
              </span>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-2 border-[#99ED43] h-auto text-base "
              asChild
            >
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
  );
};
