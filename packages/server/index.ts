import 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';

const app = express();

const port = process.env.PORT ?? 3000;

app.get('/', async (req: Request, res: Response) => {
  const modelName = process.env.OLLAMA_MODEL_NAME;
  res.send(`Hello Kayode!, ollama model is ${modelName}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
