import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StoryController } from './controllers/StoryController';
import { authenticate } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/stories/generate', authenticate as any, StoryController.generate);
app.get('/api/stories', authenticate as any, StoryController.list);
app.get('/api/stories/:id', authenticate as any, StoryController.get);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
