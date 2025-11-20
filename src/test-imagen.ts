import { ImagenService } from './services/ImagenService';
import fs from 'fs';
import path from 'path';

async function testImageGen() {
  const service = new ImagenService();
  const prompt = "A cute fluffy bunny wearing a red scarf, vector illustration style, flat colors, white background";

  console.log('Generating image...');
  try {
    const imageBuffer = await service.generateImage(prompt);
    console.log('Image generated successfully!');
    
    const outputPath = path.join(__dirname, '../test_image.png');
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`Image saved to ${outputPath}`);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testImageGen();
