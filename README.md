# Notes App

A note-taking app built with Next.js, Supabase, and shadcn/ui.

## Tech Stack

- **Next.js** (App Router) — full-stack React framework
- **Supabase** — PostgreSQL database with Row Level Security and Auth
- **Zustand** — lightweight global state management
- **shadcn/ui** + **Tailwind CSS** — UI components and styling
- **Vitest** + **React Testing Library** — testing

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
   ```

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Run tests:

   ```bash
   npm test
   ```
