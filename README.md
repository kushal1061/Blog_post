# 🖋️ Inkwell

**Inkwell** is a modern, AI-powered blogging platform designed for storytellers and editorial enthusiasts. Built with the **Next.js 16 (Turbopack)** and **Supabase**, it combines a sleek, minimalist aesthetic with powerful features like AI-driven summaries and rich-text editing.

---

## ✨ Features

### 📖 For Readers
- **Editorial Aesthetic**: A clean, typography-focused design optimized for reading.
- **AI Summaries**: Get the gist of any story instantly with Gemini-powered AI summaries.
- **Global Search**: Find stories easily with a high-performance search engine.
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop.
- **Interactive Comments**: Engage with authors through a real-time discussion system.

### ✍️ For Authors
- **Rich Text Editor**: A professional-grade editor built with Tiptap, supporting headings, formatting, and more.
- **Image Management**: Integrated Supabase Storage for high-quality featured images.
- **Story Dashboard**: A dedicated profile page to manage your published stories, drafts, and edits.
- **Automated Metadata**: AI automatically generates summaries for your posts to improve SEO and engagement.
- **Role-Based Access**: Specialized permissions for Viewers, Authors, and Admins.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI Engine**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kushal1061/Blog_post.git
cd Blog_post
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Database Setup
Execute the SQL found in `supabase-setup.sql` within your Supabase SQL Editor to initialize tables, triggers, and RLS policies.

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📁 Project Structure

```text
├── app/               # Next.js App Router (Pages, API, Styles)
├── components/        # Reusable React components (Navbar, PostCard, etc.)
├── lib/               # Shared utilities (Supabase client, UserContext)
├── public/            # Static assets
└── supabase-setup.sql # Database schema and RLS policies
```

---

## 📜 License

This project is licensed under the MIT License.

---

*Built with ❤️ for the future of digital storytelling.*
