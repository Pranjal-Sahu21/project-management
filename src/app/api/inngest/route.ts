import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceDeletion,
  syncWorkspaceMembershipCreation,
  syncWorkspaceMembershipUpdation,
  syncWorkspaceMembershipDeletion,
  syncWorkspaceUpdation,
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    syncWorkspaceCreation,
    syncWorkspaceUpdation,
    syncWorkspaceDeletion,
    syncWorkspaceMembershipCreation,
    syncWorkspaceMembershipUpdation,
    syncWorkspaceMembershipDeletion,
  ],
});
