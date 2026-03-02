import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const generateImage = action({
    args: {
        storyId: v.id("stories"),
        pageIndex: v.number(),
        prompt: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Validate API Key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in environment variables.");
        }

        // 2. Prepare payload for Gemini Image API
        const baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        const modelName = 'models/gemini-3-pro-image-preview'; // Nano Banana Pro
        const url = `${baseUrl}/${modelName}:generateContent?key=${apiKey}`;

        const payload = {
            contents: [
                {
                    parts: [{ text: args.prompt }]
                }
            ]
        };

        // 3. Make HTTP call
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        // 4. Extract base64 image data
        let base64Data: string | null = null;
        if (data.candidates && data.candidates.length > 0) {
            const parts = data.candidates[0].content.parts;
            for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                    base64Data = part.inlineData.data;
                    break;
                }
            }
        }

        if (!base64Data) {
            console.error('No inlineData found in any part. Parts:', JSON.stringify(data.candidates?.[0]?.content?.parts, null, 2));
            throw new Error('No image data found in response');
        }

        // 5. Convert base64 to Blob
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "image/png" });

        // 6. Store in Convex Storage
        const storageId = await ctx.storage.store(blob);

        // 7. Update Story Page with Image ID
        await ctx.runMutation(api.stories.updatePageImage, {
            storyId: args.storyId,
            pageIndex: args.pageIndex,
            imageId: storageId,
        });

        return storageId;
    },
});
