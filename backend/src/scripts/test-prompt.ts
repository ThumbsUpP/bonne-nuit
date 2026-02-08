import { GeminiService } from '../services/GeminiService';
import { PromptBuilder } from '../utils/PromptBuilder';
import { StoryRequest } from '../models/Story';
import fs from 'fs';
import path from 'path';

async function testPrompt() {
  const args = process.argv.slice(2);
  const params: any = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace('--', '');
      const value = args[++i];
      params[key] = value;
    }
  }

  const topic = params.topic || 'A magical adventure in the deep sea';
  const age = parseFloat(params.age) || 5;
  const protagonistName = params.protagonist || 'Nemo';
  const childName = params.child || 'Leo';

  const request: StoryRequest = {
    topic,
    age,
    protagonistName,
    childName
  };

  const gemini = new GeminiService();
  
  console.log('--- PROMPT PARAMETERS ---');
  console.log(`Topic: ${topic}`);
  console.log(`Age: ${age}`);
  console.log(`Protagonist: ${protagonistName}`);
  console.log(`Child: ${childName}`);
  console.log('-------------------------\n');

  const prompt = PromptBuilder.build(request);
  console.log('--- GENERATED PROMPT ---');
  console.log(prompt);
  console.log('-------------------------\n');

  console.log('🤖 Calling Gemini...');
  try {
    const story = await gemini.generateStory(request);
    console.log('✅ Story generated successfully!');
    console.log(`Title: ${story.title}`);
    console.log(`Pages: ${story.pages.length}`);

    const outputPath = path.join(process.cwd(), 'test_story.json');
    fs.writeFileSync(outputPath, JSON.stringify(story, null, 2));
    console.log(`\n💾 Result saved to: ${outputPath}`);

    story.pages.forEach((page, index) => {
      console.log(`\n--- PAGE ${index + 1} ---`);
      console.log(page.textContent);
      console.log(`🖼️ IMAGE PROMPT: ${page.imageDescription}`);
      console.log('------------------------------');
    });

  } catch (error) {
    console.error('❌ Failed to generate story:', error);
  }
}

testPrompt();
