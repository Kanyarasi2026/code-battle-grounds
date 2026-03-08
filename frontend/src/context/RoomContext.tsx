import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { RoomContextValue } from '../types';
import { supabase } from '../config/supabase';

const STORAGE_KEY = 'codebattleground-active-room';

interface StoredRoom { roomId: string; username: string }

const getRoomFromStorage = (): { roomId: string | null; username: string | null } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StoredRoom;
      if (parsed.roomId && parsed.username) return { roomId: parsed.roomId, username: parsed.username };
    }
  } catch { localStorage.removeItem(STORAGE_KEY); }
  return { roomId: null, username: null };
};

const RoomContext = createContext<RoomContextValue | null>(null);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const initial = getRoomFromStorage();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(initial.roomId);
  const [activeUsername, setActiveUsername] = useState<string | null>(initial.username);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setActiveRoomId(null); setActiveUsername(null); localStorage.removeItem(STORAGE_KEY);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const joinRoom = (roomId: string, username: string): void => {
    setActiveRoomId(roomId); setActiveUsername(username);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ roomId, username, joinedAt: Date.now() }));
  };

  const leaveRoom = (): void => {
    setActiveRoomId(null); setActiveUsername(null); localStorage.removeItem(STORAGE_KEY);
  };

  return <RoomContext.Provider value={{ activeRoomId, activeUsername, isInRoom: !!activeRoomId, joinRoom, leaveRoom }}>{children}</RoomContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRoom = (): RoomContextValue => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom must be used within a RoomProvider');
  return ctx;
};
