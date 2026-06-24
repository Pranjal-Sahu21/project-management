"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Image from "next/image";
import HomeMockup from "../../../assets/Home_Mockup.png";
import HomeMockupLight from "../../../assets/Home-Mockup-Light.png";

export default function SignInPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white dark:bg-[#18181a]">
      {/* Left Column - Form */}
          <div className="flex-2 flex flex-col items-center justify-center p-6 sm:p-10">
            {isMounted && (
              <div className="w-full max-w-[400px] flex flex-col items-center">
                <SignIn />
              </div>
            )}
          </div>

          {/* Right Column - Mockup image (desktop only) */}
          <div className="hidden lg:block flex-3 relative min-h-screen">
            <Image
              src={HomeMockupLight}
              alt="Platform Dashboard Preview"
              fill
              className="dark:hidden object-cover object-left-top"
              priority
            />
            <Image
              src={HomeMockup}
              alt="Platform Dashboard Preview"
              fill
              className="hidden dark:block object-cover object-left-top"
              priority
            />
          </div>
    </div>
  );
}
