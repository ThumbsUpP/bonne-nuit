import { GeminiService } from './services/GeminiService';
import { ImagenService } from './services/ImagenService';
import { StoryRequest, Story } from './models/Story';
import fs from 'fs';
import path from 'path';

async function generateBook() {
  const gemini = new GeminiService();
  const imagen = new ImagenService();

  const request: StoryRequest = {
    topic: 'Une aventure de pirate',
    age: 1.5,
    protagonistName: 'Barbe Bleu',
    childName: 'Colombe'
  };

  console.log('📖 Generating story text...');
  try {
    const story = await gemini.generateStory(request);
    console.log(`✅ Story generated: "${story.title}"`);
    console.log(`   Character: ${story.characterDescription}`);
    console.log(`   Style: ${story.artStyle}`);

    const outputDir = path.join(__dirname, '../generated_book');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Save text
    fs.writeFileSync(path.join(outputDir, 'story.json'), JSON.stringify(story, null, 2));

    console.log(`🎨 Generating images for ${story.pages.length} pages...`);

    let firstImageBuffer: Buffer | null = null;

    for (let i = 0; i < story.pages.length; i++) {
      const page = story.pages[i];
      console.log(`   [Page ${i + 1}/${story.pages.length}] Generating image...`);

      // Construct the full prompt for consistency
      const fullPrompt = `
        Style: ${story.artStyle}.
        Character: ${story.characterDescription}.
        Scene: ${page.imageDescription}.
        Ensure the character appearance is consistent with the description.
        High quality, detailed, ${story.artStyle}.
      `.trim();

      try {
        // Pass firstImageBuffer if it exists (for pages 2+)
        const imageBuffer = await imagen.generateImage(fullPrompt, firstImageBuffer || undefined);

        // Store the first image to use as reference
        if (i === 0) {
          firstImageBuffer = imageBuffer;
          console.log('   📸 First image captured as reference!');
        }

        const imagePath = path.join(outputDir, `page_${i + 1}.png`);
        fs.writeFileSync(imagePath, imageBuffer);
        console.log(`   ✅ Saved to ${imagePath}`);
      } catch (err) {
        console.error(`   ❌ Failed to generate image for page ${i + 1}:`, err);
      }
    }

    console.log('📚 Book generation complete! Check the "generated_book" folder.');

  } catch (error) {
    console.error('Book generation failed:', error);
  }
}

generateBook();
