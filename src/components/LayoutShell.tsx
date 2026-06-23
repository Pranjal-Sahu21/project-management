"use client";

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { loadTheme } from '../features/themeSlice';
import { Loader2Icon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { loading } = useSelector((state: any) => state.workspace);
    const dispatch = useDispatch();

    // Initial load of theme
    useEffect(() => {
        dispatch(loadTheme());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100 min-h-screen">
            <Toaster position="top-right" />
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
