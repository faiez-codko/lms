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
      {/* Mobile version of the first SVG */}
      <svg
        className="absolute hidden md:block md:top-[12vh] md:-left-[50vw] lg:top-[10vh] lg:-left-[58vw] xl:top-[18vh] xl:-left-[50vw] 2xl:top-[10vh] 2xl:-left-[38.3vw] md:opacity-30 inset-0 z-0 "
        viewBox="0 0 2419 1147"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d="M1610.94 373.441H1199M1404.49 578.936V167"
          stroke="url(#paint0_radial_273_22)"
          strokeDasharray="2 2"
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
          d="M253.5 133L415 169L583 323L746 1013.5L912 543.5L1075 510.5L1243 420L1406 371.5L1575 584.5L1741.5 560.5L1859 691.5L2169 726.5 M250 463.5L428 484.5L585.5 711.5L751.5 874.5L911.5 645L1084 693L1248.5 574L1420.5 602.5L1611 326"
          stroke="#99ED43"
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
            <stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <svg
        width={800}
        className="absolute block md:hidden top-[43vh] -left-[40vw] opacity-30 inset-0 z-0 "
        viewBox="0 0 2419 1147"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d="M1610.94 373.441H1199M1404.49 578.936V167"
          stroke="url(#paint0_radial_273_22)"
          strokeDasharray="2 2"
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
          d="M253.5 133L415 169L583 323L746 1013.5L912 543.5L1075 510.5L1243 420L1406 371.5L1575 584.5L1741.5 560.5L1859 691.5L2169 726.5 M250 463.5L428 484.5L585.5 711.5L751.5 874.5L911.5 645L1084 693L1248.5 574L1420.5 602.5L1611 326"
          stroke="#99ED43"
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
            <stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Mobile version of the first SVG */}
      <div className="absolute opacity-40 top-[34%] left-[39%] inset-0 z-10 pointer-events-none overflow-hidden md:hidden block w-[250px] h-[250px]">
        <svg
          className="opacity-40 w-full h-full"
          viewBox="0 0 412 412"
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

      <div className="absolute top-[49.2%] left-[40.85%] inset-0 pointer-events-none overflow-hidden z-50 md:block hidden">
        {/* Existing circle SVG remains exactly the same */}
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
            stroke="#99ED43"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Mobile version of the circle */}
      <div className="absolute top-[52%] left-[70%] pointer-events-none overflow-hidden z-50 md:hidden block w-[14px] h-[14px]">
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

      <div className="absolute top-[25%] -left-[18.3%] z-10 md:block hidden">
        {/* Existing chart SVG remains exactly the same */}
        <svg
          className="opacity-40"
          width="1900"
          height="890"
          viewBox="0 0 1921 890"
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
          </defs>

          <motion.path
            d="M 416 1187 L 416 1189 L 416 1190 L 497.265 884.226 L 662.134 412.803 L 827.002 381.161 L 991.871 286.237 L 1156.74 241.938 L 1321.61 450.773 L 1488.8 431.788 L 1604.99 560.359 L 1920.34 596.818 M 413 1190 L 413 1188 L 416 1190 L 523 767 L 666.262 509.822 L 833.366 560.782 L 1000.47 441.874 L 1170.07 470.186 L 1364.46 193.878 M 1157 242"
            stroke="url(#chartGradient1)"
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
            onAnimationIteration={() => {
              setIsChanged((prev) => !prev);
              console.log("hello");
            }}
          />
        </svg>
      </div>

      {/* Mobile version of the chart */}
      <div className="absolute top-[40%] -left-[25%] z-10 md:hidden block w-[600px] h-[300px] opacity-40">
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
            d="M 416 1187 L 416 1189 L 416 1190 L 497.265 884.226 L 662.134 412.803 L 827.002 381.161 L 991.871 286.237 L 1156.74 241.938 L 1321.61 450.773 L 1488.8 431.788 L 1604.99 560.359 L 1920.34 596.818 M 413 1190 L 413 1188 L 416 1190 L 523 767 L 666.262 509.822 L 833.366 560.782 L 1000.47 441.874 L 1170.07 470.186 L 1364.46 193.878 M 1157 242"
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

      {/* Background Graphic - Q */}
      {/* We position it absolutely on the right side. 
          Based on the SVG, it seems to have a lot of whitespace or specific positioning.
          We'll try to position it to match the reference.
      */}

      <div className="absolute w-full  top-0 md:right-0 h-1/2 md:h-[70%] md:w-[50%] pointer-events-none lg:block md:overflow-hidden opacity-50 ">
        <Image
          src="/media/Q.svg"
          alt="Background Q"
          fill
          //  className="object-left-top scale-110 translate-x-10"
          priority
        />
        <div className="absolute bottom-0 block md:hidden 2xl:left-[10%] w-full h-full bg-gradient-to-tr from-white via-white/30 to-transparent" />
        {/* Left-bottom mist overlay - Adjust width/height/opacity as needed */}
      </div>

      <div className="2xl:max-w-[90%] mx-auto px-6 w-full z-10 grid grid-cols-1 lg:grid-cols-2 md:gap-12 items-end gap-4 flex-1 pt-10 pb-20 relative top-50 md:top-0">
        {/* Left Content */}
        <div className="flex flex-col gap-4 md:gap-8">
          <h1 className="text-4xl md:text-6xl 2xl:text-8xl font-black tracking-tighter uppercase text-[#383838] font-moderniz ">
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
        <div className="flex relative -top-[40%] md:top-0 h-auto items-start justify-start  lg:min-h-[600px] pointer-events-none md:items-end md:justify-end">
          {/* Floating Card - re-enable pointer events for buttons */}
          <div className="pointer-events-auto bg-white p-2 lg:p-5 lg:pr-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-8 border border-slate-100 mb-10 lg:mr-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
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
