import { Router, Request, Response } from 'express';
import { ApiResponse } from '@skillbridge/shared';
import { isSupabaseConfigured } from '../config/supabase';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'SkillBridge Backend API is operational',
    data: {
      service: 'skillbridge-api',
      version: '1.0.0',
      uptimeSeconds: process.uptime(),
      supabaseConfigured: isSupabaseConfigured,
      environment: process.env.NODE_ENV || 'development',
    },
    timestamp: new Date().toISOString(),
  });
});
