import { io } from 'socket.io-client';
import type { AppSocket } from '../types';
import { supabase } from '../config/supabase';

const SOCKET_URL = import.meta.env['VITE_SOCKET_URL'] ?? 'http://localhost:3000';

export const initSocket = async (): Promise<AppSocket> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    console.error('No authentication token available');
    throw new Error('Authentication required');
  }

  const socket: AppSocket = io(SOCKET_URL, {
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    transports: ['websocket'],
    autoConnect: true,
    auth: { token },
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('reconnect_attempt' as Parameters<typeof socket.on>[0], (attemptNumber: unknown) => {
    console.log(`Reconnection attempt ${String(attemptNumber)}`);
  });

  socket.on('reconnect_failed' as Parameters<typeof socket.on>[0], () => {
    console.error('Socket reconnection failed after maximum attempts');
  });

  return socket;
};
