"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Hero3 = () => {
  return (
    <div className="relative h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Stars */}
      <StarField />
      
      {/* Shooting Stars */}
      <ShootingStars />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <span className="text-xs text-gray-400 font-medium">June <span className="text-[#4ade80] font-bold">FXology</span> Trading Competition</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight"
        >
          Traders from more than 150 countries around the world have registered!
        </motion.h1>
      </div>

      {/* Planet / Horizon */}
      <div className="absolute bottom-[-100vh] left-1/2 -translate-x-1/2 w-[200vw] h-[150vh] rounded-[100%] bg-black z-10 overflow-hidden pointer-events-none">
        {/* Glow effect on the horizon */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#4ade80]/20 to-transparent blur-[80px]" />
        
        {/* Sharp horizon line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4ade80]/50 to-transparent" />
      </div>
      
      {/* Atmosphere Glow behind the planet */}
      <div className="absolute bottom-[-100vh] left-1/2 -translate-x-1/2 w-[180vw] h-[70vh] bg-[#4ade80] opacity-5 blur-[150px] rounded-[100%] pointer-events-none z-0" />

    </div>
  );
};

const StarField = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const ShootingStars = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px] w-[100px] bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            top: `${Math.random() * 50}%`,
            left: `${Math.random() * 50}%`,
            rotate: '45deg'
          }}
          initial={{ x: -100, y: -100, opacity: 0 }}
          animate={{ x: 500, y: 500, opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 3 + Math.random() * 5,
            ease: "linear",
            repeatDelay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
};
