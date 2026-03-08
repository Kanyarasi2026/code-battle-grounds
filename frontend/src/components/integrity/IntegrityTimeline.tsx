import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import type { IntegrityEvent, IntegritySummary } from '../../types';

interface IntegrityTimelineProps {
  events: IntegrityEvent[];
  summary: IntegritySummary;
  /** Shown in the session header (faculty review mode) */
  studentName?: string;
  assessmentName?: string;
  /** Compact = student-facing sidebar view. Full = faculty review panel. */
  compact?: boolean;
  onViewReplay?: () => void;
}

const DOT_COLOR: Record<string, string> = {
  neutral: 'rgba(255,255,255,0.28)',
  flagged: 'rgba(251,146,60,0.72)',
  done: 'rgba(130,210,160,0.60)',
  info: 'rgba(99,179,237,0.72)',
};

const LABEL_COLOR: Record<string, string> = {
  neutral: 'rgba(255,255,255,0.62)',
  flagged: 'rgba(251,146,60,0.82)',
  done: 'rgba(130,210,160,0.72)',
  info: 'rgba(99,179,237,0.82)',
};

const PILL_FLAGGED: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px',
  padding: '3px 10px',
  borderRadius: '10px',
  background: 'rgba(251,146,60,0.08)',
  color: 'rgba(251,146,60,0.72)',
  border: '1px solid rgba(251,146,60,0.18)',
  whiteSpace: 'nowrap',
};

const PILL_NEUTRAL: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px',
  padding: '3px 10px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)',
  color: 'rgba(255,255,255,0.28)',
  border: '1px solid rgba(255,255,255,0.08)',
  whiteSpace: 'nowrap',
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * IntegrityTimeline — forensic session log component.
 *
 * Used in two modes:
 * - compact=false (default): Full instructor-review panel with session header,
 *   summary pills, timeline, and footer disclaimer.
 * - compact=true: Lightweight student-facing sidebar showing their own live
 *   activity for transparency.
 */
const IntegrityTimeline = ({
  events,
  summary,
  studentName,
  assessmentName,
  compact = false,
  onViewReplay,
}: IntegrityTimelineProps) => {
  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Compact header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px',
          }}
        >
          <Shield size={14} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.38)', flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.30)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Session Activity
          </span>
        </div>

        {/* Summary pills */}
        {(summary.tabSwitches > 0 || summary.fullscreenExits > 0 || summary.largePastes > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {summary.tabSwitches > 0 && (
              <span style={PILL_FLAGGED}>{summary.tabSwitches} tab switch{summary.tabSwitches !== 1 ? 'es' : ''}</span>
            )}
            {summary.fullscreenExits > 0 && (
              <span style={PILL_NEUTRAL}>{summary.fullscreenExits} fullscreen exit{summary.fullscreenExits !== 1 ? 's' : ''}</span>
            )}
            {summary.largePastes > 0 && (
              <span style={PILL_FLAGGED}>{summary.largePastes} large paste{summary.largePastes !== 1 ? 's' : ''}</span>
            )}
          </div>
        )}

        {/* Events list */}
        {events.length === 0 ? (
          <div
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.22)',
              textAlign: 'center',
              padding: '16px 0',
            }}
          >
            No events logged yet
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <AnimatePresence initial={false}>
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    position: 'relative',
                    paddingBottom: i < events.length - 1 ? '14px' : 0,
                  }}
                >
                  {i < events.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '3px',
                        top: '12px',
                        bottom: 0,
                        width: '1px',
                        background: 'rgba(255,255,255,0.06)',
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: DOT_COLOR[event.kind],
                      marginTop: '4px',
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '10px',
                          color: 'rgba(255,255,255,0.22)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {event.elapsed}
                      </span>
                      <span
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: 500,
                          fontSize: '12px',
                          color: LABEL_COLOR[event.kind],
                        }}
                      >
                        {event.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.20)',
                        marginTop: '2px',
                      }}
                    >
                      {event.detail}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Transparency note */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.18)',
              lineHeight: 1.7,
              margin: 0,
              letterSpacing: '0.03em',
            }}
          >
            This log is shared with your instructor. No automated verdict is generated.
          </p>
        </div>
      </div>
    );
  }

  // ── Full instructor review mode ──────────────────────────────
  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#0c1018',
      }}
    >
      {/* Session header */}
      <div
        style={{
          background: 'rgba(255,255,255,0.025)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '18px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.52)',
            letterSpacing: '0.04em',
          }}
        >
          Session · {studentName ?? 'Student'}{assessmentName ? ` — ${assessmentName}` : ''}
        </span>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {summary.tabSwitches > 0 && (
            <span style={PILL_FLAGGED}>
              {summary.tabSwitches} tab switch{summary.tabSwitches !== 1 ? 'es' : ''}
            </span>
          )}
          {summary.fullscreenExits > 0 && (
            <span style={PILL_NEUTRAL}>
              {summary.fullscreenExits} fullscreen exit{summary.fullscreenExits !== 1 ? 's' : ''}
            </span>
          )}
          {summary.largePastes > 0 && (
            <span style={PILL_FLAGGED}>
              {summary.largePastes} large paste{summary.largePastes !== 1 ? 's' : ''}
            </span>
          )}
          {summary.tabSwitches === 0 && summary.fullscreenExits === 0 && summary.largePastes === 0 && (
            <span style={PILL_NEUTRAL}>no signals</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '28px', position: 'relative' }}>
        {events.length === 0 ? (
          <div
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.22)',
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            No events recorded yet.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  position: 'relative',
                  paddingBottom: i < events.length - 1 ? '22px' : 0,
                }}
              >
                {i < events.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '3.5px',
                      top: '14px',
                      bottom: 0,
                      width: '1px',
                      background: 'rgba(255,255,255,0.06)',
                    }}
                  />
                )}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: DOT_COLOR[event.kind],
                    marginTop: '5px',
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.22)',
                      minWidth: '40px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {event.elapsed}
                  </span>
                  <span
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 500,
                      fontSize: '13px',
                      color: LABEL_COLOR[event.kind],
                    }}
                  >
                    {event.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.22)',
                    }}
                  >
                    {event.detail}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 28px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.18)',
            lineHeight: 1.6,
            letterSpacing: '0.04em',
            maxWidth: '420px',
          }}
        >
          No automated verdict is generated. Interpretation is the instructor's responsibility.
        </span>
        {onViewReplay && (
          <button
            onClick={onViewReplay}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.44)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.10)',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s, border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.44)';
            }}
          >
            View Full Replay &rarr;
          </button>
        )}
      </div>
    </div>
  );
};

export default IntegrityTimeline;
