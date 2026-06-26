"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: LayoutDashboard,
    iconBg: "bg-[#09f]/10",
    iconColor: "text-[#09f]",
    title: "Smart dashboards",
    description:
      "Real-time stats, progress tracking, and key metrics for every project in one place.",
  },
  {
    icon: ListChecks,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    title: "Task management",
    description:
      "Create, assign, and track tasks with priorities, labels, and status workflows.",
  },
  {
    icon: Users,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    title: "Team collaboration",
    description:
      "Invite teammates, assign roles, and collaborate in real-time across workspaces.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    title: "Progress analytics",
    description:
      "Automated dashboards with velocity, completion rates, and bottleneck detection at a glance.",
  },
  {
    icon: Zap,
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    title: "Background processing",
    description:
      "Zynero automatically smart-refreshes project progress behind the scenes.",
  },
  {
    icon: Shield,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    title: "Secure by default",
    description:
      "Enterprise-grade auth with role-based access controls and encrypted connections.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FeaturesGridSection() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center text-xs font-medium text-[#09f] bg-[#09f]/10 border border-[#09f]/20 rounded-full px-4 py-1.5">
            Features
          </span>
        </motion.div>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-heading text-white text-center mt-5 max-w-2xl mx-auto"
        >
          Everything your team needs to ship faster
        </motion.h2>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#0d0d0d] rounded-2xl border border-white/[0.08] p-6 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.iconBg}`}
                >
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-base text-white mt-4">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/65 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mt-10"
        >
          <a
            href="/sign-up"
            className="text-[#09f] hover:text-[#09f]/80 text-sm inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
