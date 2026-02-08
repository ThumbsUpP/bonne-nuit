import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key found');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // We can't directly list models with the high-level SDK easily in some versions, 
  // but let's try to just use a known working one or print error details.
  // Actually, the SDK doesn't have a simple listModels method exposed on the main class in all versions.
  // Let's try to just use 'gemini-1.5-flash' again but print the error more carefully?
  // No, the error was clear: 404.
  
  // Let's try 'gemini-1.5-flash' again but maybe the issue is the API key itself?
  // If the API key is invalid, it usually gives 400 or 403. 404 on the model usually means the model doesn't exist or isn't accessible.
  
  // Let's try a very standard one: 'gemini-pro' (which failed).
  // Let's try 'gemini-1.0-pro'.
  
  console.log('Checking available models is not directly supported by this SDK version easily.');
}

listModels();
