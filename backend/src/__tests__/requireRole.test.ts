import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Response, NextFunction } from 'express';
import type { AuthRequest, AuthenticatedUser } from '../types/index.js';

// Import after mocking
vi.mock('../utils/logger.js', () => ({
  logger: { warn: vi.fn(), debug: vi.fn() },
}));

import { requireRole, requireFaculty, requireStudent } from '../middleware/requireRole.js';

function mockReqResNext(user?: Partial<AuthenticatedUser>) {
  const req = { user: user as AuthenticatedUser | undefined } as AuthRequest;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

describe('requireRole middleware', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no user is attached (not authenticated)', () => {
    const { req, res, next } = mockReqResNext(undefined);
    req.user = undefined;

    requireRole(['faculty'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user has no role', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 'user@test.com',
      role: undefined,
    });

    requireRole(['faculty'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user role does not match', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 'student@test.com',
      role: 'student',
    });

    requireRole(['faculty'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when user role matches', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 'faculty@test.com',
      role: 'faculty',
    });

    requireRole(['faculty'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('allows access when user has one of multiple allowed roles', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 'student@test.com',
      role: 'student',
    });

    requireRole(['faculty', 'student'])(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('convenience middlewares', () => {
  it('requireFaculty allows faculty', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 'f@t.com',
      role: 'faculty',
    });
    requireFaculty(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('requireFaculty blocks student', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 's@t.com',
      role: 'student',
    });
    requireFaculty(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('requireStudent allows student', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 's@t.com',
      role: 'student',
    });
    requireStudent(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('requireStudent blocks faculty', () => {
    const { req, res, next } = mockReqResNext({
      id: '1',
      email: 'f@t.com',
      role: 'faculty',
    });
    requireStudent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
