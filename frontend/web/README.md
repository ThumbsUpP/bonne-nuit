# Bonne Nuit Web App

Next.js web application for generating and viewing AI-powered bedtime stories.

## Features

- 🔐 Firebase Authentication (Email/Password + Google)
- ✨ Generate personalized stories with AI
- 📚 View and browse your story library
- 📖 Read stories page by page with illustrations
- 🎨 Beautiful, responsive UI with Tailwind CSS

## Setup

1. Copy environment variables:
```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase configuration in `.env.local`

3. Install dependencies:
```bash
npm install
```

4. Run development server:
```bash
npm run dev
```

## Pages

- `/` - Landing page
- `/login` - Authentication
- `/stories` - List of your stories
- `/stories/[id]` - View a specific story
- `/generate` - Create a new story

## Project Structure

```
app/
├── page.tsx           # Landing page
├── login/page.tsx     # Auth page
├── stories/page.tsx   # Stories list
├── stories/[id]/      # Story detail
├── generate/page.tsx  # Story generation form
├── layout.tsx         # Root layout with AuthProvider
└── globals.css        # Global styles

contexts/
└── AuthContext.tsx    # Firebase auth context

lib/
└── firebase.ts        # Firebase configuration
```
