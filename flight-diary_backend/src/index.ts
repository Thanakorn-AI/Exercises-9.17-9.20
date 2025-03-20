// flight-diary_backend/src/index.ts
import express from 'express';
import cors from 'cors';
import diaryRouter from './routes/diaries';

const app = express();

// Enable CORS for requests from http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});