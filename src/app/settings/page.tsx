"use client";

import { OrganizationProfile } from "@clerk/nextjs";

export default function SettingsPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col min-h-[85vh]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Workspace Settings
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage your workspace members, settings, and general preferences.
                </p>
            </div>
            
            <div className="w-full border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex justify-center">
                <OrganizationProfile 
                    routing="hash"
                    appearance={{
                        elements: {
                            rootBox: "w-full max-w-none flex justify-center",
                            cardBox: "w-full max-w-none shadow-none border-none p-0 bg-transparent dark:bg-transparent",
                            navbar: "border-r border-zinc-200 dark:border-zinc-800 pr-4",
                            navbarButton: "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-md px-3 py-2 transition-all text-sm font-medium",
                            navbarButtonActive: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold",
                            headerTitle: "text-zinc-900 dark:text-white font-bold text-lg",
                            headerSubtitle: "text-zinc-500 dark:text-zinc-400 text-xs",
                            profileSectionTitleText: "text-zinc-850 dark:text-zinc-100 font-semibold text-sm",
                            profileSectionSubtitleText: "text-zinc-500 dark:text-zinc-400 text-xs",
                            accordionTriggerButton: "text-zinc-900 dark:text-white",
                            breadcrumbsItem: "text-zinc-500 dark:text-zinc-400 text-xs",
                            breadcrumbsItemActive: "text-zinc-950 dark:text-white text-xs font-semibold",
                            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition px-4 py-2 cursor-pointer",
                            formButtonReset: "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-xs font-medium rounded transition px-4 py-2 cursor-pointer",
                            scrollBox: "bg-transparent dark:bg-transparent shadow-none border-none",
                            pageScrollBox: "px-6 py-4",
                            organizationProfilePage__general: "space-y-6",
                            organizationProfilePage__members: "space-y-6",
                            badge: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-semibold px-2 py-0.5 rounded",
                            avatarImage: "rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800",
                        }
                    }}
                />
            </div>
        </div>
    );
}
