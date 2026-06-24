import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createProject, updateProject } from "../../../controllers/projectController";

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

    try {
      const project = await createProject(userId, { name, description, priority, status, start_date, end_date, team_lead, workspaceId, team_members });
      return NextResponse.json(project);
    } catch (err: any) {
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

    const { id, name, description, priority, status, start_date, end_date, progress, team_lead } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    try {
      const project = await updateProject(userId, id, { name, description, priority, status, start_date, end_date, progress, team_lead });
      return NextResponse.json(project);
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
