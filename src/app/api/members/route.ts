import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addMember } from "../../../controllers/memberController";

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

    try {
      const result = await addMember(currentUserId, { email, role, workspaceId, projectId });
      return NextResponse.json(result);
    } catch (err: any) {
      if (err.message === "Project not found") {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      if (err.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (err.message === "User is already a project member" || err.message === "User is already a workspace member") {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
