import type { Request, Response, NextFunction } from 'express';
import type { AppSocket, AuthRequest, AuthenticatedUser } from '../types/index.js';
import { getSupabase } from '../config/supabase.js';
import { getUserProfile } from '../services/profileService.js';
import { logger } from '../utils/logger.js';

export const verifyAuth = async (
  socket: AppSocket,
  next: (err?: Error) => void,
): Promise<void> => {
  try {
    const token = socket.handshake.auth?.['token'] as string | undefined;

    if (!token) {
      logger.warn(`[Auth] No token provided for socket ${socket.id}`);
      return next(new Error('Authentication token required'));
    }

    const supabase = getSupabase();

    if (!supabase) {
      logger.error('[Auth] Supabase client not configured');
      return next(new Error('Authentication service unavailable'));
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn(
        `[Auth] Invalid token for socket ${socket.id}: ${error?.message}`,
      );
      return next(new Error('Invalid or expired token'));
    }

    socket.data.user = {
      id: user.id,
      email: user.email,
      metadata: (user.user_metadata ?? {}) as Record<string, unknown>,
    };

    logger.info(`[Auth] User authenticated: ${user.email} (${socket.id})`);
    next();
  } catch (error) {
    logger.error(`[Auth] Error verifying token:`, error);
    next(new Error('Authentication failed'));
  }
};

/**
 * Express middleware for HTTP request authentication
 * 
 * Validates JWT token from Authorization header and attaches user data to request.
 * Also fetches user's verified role from the database for authorization.
 * 
 * @example
 * ```typescript
 * router.get('/api/protected', requireAuth, (req: AuthRequest, res) => {
 *   const user = req.user; // TypeScript knows user exists here
 *   res.json({ userId: user.id });
 * });
 * ```
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`[Auth] Missing or invalid Authorization header`);
      res.status(401).json({ error: 'Authentication token required' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const supabase = getSupabase();

    if (!supabase) {
      logger.error('[Auth] Supabase client not configured');
      res.status(500).json({ error: 'Authentication service unavailable' });
      return;
    }

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn(`[Auth] Invalid token: ${error?.message}`);
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Fetch user's verified role from database
    const profile = await getUserProfile(user.id);

    // Attach authenticated user to request
    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: profile?.role_status === 'approved' ? profile.role || undefined : undefined,
      metadata: (user.user_metadata ?? {}) as Record<string, unknown>,
    };

    (req as AuthRequest).user = authUser;

    logger.debug(`[Auth] User authenticated: ${user.email} (role: ${authUser.role || 'none'})`);
    next();
  } catch (error) {
    logger.error(`[Auth] Error in requireAuth middleware:`, error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
