import { useQuery, useMutation } from "convex/react";

export const useStories = (userId: string | undefined) => {
  const stories = useQuery("stories:list" as any, userId ? { userId } : "skip" as any);
  const removeStoryMutation = useMutation("stories:remove" as any);

  const deleteStory = async (id: string) => {
    try {
      await removeStoryMutation({ id });
    } catch (err) {
      console.error("Delete failed:", err);
      throw err;
    }
  };

  return {
    stories,
    deleteStory
  };
};
