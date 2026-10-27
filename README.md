# KNOVA — Team Productivity Platform

> **Plan. Collaborate. Deliver.**

KNOVA is a modern, high-performance Team Productivity Platform designed for speed, clarity, and deep team collaboration. Built on Next.js 16, React 19, Prisma ORM, PostgreSQL, and Tailwind CSS v4, KNOVA helps teams organize projects, manage tasks, collaborate through comments and activity timelines, receive notifications, and monitor velocity through interactive dashboard analytics.

---

## Features

- **Project Workspaces:** Organize work into distinct projects with customizable statuses, priorities, dates, and ownership.
- **Kanban & List Views:** Manage tasks effortlessly using fluid Kanban boards across customizable status columns (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`).
- **Task Management:** Granular tracking of tasks, assignees, deadlines, priorities, and descriptions.
- **Real-time Activity Timeline:** Chronological, transparent audit log of project events, task assignments, member joins, and updates.
- **Contextual Comments:** Discuss requirements directly inside tasks with full editing and deletion controls.
- **Notifications Engine:** Immediate in-app alerts with unread counter badge and read-state synchronization for task assignments, updates, and comments.
- **Analytics Dashboard:** Visual analytics tracking project completion rates, velocity, and priority distributions using Recharts.
- **Role-Based Access Control (RBAC):** Strict permission boundaries (`OWNER`, `ADMIN`, `MEMBER`) preventing unauthorized cross-project access (IDOR protection).

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Frontend:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Database / ORM:** [Prisma ORM 6.19.3](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Base UI](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Authentication:** [Auth.js v5](https://authjs.dev/) (NextAuth with Credentials Provider & JWT sessions)
- **Testing:** [Vitest](https://vitest.dev/)

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0 (Node 22+ recommended)
- **PostgreSQL** installed and running locally on port `5432`
- **npm** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Saran-Ravichandran-06/nova
   cd nova
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template:
   ```bash
   cp .env.example .env
   ```
   Configure your local PostgreSQL connection and authentication secret in `.env`:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/nova?schema=public"
   AUTH_SECRET="your-secure-random-secret"
   ```

4. **Initialize Local Database & Migrations:**
   Generate the Prisma Client and apply the baseline migration:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view KNOVA.

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start development server with Turbopack |
| `npm run build` | `prisma generate && next build` | Generate Prisma client and compile production build |
| `npm run start` | `next start` | Run compiled production build |
| `npm test` | `vitest run` | Run automated unit and permission tests |
| `npm run lint` | `eslint` | Run ESLint code quality checks |
| `npm run db:generate` | `prisma generate` | Generate Prisma client types |
| `npm run db:migrate` | `prisma migrate dev` | Apply migrations to development database |
| `npm run db:deploy` | `prisma migrate deploy` | Deploy pending migrations in production |
| `npm run db:status` | `prisma migrate status` | Check database migration tracking status |
| `npm run db:studio` | `prisma studio` | Open visual database browser at `localhost:5555` |

---

## Security Architecture

KNOVA implements strict backend security boundaries:
- **Server-Side Authorization:** Every server action and route handler validates user permissions (`OWNER`, `ADMIN`, `MEMBER`) against the database before executing mutations.
- **IDOR Protection:** Cross-tenant resource lookups ensure users cannot access projects or tasks they do not belong to.
- **Password Security:** Hashes stored using `bcryptjs` with salt rounds. Raw passwords never leave server memory.
- **Security Headers:** Strict Content-Type-Options, Frame-Options (DENY), Referrer-Policy, and HSTS enabled via `next.config.ts`.
- **Credential Hygiene:** Sensitive database URLs and auth secrets are isolated in `.env` and strictly excluded from Git tracking.

---

## License

This project is proprietary and confidential.
