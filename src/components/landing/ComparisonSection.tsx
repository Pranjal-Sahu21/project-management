"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { X, Check } from "lucide-react";
import ZyneroLogo from "@/assets/Zynero-image.png";

const painPoints = [
  "Messy spreadsheets, manual tracking",
  "Confusing permissions and roles",
  "No team collaboration and communication",
  "Rigid templates, difficult to customize",
  "Clunky interface that halts productivity",
];

const benefits = [
  "Smart dashboards, real-time task updates",
  "Role-based permissions and projects right away",
  "Team workspaces with roles and assignments",
  "Fully customizable views and workspace layouts",
  "Blazing fast UI built for modern team efficiency",
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background ambient light behind comparison cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#09f]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#09f]/20 bg-[#09f]/10 px-4 py-1.5 text-sm font-medium text-[#09f]">
            Why Zynero?
          </span>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-heading text-white text-center mt-5 max-w-2xl mx-auto font-normal"
        >
          There&apos;s a smarter way to manage projects
        </motion.h2>

        {/* Unified Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-[#0d0d0d] rounded-[32px] border border-white/[0.04] p-6 md:p-8 mt-16 max-w-4xl mx-auto relative z-10 overflow-hidden"
        >
          {/* Grid inside the common card */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* Left side — Other Tools (directly on the parent background) */}
            <div className="flex flex-col justify-between p-4 md:p-6">
              <div>
                <h3 className="text-lg text-white/55 mb-6 font-medium">
                  Other Tools
                </h3>
                <ul>
                  {painPoints.map((point, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 py-3.5 text-sm text-white/40${
                        index < painPoints.length - 1
                          ? " border-b border-white/[0.03]"
                          : ""
                      }`}
                    >
                      <X className="text-red-500/40 w-4 h-4 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side — Zynero Card (nested slide-in card with reduced glow) */}
            <motion.div
              initial={{ opacity: 0, x: 160 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="relative bg-[#131315] rounded-[24px] border border-[#09f]/20 p-6 md:p-8 shadow-[0_0_30px_rgba(0,153,255,0.06)] flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle radial glow inside card */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,153,255,0.05),transparent_60%)] pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-lg text-white mb-6 flex items-center gap-2 font-medium">
                  <Image
                    src={ZyneroLogo}
                    alt="Zynero logo"
                    width={24}
                    height={24}
                  />
                  Zynero
                </h3>
                <ul>
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 py-3.5 text-sm text-white/75${
                        index < benefits.length - 1
                          ? " border-b border-white/[0.04]"
                          : ""
                      }`}
                    >
                      <Check className="text-[#09f] w-4 h-4 mt-0.5 shrink-0" />
                      <span className="font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
