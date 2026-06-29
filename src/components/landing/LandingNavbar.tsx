"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Show } from "@clerk/nextjs";
import ZyneroLogo from "@/assets/Zynero-image.png";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (window.location.pathname !== "/") {
      return;
    }
    e.preventDefault();
    const cleanId = targetId.replace("/#", "").replace("#", "");
    const element = document.getElementById(cleanId);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={ZyneroLogo}
              alt="Zynero"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-white text-lg">Zynero</span>
          </Link>

          {/* Desktop Nav Links */}
          {!isContactPage && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("/#") || link.href.startsWith("#")) {
                      scrollToSection(e, link.href);
                    }
                  }}
                  className="text-white/65 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Show when="signed-in">
              <a
                href="/"
                className="group flex items-center gap-1 bg-[#09f] hover:bg-[#0088dd] text-white text-sm px-5 py-2.5 rounded-full transition-colors duration-200 cursor-pointer"
              >
                <span>Dashboard</span>
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
            </Show>
            <Show when="signed-out">
              <a
                href="/sign-in"
                className="text-white/65 hover:text-white text-sm transition-colors duration-200 cursor-pointer px-3 py-2"
              >
                Login
              </a>
              <a
                href="/sign-up"
                className="group flex items-center gap-1 bg-[#09f] hover:bg-[#0088dd] text-white text-sm px-5 py-2.5 rounded-full transition-colors duration-200 cursor-pointer"
              >
                <span>Get Started</span>
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
            </Show>
          </div>

          {/* Mobile Hamburger */}
          {!isContactPage && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/65 hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 z-[100] bg-[#050505]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <Link
                  href="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Image
                    src={ZyneroLogo}
                    alt="Zynero"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="text-white text-lg">
                    Zynero
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/65 hover:text-white transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-2 px-6 pt-8">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (link.href.startsWith("/#") || link.href.startsWith("#")) {
                        scrollToSection(e, link.href);
                      }
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    className="text-white/65 hover:text-white text-2xl py-3 transition-colors duration-200"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="px-6 mt-8 flex flex-col gap-3">
                <Show when="signed-in">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                  >
                    <a
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-center gap-1 bg-[#09f] hover:bg-[#0088dd] text-white text-base px-5 py-3 rounded-full transition-colors duration-200 cursor-pointer"
                    >
                      <span>Dashboard</span>
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
                </Show>

                <Show when="signed-out">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                  >
                    <a
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-white/65 hover:text-white text-base py-3 transition-colors duration-200 cursor-pointer"
                    >
                      Login
                    </a>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <a
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-center gap-1 bg-[#09f] hover:bg-[#0088dd] text-white text-base px-5 py-3 rounded-full transition-colors duration-200 cursor-pointer"
                    >
                      <span>Get Started</span>
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
                </Show>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
