"use client";

import { useState, useEffect, createContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { loadTheme } from '../features/themeSlice';
import { fetchWorkspaces, setLoading, setCurrentWorkspace } from '../features/workspaceSlice';
import { Toaster } from 'react-hot-toast';
import { Show, useAuth, useOrganization, useOrganizationList } from '@clerk/nextjs';
import CreateWorkspaceModal from './CreateWorkspaceModal';

export const LayoutContext = createContext<{
    hideSidebarAndNavbar: boolean;
    setHideSidebarAndNavbar: (val: boolean) => void;
}>({
    hideSidebarAndNavbar: false,
    setHideSidebarAndNavbar: () => {},
});

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [hideSidebarAndNavbar, setHideSidebarAndNavbar] = useState(false);
    const { workspaces, loading } = useSelector((state: any) => state.workspace);
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { organization } = useOrganization();
    const dispatch = useDispatch();

    const { setActive, userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    // Initial load of theme and mount flag
    useEffect(() => {
        dispatch(loadTheme());
        setIsMounted(true);
    }, [dispatch]);

    // Automatically switch active organization if they leave the current active one but have others
    useEffect(() => {
        if (isLoaded && isSignedIn && !organization && userMemberships.data && userMemberships.data.length > 0) {
            const firstOrg = userMemberships.data[0].organization;
            if (setActive) {
                setActive({ organization: firstOrg.id });
            }
        }
    }, [organization, userMemberships.data, isLoaded, isSignedIn, setActive]);

    // Keep Redux currentWorkspace in sync with Clerk's active organization immediately
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            if (organization) {
                dispatch(setCurrentWorkspace(organization.id));
            } else {
                dispatch(setCurrentWorkspace(null));
            }
        }
    }, [organization?.id, isLoaded, isSignedIn, workspaces, dispatch]);

    // Load workspaces from backend API on mount or when active organization changes
    useEffect(() => {
        if (isMounted && isLoaded) {
            if (isSignedIn) {
                dispatch((fetchWorkspaces as any)({ getToken }));
            } else {
                // If user is not signed in, disable loading screen right away
                dispatch(setLoading(false));
            }
        }
    }, [isMounted, isLoaded, isSignedIn, organization?.id, dispatch]);

    // If active organization is not in our database workspaces list, trigger a refetch after a short delay to sync
    useEffect(() => {
        if (isLoaded && isSignedIn && organization) {
            const hasOrg = workspaces.some((w: any) => w.id === organization.id);
            if (!hasOrg) {
                const timer = setTimeout(() => {
                    dispatch((fetchWorkspaces as any)({ getToken }));
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [organization?.id, workspaces, isLoaded, isSignedIn, dispatch, getToken]);

    // If Clerk is still loading, show a blank background
    if (!isLoaded || (isSignedIn && loading && workspaces.length === 0)) {
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

    const hasNoWorkspaces = (workspaces.length === 0) || (isOrgListLoaded && userMemberships.data && userMemberships.data.length === 0);

    return (
        <LayoutContext.Provider value={{ hideSidebarAndNavbar, setHideSidebarAndNavbar }}>
            <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100 min-h-screen">
                <Toaster position="top-right" />
                
                {hideSidebarAndNavbar ? (
                    <div className="w-full min-h-screen">
                        {children}
                    </div>
                ) : (
                    <>
                        <Show when="signed-in">
                            {hasNoWorkspaces && <CreateWorkspaceModal />}
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
                    </>
                )}
            </div>
        </LayoutContext.Provider>
    );
}
