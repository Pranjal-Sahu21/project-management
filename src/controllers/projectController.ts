import { prisma } from "../lib/prisma";

// Create a new project inside a workspace
export async function createProject(
  userId: string,
  data: {
    name: string;
    description?: string;
    priority?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    team_lead?: string;
    workspaceId: string;
    team_members?: string[];
  }
) {
  const { name, description, priority, status, start_date, end_date, team_lead, workspaceId, team_members } = data;

  // Verify calling user is a member of the workspace
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!member || member.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  // Fetch user IDs for the provided team member emails
  const dbUsers = await prisma.user.findMany({
    where: {
      email: { in: team_members || [] },
    },
    select: { id: true },
  });

  // Extract user IDs and filter out creator to avoid duplicate assignment
  const otherUserIds = dbUsers
    .map((u) => u.id)
    .filter((id) => id !== userId);

  // Create project and assign members
  return await prisma.project.create({
    data: {
      name,
      description,
      priority: priority || "MEDIUM",
      status: status || "PLANNING",
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      team_lead: team_lead || userId,
      workspaceId,
      members: {
        create: [
          { userId }, // The creator is a member by default
          ...otherUserIds.map((uId) => ({ userId: uId }))
        ]
      }
    },
    include: {
      tasks: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

// Update existing project settings
export async function updateProject(
  userId: string,
  projectId: string,
  data: {
    name?: string;
    description?: string;
    priority?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    progress?: number;
    team_lead?: string;
  }
) {
  const { name, description, priority, status, start_date, end_date, progress, team_lead } = data;

  // Check project workspace membership
  const projectExists = await prisma.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  });

  if (!projectExists) {
    throw new Error("Project not found");
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: projectExists.workspaceId,
      },
    },
  });

  if (!member || member.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return await prisma.project.update({
    where: { id: projectId },
    data: {
      name,
      description,
      priority,
      status,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      progress: progress !== undefined ? Number(progress) : undefined,
      team_lead,
    },
  });
}
