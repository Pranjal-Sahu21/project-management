"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import zyneroLogo from "@/assets/Zynero-image.png";

const quickLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
];

const infoLinks = [
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "/contact" },
];

export default function LandingFooter() {
  return (
    <footer className="relative bg-transparent border-t border-white/[0.04]">
      {/* Upper Footer: Scrolls over the giant text below */}
      <div className="relative z-20 bg-[#050505] pt-12 md:pt-16 pb-10 border-b border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-4 gap-10"
          >
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <Image
                  src={zyneroLogo}
                  alt="Zynero logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-white text-lg font-heading">Zynero</span>
              </div>
              <p className="text-white/40 text-sm mt-2 max-w-xs leading-relaxed">
                Project management for high-velocity teams.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm text-white mb-4 font-heading">
                Quick links
              </h4>
              <nav className="flex flex-col">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition py-1.5 block"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-sm text-white mb-4 font-heading">
                Information
              </h4>
              <nav className="flex flex-col">
                {infoLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition py-1.5 block"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Bottom row */}
          <div className="border-t border-white/[0.04] mt-10 pt-6 flex flex-col md:flex-row justify-end items-center gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Zynero Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Parallax Logo Text: Sits statically at the bottom (z-10) and is uncovered by scrolling */}
      <div className="sticky bottom-0 z-10 w-full bg-[#050505] h-[38vh] md:h-[55vh] flex items-center justify-center overflow-hidden select-none">
        <motion.h1
          initial={{ y: "40%", opacity: 0.2 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[30vw] font-bold text-center tracking-tighter leading-none text-[#121213] transition-all duration-700 hover:text-[#09f] hover:drop-shadow-[0_0_35px_rgba(0,153,255,0.25)] font-heading cursor-default w-full"
          style={{
            WebkitTextStroke: "1.2px rgba(255, 255, 255, 0.02)"
          }}
        >
          Zynero
        </motion.h1>
      </div>
    </footer>
  );
}
