import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    stories: defineTable({
        userId: v.string(), // Authenticated user's ID
        title: v.string(),
        ageGroup: v.string(),
        characterDescription: v.string(),
        artStyle: v.string(),
        referenceImageId: v.optional(v.id("_storage")),
        pages: v.array(
            v.object({
                textContent: v.string(),
                imageDescription: v.string(),
                imageId: v.optional(v.id("_storage")),
            })
        ),
    }).index("by_userId", ["userId"]),
});
