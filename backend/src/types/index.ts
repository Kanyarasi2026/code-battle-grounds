import type { Socket } from 'socket.io';
import type { Request } from 'express';

// ── Role-Based Access Control ──────────────────────────────────

/**
 * User roles in the system (matches database enum)
 */
export type UserRole = 'faculty' | 'student';

/**
 * Role verification status (matches database enum)
 */
export type RoleStatus = 'pending' | 'approved' | 'rejected' | 'revoked';

/**
 * User profile from database (matches user_profiles table)
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole | null;
  role_status: RoleStatus;
  role_requested_at: string | null;
  role_verified_at: string | null;
  role_verified_by: string | null;
  role_verification_note: string | null;
  institution: string | null;
  department: string | null;
  student_id: string | null;
  employee_id: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

/**
 * Authenticated user data attached to Express requests
 */
export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
  role?: UserRole;
  metadata?: Record<string, unknown>;
}

/**
 * Express Request extended with authenticated user
 */
export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

// ── Room / Client ──────────────────────────────────────────────

export interface ClientData {
  username: string;
  userId: string | null;
  userEmail: string | null;
}

export interface ClientInfo {
  socketId: string;
  username: string;
  userId: string | null;
  userEmail: string | null;
}

export interface Room {
  clients: Map<string, ClientData>;
  code: string;
  language: string;
  stdin: string;
  output: string;
  isError: boolean;
  createdAt: number;
  createdBy: string | null;
  creatorEmail: string | null;
  participants: Set<string>;
}

export interface RoomStats {
  totalRooms: number;
  totalClients: number;
}

export interface RoomInfo {
  roomId: string;
  createdBy: string | null;
  creatorEmail: string | null;
  createdAt: number;
  participants: string[];
  activeClients: number;
}

export interface RoomManagerOptions {
  roomTTL?: number;
  cleanupInterval?: number;
  maxRooms?: number;
  maxClientsPerRoom?: number;
  autoStartCleanup?: boolean;
}

// ── Authenticated socket user ──────────────────────────────────

export interface AuthUser {
  id: string;
  email: string | undefined;
  metadata: Record<string, unknown>;
}

// ── Socket.IO event payloads ───────────────────────────────────

// Client → Server events
export interface ClientToServerEvents {
  join: (data: { roomId: string; username: string }) => void;
  codeChange: (data: { roomId: string; code: string }) => void;
  languageChange: (data: { roomId: string; language: string }) => void;
  inputChange: (data: { roomId: string; stdin: string }) => void;
  executeCode: (data: {
    roomId: string;
    code: string;
    language: string;
    stdin?: string;
  }) => void;
  executionResult: (data: {
    roomId: string;
    output: string;
    isError: boolean;
  }) => void;
}

// Server → Client events
export interface ServerToClientEvents {
  userJoined: (data: {
    clients: ClientInfo[];
    username: string;
    socketId: string;
  }) => void;
  userLeft: (data: { socketId: string; username: string | null }) => void;
  syncCode: (data: {
    code: string;
    language: string;
    stdin: string;
    output: string;
    isError: boolean;
  }) => void;
  codeChanged: (data: { code: string }) => void;
  languageChanged: (data: { language: string }) => void;
  inputChanged: (data: { stdin: string }) => void;
  executionStarted: (data: { username: string | null }) => void;
  executionResult: (data: {
    output: string;
    isError: boolean;
    username: string | null;
  }) => void;
  error: (data: { message: string; event: string; timestamp: string }) => void;
  alreadyInRoom: (data: { currentRoomId: string; isSameRoom?: boolean }) => void;
}

// Inter-server events (unused, but required by socket.io generics)
export type InterServerEvents = Record<string, never>;

// Per-socket data attached to the socket instance
export interface SocketData {
  user?: AuthUser;
}

// Augmented socket type used throughout the codebase
export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
