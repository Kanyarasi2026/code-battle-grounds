#!/usr/bin/env node

/**
 * Role Management CLI Tool
 * 
 * A command-line utility for managing user roles in the backend.
 * 
 * Usage:
 *   npm run admin:role set <userId> <faculty|student>
 *   npm run admin:role get <userId>
 *   npm run admin:role revoke <userId>
 * 
 * Examples:
 *   npm run admin:role set abc-123-def faculty
 *   npm run admin:role get abc-123-def
 *   npm run admin:role revoke abc-123-def
 */

import { setVerifiedRole, getVerifiedRole, revokeVerifiedRole } from '../utils/roleManager.js';
import type { UserRole } from '../types/index.js';

const args = process.argv.slice(2);
const command = args[0];
const userId = args[1];
const role = args[2] as UserRole | undefined;

async function main() {
  if (!command) {
    console.error('❌ Error: No command specified');
    printUsage();
    process.exit(1);
  }

  switch (command) {
    case 'set':
      await handleSetRole(userId, role);
      break;
    case 'get':
      await handleGetRole(userId);
      break;
    case 'revoke':
      await handleRevokeRole(userId);
      break;
    case 'help':
    case '--help':
    case '-h':
      printUsage();
      break;
    default:
      console.error(`❌ Error: Unknown command "${command}"`);
      printUsage();
      process.exit(1);
  }
}

async function handleSetRole(userId: string | undefined, role: UserRole | undefined) {
  if (!userId) {
    console.error('❌ Error: User ID is required');
    console.log('\nUsage: npm run admin:role set <userId> <faculty|student>');
    process.exit(1);
  }

  if (!role) {
    console.error('❌ Error: Role is required');
    console.log('\nUsage: npm run admin:role set <userId> <faculty|student>');
    process.exit(1);
  }

  if (role !== 'faculty' && role !== 'student') {
    console.error(`❌ Error: Invalid role "${role}". Must be "faculty" or "student"`);
    process.exit(1);
  }

  console.log(`⏳ Setting verified role "${role}" for user ${userId}...`);
  
  const result = await setVerifiedRole(userId, role);
  
  if (result.success) {
    console.log(`✅ Success! User ${userId} is now verified as: ${role}`);
  } else {
    console.error(`❌ Failed to set role: ${result.error}`);
    process.exit(1);
  }
}

async function handleGetRole(userId: string | undefined) {
  if (!userId) {
    console.error('❌ Error: User ID is required');
    console.log('\nUsage: npm run admin:role get <userId>');
    process.exit(1);
  }

  console.log(`⏳ Fetching verified role for user ${userId}...`);
  
  const { role, error } = await getVerifiedRole(userId);
  
  if (error) {
    console.error(`❌ Error fetching role: ${error}`);
    process.exit(1);
  }

  if (role) {
    console.log(`✅ User ${userId} has verified role: ${role}`);
  } else {
    console.log(`ℹ️  User ${userId} has no verified role`);
  }
}

async function handleRevokeRole(userId: string | undefined) {
  if (!userId) {
    console.error('❌ Error: User ID is required');
    console.log('\nUsage: npm run admin:role revoke <userId>');
    process.exit(1);
  }

  console.log(`⏳ Revoking verified role for user ${userId}...`);
  
  const result = await revokeVerifiedRole(userId);
  
  if (result.success) {
    console.log(`✅ Success! Verified role revoked for user ${userId}`);
  } else {
    console.error(`❌ Failed to revoke role: ${result.error}`);
    process.exit(1);
  }
}

function printUsage() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              Role Management CLI Tool                         ║
╚═══════════════════════════════════════════════════════════════╝

Manage backend-verified user roles for authorization.

COMMANDS:
  set <userId> <role>    Set verified role for a user
  get <userId>           Get current verified role for a user
  revoke <userId>        Revoke verified role for a user
  help                   Show this help message

ROLES:
  faculty                Instructor/professor role
  student                Student/learner role

EXAMPLES:
  # Set a user as faculty
  npm run admin:role set abc-123-def faculty

  # Check a user's verified role
  npm run admin:role get abc-123-def

  # Revoke a user's verified role
  npm run admin:role revoke abc-123-def

NOTES:
  - User ID is the Supabase auth user ID (UUID)
  - Roles are stored in user_metadata.role_verified
  - Only backend-verified roles grant access to protected endpoints
  - Frontend role_requested is NOT used for authorization

ENVIRONMENT:
  Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
`);
}

// Run the CLI
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
