"use client";

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { loadTheme } from '../features/themeSlice';
import { fetchWorkspaces, setLoading } from '../features/workspaceSlice';
import { Toaster } from 'react-hot-toast';
import { Show, useAuth } from '@clerk/nextjs';
import CreateWorkspaceModal from './CreateWorkspaceModal';

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { workspaces, loading } = useSelector((state: any) => state.workspace);
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const dispatch = useDispatch();

    // Initial load of theme and mount flag
    useEffect(() => {
        dispatch(loadTheme());
        setIsMounted(true);
    }, [dispatch]);

    // Load workspaces from backend API on mount
    useEffect(() => {
        if (isMounted && isLoaded) {
            if (isSignedIn) {
                dispatch((fetchWorkspaces as any)({ getToken }));
            } else {
                // If user is not signed in, disable loading screen right away
                dispatch(setLoading(false));
            }
        }
    }, [isMounted, isLoaded, isSignedIn, dispatch]);

    // If Clerk is still loading, show a blank background
    if (!isLoaded || (isSignedIn && loading)) {
        return <div className="h-screen bg-white dark:bg-zinc-950" />;
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
                {workspaces.length === 0 && <CreateWorkspaceModal />}
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-auto no-scrollbar">
                        {children}
                    </div>
                </div>
            </Show>
            
            <Show when="signed-out">
                <div className="w-full min-h-screen">
                    {children}
                </div>
            </Show>
        </div>
    );
}
