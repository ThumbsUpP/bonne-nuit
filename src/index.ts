import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StoryController } from './controllers/StoryController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/stories/generate', StoryController.generate);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
