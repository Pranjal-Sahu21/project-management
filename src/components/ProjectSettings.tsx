"use client";

import { format } from "date-fns";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import AddProjectMember from "./AddProjectMember";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkspace } from "../features/workspaceSlice";
import { toast } from "react-hot-toast";

interface ProjectSettingsProps {
  project: any;
}

export default function ProjectSettings({ project }: ProjectSettingsProps) {
    const dispatch = useDispatch();
    const currentWorkspace = useSelector((state: any) => state.workspace?.currentWorkspace || null);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        progress: 0,
        team_lead: "",
        workspaceId: "",
        members: [] as any[],
        tasks: [] as any[]
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                id: project.id || "",
                name: project.name || "",
                description: project.description || "",
                status: project.status || "PLANNING",
                priority: project.priority || "MEDIUM",
                start_date: project.start_date || "",
                end_date: project.end_date || "",
                progress: project.progress || 0,
                team_lead: project.team_lead || "",
                workspaceId: project.workspaceId || "",
                members: project.members || [],
                tasks: project.tasks || []
            });
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace) return;

        setIsSubmitting(true);
        try {
            // Update the project in the workspace projects list
            const updatedProjects = currentWorkspace.projects.map((p: any) => {
                if (p.id === formData.id) {
                    return {
                        ...p,
                        name: formData.name,
                        description: formData.description,
                        status: formData.status,
                        priority: formData.priority,
                        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : p.start_date,
                        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : p.end_date,
                        progress: formData.progress,
                    };
                }
                return p;
            });

            const updatedWorkspace = {
                ...currentWorkspace,
                projects: updatedProjects
            };

            dispatch(updateWorkspace(updatedWorkspace));
            toast.success("Project settings updated successfully!");
        } catch (error) {
            toast.error("Failed to update project settings");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return "";
        try {
            return format(new Date(dateStr), "yyyy-MM-dd");
        } catch (e) {
            return "";
        }
    };

    const inputClasses = "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500";
    const cardClasses = "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";
    const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400 font-medium";

    if (!project) return null;

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <div className={cardClasses}>
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">Project Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Project Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClasses} required />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClasses + " h-24"} />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>Status</label>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClasses} >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>Priority</label>
                            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={inputClasses} >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>Start Date</label>
                            <input type="date" value={formatDateForInput(formData.start_date)} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className={inputClasses} />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClasses}>End Date</label>
                            <input type="date" value={formatDateForInput(formData.end_date)} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className={inputClasses} />
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Progress: {formData.progress}%</label>
                        <input type="range" min="0" max="100" step="5" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} className="w-full accent-blue-500 dark:accent-blue-400 mt-2 cursor-pointer" />
                    </div>

                    {/* Save Button */}
                    <button type="submit" disabled={isSubmitting} className="ml-auto flex items-center text-sm justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded cursor-pointer" >
                        <Save className="size-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
                <div className={cardClasses}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300">
                            Team Members <span className="text-sm text-zinc-600 dark:text-zinc-400">({formData.members.length})</span>
                        </h2>
                        <button type="button" onClick={() => setIsDialogOpen(true)} className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" >
                            <Plus className="size-4 text-zinc-900 dark:text-zinc-300" />
                        </button>
                        <AddProjectMember isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>

                    {/* Member List */}
                    {formData.members.length > 0 && (
                        <div className="space-y-2 mt-4 max-h-56 overflow-y-auto no-scrollbar">
                            {formData.members.map((member, index) => (
                                <div key={index} className="flex items-center justify-between px-3 py-2 rounded dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-300" >
                                    <span> {member?.user?.email || "Unknown"} </span>
                                    {formData.team_lead === member.user?.id && <span className="px-2 py-0.5 rounded text-xs ring-1 ring-zinc-200 dark:ring-zinc-600 bg-zinc-100 dark:bg-zinc-700 font-medium">Team Lead</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
