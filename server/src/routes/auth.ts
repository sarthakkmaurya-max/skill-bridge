import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { ApiResponse, UserProfile } from '@skillbridge/shared';

export const authRouter = Router();

/**
 * GET /api/auth/me
 * Returns the currently authenticated user session & profile
 */
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Authenticated user profile retrieved',
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          user_metadata: req.user.user_metadata,
        },
        profile: req.profile || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve profile';
    res.status(500).json({
      success: false,
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/auth/sync-profile
 * Upserts user profile in the Supabase database
 */
authRouter.post('/sync-profile', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { name, role, college, company, bio } = req.body;

    if (!isSupabaseConfigured) {
      // Return simulated success in development without live Supabase keys
      const mockProfile: UserProfile = {
        id: req.user.id,
        email: req.user.email || '',
        name: name || req.user.user_metadata?.full_name || 'User',
        role: role || req.user.user_metadata?.role || 'student',
        college: college || '',
        company: company || '',
        bio: bio || '',
        createdAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        message: 'Profile synchronized (dev mode)',
        data: mockProfile,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const updatePayload = {
      id: req.user.id,
      email: req.user.email,
      name: name || req.user.user_metadata?.full_name || 'User',
      role: role || req.user.user_metadata?.role || 'student',
      college: college || null,
      company: company || null,
      bio: bio || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(updatePayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      res.status(400).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Profile synchronization failed';
    res.status(500).json({
      success: false,
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
  }
});
