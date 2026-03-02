# Bonne Nuit - AI Generation Backend

This is the Convex backend for Bonne Nuit. It handles the core AI generation pipelines using Google Gemini models.

This document details the specific internal flow of how stories and images are created.

## 1. Story Generation Flow (`convex/gemini.ts`)

The primary entry point to create a story is the Action `api.gemini.generateStory`.

### What it does:
1. **Prompt Building**: Takes user arguments (`topic`, `age`, `protagonistName`) and uses the internal `PromptBuilder.ts` to construct a highly specific JSON prompt. Note that `PromptBuilder.ts` determines the length of the story based on the child's age.
2. **LLM Generation**: Calls the Gemini Text API (`gemini-3-flash-preview`) with instructions to return a valid JSON object holding the story metadata, characters, art styles, and a list of `pages`.
3. **Database Storage**: The Action then parses the JSON and immediately saves the result to the Convex Database by calling the internal `api.gemini.saveStory` Mutation.
4. **Return**: Returns the `storyId` so the client can begin fetching it.

## 2. Image Generation Flow (`convex/imagen.ts`)

Once a story exists in the database, the client requests image generation for each individual page using the Action `api.imagen.generateImage`.

### What it does:
1. **Prompting**: It constructs an image prompt by combining:
   - The overall story's `artStyle`.
   - The story's `characterDescription`.
   - The specific page's `imageDescription`.
2. **Image Generation**: Calls the Gemini Image API (`gemini-3-pro-image-preview`) with this combined prompt.
3. **Storage Upload**: The Gemini API returns raw base64 data. The Action decodes this into a Blob and uploads it directly to Convex File Storage.
4. **Linking**: The Action calls the internal `api.stories.updatePageImage` Mutation. This saves the Convex `storageId` into the `imageId` field of that specific story page.

## Data Fetching

When the frontend fetches a story using the query `api.stories.get` or `api.stories.list`:
- It retrieves the raw story data.
- It iterates over all pages.
- If a page has an `imageId` stored, it dynamically resolves it into a public `imageUrl` via `ctx.storage.getUrl(imageId)` before sending the data to the client. This allows the client to immediately display the images without making separate storage requests.
