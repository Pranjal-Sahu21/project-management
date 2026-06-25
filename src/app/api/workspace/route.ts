import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUserWorkspaces, createWorkspace, updateWorkspace } from "../../../controllers/workspaceController";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync Clerk user to database if they don't exist
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@example.com`;
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || email.split("@")[0];
        const image = clerkUser.imageUrl || null;

        const existingByEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (existingByEmail) {
          dbUser = await prisma.user.update({
            where: { email },
            data: { id: userId, name, image },
          });
        } else {
          dbUser = await prisma.user.create({
            data: { id: userId, name, email, image },
          });

          // Add to seed workspaces so they have default data
          const workspaces = await prisma.workspace.findMany();
          for (const ws of workspaces) {
            const exists = await prisma.workspaceMember.findUnique({
              where: {
                userId_workspaceId: { userId, workspaceId: ws.id },
              },
            });
            if (!exists) {
              await prisma.workspaceMember.create({
                data: { userId, workspaceId: ws.id, role: "ADMIN" },
              });
            }
          }
        }
      }
    }

    // Fetch workspaces from Controller
    const userWorkspaces = await getUserWorkspaces(userId);
    return NextResponse.json(userWorkspaces);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, settings, image_url } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create workspace using Controller
    const workspace = await createWorkspace(userId, { name, description, settings, image_url });
    return NextResponse.json(workspace);
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

    const { id, name, description, settings, image_url } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    // Update workspace using Controller
    try {
      const workspace = await updateWorkspace(userId, id, { name, description, settings, image_url });
      return NextResponse.json(workspace);
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
