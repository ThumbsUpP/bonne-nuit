import { GoogleGenerativeAI } from '@google/generative-ai';
import { Story, StoryRequest } from '../models/Story';
import { PromptBuilder } from '../utils/PromptBuilder';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  }

  async generateStory(request: StoryRequest): Promise<Story> {
    const prompt = PromptBuilder.build(request);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up potential markdown formatting if the model ignores the instruction
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const story: Story = JSON.parse(cleanText);
      return story;
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story');
    }
  }
}
