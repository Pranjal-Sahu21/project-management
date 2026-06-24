const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dummyUsers = [
  {
    id: "user_1",
    name: "Alex Smith",
    email: "alexsmith@example.com",
    image: "/profile_img_a.svg",
  },
  {
    id: "user_2",
    name: "John Warrel",
    email: "johnwarrel@example.com",
    image: "/profile_img_j.svg",
  },
  {
    id: "user_3",
    name: "Oliver Watts",
    email: "oliverwatts@example.com",
    image: "/profile_img_o.svg",
  }
];

const dummyWorkspaces = [
  {
    id: "org_1",
    name: "Corp Workspace",
    slug: "corp-workspace",
    ownerId: "user_3",
    image_url: "/workspace_img_default.png",
  },
  {
    id: "org_2",
    name: "Cloud Ops Hub",
    slug: "cloud-ops-hub",
    ownerId: "user_3",
    image_url: "/workspace_img_default.png",
  }
];

async function main() {
  console.log("Starting seed database...");

  // Clean old data
  await prisma.comment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.workspaceMember.deleteMany({});
  await prisma.workspace.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Seed Users
  for (const user of dummyUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }
  console.log("Seeded default users.");

  // 2. Seed Workspaces
  for (const ws of dummyWorkspaces) {
    await prisma.workspace.upsert({
      where: { id: ws.id },
      update: {},
      create: ws,
    });

    // Add members to workspaces
    for (const user of dummyUsers) {
      await prisma.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: ws.id,
          role: "ADMIN",
        },
      });
    }
  }
  console.log("Seeded workspaces and workspace members.");

  // 3. Seed Projects for Workspace 1
  const project1 = await prisma.project.create({
    data: {
      id: "4d0f6ef3-e798-4d65-a864-00d9f8085c51",
      name: "LaunchPad CRM",
      description: "A next-gen CRM for startups to manage customer pipelines, analytics, and automation.",
      priority: "HIGH",
      status: "ACTIVE",
      start_date: new Date("2025-10-10T00:00:00.000Z"),
      end_date: new Date("2026-02-28T00:00:00.000Z"),
      team_lead: "user_3",
      workspaceId: "org_1",
      progress: 65,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      id: "e5f0a667-e883-41c4-8c87-acb6494d6341",
      name: "Brand Identity Overhaul",
      description: "Rebranding client products with cohesive color palettes and typography systems.",
      priority: "MEDIUM",
      status: "PLANNING",
      start_date: new Date("2025-10-18T00:00:00.000Z"),
      end_date: new Date("2026-03-10T00:00:00.000Z"),
      team_lead: "user_3",
      workspaceId: "org_1",
      progress: 25,
    },
  });

  // Add project members
  for (const user of dummyUsers) {
    await prisma.projectMember.create({
      data: { userId: user.id, projectId: project1.id },
    });
    await prisma.projectMember.create({
      data: { userId: user.id, projectId: project2.id },
    });
  }

  // Seed tasks for project 1
  await prisma.task.createMany({
    data: [
      {
        id: "24ca6d74-7d32-41db-a257-906a90bca8f4",
        projectId: project1.id,
        title: "Design Dashboard UI",
        description: "Create a modern, responsive CRM dashboard layout.",
        status: "IN_PROGRESS",
        type: "FEATURE",
        priority: "HIGH",
        assigneeId: "user_1",
        due_date: new Date("2025-10-31T00:00:00.000Z"),
      },
      {
        id: "9dbd5f04-5a29-4232-9e8c-a1d8e4c566df",
        projectId: project1.id,
        title: "Integrate Email API",
        description: "Set up SendGrid integration for email campaigns.",
        status: "TODO",
        type: "TASK",
        priority: "MEDIUM",
        assigneeId: "user_2",
        due_date: new Date("2025-11-30T00:00:00.000Z"),
      },
      {
        id: "0e6798ad-8a1d-4bca-b0cd-8199491dbf03",
        projectId: project1.id,
        title: "Fix Duplicate Contact Bug",
        description: "Duplicate records appear when importing CSV files.",
        status: "TODO",
        type: "BUG",
        priority: "HIGH",
        assigneeId: "user_1",
        due_date: new Date("2025-12-05T00:00:00.000Z"),
      },
      {
        id: "7989b4cc-1234-4816-a1d9-cc86cd09596a",
        projectId: project1.id,
        title: "Add Role-Based Access Control (RBAC)",
        description: "Define user roles and permissions for the dashboard.",
        status: "IN_PROGRESS",
        type: "IMPROVEMENT",
        priority: "MEDIUM",
        assigneeId: "user_2",
        due_date: new Date("2025-12-20T00:00:00.000Z"),
      }
    ]
  });

  // Seed tasks for project 2
  await prisma.task.createMany({
    data: [
      {
        id: "a51bd102-6789-4e60-81ba-57768c63b7db",
        projectId: project2.id,
        title: "Create New Logo Concepts",
        description: "Sketch and finalize 3 logo concepts for client review.",
        status: "IN_PROGRESS",
        type: "FEATURE",
        priority: "MEDIUM",
        assigneeId: "user_2",
        due_date: new Date("2025-10-31T00:00:00.000Z"),
      },
      {
        id: "c7cafc09-5138-4918-9277-5ab94b520410",
        projectId: project2.id,
        title: "Update Typography System",
        description: "Introduce new font hierarchy with responsive scaling.",
        status: "TODO",
        type: "IMPROVEMENT",
        priority: "MEDIUM",
        assigneeId: "user_1",
        due_date: new Date("2025-11-15T00:00:00.000Z"),
      },
      {
        id: "53883b41-1912-460e-8501-43363ff3f5d4",
        projectId: project2.id,
        title: "Client Feedback Integration",
        description: "Implement client-requested adjustments to the brand guide.",
        status: "TODO",
        type: "TASK",
        priority: "LOW",
        assigneeId: "user_2",
        due_date: new Date("2025-10-31T00:00:00.000Z"),
      }
    ]
  });

  // 4. Seed Projects for Workspace 2
  const project3 = await prisma.project.create({
    data: {
      id: "c45e93ec-2f68-4f07-af4b-aa84f1bd407c",
      name: "Kubernetes Migration",
      description: "Migrate the monolithic app infrastructure to Kubernetes for scalability.",
      priority: "HIGH",
      status: "ACTIVE",
      start_date: new Date("2025-10-15T00:00:00.000Z"),
      end_date: new Date("2026-01-20T00:00:00.000Z"),
      team_lead: "user_3",
      workspaceId: "org_2",
      progress: 0,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      id: "b190343f-a7b1-4a40-b483-ecc59835cba3",
      name: "Automated Regression Suite",
      description: "Selenium + Playwright hybrid test framework for regression testing.",
      priority: "MEDIUM",
      status: "ACTIVE",
      start_date: new Date("2025-10-03T00:00:00.000Z"),
      end_date: new Date("2025-10-15T00:00:00.000Z"),
      team_lead: "user_3",
      workspaceId: "org_2",
      progress: 0,
    },
  });

  for (const user of dummyUsers) {
    await prisma.projectMember.create({
      data: { userId: user.id, projectId: project3.id },
    });
    await prisma.projectMember.create({
      data: { userId: user.id, projectId: project4.id },
    });
  }

  // Seed tasks for project 3
  await prisma.task.createMany({
    data: [
      {
        id: "fc8ac710-ad12-4508-b934-9d59dea01872",
        projectId: project3.id,
        title: "Security Audit",
        description: "Run container vulnerability scans and review IAM roles.",
        status: "TODO",
        type: "OTHER",
        priority: "MEDIUM",
        assigneeId: "user_3",
        due_date: new Date("2025-12-10T00:00:00.000Z"),
      },
      {
        id: "1cd6f85d-889a-4a5b-901f-ed8fa221d62b",
        projectId: project3.id,
        title: "Set Up EKS Cluster",
        description: "Provision EKS cluster on AWS and configure nodes.",
        status: "TODO",
        type: "TASK",
        priority: "HIGH",
        assigneeId: "user_1",
        due_date: new Date("2025-12-15T00:00:00.000Z"),
      },
      {
        id: "8125eeac-196d-4797-8b14-21260f46abcc",
        projectId: project3.id,
        title: "Implement CI/CD with GitHub Actions",
        description: "Add build, test, and deploy steps using GitHub Actions.",
        status: "TODO",
        type: "TASK",
        priority: "MEDIUM",
        assigneeId: "user_2",
        due_date: new Date("2025-10-31T00:00:00.000Z"),
      }
    ]
  });

  // Seed tasks for project 4
  await prisma.task.createMany({
    data: [
      {
        id: "8836edf0-b4d7-4eec-a170-960d715a0b7f",
        projectId: project4.id,
        title: "Migrate to Playwright 1.48",
        description: "Update scripts to use latest Playwright features.",
        status: "IN_PROGRESS",
        type: "IMPROVEMENT",
        priority: "HIGH",
        assigneeId: "user_1",
        due_date: new Date("2025-10-31T00:00:00.000Z"),
      },
      {
        id: "ce3dc378-f959-42f4-b12b-4c6cae6195c9",
        projectId: project4.id,
        title: "Parallel Test Execution",
        description: "Enable concurrent test runs across CI pipelines.",
        status: "TODO",
        type: "TASK",
        priority: "MEDIUM",
        assigneeId: "user_2",
        due_date: new Date("2025-11-28T00:00:00.000Z"),
      },
      {
        id: "e01fda50-8818-4635-bcb6-9cde5c140b3d",
        projectId: project4.id,
        title: "Visual Snapshot Comparison",
        description: "Implement screenshot diffing for UI regression detection.",
        status: "TODO",
        type: "FEATURE",
        priority: "LOW",
        assigneeId: "user_1",
        due_date: new Date("2025-11-20T00:00:00.000Z"),
      }
    ]
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
