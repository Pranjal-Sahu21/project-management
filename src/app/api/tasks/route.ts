import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createTask, updateTask, deleteTasks } from "../../../controllers/taskController";
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

    try {
      const task = await createTask(userId, { projectId, title, description, status, type, priority, assigneeId, due_date });

      // Trigger Inngest event to calculate project progress
      await inngest.send({
        name: "app/task.updated",
        data: { projectId },
      });

      return NextResponse.json(task);
    } catch (err: any) {
      if (err.message === "Project not found") {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      if (err.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      throw err;
    }
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

    try {
      const task = await updateTask(userId, id, { title, description, status, type, priority, assigneeId, due_date });

      // Trigger Inngest event to calculate project progress
      await inngest.send({
        name: "app/task.updated",
        data: { projectId: task.projectId },
      });

      return NextResponse.json(task);
    } catch (err: any) {
      if (err.message === "Task not found") {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      if (err.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      throw err;
    }
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
    try {
      const result = await deleteTasks(userId, taskIds);

      // Trigger Inngest event to calculate project progress
      await inngest.send({
        name: "app/task.updated",
        data: { projectId: result.projectId },
      });

      return NextResponse.json({ success: true });
    } catch (err: any) {
      if (err.message === "Task ID list is empty") {
        return NextResponse.json({ error: "Task ID list is empty" }, { status: 400 });
      }
      if (err.message === "Task not found") {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      if (err.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      throw err;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
