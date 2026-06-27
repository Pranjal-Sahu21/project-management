import { prisma } from "../lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

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

  // Ensure target User exists in database (only required for project additions)
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user && projectId) {
    throw new Error("No user found with this email address");
  }

  // CASE 1: Add member to project
  if (projectId && user) {
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
    if (user) {
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
    }

    // Send Clerk Organization Invitation
    try {
      const clerk = await clerkClient();
      await clerk.organizations.createOrganizationInvitation({
        organizationId: workspaceId,
        emailAddress: email,
        role: role === "ADMIN" ? "org:admin" : "org:member",
      });
    } catch (clerkErr: any) {
      const msg = clerkErr.errors?.[0]?.message || clerkErr.message || "Failed to send invitation via Clerk";
      throw new Error(msg);
    }

    return { success: true, invitationSent: true, email };
  }

  throw new Error("workspaceId or projectId is required");
}
