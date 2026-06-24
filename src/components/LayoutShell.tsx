"use client";

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { loadTheme } from '../features/themeSlice';
import { setWorkspaces, setCurrentWorkspace } from '../features/workspaceSlice';
import { Loader2Icon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Show } from '@clerk/nextjs';

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { loading } = useSelector((state: any) => state.workspace);
    const dispatch = useDispatch();

    // Initial load of theme and mount flag
    useEffect(() => {
        dispatch(loadTheme());
        setIsMounted(true);
    }, [dispatch]);

    // Load workspaces from backend API on mount
    useEffect(() => {
        if (isMounted) {
            const fetchWorkspaces = async () => {
                try {
                    const res = await fetch("/api/workspace");
                    if (res.ok) {
                        const data = await res.json();
                        dispatch(setWorkspaces(data));
                        
                        // Restore current workspace from localStorage if possible
                        const savedWsId = localStorage.getItem("currentWorkspaceId");
                        if (savedWsId && data.some((ws: any) => ws.id === savedWsId)) {
                            dispatch(setCurrentWorkspace(savedWsId));
                        } else if (data.length > 0) {
                            dispatch(setCurrentWorkspace(data[0].id));
                        }
                    }
                } catch (error) {
                    console.error("Error fetching workspaces:", error);
                }
            };
            fetchWorkspaces();
        }
    }, [isMounted, dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100 min-h-screen">
                <Toaster position="top-right" />
                <div className="flex-1 flex items-center justify-center h-screen overflow-y-auto">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100 min-h-screen">
            <Toaster position="top-right" />
            
            <Show when="signed-in">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-auto no-scrollbar">
                        {children}
                    </div>
                </div>
            </Show>
            
            <Show when="signed-out">
                <div className="flex-1 flex items-center justify-center h-screen overflow-y-auto">
                    {children}
                </div>
            </Show>
        </div>
    );
}
