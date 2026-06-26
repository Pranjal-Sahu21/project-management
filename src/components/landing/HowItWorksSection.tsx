"use client";

import { motion, Variants } from "motion/react";
import Image from "next/image";

import WorkspaceImage from "@/assets/workspace_img_default.png";
import CreateProject from "@/assets/create-project-img.png";
import TrackProgress from "@/assets/track-progress-img.avif";

const steps = [
  {
    step: 1,
    title: "Create a workspace",
    description:
      "Set up your team's home base — organize projects, assign roles, and start organizing in one day.",
    image: WorkspaceImage,
  },
  {
    step: 2,
    title: "Add your projects",
    description:
      "Break work into focused projects with task boards, milestones, and status workflows that fit your team.",
    image: CreateProject,
  },
  {
    step: 3,
    title: "Track progress and ship",
    description:
      "Monitor team updates in real-time. Dashboards surface bottlenecks before they become blockers. Get the ship done.",
    image: TrackProgress,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-heading text-white max-w-xl font-normal"
        >
          How Zynero works
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#0d0d0d] rounded-[28px] border border-white/[0.04] overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              {/* Mockup Container */}
              <div className="relative w-full h-48 bg-[#050505]/40 border-b border-white/[0.02] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
              </div>

              {/* Text Area (with step info) */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-start">
                <div className="flex items-center mb-3">
                  <span className="text-[9px] text-[#09f] bg-[#09f]/10 border border-[#09f]/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                    Step {step.step}
                  </span>
                </div>
                <h3 className="text-lg text-white font-heading">
                  {step.title}
                </h3>
                <p className="text-sm text-white/55 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
