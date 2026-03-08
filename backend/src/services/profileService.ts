import type { UserRole, RoleStatus, UserProfile } from '../types/index.js';
import { getSupabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Profile Service - Trusted source for user profile data including roles
 * 
 * This service queries the user_profiles table which is the authoritative
 * source for role-based authorization. Frontend metadata is NEVER trusted.
 */

/**
 * Get user profile from trusted database table
 * 
 * @param userId - The user's auth.users ID
 * @returns User profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      logger.error('[ProfileService] Supabase not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found - this is expected for new users
        logger.debug(`[ProfileService] No profile found for user ${userId}`);
        return null;
      }
      logger.error(`[ProfileService] Error fetching profile for ${userId}:`, error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    logger.error('[ProfileService] Exception in getUserProfile:', error);
    return null;
  }
}

/**
 * Get verified role for a user (primary authorization query)
 * 
 * Returns role only if status is 'approved'. This is the function
 * used by authentication middleware for authorization decisions.
 * 
 * @param userId - The user's auth.users ID
 * @returns Verified role or null
 */
export async function getVerifiedRole(userId: string): Promise<UserRole | null> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      logger.error('[ProfileService] Supabase not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('role, role_status')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.debug(`[ProfileService] No profile for user ${userId}`);
        return null;
      }
      logger.error(`[ProfileService] Error fetching role for ${userId}:`, error);
      return null;
    }

    // Only return role if status is 'approved'
    if (data.role_status === 'approved' && data.role) {
      return data.role as UserRole;
    }

    logger.debug(`[ProfileService] User ${userId} has no approved role (status: ${data.role_status})`);
    return null;
  } catch (error) {
    logger.error('[ProfileService] Exception in getVerifiedRole:', error);
    return null;
  }
}

/**
 * Create or update user profile
 * Called during user signup or profile updates
 * 
 * @param userId - The user's auth.users ID
 * @param data - Profile data to upsert
 * @returns Success status
 */
export async function upsertUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          id: userId,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      logger.error(`[ProfileService] Error upserting profile for ${userId}:`, error);
      return { success: false, error: error.message };
    }

    logger.info(`[ProfileService] Profile upserted for user ${userId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    logger.error('[ProfileService] Exception in upsertUserProfile:', error);
    return { success: false, error: err.message };
  }
}

/**
 * Set verified role for a user (backend-only operation)
 * 
 * This is the ONLY way roles should be granted. It updates the
 * user_profiles table with backend-controlled role verification.
 * 
 * @param userId - The user's auth.users ID
 * @param role - The role to assign
 * @param verifiedBy - Who/what verified the role
 * @param note - Optional verification note
 * @returns Success status
 */
export async function setVerifiedRole(
  userId: string,
  role: UserRole,
  verifiedBy: string,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    // First, ensure profile exists
    const existing = await getUserProfile(userId);
    if (!existing) {
      return { success: false, error: 'User profile not found' };
    }

    // Log old state for audit
    const oldRole = existing.role;
    const oldStatus = existing.role_status;

    // Update profile with verified role
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        role,
        role_status: 'approved',
        role_verified_at: new Date().toISOString(),
        role_verified_by: verifiedBy,
        role_verification_note: note ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      logger.error(`[ProfileService] Error setting role for ${userId}:`, updateError);
      return { success: false, error: updateError.message };
    }

    // Create audit log entry
    await createAuditLog({
      user_id: userId,
      action: 'approve',
      old_role: oldRole,
      new_role: role,
      old_status: oldStatus,
      new_status: 'approved',
      performed_by: verifiedBy,
      note: note ?? `Role set to ${role} by backend`,
    });

    logger.info(`[ProfileService] Role set to ${role} for user ${userId} by ${verifiedBy}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    logger.error('[ProfileService] Exception in setVerifiedRole:', error);
    return { success: false, error: err.message };
  }
}

/**
 * Revoke verified role for a user
 * 
 * @param userId - The user's auth.users ID
 * @param revokedBy - Who revoked the role
 * @param reason - Revocation reason
 * @returns Success status
 */
export async function revokeVerifiedRole(
  userId: string,
  revokedBy: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    // Get current state for audit
    const existing = await getUserProfile(userId);
    if (!existing) {
      return { success: false, error: 'User profile not found' };
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        role_status: 'revoked',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      logger.error(`[ProfileService] Error revoking role for ${userId}:`, updateError);
      return { success: false, error: updateError.message };
    }

    // Create audit log entry
    await createAuditLog({
      user_id: userId,
      action: 'revoke',
      old_role: existing.role,
      new_role: null,
      old_status: existing.role_status,
      new_status: 'revoked',
      performed_by: revokedBy,
      note: reason ?? 'Role revoked',
    });

    logger.info(`[ProfileService] Role revoked for user ${userId} by ${revokedBy}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    logger.error('[ProfileService] Exception in revokeVerifiedRole:', error);
    return { success: false, error: err.message };
  }
}

/**
 * Request a role (user-initiated, requires approval)
 * 
 * @param userId - The user's auth.users ID
 * @param role - The requested role
 * @returns Success status
 */
export async function requestRole(
  userId: string,
  role: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    // Ensure profile exists first
    const existing = await getUserProfile(userId);
    if (!existing) {
      return { success: false, error: 'User profile not found' };
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        role,
        role_status: 'pending',
        role_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      logger.error(`[ProfileService] Error requesting role for ${userId}:`, updateError);
      return { success: false, error: updateError.message };
    }

    // Create audit log entry
    await createAuditLog({
      user_id: userId,
      action: 'request',
      old_role: existing.role,
      new_role: role,
      old_status: existing.role_status,
      new_status: 'pending',
      performed_by: userId,
      note: `User requested ${role} role`,
    });

    logger.info(`[ProfileService] User ${userId} requested ${role} role`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    logger.error('[ProfileService] Exception in requestRole:', error);
    return { success: false, error: err.message };
  }
}

/**
 * Get pending role requests (for admin dashboard)
 * 
 * @returns Array of user profiles with pending role requests
 */
export async function getPendingRoleRequests(): Promise<UserProfile[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      logger.error('[ProfileService] Supabase not configured');
      return [];
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role_status', 'pending')
      .not('role', 'is', null)
      .order('role_requested_at', { ascending: true });

    if (error) {
      logger.error('[ProfileService] Error fetching pending requests:', error);
      return [];
    }

    return (data as UserProfile[]) ?? [];
  } catch (error) {
    logger.error('[ProfileService] Exception in getPendingRoleRequests:', error);
    return [];
  }
}

/**
 * Update last login timestamp
 * 
 * @param userId - The user's auth.users ID
 */
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    logger.error('[ProfileService] Error updating last login:', error);
  }
}

/**
 * Create audit log entry (internal helper)
 */
async function createAuditLog(data: {
  user_id: string;
  action: 'request' | 'approve' | 'reject' | 'revoke' | 'modify';
  old_role: UserRole | null;
  new_role: UserRole | null;
  old_status: RoleStatus;
  new_status: RoleStatus;
  performed_by: string;
  note: string;
}): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.from('role_audit_log').insert({
      user_id: data.user_id,
      action: data.action,
      old_role: data.old_role,
      new_role: data.new_role,
      old_status: data.old_status,
      new_status: data.new_status,
      performed_by: data.performed_by,
      note: data.note,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('[ProfileService] Error creating audit log:', error);
  }
}
