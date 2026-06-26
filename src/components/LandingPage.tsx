"use client";

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

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-clip">
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
