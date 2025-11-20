import dotenv from 'dotenv';

dotenv.config();

export class ImagenService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private modelName = 'models/gemini-2.5-flash-image'; // The "Nano Banana" model

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string, referenceImage?: Buffer): Promise<Buffer> {
    // Gemini 2.5 Flash Image uses the generateContent endpoint, similar to text models,
    // but returns image data.
    const url = `${this.baseUrl}/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const contents: any[] = [];
    const parts: any[] = [{ text: prompt }];

    if (referenceImage) {
      // Add reference image as inline data
      parts.push({
        inlineData: {
          mimeType: 'image/png', // Assuming PNG for now, or we could detect
          data: referenceImage.toString('base64')
        }
      });
    }

    contents.push({ parts });

    const payload = {
      contents: contents
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Parse the response to get the image bytes
      if (data.candidates && data.candidates.length > 0) {
        const parts = data.candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return Buffer.from(part.inlineData.data, 'base64');
            }
        }
        console.error('No inlineData found in any part. Parts:', JSON.stringify(parts, null, 2));
      }
      
      console.error('Full Response Data:', JSON.stringify(data, null, 2));
      throw new Error('No image data found in response');

    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
}
