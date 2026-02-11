import { Response } from 'express';
import { GeminiService } from '../services/GeminiService';
import { StoryRequest } from '../models/Story';
import { LocalDbService } from '../services/LocalDbService';
import { AuthRequest } from '../middleware/auth';

const geminiService = new GeminiService();
const localDbService = new LocalDbService();

export class StoryController {
  static async generate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { topic, age, protagonistName, childName } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!topic || !age) {
        res.status(400).json({ error: 'Topic and age are required' });
        return;
      }

      const storyRequest: StoryRequest = {
        topic,
        age: parseInt(age as string, 10),
        protagonistName,
        childName,
      };

      const story = await geminiService.generateStory(storyRequest);

      // Save to local DB
      const storedStory = await localDbService.addStory(userId, {
        ...story,
        topic,
        age,
        protagonistName: protagonistName || childName
      });

      res.json(storedStory);
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).json({ error: 'Failed to generate story' });
    }
  }

  static async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const stories = await localDbService.getAllStories(userId);
      res.json(stories);
    } catch (error) {
      console.error('Error listing stories:', error);
      res.status(500).json({ error: 'Failed to list stories' });
    }
  }

  static async get(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const story = await localDbService.getStoryById(id as string, userId);

      if (!story) {
        res.status(404).json({ error: 'Story not found' });
        return;
      }

      res.json(story);
    } catch (error) {
      console.error('Error getting story:', error);
      res.status(500).json({ error: 'Failed to get story' });
    }
  }
}
