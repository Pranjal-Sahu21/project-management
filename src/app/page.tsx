"use client";

import { useState } from "react";
import LandingPage from "../components/LandingPage";
import { Show, useUser } from "@clerk/nextjs";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";

export default function DashboardPage() {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const displayName = user?.firstName || user?.fullName || "User";

  return (
    <>
      <Show when="signed-in">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                Welcome back, {displayName}
              </h1>
              <p className="text-gray-500 dark:text-zinc-400 text-sm">
                Here&apos;s what&apos;s happening with your projects today.
              </p>
            </div>

            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-blue-600 text-white hover:opacity-90 transition cursor-pointer"
            >
              New Project
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
        <LandingPage />
      </Show>
    </>
  );
}
