import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchWorkspaces = createAsyncThunk('workspace/fetchWorkspaces', async ({ getToken }) => {
    try {
        const token = await getToken();
        const res = await fetch("/api/workspace", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error("Failed to fetch workspaces");
        }
        return await res.json();
    } catch (error) {
        console.error("Error in fetchWorkspaces thunk:", error);
        throw error;
    }  
});

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: true,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCurrentWorkspace: (state, action) => {
            if (typeof window !== "undefined") {
                localStorage.setItem("currentWorkspaceId", action.payload);
            }
            state.currentWorkspace = state.workspaces.find((w) => w.id === action.payload);
        },
        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);

            // set current workspace to the new workspace
            if (state.currentWorkspace?.id !== action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        updateWorkspace: (state, action) => {
            state.workspaces = state.workspaces.map((w) =>
                w.id === action.payload.id ? action.payload : w
            );

            // if current workspace is updated, set it to the updated workspace
            if (state.currentWorkspace?.id === action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        deleteWorkspace: (state, action) => {
            state.workspaces = state.workspaces.filter((w) => w._id !== action.payload);
        },
        addProject: (state, action) => {
            state.currentWorkspace.projects.push(action.payload);
            // find workspace by id and add project to it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? { ...w, projects: w.projects.concat(action.payload) } : w
            );
        },
        updateProject: (state, action) => {
            const project = action.payload;
            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) =>
                p.id === project.id ? { ...p, ...project } : p
            );
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w,
                    projects: w.projects.map((p) =>
                        p.id === project.id ? { ...p, ...project } : p
                    )
                } : w
            );
        },
        addTask: (state, action) => {
            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    p.tasks.push(action.payload);
                }
                return p;
            });

            // find workspace and project by id and add task to it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? { ...p, tasks: p.tasks.concat(action.payload) } : p
                    )
                } : w
            );
        },
        updateTask: (state, action) => {
            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    p.tasks = p.tasks.map((t) =>
                        t.id === action.payload.id ? action.payload : t
                    );
                }
                return p;
            });
            // find workspace and project by id and update task in it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? {
                            ...p, tasks: p.tasks.map((t) =>
                                t.id === action.payload.id ? action.payload : t
                            )
                        } : p
                    )
                } : w
            );
        },
        deleteTask: (state, action) => {
            const taskIds = action.payload;
            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => ({
                ...p,
                tasks: p.tasks.filter((t) => !taskIds.includes(t.id))
            }));

            // find workspace and delete tasks from all its projects
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w,
                    projects: w.projects.map((p) => ({
                        ...p,
                        tasks: p.tasks.filter((t) => !taskIds.includes(t.id))
                    }))
                } : w
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.workspaces = action.payload;
                state.loading = false;
                
                let savedWsId = null;
                if (typeof window !== "undefined") {
                    savedWsId = localStorage.getItem("currentWorkspaceId");
                }
                
                if (savedWsId && action.payload.some((ws) => ws.id === savedWsId)) {
                    state.currentWorkspace = action.payload.find((ws) => ws.id === savedWsId);
                } else if (action.payload.length > 0) {
                    state.currentWorkspace = action.payload[0];
                    if (typeof window !== "undefined") {
                        localStorage.setItem("currentWorkspaceId", action.payload[0].id);
                    }
                } else {
                    state.currentWorkspace = null;
                }
                state.loading = false;
            })
            .addCase(fetchWorkspaces.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const { setWorkspaces, setCurrentWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, addProject, updateProject, addTask, updateTask, deleteTask, setLoading } = workspaceSlice.actions;
export default workspaceSlice.reducer;
