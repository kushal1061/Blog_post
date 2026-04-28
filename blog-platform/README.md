# Full-Stack Next.js Blogging Platform

A complete, feature-rich blogging platform built with modern web technologies, scalable auth, database infrastructure, and Google's powerful Gemini AI for automatic summarization.

## 1. Project Overview
This project provides a robust solution for a blogging platform. It supports full user authentication with defined roles (`author`, `viewer`, `admin`), rich post management, AI-generated summaries, and an interactive commenting system. Everything is seamlessly wrapped in a high-performance Next.js 14/15 application.

## 2. Tech Stack
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database + Auth + Storage**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **AI Integrations**: [Google Gemini API (@google/generative-ai)](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 3. Local Setup Instructions
Follow these steps to get the project running on your local machine:

1. **Clone the repository** (if pushed to Github).
2. **Install Dependencies**: Execute `npm install` inside the project folder.
3. **Set Up the Environment Variables**:
   In the root of the project, edit the existing `.env.local` file and replace the placeholder text with your actual keys from Supabase and Google MakerSuite:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. **Run the Development Server**: Launch it using `npm run dev` and navigate to `http://localhost:3000`.

## 4. Supabase Setup Steps
Before starting the app, you must set up the database using Supabase. A SQL script `supabase-setup.sql` has been automatically prepared.
1. Create a new Supabase Project.
2. In the left-hand menu, navigate to the **SQL Editor**.
3. Open `supabase-setup.sql` and copy its entire content into the SQL Editor, then click **Run**. This will create the `users`, `posts`, and `comments` tables, configure RLS policies, and establish the user trigger.
4. Navigate to **Storage** and create a newly-named **public** bucket called `post-images` (ensure it is marked Public).

## 5. Deployment Steps
1. Push your local codebase to a new **GitHub repository**.
2. Create an account or log in to **Vercel** (`vercel.com`).
3. Import your GitHub repository to Vercel.
4. Before clicking Deploy, manually enter the four Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`) into Vercel's Environment Variables settings array.
5. Click **Deploy**.

## 6. AI Tools Section
**Antigravity** was utilized for drafting, developing, and architecting this entire solution. It was chosen to rapidly bootstrap the Next.js infrastructure and cleanly construct repetitive schema tables, Next.js Middleware routing protections, robust server queries using the Supabase App Router SSR package, and design system aesthetics with Tailwind CSS. It dramatically accelerated development through automated dependency installations and generating functional E2E code in minutes.

## 7. Feature Logic Section
- **Auth Flow**: Supabase Authentication handles users with Email/Password. Custom profiles are auto-injected into a public `users` table via Postgres SQL triggers upon sign-up. 
- **Role-Based Access**: RoleGuard component acts as an intercept on the UI, checking a shared `UserContext`. A secure Next.js Edge Middleware route guards non-public endpoints.
- **Post Creation & AI**: Image uploads bypass generic REST limits utilizing `supabase.storage`. The Google Gemini API is called upon generation to auto-summarize articles.

## 8. Cost Optimization Section
The **Gemini `generateContent` API** request is strategically isolated into an API endpoint (`/api/generate-summary`). This executes _only_ once on initial post submission (via `CreatePost`). The 200-word response string is immediately recorded onto the `posts` Supabase PostgreSQL table. Edits updates only modify the core database rows—ensuring **ZERO** repeated/useless Gemini requests.

## 9. Bug/Decision Section
**Architectural Decision**: Passing Supabase relationships. Initial consideration was to maintain redundant names in records (denormalization), but for scalability and proper SQL principles, we chose to maintain `author_id` references heavily leveraging Supabase PostgREST nested querying structures e.g. `users(name)` from `createClient()`. This provides a single source of truth for all users.
