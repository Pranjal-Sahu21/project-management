"use client";

import { motion } from "motion/react";
import Image from "next/image";
import pmMockup from "@/assets/CTA_Image.png";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#0d0d0d] rounded-3xl border border-white/[0.04] p-10 md:p-16 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 bg-[#09f]/5 blur-3xl rounded-full w-96 h-96 pointer-events-none" />
          <div className="absolute -bottom-32 -left-16 bg-[#09f]/[0.03] blur-3xl rounded-full w-80 h-80 pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left side — Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white leading-tight max-w-xl">
                Ready to take control of your projects?
              </h2>
              <p className="text-white/65 text-base mt-6 max-w-md">
                Join 1000+ teams using Zynero to ship organized, collaborate
                effortlessly, and ship on time.
              </p>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="mt-8 inline-block"
              >
                <a
                  href="/sign-up"
                  className="group flex items-center gap-1 bg-[#09f] hover:bg-[#0088dd] text-white px-8 py-3.5 rounded-full text-base transition-colors cursor-pointer font-semibold"
                >
                  <span>Start Free</span>
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
                </a>
              </motion.div>
            </motion.div>

            {/* Right side — Mockup image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-[#09f]/10 blur-2xl rounded-full scale-75 pointer-events-none" />
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative"
                >
                  <Image
                    src={pmMockup}
                    alt="Zynero project dashboard"
                    width={600}
                    height={400}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
