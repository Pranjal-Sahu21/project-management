"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "What is Zynero and who is it built for?",
    answer:
      "Zynero is a project management platform for high-velocity product teams. It combines task management, real-time dashboards, and automated analytics — designed for teams that want to move fast without losing visibility.",
  },
  {
    question: "How does automated progress tracking work?",
    answer:
      "Zynero uses background processing to automatically calculate project completion rates, track task status changes, and surface bottlenecks — so your dashboards are always up to date without manual effort.",
  },
  {
    question: "Can I invite external clients or guests?",
    answer:
      "Yes! You can invite team members and assign different roles within each workspace. Guest access and permission controls are built in.",
  },
  {
    question: "What integrations does Zynero support?",
    answer:
      "Zynero currently supports webhook integrations and REST API access. We're actively building integrations with Slack, GitHub, and Jira.",
  },
  {
    question: "Is my data secure on Zynero?",
    answer:
      "Absolutely. Zynero uses enterprise-grade authentication via Clerk, encrypted database connections, and role-based access controls to keep your data safe.",
  },
  {
    question: "How do I get support if I have questions?",
    answer:
      "You can reach our support team through the in-app help center, or email us directly. Priority support is available for team plans.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top: Two columns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 md:gap-12 items-end"
        >
          {/* Left column */}
          <div>
            <span className="text-[#09f] text-sm font-medium">
              Frequently asked
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white leading-tight mt-3 max-w-lg">
              Got questions?
              <br />
              We&apos;ve got answers.
            </h2>
          </div>

          {/* Right column */}
          <div className="md:flex md:items-end md:justify-end">
            <p className="text-white/65 text-base mt-4 md:mt-0">
              Here&apos;s everything you need to know before getting started.
            </p>
          </div>
        </motion.div>

        {/* Accordion */}
        <div className="mt-16 divide-y divide-white/[0.08]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Clickable row */}
                <button
                  onClick={() => toggleIndex(index)}
                  className="py-5 w-full flex items-center justify-between cursor-pointer group text-left"
                >
                  <span className="text-base font-medium text-white group-hover:text-[#09f] transition pr-4">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/40 shrink-0"
                  >
                    {isOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </motion.span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-white/65 pb-5 leading-relaxed max-w-2xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
