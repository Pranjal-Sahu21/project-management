"use client";

import { motion } from "motion/react";
import Image from "next/image";

import HomeMockupDark from "@/assets/Home_Mockup.png";
import profileImgA from "@/assets/profile_img_a.svg";
import profileImgJ from "@/assets/profile_img_j.svg";
import profileImgO from "@/assets/profile_img_o.svg";

function CashflowStackMockup() {
  return (
    <div className="relative w-[75%] h-[200px] flex items-center justify-center">
      {/* Layer 3 (Back Card) */}
      <div 
        className="absolute w-[85%] h-[155px] bg-[#f4f4f5] rounded-2xl border border-black/[0.04] translate-y-[-20px] translate-x-[6px] scale-[0.90] opacity-50 shadow-sm"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      />
      {/* Layer 2 (Middle Card) */}
      <div 
        className="absolute w-[92%] h-[160px] bg-[#f9fafb] rounded-2xl border border-black/[0.04] translate-y-[-10px] translate-x-[3px] scale-[0.95] opacity-80 shadow-md"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      />
      {/* Layer 1 (Front Card) */}
      <div 
        className="relative w-[100%] bg-white rounded-2xl border border-black/[0.08] p-4 shadow-xl transition-transform duration-500 group-hover:scale-[1.03]"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="flex justify-between items-center border-b border-black/[0.06] pb-2">
          <span className="text-[10px] font-bold text-zinc-900">Cashflow</span>
          <span className="text-[8px] text-zinc-500 bg-zinc-100 border border-zinc-200/60 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium cursor-pointer">
            Last 7 Days
            <svg className="w-2 h-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        
        <div className="mt-2.5 flex justify-between items-start">
          <div>
            <span className="text-zinc-400 text-[8px] uppercase tracking-wider font-semibold">Total Balance</span>
            <div className="text-zinc-900 font-bold text-xl leading-none mt-0.5">$12,000</div>
          </div>
          
          <div className="flex items-center gap-3 text-[9px] mt-1">
            <span className="flex items-center gap-1 text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55b022]" />
              Income
            </span>
            <span className="flex items-center gap-1 text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              Expense
            </span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-16 w-full mt-3 relative overflow-visible">
          {/* Horizontal grid lines */}
          <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-[0.07]">
            <div className="border-b border-black w-full" />
            <div className="border-b border-black w-full" />
            <div className="border-b border-black w-full" />
            <div className="border-b border-black w-full" />
          </div>

          {/* Left Y-axis labels */}
          <div className="absolute left-[-16px] inset-y-0 flex flex-col justify-between text-[7px] text-zinc-400 pointer-events-none pr-1">
            <span>600</span>
            <span>500</span>
            <span>400</span>
            <span>300</span>
          </div>

          {/* Floating Tooltip */}
          <div className="absolute top-[-14px] left-[52%] translate-x-[-50%] bg-white border border-zinc-150 rounded-lg px-2 py-1 shadow-lg flex flex-col items-center pointer-events-none z-10 scale-95 border-black/[0.04]">
            <span className="text-[7px] text-zinc-400 leading-none uppercase font-semibold">Income</span>
            <span className="text-[10px] font-bold text-zinc-900 mt-0.5">$6,000</span>
            <span className="text-[6px] text-zinc-400 mt-0.5">Tuesday, 25 June</span>
            <div className="absolute bottom-[-3px] left-1/2 translate-x-[-50%] w-1.5 h-1.5 bg-white border-r border-b border-black/[0.04] rotate-45" />
          </div>
          
          {/* SVG Line Chart */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cashflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#55b022" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#55b022" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Gradient Fill */}
            <path d="M0,35 Q20,38 40,15 T80,28 T100,8 L100,40 L0,40 Z" fill="url(#cashflowGrad)" />
            {/* Green Line */}
            <path d="M0,35 Q20,38 40,15 T80,28 T100,8" fill="none" stroke="#55b022" strokeWidth="2.2" strokeLinecap="round" />
            {/* Tooltip dot */}
            <circle cx="52" cy="18" r="3.5" fill="#55b022" stroke="white" strokeWidth="1.5" className="animate-pulse" />
          </svg>

          {/* Bottom X-axis labels */}
          <div className="absolute bottom-[-14px] inset-x-0 flex justify-between text-[7px] text-zinc-400 font-medium px-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressChartMockup() {
  return (
    <div className="relative w-[75%] h-[200px] flex items-center justify-center">
      {/* Layer 3 (Back Card) */}
      <div 
        className="absolute w-[85%] h-[155px] bg-[#f4f4f5] rounded-2xl border border-black/[0.04] translate-y-[-20px] translate-x-[6px] scale-[0.90] opacity-50 shadow-sm"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      />
      {/* Layer 2 (Middle Card) */}
      <div 
        className="absolute w-[92%] h-[160px] bg-[#f9fafb] rounded-2xl border border-black/[0.04] translate-y-[-10px] translate-x-[3px] scale-[0.95] opacity-80 shadow-md"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      />
      {/* Layer 1 (Front Card) */}
      <div 
        className="relative w-[100%] bg-white rounded-2xl border border-black/[0.08] p-4 shadow-xl transition-transform duration-500 group-hover:scale-[1.03]"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="flex gap-4 items-center">
          {/* Circular Pie Chart */}
          <div className="relative w-[76px] h-[76px] shrink-0 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Track */}
              <circle
                cx="18"
                cy="18"
                r="15"
                className="stroke-zinc-100"
                strokeWidth="3.5"
                fill="transparent"
              />
              
              {/* Rent & Living (Black segment) - 60% */}
              <circle
                cx="18"
                cy="18"
                r="15"
                className="stroke-zinc-900"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray="56.5 94.2"
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* Investment (Green segment) - 18% */}
              <circle
                cx="18"
                cy="18"
                r="15"
                className="stroke-[#55b022]"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray="17 94.2"
                strokeDashoffset="-56.5"
                strokeLinecap="round"
              />

              {/* Vacation (Grey segment) - 12% */}
              <circle
                cx="18"
                cy="18"
                r="15"
                className="stroke-zinc-400"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray="11.3 94.2"
                strokeDashoffset="-73.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[7px] text-zinc-400 leading-none uppercase font-semibold">Total Exp</span>
              <span className="text-[11px] font-bold text-zinc-900 mt-0.5">$3,500</span>
            </div>
          </div>
          
          {/* Legend info */}
          <div className="flex-1 flex flex-col gap-1.5">
            {/* Rent & Living */}
            <div className="flex items-center justify-between text-[9px] border-b border-zinc-100/80 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold px-1 py-0.5 bg-zinc-950 text-white rounded">60%</span>
                <span className="text-zinc-600 font-medium">Rent & Living</span>
              </div>
              <span className="text-zinc-900 font-bold">$2,100</span>
            </div>

            {/* Investment */}
            <div className="flex items-center justify-between text-[9px] border-b border-zinc-100/80 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold px-1 py-0.5 bg-[#55b022] text-white rounded">18%</span>
                <span className="text-zinc-600 font-medium">Investment</span>
              </div>
              <span className="text-zinc-900 font-bold">$625</span>
            </div>

            {/* Vacation */}
            <div className="flex items-center justify-between text-[9px]">
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold px-1 py-0.5 bg-zinc-400 text-white rounded">12%</span>
                <span className="text-zinc-600 font-medium">Vacation</span>
              </div>
              <span className="text-zinc-900 font-bold">$420</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneProgressMockup() {
  return (
    <div className="relative w-[75%] h-[200px] flex items-center justify-center">
      {/* Layer 3 (Back Card) */}
      <div 
        className="absolute w-[85%] h-[155px] bg-[#f4f4f5] rounded-2xl border border-black/[0.04] translate-y-[-20px] translate-x-[6px] scale-[0.90] opacity-50 shadow-sm"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      />
      {/* Layer 2 (Middle Card) */}
      <div 
        className="absolute w-[92%] h-[160px] bg-[#f9fafb] rounded-2xl border border-black/[0.04] translate-y-[-10px] translate-x-[3px] scale-[0.95] opacity-80 shadow-md"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      />
      {/* Layer 1 (Front Card) */}
      <div 
        className="relative w-[100%] bg-white rounded-2xl border border-black/[0.08] p-4 shadow-xl transition-transform duration-500 group-hover:scale-[1.03]"
        style={{
          transform: "perspective(1000px) rotateX(20deg) rotateY(-12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-2">
          <div className="flex items-center gap-1.5">
            {/* Target/Milestone Icon */}
            <svg className="w-3.5 h-3.5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold text-zinc-900">Vacation Fund</span>
          </div>
          <span className="text-[8px] text-[#55b022] font-semibold bg-[#55b022]/10 px-1.5 py-0.5 rounded-full">
            60% in progress
          </span>
        </div>
        
        <div className="mt-3 flex justify-between items-baseline text-[10px] text-zinc-955 font-bold">
          <span>$3,000 <span className="text-zinc-400 font-normal text-[8px]">/$5,000</span></span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-zinc-100 rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-[#55b022] rounded-full" style={{ width: "60%" }} />
        </div>
        
        {/* Members list */}
        <div className="mt-3 flex items-center justify-between text-[8px] pt-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55b022]" />
              <span className="text-zinc-600 font-medium">Andrew Foster</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              <span className="text-zinc-400 font-medium">Sarah Connors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55b022]" />
              <span className="text-zinc-600 font-medium">Max Harrison</span>
            </div>
          </div>
          
          <div className="text-zinc-400 font-medium text-right self-end pb-0.5">
            Due: 27 November 2025
          </div>
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
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
            <div className="relative h-72 w-full overflow-hidden flex items-start justify-center bg-[#050505]/40 pt-8 px-8 border-b border-white/[0.02]">
              <div 
                className="relative w-[90%] md:w-[85%] transition-transform duration-500 group-hover:scale-[1.02]"
                style={{
                  transform: "perspective(1200px) rotateX(16deg) rotateY(-12deg) rotateZ(3deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                <Image
                  src={HomeMockupDark}
                  alt="Smart Dashboard"
                  className="rounded-xl shadow-2xl border border-white/[0.08] object-cover object-top"
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
            <div className="relative h-72 w-full overflow-hidden flex items-center justify-center bg-[#050505]/40 border-b border-white/[0.02] pt-4">
              <CashflowStackMockup />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
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
            <div className="relative h-72 w-full overflow-hidden flex items-center justify-center bg-[#050505]/40 border-b border-white/[0.02] pt-4">
              <ProgressChartMockup />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
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
            <div className="relative h-72 w-full overflow-hidden flex items-center justify-center bg-[#050505]/40 border-b border-white/[0.02] pt-4">
              <MilestoneProgressMockup />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
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
                <Image src={profileImgA} alt="User Avatar" width={32} height={32} className="rounded-full border-2 border-[#0d0d0d] bg-zinc-800" />
                <Image src={profileImgJ} alt="User Avatar" width={32} height={32} className="rounded-full border-2 border-[#0d0d0d] bg-zinc-800" />
                <Image src={profileImgO} alt="User Avatar" width={32} height={32} className="rounded-full border-2 border-[#0d0d0d] bg-zinc-800" />
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
                className="text-[#09f] hover:text-[#09f]/80 text-sm inline-flex items-center gap-1 cursor-pointer transition-colors mt-2"
              >
                Start for free <span className="text-base leading-none">↗</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
