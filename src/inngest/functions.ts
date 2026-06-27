import { inngest } from "./client";
import { prisma } from "../lib/prisma";

// Inngest functions to create user
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: { event: "clerk/user.created" } },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

// Inngest function to delete user
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk", triggers: { event: "clerk/user.deleted" } },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  },
);

// Inngest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: { event: "clerk/user.updated" } },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

// Inngest function to save workspace data to the database
export const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: { event: "clerk/organization.created" },
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });

    // Add creator as ADMIN member
    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  },
);

// Inngest function to update workspace data to the database
export const syncWorkspaceUpdation = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
    triggers: { event: "clerk/organization.updated" },
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url,
      },
    });
  },
);

// Inngest function to delete workspace data from the database
export const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "delete-workspace-with-clerk",
    triggers: { event: "clerk/organization.deleted" },
  },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.delete({
      where: {
        id: data.id,
      },
    });
  },
);

// Inngest function to save workspace member data to the database
export const syncWorkspaceMembershipCreation = inngest.createFunction(
  {
    id: "sync-workspace-membership-from-clerk",
    triggers: { event: "clerk/organizationMembership.created" },
  },
  async ({ event }) => {
    const { data } = event;
    const userId = data.public_user_data?.user_id;
    const workspaceId = data.organization?.id;
    const role = data.role === "org:admin" ? "ADMIN" : "MEMBER";

    if (!userId || !workspaceId) return;

    // Check if membership already exists to avoid duplicate constraint errors
    const exists = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });

    if (!exists) {
      await prisma.workspaceMember.create({
        data: {
          userId,
          workspaceId,
          role,
        },
      });
    }
  },
);

// Inngest function to update workspace member role in the database
export const syncWorkspaceMembershipUpdation = inngest.createFunction(
  {
    id: "update-workspace-membership-from-clerk",
    triggers: { event: "clerk/organizationMembership.updated" },
  },
  async ({ event }) => {
    const { data } = event;
    const userId = data.public_user_data?.user_id;
    const workspaceId = data.organization?.id;
    const role = data.role === "org:admin" ? "ADMIN" : "MEMBER";

    if (!userId || !workspaceId) return;

    await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
      data: {
        role,
      },
    });
  },
);

// Inngest function to delete workspace member from the database
export const syncWorkspaceMembershipDeletion = inngest.createFunction(
  {
    id: "delete-workspace-membership-with-clerk",
    triggers: { event: "clerk/organizationMembership.deleted" },
  },
  async ({ event }) => {
    const { data } = event;
    const userId = data.public_user_data?.user_id;
    const workspaceId = data.organization?.id;

    if (!userId || !workspaceId) return;

    try {
      await prisma.workspaceMember.delete({
        where: {
          userId_workspaceId: { userId, workspaceId },
        },
      });
    } catch (e) {
      // Ignore if already deleted
    }
  },
);
