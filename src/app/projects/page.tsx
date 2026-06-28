"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Search, FolderOpen } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import ProjectCard from "../../components/ProjectCard";
import CreateProjectDialog from "../../components/CreateProjectDialog";

function ProjectsSkeleton() {
    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-pulse select-none">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                    <div className="h-7 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-52 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-9 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>

            {/* Search and Filters Skeleton */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="h-9 w-full max-w-sm bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>

            {/* Projects Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md space-y-4">
                        <div className="space-y-2">
                            <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            <div className="h-3.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                            <div className="h-3.5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-3 w-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            </div>
                            <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            <div className="h-3.5 w-12 bg-zinc-205 dark:bg-zinc-800 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const { membership } = useOrganization();
    const projects = useSelector(
        (state: any) => state?.workspace?.currentWorkspace?.projects || []
    );
    const loading = useSelector((state: any) => state?.workspace?.loading);

    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "ALL",
        priority: "ALL",
    });

    const isAdmin = membership?.role === "org:admin";

    const filterProjects = () => {
        let filtered = [...projects];

        if (searchTerm) {
            filtered = filtered.filter(
                (project) =>
                    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.status !== "ALL") {
            filtered = filtered.filter((project) => project.status === filters.status);
        }

        if (filters.priority !== "ALL") {
            filtered = filtered.filter(
                (project) => project.priority === filters.priority
            );
        }

        setFilteredProjects(filtered);
    };

    useEffect(() => {
        filterProjects();
    }, [projects, searchTerm, filters]);

    if (loading) return <ProjectsSkeleton />;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1"> Projects </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm"> Manage and track your projects </p>
                </div>
                {isAdmin && (
                    <>
                        <button onClick={() => setIsDialogOpen(true)} className="flex items-center px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition cursor-pointer" >
                            <Plus className="size-4 mr-2" /> New Project
                        </button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </>
                )}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-400 w-4 h-4" />
                    <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className="w-full pl-10 text-sm pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:border-blue-500 outline-none" placeholder="Search projects..." />
                </div>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none" >
                    <option value="ALL" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">All Status</option>
                    <option value="ACTIVE" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">Active</option>
                    <option value="PLANNING" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">Planning</option>
                    <option value="COMPLETED" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">Completed</option>
                    <option value="ON_HOLD" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">On Hold</option>
                    <option value="CANCELLED" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">Cancelled</option>
                </select>
                <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none" >
                    <option value="ALL" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">All Priority</option>
                    <option value="HIGH" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">High</option>
                    <option value="MEDIUM" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">Medium</option>
                    <option value="LOW" className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">Low</option>
                </select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    projects.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                <FolderOpen className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No projects found
                            </h3>
                            <p className="text-gray-500 dark:text-zinc-400 mb-6 text-sm">
                                {isAdmin ? "Create your first project to get started" : "Ask your workspace administrator to create a project to get started."}
                            </p>
                            {isAdmin && (
                                <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mx-auto text-sm cursor-pointer" >
                                    <Plus className="size-4" />
                                    Create Project
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                <FolderOpen className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                This project doesn&apos;t exist
                            </h3>
                            <p className="text-gray-500 dark:text-zinc-400 text-sm">
                                Try adjusting your search term or filters to find what you&apos;re looking for.
                            </p>
                        </div>
                    )
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>
        </div>
    );
}
