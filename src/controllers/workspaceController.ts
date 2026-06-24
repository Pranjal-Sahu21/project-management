import { prisma } from "../lib/prisma";

// Get workspaces where user is a member
export async function getUserWorkspaces(userId: string) {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { members: { some: { userId: userId } } },
      include: {
        members: { include: { user: true } },
        projects: {
          include: {
            tasks: {
              include: {
                assignee: true,
                comments: { include: { user: true } },
              },
            },
            members: { include: { user: true } },
          },
        },
        owner: true,
      },
    });
    return workspaces;
  } catch (error) {
    console.log(error);
  }
}

// Create new workspace
export async function createWorkspace(
  userId: string,
  data: { name: string; description?: string; settings?: any },
) {
  const { name, description, settings } = data;
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 6);

  return await prisma.workspace.create({
    data: {
      name,
      slug,
      description,
      settings: settings || {},
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      projects: true,
    },
  });
}

// Update workspace
export async function updateWorkspace(
  userId: string,
  workspaceId: string,
  data: {
    name?: string;
    description?: string;
    settings?: any;
    image_url?: string;
  },
) {
  const { name, description, settings, image_url } = data;

  // Check if user is admin of this workspace
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

  return await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name,
      description,
      settings,
      image_url,
    },
  });
}


