import { Response } from 'express';
import { GeminiService } from '../services/GeminiService';
import { StoryRequest } from '../models/Story';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';

const geminiService = new GeminiService();

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

      // Save to Firestore
      if (db) {
        const docRef = await db.collection('stories').add({
          ...story,
          userId,
          createdAt: new Date().toISOString(),
          topic,
          age,
          protagonistName: protagonistName || childName
        });
        res.json({ id: docRef.id, ...story });
      } else {
        res.json(story);
      }
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

      if (!db) {
        res.status(500).json({ error: 'Database not initialized' });
        return;
      }

      const snapshot = await db.collection('stories')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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

      if (!db) {
        res.status(500).json({ error: 'Database not initialized' });
        return;
      }

      const doc = await db.collection('stories').doc(id).get();

      if (!doc.exists) {
        res.status(404).json({ error: 'Story not found' });
        return;
      }

      const data = doc.data();
      if (data?.userId !== userId) {
        res.status(403).json({ error: 'Unauthorized to access this story' });
        return;
      }

      res.json({ id: doc.id, ...data });
    } catch (error) {
      console.error('Error getting story:', error);
      res.status(500).json({ error: 'Failed to get story' });
    }
  }
}
