import { inngest } from "./client";
import { prisma } from "../lib/prisma";

// Background job to calculate project progress based on task statuses
export const calculateProjectProgress = inngest.createFunction(
  { id: "calculate-project-progress", triggers: [{ event: "app/task.updated" }] },
  async ({ event, step }) => {
    const { projectId } = event.data;

    // Run this computation step-by-step
    await step.run("compute-progress", async () => {
      // 1. Fetch all tasks for the project
      const tasks = await prisma.task.findMany({
        where: { projectId },
        select: { status: true },
      });

      // 2. If no tasks exist, progress is 0%
      if (tasks.length === 0) {
        await prisma.project.update({
          where: { id: projectId },
          data: { progress: 0 },
        });
        return { progress: 0 };
      }

      // 3. Compute percentage of completed tasks (status: DONE)
      const doneTasks = tasks.filter((task) => task.status === "DONE");
      const progress = Math.round((doneTasks.length / tasks.length) * 100);

      // 4. Update the project progress in the database
      await prisma.project.update({
        where: { id: projectId },
        data: { progress },
      });

      return { progress };
    });
  }
);
