import { useState } from 'react';
import { useAction, useConvex, useMutation } from "convex/react";

export const useStoryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const convex = useConvex();
  const generateStoryAction = useAction("gemini:generateStory" as any);
  const generateImageAction = useAction("imagen:generateImage" as any);
  const generateTurnaroundImageAction = useAction("imagen:generateTurnaroundImage" as any);
  const updateStoryReferenceImageMutation = useMutation("stories:updateStoryReferenceImage" as any);

  const generateImagesInBackground = async (storyId: any) => {
    try {
      const story: any = await convex.query("stories:get" as any, { id: storyId });
      if (!story || !story.pages) return;

      // 1. Generate Character Turnaround Image
      let referenceImageBase64 = null;
      try {
        const turnaroundPrompt = `Character Turnaround: ${story.characterDescription}. Style: ${story.artStyle}. Show multiple angles of the same character on a clean white background. High quality, clear features. Include the sample text "${story.title}" written in a beautiful, readable children's book font to establish a consistent typography style for the rest of the story.`;
        const turnaroundResult: any = await generateTurnaroundImageAction({ prompt: turnaroundPrompt });
        
        if (turnaroundResult && turnaroundResult.storageId) {
          await updateStoryReferenceImageMutation({ 
            storyId: storyId, 
            referenceImageId: turnaroundResult.storageId 
          });
          referenceImageBase64 = turnaroundResult.base64Data;
        }
      } catch (err) {
        console.error("Failed to generate character turnaround:", err);
      }

      // 2. Generate Page Images
      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];
        let fullPrompt = `Style: ${story.artStyle}.\nCharacter: ${story.characterDescription}.\nScene: ${page.imageDescription}.\nEnsure the character appearance is consistent with the description.\nClear and focused composition, visually balanced, ${story.artStyle}.`.trim();

        if (referenceImageBase64) {
          fullPrompt += `\nUse the attached character turnaround image as a strict visual reference. For any text in the image, use the exact same font and typography style as established in the reference image.`;
        }

        await generateImageAction({
          storyId,
          pageIndex: i,
          prompt: fullPrompt,
          referenceImageBase64: referenceImageBase64 || undefined
        });
      }
    } catch (err) {
      console.error("Failed to generate background images:", err);
    }
  };

  const createStory = async (params: {
    userId: string | undefined;
    topic: string;
    protagonist: string;
    childName: string;
    onSuccess: (storyId: string) => void;
  }) => {
    if (!params.topic || !params.protagonist || !params.childName) return;
    setIsGenerating(true);
    try {
      const storyId = await generateStoryAction({
        userId: params.userId,
        topic: params.topic,
        age: 4,
        protagonistName: params.protagonist,
        childName: params.childName,
      });

      // Trigger background image generation!
      // Since it takes a long time, we do it in the background asynchronously
      generateImagesInBackground(storyId);
      
      params.onSuccess(storyId);
    } catch (e) {
      console.error("Error generating story:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    createStory,
  };
};
