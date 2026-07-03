"use client";

import dynamic from "next/dynamic";
import LandingNavbar from "./landing/LandingNavbar";
import HeroSection from "./landing/HeroSection";
import HowItWorksSection from "./landing/HowItWorksSection";
import ProjectsShowcaseSection from "./landing/ProjectsShowcaseSection";
import FeaturesGridSection from "./landing/FeaturesGridSection";
import ComparisonSection from "./landing/ComparisonSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import FAQSection from "./landing/FAQSection";
import CTASection from "./landing/CTASection";
import LandingFooter from "./landing/LandingFooter";

const PaperTexture = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.PaperTexture),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-clip relative">
      {/* Subtle tactile paper design texture overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.025] select-none mix-blend-overlay">
        <PaperTexture style={{ width: "100%", height: "100%" }} />
      </div>

      <LandingNavbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ProjectsShowcaseSection />
        <FeaturesGridSection />
        <ComparisonSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
