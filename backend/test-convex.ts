import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";
import dotenv from "dotenv";
import path from "path";

// Load the environment variables from the .env.local file
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
const httpClient = new ConvexHttpClient(process.env.CONVEX_URL!);

async function testBackend() {
    console.log("🚀 Testing Convex Backend Migration...");

    const request = {
        userId: "test-user-id",
        topic: "Un petit lapin courageux",
        age: 4,
        protagonistName: "Pompon",
        childName: "Alice"
    };

    console.log(`📖 Generating story about "${request.topic}" for ${request.childName}...`);
    try {
        // 1. Test generateStory action
        const storyId = await httpClient.action(api.gemini.generateStory, request);
        console.log(`✅ Story successfully generated and saved! ID: ${storyId}`);

        // 2. Test get query
        console.log(`🔍 Fetching the newly generated story...`);
        const story = await httpClient.query(api.stories.get, { id: storyId as any });

        if (story) {
            console.log(`✅ Story fetched successfully!`);
            console.log(`   Title: ${story.title}`);
            console.log(`   Pages: ${story.pages.length}`);
            console.log(`   Style: ${story.artStyle}`);
        } else {
            console.log(`❌ Failed to fetch story with ID: ${storyId}`);
        }

        // 3. Test list query
        console.log(`\n📚 Fetching all stories for user "test-user-id"...`);
        const allStories = await httpClient.query(api.stories.list, { userId: "test-user-id" });
        console.log(`✅ Found ${allStories.length} stories for this user.`);

        // 4. Test generateImage action for ALL pages
        if (story && story.pages.length > 0) {
            console.log(`\n🎨 Generating images for all ${story.pages.length} pages...`);

            for (let i = 0; i < story.pages.length; i++) {
                console.log(`   [Page ${i + 1}/${story.pages.length}] Generating image...`);
                const page = story.pages[i];
                const fullPrompt = `
                  Style: ${story.artStyle}.
                  Character: ${story.characterDescription}.
                  Scene: ${page.imageDescription}.
                  Ensure the character appearance is consistent with the description.
                  High quality, detailed, ${story.artStyle}.
                `.trim();

                const storageId = await httpClient.action(api.imagen.generateImage, {
                    storyId: storyId as any,
                    pageIndex: i,
                    prompt: fullPrompt
                });
                console.log(`   ✅ Saved to Convex storage! Storage ID: ${storageId}`);
            }

            // Refetch story to verify imageId is saved and get URLs
            const updatedStory = await httpClient.query(api.stories.get, { id: storyId as any });
            console.log(`\n✅ Story fully updated! Images available at:`);
            updatedStory?.pages.forEach((page: any, index: number) => {
                console.log(`   Page ${index + 1}: ${page.imageUrl}`);
            });
        }

    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

testBackend();
