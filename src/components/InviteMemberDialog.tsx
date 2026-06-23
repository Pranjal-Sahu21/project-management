"use client";

import { useState } from "react";
import { Mail, UserPlus, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkspace } from "../features/workspaceSlice";
import { toast } from "react-hot-toast";

interface InviteMemberDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteMemberDialog = ({ isDialogOpen, setIsDialogOpen }: InviteMemberDialogProps) => {
    const dispatch = useDispatch();
    const currentWorkspace = useSelector((state: any) => state.workspace?.currentWorkspace || null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        role: "MEMBER",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }

        setIsSubmitting(true);
        try {
            // Check if member already exists
            const exists = currentWorkspace?.members?.some((m: any) => m.user.email === formData.email);
            if (exists) {
                toast.error("Member already in workspace");
                return;
            }

            const memberId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
            const userId = "user_" + Math.random().toString(36).substring(2, 9);

            const newMember = {
                id: memberId,
                userId: userId,
                workspaceId: currentWorkspace.id,
                message: "",
                role: formData.role,
                user: {
                    id: userId,
                    name: formData.email.split('@')[0],
                    email: formData.email,
                    image: null
                }
            };

            const updatedWorkspace = {
                ...currentWorkspace,
                members: [...currentWorkspace.members, newMember]
            };

            dispatch(updateWorkspace(updatedWorkspace));
            toast.success("Invitation sent & member added successfully!");
            setIsDialogOpen(false);
            setFormData({
                email: "",
                role: "MEMBER",
            });
        } catch (error) {
            toast.error("Failed to send invitation");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200 relative">
                <button className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer" onClick={() => setIsDialogOpen(false)} >
                    <XIcon className="size-5" />
                </button>

                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Invite Team Member
                    </h2>
                    {currentWorkspace && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                            Inviting to workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
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
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email address" className="pl-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 py-2 focus:outline-none focus:border-blue-500" required />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Role</label>
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 py-2 px-3 mt-1 focus:outline-none focus:border-blue-500 text-sm" >
                            <option value="MEMBER" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200">Member</option>
                            <option value="ADMIN" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200">Admin</option>
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsDialogOpen(false)} className="px-5 py-2 rounded text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting || !currentWorkspace} className="px-5 py-2 rounded text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 hover:opacity-90 transition cursor-pointer" >
                            {isSubmitting ? "Sending..." : "Send Invitation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberDialog;
