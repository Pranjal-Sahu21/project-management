"use client";

import { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { ArrowLeftIcon, PlusIcon, SettingsIcon, BarChart3Icon, CalendarIcon, FileStackIcon, ZapIcon } from "lucide-react";
import ProjectAnalytics from "../../components/ProjectAnalytics";
import ProjectSettings from "../../components/ProjectSettings";
import CreateTaskDialog from "../../components/CreateTaskDialog";
import ProjectCalendar from "../../components/ProjectCalendar";
import ProjectTasks from "../../components/ProjectTasks";

function ProjectDetailSkeleton() {
    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-pulse select-none text-zinc-900 dark:text-white">
            {/* Top Bar Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="space-y-2">
                        <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        <div className="flex gap-2">
                            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </div>
                    </div>
                </div>
                <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>

            {/* Description Skeleton */}
            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />

            {/* Tab Bar Skeleton */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6 pb-px">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                ))}
            </div>

            {/* Tasks Section Skeleton */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-4 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                </div>
                                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-805 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { membership } = useOrganization();
    
    const tab = searchParams.get('tab') || "tasks";
    const id = searchParams.get('id') || "";

    const projects = useSelector((state: any) => state?.workspace?.currentWorkspace?.projects || []);
    const loading = useSelector((state: any) => state?.workspace?.loading);

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [showCreateTask, setShowCreateTask] = useState(false);

    const isAdmin = membership?.role === "org:admin";

    useEffect(() => {
        if (projects && projects.length > 0 && id) {
            const proj = projects.find((p: any) => p.id === id);
            setProject(proj);
            setTasks(proj?.tasks || []);
        }
    }, [id, projects]);

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        router.push(`/projectsDetail?${params.toString()}`);
    };

    const statusColors: Record<string, string> = {
        PLANNING: "bg-zinc-200 text-zinc-900 dark:bg-zinc-600 dark:text-zinc-200",
        ACTIVE: "bg-emerald-200 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-900",
        ON_HOLD: "bg-amber-200 text-amber-900 dark:bg-amber-500 dark:text-amber-900",
        COMPLETED: "bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-blue-900",
        CANCELLED: "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-900",
    };

    if (loading) return <ProjectDetailSkeleton />;

    if (!project) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <p className="text-3xl md:text-5xl mt-40 mb-10">Project not found</p>
                <button onClick={() => router.push('/projects')} className="mt-4 px-4 py-2 rounded bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 cursor-pointer" >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-6xl mx-auto text-zinc-900 dark:text-white">
            {/* Header */}
            <div className="flex max-md:flex-col gap-4 flex-wrap items-start justify-between max-w-6xl">
                <div className="flex items-center gap-4">
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-pointer" onClick={() => router.push('/projects')}>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold">{project.name}</h1>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${statusColors[project.status] || ''}`} >
                            {project.status.replace("_", " ")}
                        </span>
                    </div>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowCreateTask(true)} className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:opacity-90 transition" >
                        <PlusIcon className="size-4" />
                        New Task
                    </button>
                )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-6">
                {[
                    { label: "Total Tasks", value: tasks.length, color: "text-zinc-900 dark:text-white" },
                    { label: "Completed", value: tasks.filter((t) => t.status === "DONE").length, color: "text-emerald-700 dark:text-emerald-400" },
                    { label: "In Progress", value: tasks.filter((t) => t.status === "IN_PROGRESS").length, color: "text-amber-700 dark:text-amber-400" },
                    { label: "Team Members", value: project.members?.length || 0, color: "text-blue-700 dark:text-blue-400" },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex justify-between sm:min-w-60 p-4 py-2.5 rounded">
                        <div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">{card.label}</div>
                            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                        </div>
                        <ZapIcon className={`size-4 ${card.color}`} />
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div>
                <div className="inline-flex flex-wrap max-sm:grid grid-cols-3 gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                    {[
                        { key: "tasks", label: "Tasks", icon: FileStackIcon },
                        { key: "calendar", label: "Calendar", icon: CalendarIcon },
                        { key: "analytics", label: "Analytics", icon: BarChart3Icon },
                        { key: "settings", label: "Settings", icon: SettingsIcon },
                    ].map((tabItem) => (
                        <button key={tabItem.key} onClick={() => handleTabChange(tabItem.key)} className={`flex items-center gap-2 px-4 py-2 text-sm transition-all cursor-pointer ${tab === tabItem.key ? "bg-zinc-100 dark:bg-zinc-800/80 font-medium" : "hover:bg-zinc-50 dark:hover:bg-zinc-700"}`} >
                            <tabItem.icon className="size-3.5" />
                            {tabItem.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {tab === "tasks" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectTasks tasks={tasks} />
                        </div>
                    )}
                    {tab === "analytics" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectAnalytics tasks={tasks} project={project} />
                        </div>
                    )}
                    {tab === "calendar" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectCalendar tasks={tasks} />
                        </div>
                    )}
                    {tab === "settings" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectSettings project={project} />
                        </div>
                    )}
                </div>
            </div>

            {/* Create Task Modal */}
            {isAdmin && showCreateTask && <CreateTaskDialog showCreateTask={showCreateTask} setShowCreateTask={setShowCreateTask} projectId={id} />}
        </div>
    );
}

export default function ProjectDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
                <p className="text-zinc-500">Loading project details...</p>
            </div>
        }>
            <ProjectDetailContent />
        </Suspense>
    );
}
