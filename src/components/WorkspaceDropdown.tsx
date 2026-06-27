"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace, fetchWorkspaces } from "../features/workspaceSlice";
import { useRouter } from "next/navigation";
import { CreateOrganization, useOrganizationList, useAuth, useOrganization } from "@clerk/nextjs";

function WorkspaceDropdown() {
    const router = useRouter();
    const dispatch = useDispatch();

    const currentWorkspace = useSelector((state: any) => state.workspace?.currentWorkspace || null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { getToken } = useAuth();
    const { organization } = useOrganization();
    const prevOrgIdRef = useRef(organization?.id);

    const { setActive, userMemberships } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Automatically close workspace modal and refresh Redux store when organization is created
    useEffect(() => {
        if (isCreateOpen && organization && organization.id !== prevOrgIdRef.current) {
            setIsCreateOpen(false);
            setIsOpen(false);
            setTimeout(() => {
                dispatch((fetchWorkspaces as any)({ getToken }));
            }, 1000);
        }
        prevOrgIdRef.current = organization?.id;
    }, [organization, isCreateOpen, dispatch, getToken]);

    const onSelectWorkspace = async (organizationId: string) => {
        if (setActive) {
            await setActive({ organization: organizationId });
        }
        dispatch(setCurrentWorkspace(organizationId));
        setIsOpen(false);
        router.push('/');
    };

    const currentImg = currentWorkspace?.image_url?.src || currentWorkspace?.image_url;
    const workspaceCount = userMemberships.data?.length || 0;

    return (
        <div className="relative m-4" ref={dropdownRef}>
            <button onClick={() => setIsOpen(prev => !prev)} className="w-full flex items-center justify-between p-3 h-auto text-left rounded hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer" >
                <div className="flex items-center gap-3">
                    {currentImg && <img src={currentImg} alt={currentWorkspace?.name} className="w-8 h-8 rounded shadow" />}
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {currentWorkspace?.name || "Select Workspace"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                            {workspaceCount} workspace{workspaceCount !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-lg top-full left-0">
                    <div className="p-2">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
                            Workspaces
                        </p>
                        {userMemberships.data?.map((membership) => {
                            const ws = membership.organization;
                            const wsImg = ws.imageUrl;
                            const isAdmin = membership.role === "org:admin" || membership.role === "admin";
                            return (
                                <div key={ws.id} onClick={() => onSelectWorkspace(ws.id)} className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                                    {wsImg && <img src={wsImg} alt={ws.name} className="w-6 h-6 rounded" />}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {ws.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate capitalize font-medium">
                                            {isAdmin ? "Admin" : "Member"}
                                        </p>
                                    </div>
                                    {currentWorkspace?.id === ws.id && (
                                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <hr className="border-gray-200 dark:border-zinc-700" />

                    <div className="p-2 cursor-pointer rounded group hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={() => setIsCreateOpen(true)}>
                        <p className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
                            <Plus className="w-4 h-4" /> Create Workspace
                        </p>
                    </div>
                </div>
            )}

            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50 p-4" onClick={() => setIsCreateOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="relative">
                        <button className="absolute -top-3 -right-3 p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full cursor-pointer z-[51] shadow" onClick={() => setIsCreateOpen(false)} >
                            <X className="size-4" />
                        </button>
                        <CreateOrganization 
                            routing="hash"
                            afterCreateOrganizationUrl="/"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceDropdown;
