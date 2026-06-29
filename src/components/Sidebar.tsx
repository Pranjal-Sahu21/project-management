"use client";

import { useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MyTasksSidebar from './MyTasksSidebar';
import ProjectSidebar from './ProjectsSidebar';
import WorkspaceDropdown from './WorkspaceDropdown';
import { FolderOpenIcon, HelpCircleIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
        { name: 'Projects', href: '/projects', icon: FolderOpenIcon },
        { name: 'Team', href: '/team', icon: UsersIcon },
    ];

    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsSidebarOpen]);

    return (
        <div ref={sidebarRef} className={`z-10 bg-white dark:bg-zinc-900 min-w-68 flex flex-col h-screen border-r border-gray-200 dark:border-zinc-800 max-sm:absolute transition-all ${isSidebarOpen ? 'left-0' : '-left-full sm:left-0'} `} >
            <WorkspaceDropdown />
            <hr className='border-gray-200 dark:border-zinc-800' />
            <div className='flex-1 overflow-y-auto no-scrollbar flex flex-col'>
                <div>
                    <div className='p-4'>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link href={item.href} key={item.name} className={`flex items-center gap-3 py-2 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded transition-all ${isActive ? 'bg-gray-100 dark:bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-800/50 dark:ring-zinc-800' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/60'}`} >
                                    <item.icon size={16} />
                                    <p className='text-sm truncate'>{item.name}</p>
                                </Link>
                            );
                        })}
                        <Link href="/settings" className={`flex w-full items-center gap-3 py-2 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded transition-all ${pathname === '/settings' ? 'bg-gray-100 dark:bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-800/50 dark:ring-zinc-800' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/60'}`}>
                            <SettingsIcon size={16} />
                            <p className='text-sm truncate'>Settings</p>
                        </Link>
                        <Link href="/contact" className={`flex w-full items-center gap-3 py-2 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded transition-all ${pathname === '/contact' ? 'bg-gray-100 dark:bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-800/50 dark:ring-zinc-800' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/60'}`}>
                            <HelpCircleIcon size={16} />
                            <p className='text-sm truncate'>Contact Us</p>
                        </Link>
                    </div>
                    <MyTasksSidebar />
                    <Suspense fallback={<div className="px-6 py-2 text-xs text-zinc-500">Loading projects...</div>}>
                        <ProjectSidebar />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
