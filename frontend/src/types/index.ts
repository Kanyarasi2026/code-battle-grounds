import type { Session, User } from '@supabase/supabase-js';
import type { Socket } from 'socket.io-client';

export type { Session, User };

export type Language = 'cpp' | 'c' | 'javascript' | 'java' | 'python';
export type UserRole = 'faculty' | 'student';

export interface Client {
  socketId: string;
  username: string;
  userId: string | null;
  userEmail: string | null;
}

// ── Auth ──────────────────────────────────────────────────────
export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  roleData: {
    requested: UserRole | null;
    verified: UserRole | null;
  };
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  requestRole: (role: UserRole) => void;
}

// ── Room ──────────────────────────────────────────────────────
export interface RoomContextValue {
  activeRoomId: string | null;
  activeUsername: string | null;
  isInRoom: boolean;
  joinRoom: (roomId: string, username: string) => void;
  leaveRoom: () => void;
}

// ── API ───────────────────────────────────────────────────────
export interface ExecuteRunResult {
  output: string;
  stderr: string;
  stdout: string;
  code: number;
}

export interface ExecuteResponse {
  run: ExecuteRunResult;
}

// ── Socket event payloads ─────────────────────────────────────
export interface JoinPayload {
  roomId: string;
  username: string;
}

export interface JoinedPayload {
  clients: Client[];
  username: string;
  socketId: string;
}

export interface UserLeftPayload {
  socketId: string;
  username: string | null;
}

export interface CodeChangePayload {
  roomId: string;
  code: string;
}

export interface CodeChangedPayload {
  code: string;
}

export interface LanguageChangePayload {
  roomId: string;
  language: string;
}

export interface LanguageChangedPayload {
  language: string;
}

export interface SyncCodePayload {
  code: string;
  language: string;
  stdin: string;
  output: string;
  isError: boolean;
}

export interface ExecuteCodePayload {
  roomId: string;
  code: string;
  language: string;
  stdin?: string;
}

export interface ExecutionResultPayload {
  roomId: string;
  output: string;
  isError: boolean;
}

export interface ExecutionResultBroadcast {
  output: string;
  isError: boolean;
  username: string | null;
}

export interface ExecutionStartedPayload {
  username: string | null;
}

export interface InputChangePayload {
  roomId: string;
  stdin: string;
}

export interface InputChangedPayload {
  stdin: string;
}

export interface AlreadyInRoomPayload {
  currentRoomId: string;
  isSameRoom?: boolean;
}

export interface SocketErrorPayload {
  message: string;
  event: string;
  timestamp: string;
}

// ── Typed socket ──────────────────────────────────────────────
export interface ServerToClientEvents {
  userJoined: (data: JoinedPayload) => void;
  userLeft: (data: UserLeftPayload) => void;
  syncCode: (data: SyncCodePayload) => void;
  codeChanged: (data: CodeChangedPayload) => void;
  languageChanged: (data: LanguageChangedPayload) => void;
  inputChanged: (data: InputChangedPayload) => void;
  executionStarted: (data: ExecutionStartedPayload) => void;
  executionResult: (data: ExecutionResultBroadcast) => void;
  error: (data: SocketErrorPayload) => void;
  alreadyInRoom: (data: AlreadyInRoomPayload) => void;
}

export interface ClientToServerEvents {
  join: (data: JoinPayload) => void;
  codeChange: (data: CodeChangePayload) => void;
  languageChange: (data: LanguageChangePayload) => void;
  inputChange: (data: InputChangePayload) => void;
  executeCode: (data: ExecuteCodePayload) => void;
  executionResult: (data: ExecutionResultPayload) => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// ── Integrity Timeline ─────────────────────────────────────────
export type IntegrityEventKind = 'neutral' | 'flagged' | 'done' | 'info';

export interface IntegrityEvent {
  id: string;
  timestamp: number;
  elapsed: string; // MM:SS from session start
  label: string;
  detail: string;
  kind: IntegrityEventKind;
}

export interface IntegritySummary {
  tabSwitches: number;
  fullscreenExits: number;
  largePastes: number;
}
