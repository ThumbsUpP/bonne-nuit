import { db, storage } from './config/firebase';
import fs from 'fs';
import path from 'path';

async function testFirebase() {
  console.log('Testing Firebase connection...');

  if (!db || !storage) {
    console.error('Firebase not initialized!');
    return;
  }

  try {
    // 1. Test Firestore
    console.log('Writing to Firestore...');
    const docRef = db.collection('test_collection').doc('test_doc');
    await docRef.set({
      message: 'Hello from Bonne Nuit Backend!',
      timestamp: new Date()
    });
    console.log('Firestore write successful!');

    // 2. Test Storage
    console.log('Uploading to Storage...');
    const bucket = storage.bucket();
    const testFilePath = path.join(__dirname, '../package.json'); // Use package.json as a dummy file
    const destination = 'test_uploads/package.json';
    
    await bucket.upload(testFilePath, {
      destination: destination,
    });
    console.log('Storage upload successful!');
    
  } catch (error) {
    console.error('Firebase Test Failed:', error);
  }
}

testFirebase();
