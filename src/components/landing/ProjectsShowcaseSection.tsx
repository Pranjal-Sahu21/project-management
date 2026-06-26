"use client";

import { motion, Variants } from "motion/react";
import Image from "next/image";

import Dashboard from "@/assets/Dashboard_Default_Img.png";
import profileImg1 from "@/assets/profile_avatar_1.png";
import profileImg2 from "@/assets/profile_avatar_2.png";
import profileImg3 from "@/assets/profile_avatar_3.png";
import PlaceholderImage from "@/assets/workspace_img_default.png";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ProjectsShowcaseSection() {
  return (
    <section id="showcase" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top area — two-column layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-normal font-heading text-white leading-tight max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            See your projects in real time, clearly.
          </motion.h2>

          <motion.p
            className="text-white/55 text-base md:text-lg leading-relaxed md:pt-2 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Zynero gives your team a shared view of progress — priorities,
            owners, timelines — so you can act on it immediately.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="grid lg:grid-cols-3 gap-6 mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Row 1 - Smart Dashboard (takes 2 cols) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[#0d0d0d] rounded-[28px] border border-white/[0.04] overflow-hidden lg:col-span-2 flex flex-col justify-between group cursor-pointer"
          >
            {/* Mockup at TOP */}
            <div className="relative h-72 w-full overflow-hidden flex items-start justify-center bg-[#050505]/40 px-8 ">
              <div 
                className="relative w-full md:w-full transition-transform duration-500 group-hover:scale-[1.02]"
                style={{
                  transform: "perspective(1200px) rotateX(16deg) rotateY(-12deg) rotateZ(3deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                <Image
                  src={Dashboard}
                  alt="Smart Dashboard"
                  className="rounded-xl shadow-2xl object-cover object-top"
                  width={750}
                  height={450}
                  priority
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
            </div>

            {/* Text at BOTTOM */}
            <div className="p-8">
              <h3 className="text-xl font-medium text-white font-heading">
                Smart Dashboard
              </h3>
              <p className="text-sm text-white/55 mt-2 leading-relaxed max-w-md">
                See all projects in one view – progress, owners, and blockers at a glance.
              </p>
            </div>
          </motion.div>

          {/* Row 1 - Activity Feed (takes 1 col) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[#0d0d0d] rounded-[28px] border border-white/[0.04] overflow-hidden lg:col-span-1 flex flex-col justify-between group cursor-pointer"
          >
            {/* Mockup at TOP */}
            <div className="relative h-72 w-full overflow-hidden bg-[#050505]/40 border-b border-white/[0.02]">
              <Image
                src={PlaceholderImage}
                alt="Activity Feed"
                fill
                className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
            </div>

            {/* Text at BOTTOM */}
            <div className="p-8">
              <h3 className="text-xl font-medium text-white font-heading">
                Activity Feed
              </h3>
              <p className="text-sm text-white/55 mt-2 leading-relaxed max-w-[280px]">
                Track every task update, comment, and status change as it happens across your team.
              </p>
            </div>
          </motion.div>

          {/* Row 2 - Column 1: Progress Analytics */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[#0d0d0d] rounded-[28px] border border-white/[0.04] overflow-hidden lg:col-span-1 flex flex-col justify-between group cursor-pointer"
          >
            {/* Mockup at TOP */}
            <div className="relative h-72 w-full overflow-hidden bg-[#050505]/40 border-b border-white/[0.02]">
              <Image
                src={PlaceholderImage}
                alt="Progress Analytics"
                fill
                className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
            </div>

            {/* Text at BOTTOM */}
            <div className="p-8">
              <h3 className="text-xl font-medium text-white font-heading">
                Progress Analytics
              </h3>
              <p className="text-sm text-white/55 mt-2 leading-relaxed max-w-[280px]">
                Automated charts that show sprint velocity, completion rates, and team workload.
              </p>
            </div>
          </motion.div>

          {/* Row 2 - Column 2: Milestone Tracking */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[#0d0d0d] rounded-[28px] border border-white/[0.04] overflow-hidden lg:col-span-1 flex flex-col justify-between group cursor-pointer"
          >
            {/* Mockup at TOP */}
            <div className="relative h-72 w-full overflow-hidden bg-[#050505]/40 border-b border-white/[0.02]">
              <Image
                src={PlaceholderImage}
                alt="Milestone Tracking"
                fill
                className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
            </div>

            {/* Text at BOTTOM */}
            <div className="p-8">
              <h3 className="text-xl font-medium text-white font-heading">
                Milestone Tracking
              </h3>
              <p className="text-sm text-white/55 mt-2 leading-relaxed max-w-[280px]">
                Set project goals with due dates. Zynero tracks them and alerts when you're off track.
              </p>
            </div>
          </motion.div>

          {/* Row 2 - Column 3: Stacked Info Cards */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Card 5a: Trusted by 500+ teams */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#0d0d0d] rounded-[28px] border border-white/[0.04] p-8 flex flex-col justify-center items-start gap-4 flex-1 min-h-[140px]"
            >
              <div className="flex -space-x-2">
                <Image src={profileImg1} alt="User Avatar" width={32} height={32} className="rounded-full border-2 border-[#0d0d0d] bg-zinc-800 object-cover" />
                <Image src={profileImg2} alt="User Avatar" width={32} height={32} className="rounded-full border-2 border-[#0d0d0d] bg-zinc-800 object-cover" />
                <Image src={profileImg3} alt="User Avatar" width={32} height={32} className="rounded-full border-2 border-[#0d0d0d] bg-zinc-800 object-cover" />
              </div>
              <h3 className="text-xl font-medium text-white font-heading leading-snug max-w-[220px]">
                Trusted by 500+ teams worldwide
              </h3>
            </motion.div>

            {/* Card 5b: 10,000+ projects shipped */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#0d0d0d] rounded-[28px] border border-white/[0.04] p-8 flex flex-col justify-between flex-2 gap-6"
            >
              <div>
                <p className="text-4xl font-semibold font-heading text-white tracking-tight leading-none">
                  10,000+
                </p>
                <h3 className="text-xl font-medium text-white font-heading mt-2 leading-tight">
                  projects shipped
                </h3>
                <p className="text-sm text-white/55 mt-3 leading-relaxed max-w-[240px]">
                  Zynero helps teams plan better, move faster, and deliver on time.
                </p>
              </div>
              <a 
                href="/sign-up" 
                className="group text-[#09f] hover:text-[#09f]/80 text-sm inline-flex items-center gap-1 cursor-pointer transition-colors mt-2 font-semibold"
              >
                <span>Start for free</span>
                <span className="relative flex items-center justify-center overflow-hidden w-4 h-4 shrink-0">
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
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
