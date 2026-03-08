import type { AppSocket } from '../types/index.js';
import { logger } from '../utils/logger.js';

export const handleSocketError = (
  socket: AppSocket,
  error: Error,
  event: string,
): void => {
  logger.error(`Socket error in ${event}:`, {
    error: error.message,
    stack: error.stack,
    socketId: socket.id,
    event,
  });

  const isProduction = process.env['NODE_ENV'] === 'production';
  const userMessage = isProduction
    ? getSafeErrorMessage(error)
    : error.message || 'An error occurred';

  socket.emit('error', {
    message: userMessage,
    event,
    timestamp: new Date().toISOString(),
  });
};

const getSafeErrorMessage = (error: Error): string => {
  const message = error.message || '';

  const safeErrors: Record<string, string> = {
    'Invalid room ID format': 'Invalid room ID. Please check and try again.',
    'Room ID is required': 'Room ID is required.',
    'Username is required': 'Username is required.',
    'Username must be at least 2 characters':
      'Username must be at least 2 characters.',
    'Username cannot exceed 30 characters': 'Username is too long.',
    'Invalid programming language': 'Invalid programming language selected.',
    'Code cannot exceed 100KB': 'Code is too large.',
    'Maximum number of rooms': 'Server is at capacity. Please try again later.',
    'Room is full': 'This room is full. Please try another room.',
  };

  for (const [key, safeMsg] of Object.entries(safeErrors)) {
    if (message.includes(key)) {
      return safeMsg;
    }
  }

  if (message.includes('Too Many Requests') || message.includes('rate limit')) {
    return 'You are sending requests too quickly. Please slow down.';
  }

  return 'An error occurred. Please try again.';
};

export const wrapSocketHandler = (
  handler: (socket: AppSocket, data: unknown) => Promise<void>,
) => {
  return async (socket: AppSocket, data: unknown): Promise<void> => {
    try {
      await handler(socket, data);
    } catch (error) {
      handleSocketError(socket, error as Error, 'unknown');
    }
  };
};
