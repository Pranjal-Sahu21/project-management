import { prisma } from "../lib/prisma";

// Add user to workspace or project, sync/create user on-the-fly
export async function addMember(
  currentUserId: string,
  data: {
    email: string;
    role?: string;
    workspaceId?: string;
    projectId?: string;
  }
) {
  const { email, role, workspaceId, projectId } = data;

  // Ensure target User exists in database
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("No user found with this email address");
  }

  // CASE 1: Add member to project
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Verify workspace membership of the calling user
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: currentUserId,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!member) {
      throw new Error("Forbidden");
    }

    // Check if target user is in workspace first, if not add them
    const wsMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!wsMember) {
      await prisma.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: project.workspaceId,
          role: "MEMBER",
        },
      });
    }

    // Check if already in project
    const projMemberExists = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    if (projMemberExists) {
      throw new Error("User is already a project member");
    }

    // Add to project
    return await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId,
      },
      include: {
        user: true,
      },
    });
  }

  // CASE 2: Add member to workspace
  if (workspaceId) {
    // Verify workspace membership of caller and check if admin
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: currentUserId,
          workspaceId,
        },
      },
    });

    if (!member || member.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    // Check if already in workspace
    const wsMemberExists = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (wsMemberExists) {
      throw new Error("User is already a workspace member");
    }

    // Add to workspace
    return await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId,
        role: role || "MEMBER",
      },
      include: {
        user: true,
      },
    });
  }

  throw new Error("workspaceId or projectId is required");
}
