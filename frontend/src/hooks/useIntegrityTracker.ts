import { useState, useEffect, useCallback, useRef } from 'react';
import type { IntegrityEvent, IntegrityEventKind, IntegritySummary } from '../types';

const LARGE_PASTE_THRESHOLD = 50; // characters

function formatElapsed(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Tracks integrity events during an assessment session:
 * - Tab switches (visibilitychange)
 * - Fullscreen exits/returns (fullscreenchange)
 * - Large paste events (paste)
 *
 * Returns live events, a summary, and a `logEvent` function for manual events.
 */
export function useIntegrityTracker(active = true) {
  const [events, setEvents] = useState<IntegrityEvent[]>([]);
  // eslint-disable-next-line react-hooks/purity
  const startRef = useRef(Date.now());
  const counterRef = useRef(0);

  const addEvent = useCallback(
    (label: string, detail: string, kind: IntegrityEventKind) => {
      const event: IntegrityEvent = {
        id: String(++counterRef.current),
        timestamp: Date.now(),
        elapsed: formatElapsed(Date.now() - startRef.current),
        label,
        detail,
        kind,
      };
      setEvents((prev) => [...prev, event]);
    },
    [],
  );

  // Tab-switch tracking: log after the student returns (captures duration)
  useEffect(() => {
    if (!active) return;
    let leaveTime: number | null = null;

    const onVisibilityChange = () => {
      if (document.hidden) {
        leaveTime = Date.now();
      } else if (leaveTime !== null) {
        const secs = Math.round((Date.now() - leaveTime) / 1000);
        addEvent(
          'Left assessment tab',
          `Duration: ${secs} second${secs !== 1 ? 's' : ''}`,
          'flagged',
        );
        leaveTime = null;
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [active, addEvent]);

  // Fullscreen-exit tracking: log after student returns (captures duration)
  useEffect(() => {
    if (!active) return;
    let exitTime: number | null = null;

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        exitTime = Date.now();
      } else if (exitTime !== null) {
        const secs = Math.round((Date.now() - exitTime) / 1000);
        addEvent(
          'Exited fullscreen',
          `Returned after ${secs} second${secs !== 1 ? 's' : ''}`,
          'neutral',
        );
        exitTime = null;
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [active, addEvent]);

  // Large-paste detection
  useEffect(() => {
    if (!active) return;

    const onPaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text') ?? '';
      if (text.length >= LARGE_PASTE_THRESHOLD) {
        addEvent('Large paste detected', `${text.length} characters pasted`, 'flagged');
      }
    };

    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [active, addEvent]);

  /** Manually log a named event (e.g. assessment started, submitted). */
  const logEvent = useCallback(
    (label: string, detail: string, kind: IntegrityEventKind = 'neutral') => {
      addEvent(label, detail, kind);
    },
    [addEvent],
  );

  const summary: IntegritySummary = {
    tabSwitches: events.filter((e) => e.label === 'Left assessment tab').length,
    fullscreenExits: events.filter((e) => e.label === 'Exited fullscreen').length,
    largePastes: events.filter((e) => e.label === 'Large paste detected').length,
  };

  return { events, summary, logEvent };
}
