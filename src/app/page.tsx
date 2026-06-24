"use client";

import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";
import { Show, SignIn, useUser } from "@clerk/nextjs";
import Image from "next/image";
import HomeMockup from "../assets/Home_Mockup.png";
import HomeMockupLight from "../assets/Home-Mockup-Light.png";

export default function DashboardPage() {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayName = user?.firstName || user?.fullName || "User";

  return (
    <>
      <Show when="signed-in">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                {" "}
                Welcome back, {displayName}{" "}
              </h1>
              <p className="text-gray-500 dark:text-zinc-400 text-sm">
                {" "}
                Here&apos;s what&apos;s happening with your projects today{" "}
              </p>
            </div>

            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={16} /> New Project
            </button>

            <CreateProjectDialog
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </div>

          <StatsGrid />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProjectOverview />
              <RecentActivity />
            </div>
            <div>
              <TasksSummary />
            </div>
          </div>
        </div>
      </Show>

      <Show when="signed-out">
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
      </Show>
    </>
  );
}
