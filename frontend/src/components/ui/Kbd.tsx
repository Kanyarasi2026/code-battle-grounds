import clsx from 'clsx';
import type { ReactNode } from 'react';
import './Kbd.scss';

interface KbdProps { children?: ReactNode; className?: string; }
interface KbdShortcutProps { keys: string[]; className?: string; }

const Kbd = ({ children, className }: KbdProps) => <kbd className={clsx('kbd', className)}>{children}</kbd>;

export const KbdShortcut = ({ keys, className }: KbdShortcutProps) => (
  <span className={clsx('kbd-shortcut', className)}>
    {keys.map((key, i) => (
      <span key={i}><Kbd>{key}</Kbd>{i < keys.length - 1 && <span className="kbd-shortcut__sep">+</span>}</span>
    ))}
  </span>
);

export default Kbd;
