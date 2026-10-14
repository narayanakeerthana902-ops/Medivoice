import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
app.use(cors({
  origin: [CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parser with strict size limits
app.use(express.json({ limit: '256kb' }));

// Privacy-Preserving Request Logging (Never logs symptom body content)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log only method, path, status, and duration (never sensitive medical payload)
    console.log(`[HTTP] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Routes
app.use('/api', apiRouter);

// 404 Route
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found' });
});

// Global Safe Error Handler (Never leaks internal traces or credentials)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err?.message || 'Unknown internal error');
  res.status(err?.status || 500).json({
    error: 'Internal Server Error',
    message: 'A protected server error occurred. Clinical safety was not compromised.'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` MediVoice AI Backend Server running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Configured AI Provider: ${process.env.AI_PROVIDER || 'local-heuristic'}`);
    console.log(`=================================================`);
  });
}

export default app;
