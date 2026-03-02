import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptBuilder } from "./PromptBuilder";
import { api } from "./_generated/api";

export const generateStory = action({
    args: {
        userId: v.string(),
        topic: v.string(),
        age: v.number(),
        protagonistName: v.optional(v.string()),
        childName: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<string> => {
        const prompt = PromptBuilder.build({
            topic: args.topic,
            age: args.age,
            protagonistName: args.protagonistName,
            childName: args.childName
        });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in environment variables.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const storyData = JSON.parse(cleanText);

        // Save story to DB using internal mutation
        const storyId = await ctx.runMutation(api.gemini.saveStory, {
            userId: args.userId,
            title: storyData.title,
            ageGroup: storyData.ageGroup,
            characterDescription: storyData.characterDescription,
            artStyle: storyData.artStyle,
            pages: storyData.pages,
        });

        return storyId as string;
    },
});

export const saveStory = mutation({
    args: {
        userId: v.string(),
        title: v.string(),
        ageGroup: v.string(),
        characterDescription: v.string(),
        artStyle: v.string(),
        pages: v.array(
            v.object({
                textContent: v.string(),
                imageDescription: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("stories", args);
    },
});
