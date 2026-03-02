# Bonne Nuit - Backend (Convex)

This directory contains the backend services for the "Bonne Nuit" application, built natively on [Convex](https://convex.dev/). Convex serves as our database, serverless backend, and file storage solution all in one.

## Features

- **Story Generation**: Automatically generates personalized, multi-page bedtime stories for children using Google's Gemini LLM.
- **Image Generation**: Creates unique illustrations for each page of the generated story using the Gemini Image API.
- **Real-time Sync**: The database is fully reactive, making frontend integration seamless and real-time.

## Architecture & Data Flow

The backend consists of the following Convex functions:

### 1. Database Schema (`convex/schema.ts`)
- **`stories` Table**: Stores the generated stories.
  - Fields: `userId`, `title`, `ageGroup`, `characterDescription`, `artStyle`, `pages`.
  - Each `page` contains: `textContent`, `imageDescription`, and an optional `imageId` (a reference to an image saved in Convex File Storage).
  - Index: `by_userId` for efficient fetching.

### 2. Queries & Mutations (`convex/stories.ts`)
- **`list` (Query)**: Fetches all stories for a specific user. It automatically iterates through the pages to resolve the `imageId` into a public `imageUrl` via Convex Storage.
- **`get` (Query)**: Fetches a specific story by its ID, also resolving all image URLs for the client.
- **`updatePageImage` (Mutation)**: Used internally by our image generation action to link a newly generated image ID to a specific page of a story.

### 3. AI Actions
Convex Actions are used to communicate with external APIs (like Google Gemini) because they are allowed to have side effects and take longer to execute than fast Queries/Mutations.
- **`convex/gemini.ts` (`generateStory`)**: 
  - Takes user parameters (topic, age, protagonist name).
  - Uses `PromptBuilder.ts` to construct a high-quality prompt for Gemini.
  - Calls the Gemini text model and requests the output strictly in JSON format.
  - Parses the response and saves the new story directly to the Convex database.
- **`convex/imagen.ts` (`generateImage`)**: 
  - Extracts the story's overall art style, character description, and the specific page's scene description.
  - Calls the Gemini Image API to generate a visualization.
  - Receives a base64 string, converts it to a Blob, and uploads it to Convex File Storage.
  - Calls the internal `updatePageImage` mutation to attach the new storage ID to the story page.

## Running Locally

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   You must set your Gemini API Key in the Convex environment. This is stored securely in your Convex dashboard.
   ```bash
   npx convex env set GEMINI_API_KEY <your-gemini-api-key>
   ```

3. **Start the Development Server**:
   ```bash
   pnpm dev
   ```
   This command starts the local Convex development server (watching for changes) and provides an interactive dashboard URL.

4. **Testing the Pipeline**:
   You can manually test the entire backend generation flow without needing the frontend by running the client test script:
   ```bash
   pnpm test:convex
   ```
   This script mimics a frontend client, calling the story generation action, fetching the story, and then triggering image generations for the pages.
