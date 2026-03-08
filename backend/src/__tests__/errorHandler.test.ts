import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AppSocket } from '../types/index.js';

// Mock logger
vi.mock('../utils/logger.js', () => ({
  logger: { error: vi.fn() },
}));

import {
  handleSocketError,
  wrapSocketHandler,
} from '../middleware/errorHandler.js';

function mockSocket(): AppSocket {
  return {
    id: 'test-socket-id',
    emit: vi.fn(),
    data: {},
  } as unknown as AppSocket;
}

describe('handleSocketError', () => {
  beforeEach(() => vi.clearAllMocks());

  it('emits error event with message, event name, and timestamp', () => {
    const socket = mockSocket();
    const error = new Error('Something broke');

    handleSocketError(socket, error, 'join-room');

    expect(socket.emit).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({
        event: 'join-room',
        timestamp: expect.any(String),
      }),
    );
  });

  it('uses safe error message in production', () => {
    const origEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';

    const socket = mockSocket();

    handleSocketError(socket, new Error('Invalid room ID format blah'), 'test');

    const emitted = (socket.emit as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(emitted.message).toBe('Invalid room ID. Please check and try again.');

    process.env['NODE_ENV'] = origEnv;
  });

  it('uses raw error message in development', () => {
    const origEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';

    const socket = mockSocket();
    handleSocketError(socket, new Error('Raw debug error'), 'test');

    const emitted = (socket.emit as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(emitted.message).toBe('Raw debug error');

    process.env['NODE_ENV'] = origEnv;
  });

  it('returns generic message for unknown errors in production', () => {
    const origEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';

    const socket = mockSocket();
    handleSocketError(socket, new Error('some_internal_error_xyz'), 'test');

    const emitted = (socket.emit as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(emitted.message).toBe('An error occurred. Please try again.');

    process.env['NODE_ENV'] = origEnv;
  });

  it('handles rate limit errors in production', () => {
    const origEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';

    const socket = mockSocket();
    handleSocketError(socket, new Error('Too Many Requests'), 'test');

    const emitted = (socket.emit as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(emitted.message).toContain('too quickly');

    process.env['NODE_ENV'] = origEnv;
  });
});

describe('wrapSocketHandler', () => {
  it('calls the handler with socket and data', async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const wrapped = wrapSocketHandler(handler);
    const socket = mockSocket();

    await wrapped(socket, { foo: 'bar' });

    expect(handler).toHaveBeenCalledWith(socket, { foo: 'bar' });
  });

  it('catches errors and emits safe error via handleSocketError', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('handler failed'));
    const wrapped = wrapSocketHandler(handler);
    const socket = mockSocket();

    await wrapped(socket, {});

    expect(socket.emit).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ event: 'unknown' }),
    );
  });
});
