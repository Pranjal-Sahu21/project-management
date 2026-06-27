"use client";

import { useState, useEffect, useRef } from "react";
import { SearchIcon, PanelLeft, MoonIcon, SunIcon, Folder, CheckSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/themeSlice';
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setIsSidebarOpen }: NavbarProps) => {
    const dispatch = useDispatch();
    const theme = useSelector((state: any) => state.theme.theme);
    const currentWorkspace = useSelector((state: any) => state?.workspace?.currentWorkspace || null);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [placeholder, setPlaceholder] = useState("Search...");
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset active index when search query changes
    useEffect(() => {
        setActiveIndex(-1);
    }, [searchQuery]);

    // Dynamic placeholder on mobile resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setPlaceholder("Search...");
            } else {
                setPlaceholder("Search projects, tasks...");
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus input on Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Get matching projects and tasks
    const projects = currentWorkspace?.projects || [];
    const filteredProjects = searchQuery.trim() === "" 
        ? [] 
        : projects.filter((project: any) => 
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );

    const filteredTasks = searchQuery.trim() === ""
        ? []
        : projects.flatMap((project: any) => 
            (project.tasks || []).map((task: any) => ({
                ...task,
                projectName: project.name,
                projectId: project.id
            }))
          ).filter((task: any) => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );

    const hasResults = filteredProjects.length > 0 || filteredTasks.length > 0;

    const combinedResults = [
        ...filteredProjects.map((p: any) => ({ ...p, searchType: "project" })),
        ...filteredTasks.map((t: any) => ({ ...t, searchType: "task" }))
    ];

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isDropdownOpen || combinedResults.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % combinedResults.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + combinedResults.length) % combinedResults.length);
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && activeIndex < combinedResults.length) {
                e.preventDefault();
                const selected = combinedResults[activeIndex];
                if (selected.searchType === "project") {
                    router.push(`/projectsDetail?id=${selected.id}`);
                } else {
                    router.push(`/taskDetails?projectId=${selected.projectId}&taskId=${selected.id}`);
                }
                setSearchQuery("");
                setIsDropdownOpen(false);
            }
        } else if (e.key === "Escape") {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto gap-4">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <PanelLeft size={20} />
                    </button>

                    {/* Search Input */}
                    <div ref={searchRef} className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            onKeyDown={handleSearchKeyDown}
                            className="pl-8 pr-12 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 border border-gray-200 dark:border-zinc-700/80 rounded bg-gray-50 dark:bg-zinc-800 text-[10px] text-gray-450 dark:text-zinc-555 font-sans pointer-events-none select-none">
                            <span className="text-[9px]">Ctrl + K</span>
                        </div>

                        {/* Search Results Dropdown */}
                        {isDropdownOpen && searchQuery.trim() !== "" && (
                            <div className="absolute left-0 right-0 mt-2 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 py-2 text-sm text-gray-900 dark:text-white animate-in fade-in slide-in-from-top-1 duration-150">
                                {hasResults ? (
                                    <>
                                        {/* Projects Section */}
                                        {filteredProjects.length > 0 && (
                                            <div className="mb-2">
                                                <div className="px-3 py-1 text-xs font-semibold text-gray-450 dark:text-zinc-555 uppercase tracking-wider">
                                                    Projects
                                                </div>
                                                {filteredProjects.map((project: any, pIdx: number) => {
                                                    const overallIdx = pIdx;
                                                    const isActive = overallIdx === activeIndex;
                                                    return (
                                                        <button
                                                            key={project.id}
                                                            onClick={() => {
                                                                router.push(`/projectsDetail?id=${project.id}`);
                                                                setSearchQuery("");
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 flex items-center gap-2.5 transition-colors cursor-pointer ${isActive ? "bg-gray-100 dark:bg-zinc-800/85 text-zinc-950 dark:text-white font-medium" : "hover:bg-gray-55 dark:hover:bg-zinc-900/60"}`}
                                                        >
                                                            <Folder className="size-4 text-blue-500 shrink-0" />
                                                            <div className="min-w-0">
                                                                <div className="font-medium truncate">{project.name}</div>
                                                                {project.description && (
                                                                    <div className="text-xs text-gray-500 dark:text-zinc-500 truncate">
                                                                        {project.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Tasks Section */}
                                        {filteredTasks.length > 0 && (
                                            <div>
                                                <div className="px-3 py-1 text-xs font-semibold text-gray-450 dark:text-zinc-555 uppercase tracking-wider">
                                                    Tasks
                                                </div>
                                                {filteredTasks.map((task: any, tIdx: number) => {
                                                    const overallIdx = filteredProjects.length + tIdx;
                                                    const isActive = overallIdx === activeIndex;
                                                    return (
                                                        <button
                                                            key={task.id}
                                                            onClick={() => {
                                                                router.push(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`);
                                                                setSearchQuery("");
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 flex items-center gap-2.5 transition-colors cursor-pointer ${isActive ? "bg-gray-100 dark:bg-zinc-800/85 text-zinc-950 dark:text-white font-medium" : "hover:bg-gray-55 dark:hover:bg-zinc-900/60"}`}
                                                        >
                                                            <CheckSquare className="size-4 text-green-500 shrink-0" />
                                                            <div className="min-w-0">
                                                                <div className="font-medium truncate">{task.title}</div>
                                                                <div className="text-xs text-gray-500 dark:text-zinc-500 truncate">
                                                                    Project: {task.projectName}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="px-4 py-3 text-center text-gray-500 dark:text-zinc-500">
                                        No results found for &ldquo;{searchQuery}&rdquo;
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button onClick={() => dispatch(toggleTheme())} className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95 cursor-pointer">
                        {
                            theme === "light"
                                ? (<MoonIcon className="size-4 text-gray-800 dark:text-gray-200" />)
                                : (<SunIcon className="size-4 text-yellow-400" />)
                        }
                    </button>

                    {/* Clerk User Button / Sign In / Sign Up */}
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                    <Show when="signed-out">
                        <div className="flex gap-2">
                            <SignInButton mode="modal">
                                <button className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
