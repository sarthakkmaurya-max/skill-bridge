import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { ApiResponse, UserProfile, UserRole } from '@skillbridge/shared';

// Extend Express Request to include Supabase user and profile
export interface AuthenticatedRequest extends Request {
  user?: User;
  profile?: UserProfile;
}

/**
 * Middleware that verifies the Bearer JWT token from Supabase Auth
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Missing or malformed Authorization header. Expected Bearer <token>.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured) {
      // In unconfigured development mode, permit mock demo tokens
      if (token === 'demo-token' || token === 'demo-token-student') {
        req.user = {
          id: 'demo-student-id',
          email: 'student.demo@skillbridge.edu',
          app_metadata: {},
          user_metadata: { role: 'student', full_name: 'Alex Rivera' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;

        req.profile = {
          id: 'demo-student-id',
          email: 'student.demo@skillbridge.edu',
          name: 'Alex Rivera',
          role: 'student',
          college: 'Apex Institute of Technology',
          createdAt: new Date().toISOString(),
        };

        return next();
      }

      if (token === 'demo-token-recruiter') {
        req.user = {
          id: 'demo-recruiter-id',
          email: 'elena.rostova@techcorp.io',
          app_metadata: {},
          user_metadata: { role: 'recruiter', full_name: 'Elena Rostova' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;

        req.profile = {
          id: 'demo-recruiter-id',
          email: 'elena.rostova@techcorp.io',
          name: 'Elena Rostova',
          role: 'recruiter',
          company: 'Nexus Cloud Innovations',
          createdAt: new Date().toISOString(),
        };

        return next();
      }

      if (token === 'demo-token-admin') {
        req.user = {
          id: 'demo-admin-id',
          email: 'dean.patel@apex.edu',
          app_metadata: {},
          user_metadata: { role: 'admin', full_name: 'Dr. Devraj Patel' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;

        req.profile = {
          id: 'demo-admin-id',
          email: 'dean.patel@apex.edu',
          name: 'Dr. Devraj Patel',
          role: 'admin',
          college: 'Apex Institute of Technology',
          createdAt: new Date().toISOString(),
        };

        return next();
      }

      res.status(503).json({
        success: false,
        error: 'Supabase credentials are not configured on the server.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({
        success: false,
        error: error?.message || 'Invalid or expired authorization token.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    req.user = data.user;

    // Fetch user profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      req.profile = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        college: profile.college,
        company: profile.company,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    }

    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication verification failed';
    res.status(500).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Middleware to restrict route access to specific roles
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required before role verification.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const currentRole = req.profile?.role || (req.user.user_metadata?.role as UserRole);

    if (!currentRole || !allowedRoles.includes(currentRole)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]. Current: '${currentRole || 'none'}'.`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
