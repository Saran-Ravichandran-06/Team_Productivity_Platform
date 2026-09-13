# Nova

Nova is a modern, high-performance Project and Task Management platform designed for speed and clarity. Built on top of Next.js, Prisma, and Tailwind CSS, Nova provides an intuitive Kanban board, rich analytics, and comprehensive activity tracking for engineering and product teams.

## Features

- **Project Workspaces:** Organize work into distinct projects with customizable statuses and priorities.
- **Kanban & List Views:** Manage tasks effortlessly using fluid Kanban boards or dense list views.
- **Task Management:** Granular tracking of tasks, assignees, deadlines, and priorities.
- **Real-time Activity Timeline:** Keep track of everything happening in a project with chronological activity feeds.
- **Comments & Collaboration:** Leave comments on tasks and discuss requirements directly within the context of the work.
- **Analytics Dashboard:** Get a bird's eye view of project velocity, completion rates, and upcoming deadlines.
- **Notifications Engine:** Stay updated with unread counts and read-state synchronization for all activities.
- **Role-based Access Control (RBAC):** Secure permission boundaries ensuring users only see and interact with authorized projects.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Database / ORM:** [Prisma](https://www.prisma.io/) + SQLite (Dev) / PostgreSQL (Prod)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Base UI](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Authentication:** NextAuth / Next.js API Routes (Cookies/JWT)

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Nova
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy the example environment file and fill in your secrets.
   ```bash
   cp .env.example .env
   ```
   > **Note:** Make sure to set a secure `JWT_SECRET` or `AUTH_SECRET` in your `.env`.

4. Setup Database:
   Initialize the Prisma schema and run migrations.
   ```bash
   npx prisma generate
   npx prisma db push
   # Or npx prisma migrate dev
   ```

5. Run the Development Server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Security

Nova implements strict backend security boundaries:
- Server-side permission validation for all operations.
- Data aggregation and analytics are computed exclusively on the server to prevent data leakage.
- Environment secrets are securely omitted from client bundles.

## License

This project is proprietary and confidential.
