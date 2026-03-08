import type { UserRole } from '../types/index.js';
import {
  setVerifiedRole as profileSetVerifiedRole,
  revokeVerifiedRole as profileRevokeVerifiedRole,
  getVerifiedRole as profileGetVerifiedRole,
} from '../services/profileService.js';
import { logger } from './logger.js';

/**
 * Backend utility to set verified role for a user
 * 
 * This function should ONLY be called by backend code, never exposed to frontend.
 * It delegates to profileService which updates the trusted user_profiles table.
 * 
 * @param userId - The user's ID
 * @param role - The role to assign ('faculty' or 'student')
 * @returns Success status
 */
export async function setVerifiedRole(
  userId: string,
  role: UserRole,
): Promise<{ success: boolean; error?: string }> {
  return profileSetVerifiedRole(userId, role, 'system', `Role set via roleManager`);
}

/**
 * Backend utility to revoke verified role for a user
 * 
 * @param userId - The user's ID
 * @returns Success status
 */
export async function revokeVerifiedRole(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  return profileRevokeVerifiedRole(userId, 'system', 'Role revoked via roleManager');
}

/**
 * Get verified role for a user
 * 
 * @param userId - The user's ID
 * @returns The verified role or null if not set
 */
export async function getVerifiedRole(
  userId: string,
): Promise<{ role: UserRole | null; error?: string }> {
  try {
    const role = await profileGetVerifiedRole(userId);
    return { role };
  } catch (error) {
    const err = error as Error;
    logger.error(`[roleManager] Error getting verified role:`, error);
    return { role: null, error: err.message };
  }
}
