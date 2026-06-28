"use client";

import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { LayoutContext } from "../../components/LayoutShell";

export default function ContactPage() {
  const { setHideSidebarAndNavbar } = useContext(LayoutContext);

  // Set hideSidebarAndNavbar to true on mount to skip dashboard shell
  useEffect(() => {
    setHideSidebarAndNavbar(true);
    return () => setHideSidebarAndNavbar(false);
  }, [setHideSidebarAndNavbar]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // Simulate API submission call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully!");
    }, 1800);
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our team will respond within 12 hours.",
      detail: "support@zynero.com",
      link: "mailto:support@zynero.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm EST.",
      detail: "+1 (800) 555-0199",
      link: "tel:+18005550199",
    },
    {
      icon: MapPin,
      title: "Office Location",
      description: "Come visit our main tech hub.",
      detail: "100 Pine Street, San Francisco, CA",
      link: "https://maps.google.com",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-clip font-sans flex flex-col justify-between">
      <LandingNavbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 md:py-24 w-full grid lg:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* Left Side: Contact Details & Info */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] pb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Get in touch with our team.
            </h1>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Have questions about Zynero? Drop us a message, and our product specialists will guide you through how we can accelerate your team.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid sm:grid-cols-1 gap-6 pt-4">
            {contactOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] transition duration-200">
                  <div className="p-3 h-fit rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#09f]">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm sm:text-base">{opt.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{opt.description}</p>
                    <a href={opt.link} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-blue-400 hover:underline mt-2 block">
                      {opt.detail}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Contact Form */}
        <div className="lg:col-span-7 w-full">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden"
              >
                {/* Visual Accent Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />

                <h2 className="text-xl sm:text-2xl mb-6 text-white">Send a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-450">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-[#09f]/50 px-4 py-3 text-white text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-[#09f]/30 transition"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-450">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-[#09f]/50 px-4 py-3 text-white text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-[#09f]/30 transition"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Subject select */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-450">How can we help? *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-xl bg-[#090909] border border-white/[0.08] focus:border-[#09f]/50 px-4 py-3 text-white text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-[#09f]/30 transition cursor-pointer"
                      disabled={loading}
                    >
                      <option value="Inquiry">General Inquiry</option>
                      <option value="Sales">Request a Demo / Sales</option>
                      <option value="Support">Technical Support</option>
                      <option value="Feedback">Feature Feedback</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-450">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe how we can help your team..."
                      rows={5}
                      className="w-full rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-[#09f]/50 px-4 py-3 text-white text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-[#09f]/30 resize-none transition"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 bg-[#09f] hover:bg-[#0088dd] text-white text-sm px-6 py-3.5 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <span className="relative flex items-center justify-center overflow-hidden w-4 h-4 shrink-0 ml-1">
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
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-10 backdrop-blur-xl text-center relative overflow-hidden flex flex-col items-center justify-center py-16"
              >
                {/* Accent Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 animate-bounce">
                  <CheckCircle2 className="size-12" />
                </div>

                <h2 className="text-2xl mb-3 text-white">Thank you, {form.name}!</h2>
                <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8">
                  Your message has been safely received. A Zynero product expert will get back to you at <span className="text-blue-400 ">{form.email}</span> shortly.
                </p>

                <button
                  onClick={() => {
                    setForm({ name: "", email: "", subject: "Inquiry", message: "" });
                    setSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-sm transition duration-200 cursor-pointer "
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
