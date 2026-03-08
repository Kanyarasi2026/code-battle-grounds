import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User, AuthContextValue, UserRole } from '../types';
import { supabase } from '../config/supabase';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleData, setRoleData] = useState<{ requested: UserRole | null; verified: UserRole | null }>({
    requested: null,
    verified: null,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s); 
      setUser(s?.user ?? null);
      // Initialize roleData from user metadata if available
      if (s?.user?.user_metadata) {
        const metadata = s.user.user_metadata as Record<string, unknown>;
        const role = metadata.role as UserRole | undefined;
        if (role === 'faculty' || role === 'student') {
          setRoleData({ requested: role, verified: null });
        }
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s); 
      setUser(s?.user ?? null);
      // Update roleData when auth state changes
      if (s?.user?.user_metadata) {
        const metadata = s.user.user_metadata as Record<string, unknown>;
        const role = metadata.role as UserRole | undefined;
        if (role === 'faculty' || role === 'student') {
          setRoleData({ requested: role, verified: null });
        }
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const requestRole = (role: UserRole) => {
    setRoleData({ requested: role, verified: null });
    // Optionally persist to user metadata
    if (user) {
      supabase.auth.updateUser({
        data: { role }
      }).catch(err => {
        console.error('Failed to update role in metadata:', err);
      });
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      const { error: e } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/role` } });
      if (e) throw e;
    } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      const { error: e } = await supabase.auth.signOut();
      if (e) throw e;
      setRoleData({ requested: null, verified: null });
    } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  };

  return <AuthContext.Provider value={{ user, session, loading, error, roleData, signInWithGoogle, signOut, requestRole }}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
