import { Story } from '@/types/story';

const STORAGE_KEY = 'bonne-nuit-stories';

export function getStoredStories(): Story[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveStory(story: Story): Story {
  const stories = getStoredStories();
  const newStory = {
    ...story,
    id: story.id || Date.now().toString(),
    createdAt: story.createdAt || new Date().toISOString(),
  };
  stories.unshift(newStory);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  return newStory;
}

export function getStoryById(id: string): Story | undefined {
  const stories = getStoredStories();
  return stories.find(s => s.id === id);
}

export function deleteStory(id: string): void {
  const stories = getStoredStories().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}
