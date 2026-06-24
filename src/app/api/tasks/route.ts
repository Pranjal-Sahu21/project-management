import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { inngest } from "../../../inngest/client";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, title, description, status, type, priority, assigneeId, due_date } = await req.json();
    if (!projectId || !title) {
      return NextResponse.json({ error: "Project ID and Title are required" }, { status: 400 });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify workspace membership
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const task = await prisma.task.create({
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

    // Trigger Inngest event to calculate project progress
    await inngest.send({
      name: "app/task.updated",
      data: { projectId },
    });

    return NextResponse.json(task);
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

    const { id, title, description, status, type, priority, assigneeId, due_date } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // Verify task exists and get project workspaceId
    const taskExists = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { workspaceId: true },
        },
      },
    });

    if (!taskExists) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
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

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const task = await prisma.task.update({
      where: { id },
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

    // Trigger Inngest event to calculate project progress
    await inngest.send({
      name: "app/task.updated",
      data: { projectId: task.projectId },
    });

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await req.json();
    if (!ids || (!Array.isArray(ids) && typeof ids !== "string")) {
      return NextResponse.json({ error: "Task ID(s) are required" }, { status: 400 });
    }

    const taskIds = Array.isArray(ids) ? ids : [ids];
    if (taskIds.length === 0) {
      return NextResponse.json({ error: "Task ID list is empty" }, { status: 400 });
    }

    // Check workspace membership for the first task (assuming all belong to the same workspace context)
    const taskSample = await prisma.task.findUnique({
      where: { id: taskIds[0] },
      include: {
        project: {
          select: { workspaceId: true },
        },
      },
    });

    if (!taskSample) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.task.deleteMany({
      where: {
        id: { in: taskIds },
      },
    });

    // Trigger Inngest event to calculate project progress
    await inngest.send({
      name: "app/task.updated",
      data: { projectId: taskSample.projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
