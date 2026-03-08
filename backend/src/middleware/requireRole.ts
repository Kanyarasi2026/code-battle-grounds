import type { Response, NextFunction } from 'express';
import type { AuthRequest, UserRole } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Role-based authorization middleware factory
 * 
 * Creates middleware that enforces role requirements for HTTP endpoints.
 * Must be used AFTER requireAuth middleware.
 * 
 * @param allowedRoles - Array of roles that are permitted to access the endpoint
 * @returns Express middleware function
 * 
 * @example
 * ```typescript
 * // Faculty-only endpoint
 * app.post('/api/assessment/create', requireAuth, requireRole(['faculty']), (req, res) => {
 *   // Only faculty can reach here
 * });
 * 
 * // Student-only endpoint
 * app.get('/api/assessment/:id/submit', requireAuth, requireRole(['student']), (req, res) => {
 *   // Only students can reach here
 * });
 * 
 * // Multi-role endpoint
 * app.get('/api/assessment/:id', requireAuth, requireRole(['faculty', 'student']), (req, res) => {
 *   // Both faculty and students can access
 * });
 * ```
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Ensure user is authenticated (should be set by requireAuth middleware)
    if (!req.user) {
      logger.warn('[requireRole] Called without authenticated user');
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if user has a verified role
    if (!req.user.role) {
      logger.warn(`[requireRole] User ${req.user.email} has no verified role`);
      res.status(403).json({ 
        error: 'Access denied',
        message: 'Your account role has not been verified. Please contact an administrator.',
      });
      return;
    }

    // Check if user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `[requireRole] User ${req.user.email} with role ${req.user.role} attempted to access endpoint requiring ${allowedRoles.join(' or ')}`
      );
      res.status(403).json({ 
        error: 'Access denied',
        message: `This endpoint requires ${allowedRoles.length === 1 ? allowedRoles[0] : allowedRoles.join(' or ')} role.`,
      });
      return;
    }

    // User is authorized
    logger.debug(`[requireRole] User ${req.user.email} authorized with role ${req.user.role}`);
    next();
  };
}

/**
 * Convenience middleware for faculty-only endpoints
 * Equivalent to requireRole(['faculty'])
 */
export const requireFaculty = requireRole(['faculty']);

/**
 * Convenience middleware for student-only endpoints
 * Equivalent to requireRole(['student'])
 */
export const requireStudent = requireRole(['student']);
