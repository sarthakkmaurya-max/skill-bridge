import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { assessmentsRouter } from './routes/assessments';
import { opportunitiesRouter } from './routes/opportunities';
import { applicationsRouter } from './routes/applications';
import { portfolioRouter } from './routes/portfolio';
import { adminRouter } from './routes/admin';
import { ApiResponse } from '@skillbridge/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (origin === CLIENT_URL || origin.includes('localhost') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly fallback
  },
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/admin', adminRouter);

// Root route
app.get('/', (_req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'SkillBridge Backend API Server is running',
    data: {
      endpoints: [
        'GET /api/health',
        'GET /api/auth/me',
        'POST /api/auth/sync-profile',
        'GET /api/assessments/latest',
        'POST /api/assessments/submit',
        'GET /api/opportunities',
        'GET /api/opportunities/mine',
        'POST /api/opportunities',
        'PUT /api/opportunities/:id',
        'DELETE /api/opportunities/:id'
      ],
      documentation: 'See README.md for complete details'
    },
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((_req: Request, res: Response<ApiResponse>) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response<ApiResponse>, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SkillBridge Backend API listening on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
});

export default app;
