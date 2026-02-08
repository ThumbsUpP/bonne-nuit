import { GeminiService } from './services/GeminiService';
import { StoryRequest } from './models/Story';
import fs from 'fs';
import path from 'path';

async function testGeneration() {
  const service = new GeminiService();
  
  const request: StoryRequest = {
    topic: 'A brave bunny who goes to the moon',
    age: 4,
    protagonistName: 'Barnaby',
    childName: 'Alice'
  };

  console.log('Generating story...');
  try {
    const story = await service.generateStory(request);
    console.log('Story generated successfully!');
    
    const outputPath = path.join(__dirname, '../test_story.json');
    fs.writeFileSync(outputPath, JSON.stringify(story, null, 2));
    console.log(`Story saved to ${outputPath}`);
    
    console.log('Preview:');
    console.log(`Title: ${story.title}`);
    console.log(`Age Group: ${story.ageGroup}`);
    console.log(`Character: ${story.characterDescription}`);
    console.log(`Style: ${story.artStyle}`);
    console.log(`Pages: ${story.pages.length}`);
    console.log(`First page text: ${story.pages[0].textContent}`);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testGeneration();
