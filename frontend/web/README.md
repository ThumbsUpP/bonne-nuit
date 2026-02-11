# Bonne Nuit Web App

Next.js web application for generating and viewing AI-powered bedtime stories.

## Features

- ✨ Generate personalized stories with AI (mock mode for testing)
- 📚 View and browse your story library
- 📖 Read stories page by page with illustrations
- 💾 Local storage - no backend needed for testing
- 🎨 Beautiful, responsive UI with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Landing page
- `/login` - Local authentication (stored in localStorage)
- `/stories` - List of your stories
- `/stories/[id]` - View a specific story
- `/generate` - Create a new story

## Data Storage

All data is stored locally in your browser:
- `bonne-nuit-user` - User session
- `bonne-nuit-stories` - Your generated stories

## Connecting to Backend

To connect to your actual backend API with Gemini:

1. Edit `app/generate/page.tsx`
2. Replace `generateMockStory()` with a real API call:

```typescript
const response = await fetch('http://localhost:3000/api/stories/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request),
});
const story = await response.json();
```

## Project Structure

```
app/
├── page.tsx           # Landing page
├── login/page.tsx     # Auth page
├── stories/page.tsx   # Stories list (local storage)
├── stories/[id]/      # Story detail
├── generate/page.tsx  # Story generation form
├── layout.tsx         # Root layout with AuthProvider
└── globals.css        # Global styles

contexts/
└── AuthContext.tsx    # Local auth context

lib/
├── storage.ts         # localStorage helpers
└── firebase.ts        # (deleted - not needed for local mode)

types/
└── story.ts           # TypeScript types
```
