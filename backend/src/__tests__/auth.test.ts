import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index.js';

// Mock dependencies
vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

vi.mock('../config/supabase.js', () => ({
  getSupabase: vi.fn(),
}));

vi.mock('../services/profileService.js', () => ({
  getUserProfile: vi.fn(),
}));

import { verifyAuth, requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../config/supabase.js';
import { getUserProfile } from '../services/profileService.js';
import type { AppSocket } from '../types/index.js';

// ── verifyAuth (socket middleware) ────────────────────────────────────────────

describe('verifyAuth', () => {
  beforeEach(() => vi.clearAllMocks());

  function mockSocket(token?: string): AppSocket {
    return {
      id: 'sock-1',
      handshake: { auth: { token } },
      data: {},
    } as unknown as AppSocket;
  }

  it('calls next with error when no token', async () => {
    const next = vi.fn();
    await verifyAuth(mockSocket(undefined), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect((next.mock.calls[0][0] as Error).message).toContain('token required');
  });

  it('calls next with error when supabase not configured', async () => {
    vi.mocked(getSupabase).mockReturnValue(null);
    const next = vi.fn();
    await verifyAuth(mockSocket('some-token'), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect((next.mock.calls[0][0] as Error).message).toContain('unavailable');
  });

  it('calls next with error for invalid token', async () => {
    vi.mocked(getSupabase).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'invalid' },
        }),
      },
    } as never);

    const next = vi.fn();
    await verifyAuth(mockSocket('bad-token'), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect((next.mock.calls[0][0] as Error).message).toContain('Invalid or expired');
  });

  it('attaches user to socket.data on valid token', async () => {
    vi.mocked(getSupabase).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-1',
              email: 'test@test.com',
              user_metadata: { name: 'Test' },
            },
          },
          error: null,
        }),
      },
    } as never);

    const socket = mockSocket('valid-token');
    const next = vi.fn();
    await verifyAuth(socket, next);

    expect(next).toHaveBeenCalledWith(); // no error
    expect(socket.data.user).toEqual(
      expect.objectContaining({ id: 'user-1', email: 'test@test.com' }),
    );
  });
});

// ── requireAuth (Express middleware) ──────────────────────────────────────────

describe('requireAuth', () => {
  beforeEach(() => vi.clearAllMocks());

  function mockReqResNext(authHeader?: string) {
    const req = {
      headers: { authorization: authHeader },
    } as unknown as AuthRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;
    return { req, res, next };
  }

  it('returns 401 when Authorization header is missing', async () => {
    const { req, res, next } = mockReqResNext(undefined);
    await requireAuth(req as never, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header is not Bearer', async () => {
    const { req, res, next } = mockReqResNext('Basic abc');
    await requireAuth(req as never, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 500 when supabase not configured', async () => {
    vi.mocked(getSupabase).mockReturnValue(null);
    const { req, res, next } = mockReqResNext('Bearer valid-token');
    await requireAuth(req as never, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('returns 401 for invalid token', async () => {
    vi.mocked(getSupabase).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'invalid' },
        }),
      },
    } as never);

    const { req, res, next } = mockReqResNext('Bearer bad-token');
    await requireAuth(req as never, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('attaches user to req and calls next on valid token', async () => {
    vi.mocked(getSupabase).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-1',
              email: 'test@test.com',
              user_metadata: {},
            },
          },
          error: null,
        }),
      },
    } as never);
    vi.mocked(getUserProfile).mockResolvedValue({
      role: 'faculty',
      role_status: 'approved',
    } as never);

    const { req, res, next } = mockReqResNext('Bearer valid-token');
    await requireAuth(req as never, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as AuthRequest).user).toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'test@test.com',
        role: 'faculty',
      }),
    );
  });

  it('sets role to undefined when profile role_status is not approved', async () => {
    vi.mocked(getSupabase).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: { id: 'user-2', email: 'u@t.com', user_metadata: {} },
          },
          error: null,
        }),
      },
    } as never);
    vi.mocked(getUserProfile).mockResolvedValue({
      role: 'student',
      role_status: 'pending',
    } as never);

    const { req, res, next } = mockReqResNext('Bearer valid-token');
    await requireAuth(req as never, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as AuthRequest).user?.role).toBeUndefined();
  });
});
