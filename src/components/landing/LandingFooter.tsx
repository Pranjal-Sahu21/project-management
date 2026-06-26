"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import zyneroLogo from "@/assets/Zynero-image.png";

const quickLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
];

const infoLinks = [
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] py-12">
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
              <span className="text-white text-lg">Zynero</span>
            </div>
            <p className="text-white/40 text-sm mt-2 max-w-xs">
              Project management for high-velocity teams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm text-white mb-4">
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
            <h4 className="text-sm text-white mb-4">
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
        <div className="border-t border-white/[0.08] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={zyneroLogo}
              alt="Zynero logo"
              width={20}
              height={20}
              className="rounded"
            />
            <span className="text-white text-sm font-medium">Zynero</span>
          </div>
          <p className="text-xs text-white/30">
            © 2025 Zynero Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
