import type { AppSocket } from '../types/index.js';
import { getSupabase } from '../config/supabase.js';
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
