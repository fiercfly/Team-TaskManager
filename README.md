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

### Vercel (Recommended)
1. Push your code to GitHub.
2. Connect your repo to [Vercel](https://vercel.com).
3. Set the following environment variables in the Vercel Dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `AUTH_SECRET`: A secure random string (generate one using `openssl rand -base64 32`).
4. Click **Deploy**.

### Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the following configurations:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `AUTH_SECRET`: Your secure secret.
5. Deploy.

### Database Setup
Before the app works, ensure you sync the database schema:
```bash
npm run db:push
```
(You can run this locally while pointing to your production `DATABASE_URL`)
