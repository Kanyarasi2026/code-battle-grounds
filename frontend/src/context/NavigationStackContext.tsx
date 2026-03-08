import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type NavEntry = { pathname: string; search: string; state?: any };

type NavStackContextValue = {
  stack: NavEntry[];
  goBack: () => void;
  push: (entry: NavEntry) => void;
  replaceTop: (entry: NavEntry) => void;
};

const NavigationStackContext = createContext<NavStackContextValue | null>(null);

export function NavigationStackProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const prevRef = useRef(location);
  const [stack, setStack] = useState<NavEntry[]>([]);

  useEffect(() => {
    // push current location when it changes, avoid consecutive duplicates
    const last = stack[stack.length - 1];
    const entry = { pathname: location.pathname, search: location.search, state: (location as any).state };
    if (!last || last.pathname !== entry.pathname || last.search !== entry.search) {
      setStack((s) => [...s, entry]);
    }
    prevRef.current = location;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const goBack = () => {
    setStack((s) => {
      if (s.length <= 1) {
        // nothing to go back to in our stack — fall back to browser history
        window.history.back();
        return s;
      }
      // current is last; previous is second-last
      const prev = s[s.length - 2];
      const newStack = s.slice(0, -1);
      navigate(prev.pathname + (prev.search || ''), { state: prev.state, replace: true });
      return newStack;
    });
  };

  const push = (entry: NavEntry) => setStack((s) => [...s, entry]);
  const replaceTop = (entry: NavEntry) => setStack((s) => {
    if (s.length === 0) return [entry];
    const copy = [...s];
    copy[copy.length - 1] = entry;
    return copy;
  });

  return (
    <NavigationStackContext.Provider value={{ stack, goBack, push, replaceTop }}>
      {children}
    </NavigationStackContext.Provider>
  );
}

export function useNavStack() {
  const ctx = useContext(NavigationStackContext);
  if (!ctx) throw new Error('useNavStack must be used within NavigationStackProvider');
  return ctx;
}
