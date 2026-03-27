import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
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

        const storySchema: Schema = {
            type: SchemaType.OBJECT,
            properties: {
                synopsisAndPlanning: {
                    type: SchemaType.STRING,
                    description: "Internal monologue mapping out the 3-act structure and plot before writing."
                },
                title: { type: SchemaType.STRING, description: "Title of the story in French" },
                ageGroup: { type: SchemaType.STRING, description: "Target age group" },
                characterDescription: { type: SchemaType.STRING, description: "Visual description of the character in English" },
                artStyle: { type: SchemaType.STRING, description: "Art style description in English" },
                pages: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            textContent: { type: SchemaType.STRING, description: "Story text for the page in French" },
                            imageDescription: { type: SchemaType.STRING, description: "Image prompt in English" }
                        },
                        required: ["textContent", "imageDescription"]
                    }
                }
            },
            required: ["synopsisAndPlanning", "title", "ageGroup", "characterDescription", "artStyle", "pages"]
        };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-3-pro-preview',
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: storySchema,
            }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const storyData = JSON.parse(text);

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

export const suggestProposition = action({
    args: {
        field: v.string(),
    },
    handler: async (ctx, args): Promise<string> => {
        const prompt = PromptBuilder.buildSuggestionPrompt(args.field);

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in environment variables.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        return text;
    },
});

export const saveStory = mutation({
    args: {
        userId: v.string(),
        title: v.string(),
        ageGroup: v.string(),
        characterDescription: v.string(),
        artStyle: v.string(),
        referenceImageId: v.optional(v.id("_storage")),
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
