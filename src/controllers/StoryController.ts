import { Request, Response } from 'express';
import { GeminiService } from '../services/GeminiService';
import { StoryRequest } from '../models/Story';

const geminiService = new GeminiService();

export class StoryController {
  static async generate(req: Request, reqRes: Response): Promise<void> {
    try {
      const { topic, age, childName } = req.body;

      if (!topic || !age) {
        reqRes.status(400).json({ error: 'Topic and age are required' });
        return;
      }

      const storyRequest: StoryRequest = {
        topic,
        age: parseInt(age as string, 10),
        childName,
      };

      const story = await geminiService.generateStory(storyRequest);
      reqRes.json(story);
    } catch (error) {
      console.error('Error in controller:', error);
      reqRes.status(500).json({ error: 'Failed to generate story' });
    }
  }
}
