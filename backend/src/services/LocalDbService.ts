import fs from 'fs/promises';
import { storageConfig } from '../config/storage';
import { Story } from '../models/Story';
import { v4 as uuidv4 } from 'uuid';

export interface StoredStory extends Story {
    id: string;
    userId: string;
    createdAt: string;
    topic: string;
    age: number;
    protagonistName?: string;
}

export class LocalDbService {
    private async ensureFileExists() {
        try {
            await fs.access(storageConfig.storiesFile);
        } catch {
            await fs.writeFile(storageConfig.storiesFile, JSON.stringify([], null, 2));
        }
    }

    async getAllStories(userId: string): Promise<StoredStory[]> {
        await this.ensureFileExists();
        const data = await fs.readFile(storageConfig.storiesFile, 'utf-8');
        const stories: StoredStory[] = JSON.parse(data);
        return stories
            .filter(s => s.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async getStoryById(id: string, userId: string): Promise<StoredStory | null> {
        await this.ensureFileExists();
        const data = await fs.readFile(storageConfig.storiesFile, 'utf-8');
        const stories: StoredStory[] = JSON.parse(data);
        const story = stories.find(s => s.id === id && s.userId === userId);
        return story || null;
    }

    async addStory(userId: string, storyParams: any): Promise<StoredStory> {
        await this.ensureFileExists();
        const data = await fs.readFile(storageConfig.storiesFile, 'utf-8');
        const stories: StoredStory[] = JSON.parse(data);

        const newStory: StoredStory = {
            ...storyParams,
            id: uuidv4(),
            userId,
            createdAt: new Date().toISOString(),
        };

        stories.push(newStory);
        await fs.writeFile(storageConfig.storiesFile, JSON.stringify(stories, null, 2));
        return newStory;
    }
}
