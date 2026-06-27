"use client";

import { CreateOrganization, SignOutButton, useOrganization, useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchWorkspaces } from "../features/workspaceSlice";

export default function CreateWorkspaceModal() {
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const { organization } = useOrganization();
    const prevOrgIdRef = useRef(organization?.id);

    useEffect(() => {
        if (organization && organization.id !== prevOrgIdRef.current) {
            // Refresh workspaces after a short delay to auto-close the modal
            setTimeout(() => {
                dispatch((fetchWorkspaces as any)({ getToken }));
            }, 1000);
        }
        prevOrgIdRef.current = organization?.id;
    }, [organization, dispatch, getToken]);

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-left z-[9999] p-4">
            <div className="space-y-4 flex flex-col items-center">
                <CreateOrganization 
                    routing="hash"
                    afterCreateOrganizationUrl="/"
                />
                <SignOutButton>
                    <button type="button" className="text-zinc-400 hover:text-zinc-200 text-sm font-semibold underline cursor-pointer transition">
                        Sign out of account
                    </button>
                </SignOutButton>
            </div>
        </div>
    );
}
