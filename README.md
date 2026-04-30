# Team Task Manager

A simple full-stack task management web application built for teams to collaborate on projects and track tasks.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Neon.tech) with Drizzle ORM
- **Auth**: NextAuth.js v5

## Features

- **Projects**: Create and manage project workspaces.
- **Kanban Board**: Drag-and-drop style task management (status updates).
- **Dashboard**: Simple stats for total and in-progress tasks.
- **Team Roles**: Basic Admin and Member roles.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables in `.env.local`:
   ```env
   DATABASE_URL="your_postgresql_url"
   NEXTAUTH_SECRET="your_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```
3. Sync database:
   ```bash
   npx drizzle-kit push
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```

## Deployment

Deploy to Vercel or Railway by connecting your GitHub repo and adding the environment variables.
