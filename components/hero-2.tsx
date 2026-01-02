"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export const Hero2 = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center pt-20">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Top Green Spotlight/Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#4d7722] opacity-20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#99ed43] opacity-10 blur-[80px] rounded-full pointer-events-none z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#333] mb-8"
        >
          <span className="text-sm text-gray-400 font-medium">Unlock Your</span>
          <span className="text-sm text-[#99ed43] font-bold flex items-center gap-1">
            <span className="text-xs">+</span> Success
          </span>
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#99ed43] to-transparent opacity-50" />
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="block text-white">Turn Your Trading</span>
          <span className="block text-[#e0e0e0]">Into A Business.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 mb-10"
        >
          Join the best and get started today!
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button 
            size="lg"
            className="rounded-full bg-white text-black hover:bg-gray-200 font-semibold px-8 h-12 flex items-center gap-2 group"
          >
            Browse
            <div className="bg-[#99ed43] rounded-full p-1 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-3 h-3 text-black" />
            </div>
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="rounded-full border-gray-700 text-white hover:bg-[#1a1a1a] hover:text-white px-8 h-12"
          >
            Login
          </Button>
        </motion.div>
      </div>

      {/* Animated Candles Bottom */}
      <CandleChart />

    </div>
  );
};

const CandleChart = () => {
  // Generate some random candle data
  const [candles, setCandles] = useState<number[]>([]);

  useEffect(() => {
    // Create initial random heights
    const initialCandles = Array.from({ length: 40 }, () => Math.random() * 100);
    setCandles(initialCandles);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-between px-4 gap-1 md:gap-2 opacity-60 pointer-events-none select-none">
      {candles.map((height, i) => (
        <Candle key={i} index={i} initialHeight={height} />
      ))}
    </div>
  );
};

const Candle = ({ index, initialHeight }: { index: number; initialHeight: number }) => {
  return (
    <motion.div
      initial={{ height: `${initialHeight}%`, opacity: 0.3 }}
      animate={{ 
        height: [`${initialHeight}%`, `${Math.max(10, Math.random() * 100)}%`, `${Math.max(10, Math.random() * 100)}%`],
        opacity: [0.3, 0.8, 0.3]
      }}
      transition={{ 
        duration: 3 + Math.random() * 2, 
        repeat: Infinity, 
        repeatType: "reverse",
        ease: "easeInOut",
        delay: index * 0.05
      }}
      className="w-full max-w-[20px] bg-[#4d7722] rounded-t-sm relative group"
    >
      {/* Wick */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-[1px] h-4 bg-[#4d7722] opacity-50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-[1px] h-4 bg-[#4d7722] opacity-50" />
      
      {/* Highlight effect on some candles */}
      {index % 3 === 0 && (
         <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#99ed43] opacity-20" />
      )}
    </motion.div>
  );
}
