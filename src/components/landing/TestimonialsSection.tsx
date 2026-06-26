"use client";

import { motion } from "motion/react";

const row1Testimonials = [
  {
    quote: "Zynero replaced three tools we were stitching together. Everything our team needs is in one place now.",
    name: "Sarah L.",
    role: "Engineering Lead @ Vercel",
    avatarBg: "bg-emerald-500",
    initial: "S",
  },
  {
    quote: "The automated progress tracking alone saves us hours of manual status updates every sprint.",
    name: "Michael K.",
    role: "Product Manager @ Stripe",
    avatarBg: "bg-[#09f]",
    initial: "M",
  },
  {
    quote: "Zynero gives us one source of truth for every project. No more hunting through Slack for updates.",
    name: "Jessica M.",
    role: "Design Director @ Figma",
    avatarBg: "bg-purple-500",
    initial: "J",
  },
  {
    quote: "I finally feel like I know what my team is working on at any given moment.",
    name: "David R.",
    role: "CTO @ StartupX",
    avatarBg: "bg-orange-500",
    initial: "D",
  },
  {
    quote: "The user interface is exceptionally clean. It makes daily planning actually enjoyable for the team.",
    name: "Elena P.",
    role: "VP of Product @ Linear",
    avatarBg: "bg-pink-500",
    initial: "E",
  },
  {
    quote: "Automated milestone tracking has completely changed how we report status to stakeholders.",
    name: "Marcus W.",
    role: "Tech Lead @ Airbnb",
    avatarBg: "bg-red-500",
    initial: "M",
  },
  {
    quote: "Creating workspaces and onboarding clients takes minutes now. The workflow is incredibly smooth.",
    name: "Amanda T.",
    role: "Operations Manager @ Retool",
    avatarBg: "bg-teal-500",
    initial: "A",
  },
  {
    quote: "Real-time dashboards update instantly. The speed and responsiveness of the site is stellar.",
    name: "Robert C.",
    role: "Lead Frontend Engineer",
    avatarBg: "bg-indigo-500",
    initial: "R",
  },
];

const row2Testimonials = [
  {
    quote: "The typography and dark mode aesthetics are stunning. It matches our brand guidelines perfectly.",
    name: "Clara N.",
    role: "Creative Director @ Webflow",
    avatarBg: "bg-rose-500",
    initial: "C",
  },
  {
    quote: "As a founder, I need high-level visibility. Zynero's analytics give me exactly that in one click.",
    name: "James L.",
    role: "Founder @ DevFlow",
    avatarBg: "bg-violet-500",
    initial: "J",
  },
  {
    quote: "We went from missing deadlines to shipping early. The milestone dashboards are game-changers.",
    name: "Sophia G.",
    role: "Project Manager @ Notion",
    avatarBg: "bg-cyan-500",
    initial: "S",
  },
  {
    quote: "Onboarding new developers is seamless. They pick up the task workflows on day one.",
    name: "Thomas B.",
    role: "Engineering Manager @ Slack",
    avatarBg: "bg-amber-500",
    initial: "T",
  },
  {
    quote: "The team collaboration features are so intuitive. Real-time commenting keeps everyone aligned.",
    name: "Lily H.",
    role: "Co-founder @ Seedling",
    avatarBg: "bg-fuchsia-500",
    initial: "L",
  },
  {
    quote: "I love the attention to detail in the microinteractions. Zynero is beautifully designed.",
    name: "Alex M.",
    role: "Product Designer @ Duolingo",
    avatarBg: "bg-emerald-600",
    initial: "A",
  },
  {
    quote: "Managing multiple cross-functional workspaces has never been this organized and pain-free.",
    name: "Rachel K.",
    role: "Operations Director @ Shopify",
    avatarBg: "bg-sky-500",
    initial: "R",
  },
  {
    quote: "Zynero scales effortlessly with our engineering organization. It's robust and secure by design.",
    name: "Daniel S.",
    role: "Engineering Director @ Uber",
    avatarBg: "bg-blue-600",
    initial: "D",
  },
];

interface TestimonialRowProps {
  items: typeof row1Testimonials;
  speed?: number;
  reverse?: boolean;
}

function TestimonialRow({ items, speed = 40, reverse = false }: TestimonialRowProps) {
  // Triple the items to ensure there is plenty of content to fill the track even on very wide screens
  const triplicatedItems = [...items, ...items, ...items];

  return (
    <div 
      className="flex overflow-hidden w-full relative"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
      }}
    >
      <motion.div
        className="flex gap-5 py-3 shrink-0"
        animate={{
          x: reverse ? ["-33.33%", "0%"] : ["0%", "-33.33%"]
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
      >
        {triplicatedItems.map((testimonial, idx) => (
          <div
            key={idx}
            className="w-[320px] bg-[#0d0d0d] rounded-2xl border border-white/[0.08] p-6 shrink-0 flex flex-col justify-between hover:border-white/[0.15] transition-colors duration-300"
          >
            <p className="text-sm text-white/70 leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm shrink-0 ${testimonial.avatarBg}`}
              >
                {testimonial.initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {testimonial.name}
                </p>
                <p className="text-xs text-white/40 truncate">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading text-white max-w-lg"
          >
            Loved by teams worldwide
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/65 mt-4 md:mt-0 text-base max-w-md"
          >
            Teams across industries trust Zynero to plan and ship — with
            real-time dashboards and effortless collaboration.
          </motion.p>
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="flex flex-col gap-6 w-full">
        <TestimonialRow items={row1Testimonials} speed={40} reverse={false} />
        <TestimonialRow items={row2Testimonials} speed={45} reverse={true} />
      </div>
    </section>
  );
}
