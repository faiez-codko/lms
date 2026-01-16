"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const QHero = () => {
  const [isChanged, setIsChanged] = useState(false);
  const variants = {
    green: { stroke: "url(#chartGradient1)" },
    blue: { stroke: "url(#chartGradient2)" },
  };

  return (
    <section className="relative w-full min-h-screen  md:min-h-[70vh] xl:min-h-[calc(100vh)] bg-white text-slate-900 overflow-hidden flex flex-col justify-center">
      <div className="absolute opacity-40 top-[39%] left-[39%] inset-0 z-10 pointer-events-none overflow-hidden md:hidden block w-[250px] h-[250px]">
        <svg
          className="opacity-40 w-full h-full"
          viewBox="0 0 412 412"
          width="100"
          height="100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="" stroke="url(#paint0_radial_115_153_mobile)" />
          <defs>
            <radialGradient
              id="paint0_radial_115_153_mobile"
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
              stroke="url(#paint0_radial_115_153_mobile)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="2 , 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0, strokeDasharray: "2 ,2" }}
              animate={{
                strokeDasharray: "2,2",
                pathLength: [0, 1, 0],
                opacity: [0, 1, 1],
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
      {/* Mobile version of the circle */}
      <div className="absolute top-[57%] left-[70%] pointer-events-none overflow-hidden z-50 md:hidden block w-[14px] h-[14px]">
        <svg
          className="w-full h-full"
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
            stroke="#99ED43"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="absolute top-[45%] -left-[24%] z-10 md:hidden block w-[600px] h-[300px] opacity-40">
        <svg
          className="w-full h-full"
          viewBox="0 0 1921 890"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="chartGradient1_mobile"
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
          </defs>

          <motion.path
            d="M 0.3367 1.4617 L 165.205 39.4317 L 178 318 L 497.265 884.226 L 662.134 412.803 L 827.002 381.161 L 991.871 286.237 L 1156.74 241.938 L 1321.61 450.773 L 1488.8 431.788 L 1604.99 560.359 L 1920.34 596.818 M 0.3367 327.835 L 83 416 L 339.534 580.6 L 504.145 744.807 L 666.262 509.822 L 833.366 560.782 L 1000.47 441.874 L 1170.07 470.186 L 1364.46 193.878"
            stroke="url(#chartGradient1_mobile)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
            onAnimationIteration={() => {
              setIsChanged((prev) => !prev);
              console.log("hello");
            }}
          />
        </svg>
      </div>

      <div className="w-full h-full overflow-hidden absolute xl:top-[25%] top-[28%] -left-[20%] 2xl:-left-[16.2%] opacity-40 hidden lg:block">
        <svg
          viewBox="0 0 2419 1147"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M1610.94 373.441H1199M1404.49 578.936V167"
            stroke="url(#paint0_radial_273_22)"
            stroke-dasharray="2 2"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          />
          <motion.path
            d="M 495 1211 L 499 1213 L 500 1219 L 717 1010 L 912 543.5 L 1075 510.5 L 1243 420 L 1406 371.5 L 1575 584.5 L 1741.5 560.5 L 1859 691.5 L 2169 726.5 M 497 1215 L 497 1217 L 497 1213 L 751.5 874.5 L 911.5 645 L 1084 693 L 1248.5 574 L 1420.5 602.5 L 1611 326"
            stroke="#99ED43"
            stroke-width="3"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          />
          <path d="" stroke="#99ED43" stroke-width="4" />
          <motion.circle
            cx="1405"
            cy="372.5"
            r="15.5"
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
            stroke="#99ED43"
            strokeWidth="2"
          />
          <defs>
            <radialGradient
              id="paint0_radial_273_22"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(1404.97 372.968) rotate(90) scale(205.968)"
            >
              <stop />
              <stop offset="1" stop-opacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Background Graphic - Q */}
      {/* We position it absolutely on the right side. 
          Based on the SVG, it seems to have a lot of whitespace or specific positioning.
          We'll try to position it to match the reference.
      */}
      <div className="absolute top-0  w-full h-[50%]  xl:top-0 xl:right-0 xl:h-[60%] 2xl:h-[70%] xl:w-[55%] pointer-events-none lg:block overflow-hidden">
        <Image
          src="/media/Q.svg"
          alt="Background Q"
          fill
          //  className="object-left-top scale-110 translate-x-10"
          priority
        />
        {/* Left-bottom mist overlay - Adjust width/height/opacity as needed */}
        <div className="absolute bottom-5 2xl:bottom-0  2xl:left-[10%] w-full h-full bg-gradient-to-tr from-white via-white/30 to-transparent" />
      </div>

      <div className="mx-auto p-6 w-full h-[95vh]  flex flex-col justify-end gap-4 z-10 mb-10">
        {/* Left Content */}
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl md:text-6xl 2xl:text-8xl font-black tracking-tighter uppercase text-[#383838] font-moderniz ">
            Turn Your <br />
            Trading <br />
            Into A <br />
            Mobile.
          </h1>

          <p className="text-md md:text-xl text-slate-500 max-w-4xl leading-relaxed font-poppins font-regular">
            The all-in-one platform to master technical analysis, manage risk,
            and build a profitable trading career. No noise, just results.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Button
              asChild
              size="lg"
              className="bg-[#99ed43] hover:bg-[#88d63b] text-slate-900  rounded-full px-8 xl:py-7 text-lg transition-transform hover:scale-105"
            >
              <Link href="/register">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Content / Spacer */}
        <div className="relative  lg:flex items-end justify-end pointer-events-none">
          {/* Floating Card - re-enable pointer events for buttons */}
          <div className="pointer-events-auto bg-white p-2 2xl:p-5 2xl:pr-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex justify-between items-center gap-8 border border-slate-100 2xl:mb-10 2xl:mr-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-col gap-2">
              <div className="flex -space-x-4 pl-2">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    className="2xl:w-12 2xl:h-12 border-2 border-white ring-2 ring-slate-50"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${i + 20}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs 2xl:text-sm font-bold text-slate-600 pl-2">
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-300">
        <Mouse className="w-8 h-8" strokeWidth={1.5} />
      </div>
    </section>
  );
};
