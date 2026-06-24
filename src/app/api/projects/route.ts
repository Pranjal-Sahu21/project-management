import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, priority, status, start_date, end_date, team_lead, workspaceId, team_members } = await req.json();
    if (!name || !workspaceId) {
      return NextResponse.json({ error: "Name and Workspace ID are required" }, { status: 400 });
    }

    // Verify workspace membership
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create project
    const project = await prisma.project.create({
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
            ...(team_members || []).map((email: string) => ({
              user: {
                connect: { email }
              }
            }))
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

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description, priority, status, start_date, end_date, progress, team_lead } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Check project workspace membership
    const projectExists = await prisma.project.findUnique({
      where: { id },
      select: { workspaceId: true },
    });

    if (!projectExists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: projectExists.workspaceId,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const project = await prisma.project.update({
      where: { id },
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

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
