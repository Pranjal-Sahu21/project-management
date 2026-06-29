# Zynero - Modern Project Management Platform 

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square)](https://clerk.com/)
[![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.8.2-764abc?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![Inngest](https://img.shields.io/badge/Inngest-Background%20Jobs-000000?style=flat-square)](https://www.inngest.com/)

A premium, real-time project management platform designed to organize workspaces, track project timelines, manage tasks, collaborate on threads, and view interactive workload analytics.

---

## Overview

Zynero is a professional SaaS-grade project management application. It bridges the gap between high-level project roadmap metrics and granular task progress. Built with a responsive dark-mode dashboard shell and glassmorphic elements, it solves team productivity fragmentation by offering real-time task allocation, interactive discussion threads, and visual analytics charts.

### Key Features
*   **Workspace & Project Roadmaps**: Create workspaces, structure projects, and define statuses, priority ranks, and timelines.
*   **Granular Task System**: Break down projects into component tasks, assign them to team members, set due dates, and track completion states.
*   **Workload & Trend Analytics**: Monitor team workload distribution, task type breakups, and weekly completion velocities using responsive Chart.js analytics.
*   **Interactive Comments**: Communicate in real-time on task discussion threads to keep team logs clean and centralized.
*   **Secure Path Protection**: Clerk-integrated middleware restricting access to private dashboard folders while allowing public landing page discovery.
*   **Public Contact Form**: Seamless corporate contact support featuring sliding animations and automatic simulated validation logs.

---

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.1.0 (App Router) | React framework supporting server component rendering and optimized route loading. |
| **Language** | TypeScript 5.5.2 | Strongly typed code structure for frontend components, API endpoints, and controllers. |
| **Styling** | Tailwind CSS v4.0 | Modern utility framework with custom global CSS variables and responsive glassmorphic cards. |
| **Authentication**| Clerk | Secure login, registration, user profiles, and session management. |
| **State Management**| Redux Toolkit | Centralized client-side state machine caching workspace, project, and user selections. |
| **Database & ORM**| Prisma ORM + PostgreSQL | Relational modeling, migrations, and database operations using PostgreSQL (Neon). |
| **Queue / Workers**| Inngest | Asynchronous event pipelines syncing Clerk registration webhooks to database profiles. |
| **Transitions** | Framer Motion | Smooth slide-up page transitions across routes via a template wrapper. |
| **Charts** | Chart.js & react-chartjs-2 | Visual dashboard metrics mapping status, type, trend, and member workload distributions. |

---

## Project Structure

```bash
project-management/
├── prisma/                  # Database schema modeling and migration logs
│   └── schema.prisma        # Prisma schema containing User, Workspace, Project, Task, and Comment models
├── public/                  # Static assets (icons, images, logos)
└── src/
    ├── app/                 # Next.js App Router folders (pages, templates, routing)
    │   ├── api/             # API routes (Inngest webhook listener endpoints)
    │   ├── contact/         # Public Contact Us page and Client components
    │   ├── projects/        # Workspace Projects overview page
    │   ├── projectsDetail/  # Dedicated project view (Analytics, Tasks list, Settings tabs)
    │   ├── team/            # Workspace Team membership list page
    │   ├── settings/        # Workspace configurations page
    │   ├── taskDetails/     # Dedicated Task discussion and description detail pages
    │   ├── globals.css      # Core style definitions and Tailwind CSS directives
    │   ├── layout.tsx       # Root layout configuring Google fonts and providers
    │   ├── middleware.ts    # Clerk routing configuration protecting private routes
    │   └── template.tsx     # Framer Motion page transition wrapper
    ├── assets/              # SVG vectors and graphic icons
    ├── components/          # Reusable React components (Sidebar, LayoutShell, StatsGrid, Skeletons)
    ├── controllers/         # Backend database controller handlers verifying admin/assignee rules
    ├── features/            # Redux store state slices (user, workspace, project, task slices)
    ├── inngest/             # Inngest event definitions and user sync functions
    └── lib/                 # Shared database clients, utilities, and helper scripts
```

---

## Installation

### Prerequisites
*   [Node.js](https://nodejs.org/en/) (v20+ recommended)
*   [npm](https://www.npmjs.com/) or equivalent package manager
*   A running [PostgreSQL](https://www.postgresql.org/) database (e.g. Neon, Supabase)
*   A [Clerk](https://clerk.com/) account for authentication keys

### Steps

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Pranjal-Sahu21/project-management.git
    cd project-management
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the root directory and define the values as listed in the [Configuration](#configuration) section.

4.  **Sync Database Schema & Generate Prisma Client**:
    Push the schema model to your PostgreSQL database:
    ```bash
    npx prisma db push
    ```

5.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Usage

### UI Showcase


<img src="./public/Landing_Mockup.png" alt="Zynero Landing page Layout" width = "100%"/>
  <img src="./public/CTA_Image.png" alt="Zynero Desktop Layout" width="100%" />
  &nbsp;&nbsp;
  <img src="./public/Mobile_Dashboard.png" alt="Zynero Mobile Layout" width="100%" />


1.  **Public Access**: View the landing page and submit inquiries via the public **Contact Us** page.
2.  **Authentication**: Register or log in to create or join a workspace.
3.  **Create Workspace**: Set up a custom workspace profile.
4.  **Project Management**: Admins can create new projects and define timelines. Team members can view project analytics and settings.
5.  **Task Allocation**: Assign tasks, update statuses (To Do, In Progress, Done), and comment on tasks. Non-admin users are restricted to modifying status on tasks they are assigned to.
6.  **Analytics Dashboard**: Check status ratios, type counts, task trends, and member workload distributions in the Analytics tab.

---

## Configuration

The application requires the following environment variables to run. Create a `.env` file in the root folder with this structure:

### Required Variables

| Name | Type | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | String | Connection string for your PostgreSQL database (include SSL mode if using Neon). |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | String | Public key retrieved from the Clerk Developer Dashboard. |
| `CLERK_SECRET_KEY` | String | Secret key retrieved from the Clerk Developer Dashboard. |
| `CLERK_WEBHOOK_SECRET` | String | Webhook signing secret used to verify Clerk event payloads sent to `/api/inngest`. |
| `INNGEST_EVENT_KEY` | String | Event sending key obtained from the Inngest Cloud Console. |
| `INNGEST_SIGNING_KEY` | String | Inngest signing secret key used to verify job handshakes. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | String | Path to redirects on login requests (e.g. `/sign-in`). |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | String | Path to redirects on registration requests (e.g. `/sign-up`). |

### Example `.env` File
```env
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."
NODE_ENV="development"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts the Next.js local development server with hot-reloading. |
| `npm run build` | `prisma generate && next build` | Compiles the database Prisma client schema model and builds the Next.js production build package. |
| `npm run start` | `next start` | Starts the compiled production server in your deployment environment. |
| `npm run lint` | `next lint` | Executes ESLint to check for code formatting and rule violations. |

---

## Architecture

Zynero follows a robust architectural flow combining server-side database handlers, global client-side slices, and asynchronous worker queues:

```mermaid
graph TD
    User([User Browser]) -->|Routes| Pages[Next.js Pages /app]
    Pages -->|Dispatches| ReduxStore[Redux Slices /features]
    Pages -->|Invokes| DBControllers[DB Controllers /controllers]
    DBControllers -->|Queries| Prisma[Prisma Client]
    Prisma -->|Reads/Writes| DB[(PostgreSQL)]
    
    Clerk[Clerk Auth Service] -->|Webhooks| Inngest[Inngest Event Worker]
    Inngest -->|Sync User Profile| Prisma
    
    Middleware[Clerk Middleware] -->|Filters Requests| Pages
```

*   **Authentication & Profile Sync**: When a user registers via Clerk, Clerk emits a webhook which is processed by the **Inngest** worker queue. Inngest executes a sync handler, creating a matching profile inside the PostgreSQL database via Prisma.
*   **Clerk Middleware**: Filters all incoming Next.js requests. Public paths (`/`, `/contact`, `/sitemap.xml`, `/robots.txt`) bypass middleware checks, while private routes trigger a sign-in redirect.
*   **State Sync (Redux)**: Global workspaces, selected projects, and active tasks are cached in Redux Toolkit on the client side, ensuring components render instantly during route switches.
*   **Controller Level**: Standard operations (project/task details creation or modification) pass through backend controllers verify user identity and check workspace membership role status (`ADMIN` vs `MEMBER`) before issuing Prisma commits.

---

## Deployment

Zynero is optimized for deployment on the **Vercel** platform.

### Step-by-Step Vercel Deployment

1.  Create a new project on **Vercel** and import your GitHub repository.
2.  In the project **Environment Variables** settings, add all the keys listed in the [Configuration](#configuration) section.
3.  Configure the Vercel **Build Command**:
    ```bash
    npm run build
    ```
    *(This is configured to run `prisma generate && next build` automatically, ensuring Vercel compiles the schema client before generating static pages)*.
4.  Click **Deploy**. Vercel will host your site and configure automatic SSL certificates.



---

