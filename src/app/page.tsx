"use client";

import { useState } from "react";
import LandingPage from "../components/LandingPage";
import { Show, useUser, useOrganization } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-6 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Project Overview Card Skeleton */}
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md space-y-4">
            <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div className="space-y-1 flex-1">
                    <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Card Skeleton */}
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md space-y-4">
            <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-800 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Summary Card Skeleton */}
        <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md space-y-4">
          <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border border-zinc-100 dark:border-zinc-800 rounded space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-805 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const { membership } = useOrganization();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const loading = useSelector((state: any) => state?.workspace?.loading);

  const displayName = user?.firstName || user?.fullName || "User";
  const isAdmin = membership?.role === "org:admin";

  return (
    <>
      <Show when="signed-in">
        {loading ? (
          <DashboardSkeleton />
        ) : (
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

            {isAdmin && (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-blue-600 text-white hover:opacity-90 transition cursor-pointer"
              >
                New Project
              </button>
            )}

            {isAdmin && (
              <CreateProjectDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            )}
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
      )}
    </Show>

      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}
