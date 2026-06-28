import { prisma } from "../lib/prisma";

// Create a new task inside a project
export async function createTask(
  userId: string,
  data: {
    projectId: string;
    title: string;
    description?: string;
    status?: string;
    type?: string;
    priority?: string;
    assigneeId?: string;
    due_date?: string;
  }
) {
  const { projectId, title, description, status, type, priority, assigneeId, due_date } = data;

  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify calling user is a member of the workspace
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: project.workspaceId,
      },
    },
  });

  if (!member || member.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return await prisma.task.create({
    data: {
      projectId,
      title,
      description,
      status: status || "TODO",
      type: type || "TASK",
      priority: priority || "MEDIUM",
      assigneeId: assigneeId || null,
      due_date: due_date ? new Date(due_date) : null,
    },
    include: {
      assignee: true,
      comments: true,
    },
  });
}

// Update existing task details
export async function updateTask(
  userId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    type?: string;
    priority?: string;
    assigneeId?: string;
    due_date?: string;
  }
) {
  const { title, description, status, type, priority, assigneeId, due_date } = data;

  // Verify task exists and get project workspaceId
  const taskExists = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        select: { workspaceId: true },
      },
    },
  });

  if (!taskExists) {
    throw new Error("Task not found");
  }

  // Verify workspace membership
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: taskExists.project.workspaceId,
      },
    },
  });

  if (!member || member.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      status,
      type,
      priority,
      assigneeId: assigneeId === "" ? null : assigneeId,
      due_date: due_date ? new Date(due_date) : undefined,
    },
    include: {
      assignee: true,
    },
  });
}

// Bulk delete tasks
export async function deleteTasks(userId: string, taskIds: string[]) {
  if (taskIds.length === 0) {
    throw new Error("Task ID list is empty");
  }

  // Check workspace membership for the first task
  const taskSample = await prisma.task.findUnique({
    where: { id: taskIds[0] },
    include: {
      project: {
        select: { workspaceId: true },
      },
    },
  });

  if (!taskSample) {
    throw new Error("Task not found");
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: taskSample.project.workspaceId,
      },
    },
  });

  if (!member) {
    throw new Error("Forbidden");
  }

  await prisma.task.deleteMany({
    where: {
      id: { in: taskIds },
    },
  });

  return { success: true, projectId: taskSample.projectId };
}
