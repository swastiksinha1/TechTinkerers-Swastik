import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

import complaintRoutes from './routes/complaintRoutes';
import { startEscalationCron } from './cron';

// Mount routes
app.use('/api/complaints', complaintRoutes);

// Start background jobs
startEscalationCron();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
