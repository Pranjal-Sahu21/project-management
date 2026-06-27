"use client";

import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarIcon, MessageCircle, PenIcon, XIcon } from "lucide-react";
import { assets } from "../../assets/assets";
import { useUser } from "@clerk/nextjs";
import { updateTask } from "../../features/workspaceSlice";

const TaskDetailsContent = () => {
    const dispatch = useDispatch();
    const { user } = useUser();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") || "";
    const taskId = searchParams.get("taskId") || "";

    const [task, setTask] = useState<any>(null);
    const [project, setProject] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const commentsEndRef = useRef<HTMLDivElement>(null);
    const prevCommentsLengthRef = useRef(0);
    const loadedTaskIdRef = useRef<string | null>(null);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        assigneeId: "",
        due_date: "",
    });

    const { currentWorkspace } = useSelector((state: any) => state.workspace);
    const currentUserMember = currentWorkspace?.members?.find((m: any) => m.userId === user?.id);
    const isAdmin = currentUserMember?.role === "ADMIN";

    const fetchComments = async (isInitial = false) => {
        if (!taskId) return;
        
        const shouldShowLoading = isInitial && loadedTaskIdRef.current !== taskId;
        if (shouldShowLoading) {
            setCommentsLoading(true);
        }

        try {
            const res = await fetch(`/api/comments?taskId=${taskId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
                loadedTaskIdRef.current = taskId;
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            if (shouldShowLoading) {
                setCommentsLoading(false);
            }
        }
    };

    const fetchTaskDetails = async () => {
        setLoading(true);
        if (!projectId || !taskId || !currentWorkspace) return;

        const proj = currentWorkspace.projects.find((p: any) => p.id === projectId);
        if (!proj) return;

        const tsk = proj.tasks.find((t: any) => t.id === taskId);
        if (!tsk) return;

        setTask(tsk);
        setProject(proj);
        setLoading(false);
    };

    // Pre-fill form when task details are loaded
    useEffect(() => {
        if (task) {
            setEditForm({
                title: task.title || "",
                description: task.description || "",
                type: task.type || "TASK",
                status: task.status || "TODO",
                priority: task.priority || "MEDIUM",
                assigneeId: task.assigneeId || "",
                due_date: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd") : "",
            });
        }
    }, [task]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !taskId) return;

        try {
            toast.loading("Adding comment...");
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId,
                    content: newComment,
                }),
            });

            if (res.ok) {
                const comment = await res.json();
                setComments((prev) => [...prev, comment]);
                setNewComment("");
                toast.dismiss();
                toast.success("Comment added.");
            } else {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to add comment");
            }
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Failed to add comment");
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.title.trim()) {
            toast.error("Task title is required");
            return;
        }

        setIsUpdating(true);
        try {
            toast.loading("Saving task changes...");
            const res = await fetch("/api/tasks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: taskId,
                    title: editForm.title,
                    description: editForm.description,
                    status: editForm.status,
                    type: editForm.type,
                    priority: editForm.priority,
                    assigneeId: editForm.assigneeId || null,
                    due_date: editForm.due_date ? new Date(editForm.due_date).toISOString() : null,
                }),
            });

            if (res.ok) {
                const updatedTask = await res.json();
                dispatch(updateTask(updatedTask));
                setTask(updatedTask);
                setIsEditOpen(false);
                toast.dismiss();
                toast.success("Task updated successfully!");
            } else {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to update task");
            }
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Failed to update task");
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId, projectId, currentWorkspace]);

    useEffect(() => {
        if (taskId && task) {
            fetchComments(true);
            const interval = setInterval(() => { fetchComments(); }, 3000);
            return () => clearInterval(interval);
        }
    }, [taskId, task]);

    // Scroll to bottom of comments when length changes
    useEffect(() => {
        if (comments.length > 0 && comments.length !== prevCommentsLengthRef.current) {
            commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
            prevCommentsLengthRef.current = comments.length;
        }
    }, [comments]);

    if (loading) return <div className="text-gray-500 dark:text-zinc-400 px-4 py-6">Loading task details...</div>;
    if (!task) return <div className="text-red-500 px-4 py-6">Task not found.</div>;

    const assigneeImg = task.assignee?.image?.src || task.assignee?.image;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-gray-900 dark:text-zinc-100 max-w-6xl mx-auto">
            {/* Left: Comments / Chatbox */}
            <div className="w-full lg:w-2/3">
                <div className="p-5 rounded-md border border-gray-300 dark:border-zinc-800 flex flex-col lg:h-[80vh]">
                    <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                        <MessageCircle className="size-5" /> Task Discussion ({comments.length})
                    </h2>

                    <div className="flex-1 overflow-y-auto mb-4 pr-1">
                        {commentsLoading ? (
                            <div className="flex flex-col gap-4 mb-6 mr-2">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className={`w-[70%] border border-zinc-200 dark:border-zinc-800 p-3 rounded-md animate-pulse ${n % 2 === 0 ? "ml-auto bg-zinc-100/50 dark:bg-zinc-800/40" : "mr-auto bg-zinc-100/50 dark:bg-zinc-800/40"}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="size-5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                            <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            <div className="h-3 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="flex flex-col gap-4 mb-6 mr-2">
                                {comments.map((comment) => {
                                    const commentUserImg = comment.user.image?.src || comment.user.image;
                                    return (
                                        <div key={comment.id} className={`sm:max-w-[80%] dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border border-gray-300 dark:border-zinc-700 p-3 rounded-md ${comment.user.id === user?.id ? "ml-auto" : "mr-auto"}`} >
                                            <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-zinc-400">
                                                {commentUserImg && <img src={commentUserImg} alt="avatar" className="size-5 rounded-full" />}
                                                <span className="font-semibold text-gray-900 dark:text-white">{comment.user.name}</span>
                                                <span className="text-xs text-gray-400 dark:text-zinc-550">
                                                    • {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-900 dark:text-zinc-200">{comment.content}</p>
                                        </div>
                                    );
                                })}
                                <div ref={commentsEndRef} />
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-zinc-500 mb-4 text-sm">No comments yet. Be the first!</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mt-auto">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md p-2 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
                            rows={3}
                        />
                        <button onClick={handleAddComment} className="bg-gradient-to-l from-blue-500 to-blue-600 transition-colors text-white text-sm px-5 py-2 rounded cursor-pointer hover:opacity-90 animate-pulse hover:animate-none" >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Task + Project Info */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                {/* Task Info */}
                <div className="p-5 rounded-md bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800">
                    <div className="mb-3">
                        <div className="flex justify-between items-start">
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 break-words max-w-[85%]">{task.title}</h1>
                            {isAdmin && (
                                <button onClick={() => setIsEditOpen(true)} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-750 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer transition">
                                    <PenIcon className="size-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 text-xs font-semibold">
                                {task.status}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-300 text-xs font-semibold">
                                {task.type}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-green-200 dark:bg-emerald-900 text-green-900 dark:text-emerald-300 text-xs font-semibold">
                                {task.priority}
                            </span>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">{task.description}</p>
                    )}

                    <hr className="border-zinc-200 dark:border-zinc-700 my-3" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-2">
                            {assigneeImg && <img src={assigneeImg} className="size-5 rounded-full" alt="avatar" />}
                            {task.assignee?.name || "Unassigned"}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-4 text-gray-500 dark:text-zinc-500" />
                            <span>Due : {task.due_date ? format(new Date(task.due_date), "dd MMM yyyy") : "-"}</span>
                        </div>
                    </div>
                </div>

                {/* Project Info */}
                {project && (
                    <div className="p-5 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-gray-300 dark:border-zinc-800 ">
                        <p className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Project Details</p>
                        <h2 className="text-gray-900 dark:text-zinc-100 flex items-center gap-2 font-medium"> {project.name}</h2>
                        <p className="text-xs mt-3 text-zinc-500">Project Start Date: {project.start_date ? format(new Date(project.start_date), "dd MMM yyyy") : "-"}</p>
                        <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-zinc-400 mt-3">
                            <span>Status: {project.status}</span>
                            <span>Priority: {project.priority}</span>
                            <span>Progress: {project.progress}%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Task Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur p-4">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md p-6 text-zinc-900 dark:text-white relative max-h-[90vh] overflow-y-auto no-scrollbar">
                        <button className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer" onClick={() => setIsEditOpen(false)} >
                            <XIcon className="size-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Title</label>
                                <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Task title" className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Description</label>
                                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Task description..." className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" rows={3} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Type */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Type</label>
                                    <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="w-full rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                        <option value="TASK">Task</option>
                                        <option value="BUG">Bug</option>
                                        <option value="FEATURE">Feature</option>
                                        <option value="IMPROVEMENT">Improvement</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                {/* Priority */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Priority</label>
                                    <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} className="w-full rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Status */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Status</label>
                                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>

                                {/* Assignee */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Assignee</label>
                                    <select value={editForm.assigneeId} onChange={(e) => setEditForm({ ...editForm, assigneeId: e.target.value })} className="w-full rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                        <option value="">Unassigned</option>
                                        {(project?.members || []).map((m: any) => (
                                            <option key={m.userId} value={m.userId}>{m.user?.name || m.user?.email}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Due Date</label>
                                <input type="date" value={editForm.due_date} onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end gap-3 pt-2 text-sm">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer" >
                                    Cancel
                                </button>
                                <button type="submit" disabled={isUpdating} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer disabled:opacity-50" >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function TaskDetailsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
                <p className="text-zinc-500">Loading task details...</p>
            </div>
        }>
            <TaskDetailsContent />
        </Suspense>
    );
}
