"use client";

import { useState } from "react";
import { Mail, UserPlus, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { updateWorkspace } from "../features/workspaceSlice";
import { toast } from "react-hot-toast";

interface AddProjectMemberProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }: AddProjectMemberProps) => {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id');

    const currentWorkspace = useSelector((state: any) => state.workspace?.currentWorkspace || null);
    const project = currentWorkspace?.projects.find((p: any) => p.id === projectId);
    const projectMembersEmails = project?.members.map((member: any) => member.user.email) || [];

    const [email, setEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please select a member");
            return;
        }

        setIsAdding(true);
        try {
            const wsMember = currentWorkspace?.members?.find((m: any) => m.user.email === email);
            if (!wsMember) {
                toast.error("Member not found in workspace");
                return;
            }

            const newMember = {
                id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
                userId: wsMember.userId,
                projectId: projectId,
                user: wsMember.user
            };

            const updatedProjects = currentWorkspace.projects.map((p: any) => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        members: [...p.members, newMember]
                    };
                }
                return p;
            });

            const updatedWorkspace = {
                ...currentWorkspace,
                projects: updatedProjects
            };

            dispatch(updateWorkspace(updatedWorkspace));
            toast.success("Member added to project successfully!");
            setIsDialogOpen(false);
            setEmail('');
        } catch (error) {
            toast.error("Failed to add member to project");
        } finally {
            setIsAdding(false);
        }
    };

    if (!isDialogOpen || !project) return null;

    const availableMembers = currentWorkspace?.members?.filter((member: any) => 
        !projectMembersEmails.includes(member.user.email)
    ) || [];

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200 relative">
                <button className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer" onClick={() => setIsDialogOpen(false)} >
                    <XIcon className="size-5" />
                </button>

                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Add Member to Project
                    </h2>
                    {project && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-400 mt-1">
                            Adding to Project: <span className="text-blue-600 dark:text-blue-400">{project.name}</span>
                        </p>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 w-4 h-4" />
                            <select value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required >
                                <option value="">Select a member</option>
                                {availableMembers.map((member: any) => (
                                    <option key={member.user.id} value={member.user.email}>
                                        {member.user.name} ({member.user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsDialogOpen(false)} className="px-5 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isAdding || !currentWorkspace} className="px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white disabled:opacity-50 transition cursor-pointer" >
                            {isAdding ? "Adding..." : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectMember;
