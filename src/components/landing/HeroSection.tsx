"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import HomeMockupLight from "@/assets/Hero_Mockup.webp";
import dynamic from "next/dynamic";

const Warp = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Warp),
  { ssr: false }
);

export default function HeroSection() {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 450); // Stagger text entry to let dynamic Warp canvas initialize first
    return () => clearTimeout(timer);
  }, []);
  
  // Transform scroll position (0px to 500px) to 3D rotation and scale values
  const rotateXRaw = useTransform(scrollY, [0, 500], [18, 0]);
  const scaleRaw = useTransform(scrollY, [0, 500], [0.93, 1]);
  
  // Apply buttery smooth spring physics to scroll values
  const rotateX = useSpring(rotateXRaw, { stiffness: 90, damping: 22 });
  const scale = useSpring(scaleRaw, { stiffness: 90, damping: 22 });

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-36 md:pt-44 pb-16"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Text Content */}
        <div className="text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-tight text-white leading-tight max-w-4xl mx-auto font-normal"
          >
            Manage projects with
            <br />
            clarity and speed
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/55 text-base md:text-medium max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            A shared workspace for teams that plan, track, and ship with
            real-time dashboards, smart task management, and automated progress
            built in.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8"
          >
            <a href="/sign-up" className="group inline-block">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center gap-1 bg-[#09f] hover:bg-[#0088dd] text-white px-6 py-3 rounded-full text-base transition-colors duration-200 cursor-pointer"
              >
                <span>Start for free</span>
                <span className="relative flex items-center justify-center overflow-hidden w-4 h-4 ml-1 shrink-0">
                  <span className="absolute transition-transform duration-300 ease-out translate-x-0 translate-y-0 group-hover:translate-x-3.5 group-hover:-translate-y-3.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </span>
                  <span className="absolute transition-transform duration-300 ease-out -translate-x-3.5 translate-y-3.5 group-hover:translate-x-0 group-hover:translate-y-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </span>
                </span>
              </motion.span>
            </a>
          </motion.div>
        </div>

        {/* Hero Mockup Composition */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 md:mt-12 max-w-8xl mx-auto"
          style={{ perspective: "1200px" }}
        >
          {/* Light Mockup with 3D scroll reactive tilt */}
          <motion.div
            style={{
              rotateX,
              scale,
              transformStyle: "preserve-3d"
            }}
            className="relative z-10 w-[100%] overflow-hidden rounded-2xl"
          >
            <Image
              src={HomeMockupLight}
              alt="Zynero project dashboard — light theme"
              width={1200}
              height={750}
              priority
              className="rounded-2xl shadow-2xl border border-white/10"
            />
            {/* Dark overlay gradient matching background (#050505) to merge mockup into page */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>

      {/* Warp Background from shaders.paper.design */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.65] select-none">
        <Warp
          colors={["#050505", "#0055ff", "#050505", "#09f"]}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          speed={0.8}
          style={{ width: "100%", height: "100%" }}
        />
        {/* Soft dark overlays to seamlessly merge into the landing page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Background Ambient Glow (Top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#09f]/[0.05] rounded-full blur-3xl pointer-events-none z-10" />
    </section>
  );
}
