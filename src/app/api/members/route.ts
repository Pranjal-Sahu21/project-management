import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role, workspaceId, projectId } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Ensure target User exists in database
    // (In production, if they don't exist yet, we can create a placeholder user profile or wait until they sign up)
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a default placeholder user for this email so relations work
      const placeholderId = "user_" + Math.random().toString(36).substring(2, 9);
      user = await prisma.user.create({
        data: {
          id: placeholderId,
          name: email.split("@")[0],
          email,
        },
      });
    }

    // CASE 1: Add member to project
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { workspaceId: true },
      });

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
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
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
        return NextResponse.json({ error: "User is already a project member" }, { status: 400 });
      }

      // Add to project
      const projectMember = await prisma.projectMember.create({
        data: {
          userId: user.id,
          projectId,
        },
        include: {
          user: true,
        },
      });

      return NextResponse.json(projectMember);
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
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
        return NextResponse.json({ error: "User is already a workspace member" }, { status: 400 });
      }

      // Add to workspace
      const workspaceMember = await prisma.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId,
          role: role || "MEMBER",
        },
        include: {
          user: true,
        },
      });

      return NextResponse.json(workspaceMember);
    }

    return NextResponse.json({ error: "workspaceId or projectId is required" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
