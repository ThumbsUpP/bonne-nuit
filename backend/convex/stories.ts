import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const stories = await ctx.db
            .query("stories")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        return await Promise.all(
            stories.map(async (story) => {
                const pagesWithUrls = await Promise.all(
                    story.pages.map(async (page) => {
                        let imageUrl = null;
                        if (page.imageId) {
                            imageUrl = await ctx.storage.getUrl(page.imageId);
                        }
                        return {
                            ...page,
                            imageUrl,
                        };
                    })
                );
                return {
                    ...story,
                    pages: pagesWithUrls,
                };
            })
        );
    },
});

export const get = query({
    args: { id: v.id("stories") },
    handler: async (ctx, args) => {
        const story = await ctx.db.get(args.id);
        if (!story) return null;

        const pagesWithUrls = await Promise.all(
            story.pages.map(async (page) => {
                let imageUrl = null;
                if (page.imageId) {
                    imageUrl = await ctx.storage.getUrl(page.imageId);
                }
                return {
                    ...page,
                    imageUrl,
                };
            })
        );

        return {
            ...story,
            pages: pagesWithUrls,
        };
    },
});

export const updatePageImage = mutation({
    args: {
        storyId: v.id("stories"),
        pageIndex: v.number(),
        imageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const story = await ctx.db.get(args.storyId);
        if (!story) {
            throw new Error(`Story not found: ${args.storyId}`);
        }

        if (args.pageIndex < 0 || args.pageIndex >= story.pages.length) {
            throw new Error(`Invalid page index: ${args.pageIndex}`);
        }

        story.pages[args.pageIndex].imageId = args.imageId;

        await ctx.db.patch(args.storyId, { pages: story.pages });

        return true;
    },
});
