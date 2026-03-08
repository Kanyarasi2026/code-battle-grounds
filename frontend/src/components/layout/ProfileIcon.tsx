import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import './ProfileIcon.scss';

export default function ProfileIcon() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const displayName =
    (user?.user_metadata?.['full_name'] as string | undefined) ??
    user?.email?.split('@')[0] ??
    'User';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="profile-icon" ref={wrapRef}>
      <button
        className="profile-icon__btn"
        onClick={() => setOpen((p) => !p)}
        title="Profile"
      >
        <Avatar username={displayName} size="sm" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="profile-icon__dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="profile-icon__info">
              <Avatar username={displayName} size="md" />
              <div className="profile-icon__details">
                <span className="profile-icon__name">{displayName}</span>
                <span className="profile-icon__email">
                  <Mail size={12} />
                  {user?.email}
                </span>
              </div>
            </div>
            <div className="profile-icon__divider" />
            <button
              className="profile-icon__action"
              onClick={() => { void signOut(); }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
