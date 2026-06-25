"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, X, Upload, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace, addWorkspace } from "../features/workspaceSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import workspaceImgDefault from "../assets/workspace_img_default.png";
import Image from "next/image";

function WorkspaceDropdown() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { workspaces } = useSelector((state: any) => state.workspace);
    const currentWorkspace = useSelector((state: any) => state.workspace?.currentWorkspace || null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newWsName, setNewWsName] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const onSelectWorkspace = (organizationId: string) => {
        dispatch(setCurrentWorkspace(organizationId));
        setIsOpen(false);
        router.push('/');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSelectedImage(base64String);
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWsName.trim()) {
            toast.error("Workspace name is required");
            return;
        }
        setIsCreating(true);
        try {
            const res = await fetch("/api/workspace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: newWsName, 
                    image_url: selectedImage || workspaceImgDefault.src || workspaceImgDefault
                }),
            });
            if (res.ok) {
                const data = await res.json();
                dispatch(addWorkspace(data));
                dispatch(setCurrentWorkspace(data.id));
                toast.success("Workspace created successfully!");
                setIsCreateOpen(false);
                setIsOpen(false);
                setNewWsName("");
                setSelectedImage(null);
                setImagePreview(null);
                router.push('/');
            } else {
                const errData = await res.json();
                toast.error(errData.error || "Failed to create workspace");
            }
        } catch (err) {
            toast.error("Failed to create workspace");
        } finally {
            setIsCreating(false);
        }
    };

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

    const currentImg = currentWorkspace?.image_url?.src || currentWorkspace?.image_url;

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
                            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
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
                        {workspaces.map((ws: any) => {
                            const wsImg = ws.image_url?.src || ws.image_url;
                            return (
                                <div key={ws.id} onClick={() => onSelectWorkspace(ws.id)} className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                                    {wsImg && <img src={wsImg} alt={ws.name} className="w-6 h-6 rounded" />}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {ws.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                                            {ws.members?.length || 0} members
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
                <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-sm text-zinc-900 dark:text-zinc-200 relative shadow-2xl">
                        <button className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer" onClick={() => setIsCreateOpen(false)} >
                            <X className="size-5" />
                        </button>
                        <h2 className="text-lg font-medium mb-4">Create New Workspace</h2>
                        <form onSubmit={handleCreateWorkspace} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2 font-medium">Workspace Name</label>
                                <input type="text" value={newWsName} onChange={(e) => setNewWsName(e.target.value)} placeholder="e.g. Acme Marketing" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">Workspace Image <span className="text-xs text-zinc-500 dark:text-zinc-400">(Optional)</span></label>
                                
                                {!imagePreview ? (
                                    <div className="space-y-3">
                                        <div className="relative w-full h-32 rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
                                            <Image src={workspaceImgDefault.src || workspaceImgDefault} alt="Default" className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Default workspace image</span>
                                            </div>
                                        </div>
                                        <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="w-5 h-5 text-zinc-400 dark:text-zinc-500 mb-1.5" />
                                                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">PNG, JPG up to 2MB</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative inline-block w-full">
                                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-zinc-300 dark:border-zinc-700" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <label className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg cursor-pointer transition shadow-lg">
                                            <Upload className="w-3.5 h-3.5" />
                                            Change
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2 text-sm">
                                <button type="button" onClick={() => {
                                    setIsCreateOpen(false);
                                    setNewWsName("");
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                }} className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition" >
                                    Cancel
                                </button>
                                <button type="submit" disabled={isCreating} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition disabled:opacity-50" >
                                    {isCreating ? "Creating..." : "Create Workspace"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceDropdown;
