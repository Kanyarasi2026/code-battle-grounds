import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User, AuthContextValue } from '../types';
import { supabase } from '../config/supabase';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s); setUser(s?.user ?? null); setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s); setUser(s?.user ?? null); setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      const { error: e } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/` } });
      if (e) throw e;
    } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      const { error: e } = await supabase.auth.signOut();
      if (e) throw e;
    } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  };

  return <AuthContext.Provider value={{ user, session, loading, error, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
