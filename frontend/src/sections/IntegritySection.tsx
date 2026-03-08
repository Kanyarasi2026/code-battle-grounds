import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const EVENTS = [
  { time: '04:12', label: 'Assessment started', detail: 'Fullscreen enabled', kind: 'neutral' as const },
  { time: '12:47', label: 'Left assessment tab', detail: 'Duration: 8 seconds', kind: 'flagged' as const },
  { time: '18:33', label: 'Large paste detected', detail: '347 characters pasted', kind: 'flagged' as const },
  { time: '31:20', label: 'Exited fullscreen', detail: 'Returned after 3 seconds', kind: 'neutral' as const },
  { time: '45:01', label: 'Assessment submitted', detail: '3 of 3 problems attempted', kind: 'done' as const },
];

const DOT_COLOR = { neutral: 'rgba(255,255,255,0.28)', flagged: 'rgba(251,146,60,0.72)', done: 'rgba(130,210,160,0.60)' };
const LABEL_COLOR = { neutral: 'rgba(255,255,255,0.62)', flagged: 'rgba(251,146,60,0.82)', done: 'rgba(130,210,160,0.72)' };

const IntegritySection = () => {
  const pillStyle = (flagged: boolean): React.CSSProperties => ({
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    padding: '3px 10px',
    borderRadius: '10px',
    background: flagged ? 'rgba(251,146,60,0.08)' : 'rgba(255,255,255,0.04)',
    color: flagged ? 'rgba(251,146,60,0.72)' : 'rgba(255,255,255,0.28)',
    border: flagged ? '1px solid rgba(251,146,60,0.18)' : '1px solid rgba(255,255,255,0.08)',
  });

  return (
    <section id="integrity" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '52px' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.22em', marginBottom: '14px' }}>
            ASSESSMENT TRANSPARENCY
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '44px', letterSpacing: '-0.032em', color: 'rgba(255,255,255,0.90)', margin: '0 0 16px', lineHeight: 1.1 }}>
            Integrity insights,<br />not verdicts.
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.78, maxWidth: '560px', margin: '0 auto' }}>
            We don't call it cheat detection. We call it the Integrity Timeline — a factual, neutral log of session events that puts the instructor in control of interpretation.
          </p>
        </motion.div>

        {/* Demo card */}
        <motion.div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#0c1018',
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          whileHover={{ y: -2, transition: { duration: 0.22, ease: 'easeOut' as const } }}
        >
          {/* Card header */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '18px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.52)', letterSpacing: '0.04em' }}>
              Session · Maya K. — Assessment #3
            </span>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
              <span style={pillStyle(true)}>2 tab switches</span>
              <span style={pillStyle(false)}>1 fullscreen exit</span>
              <span style={pillStyle(true)}>1 large paste</span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ padding: '28px', position: 'relative' }}>
            {EVENTS.map((event, i) => (
              <motion.div
                key={i}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', paddingBottom: i < EVENTS.length - 1 ? '22px' : 0 }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
              >
                {/* Connector line */}
                {i < EVENTS.length - 1 && (
                  <div style={{ position: 'absolute', left: '3.5px', top: '14px', bottom: 0, width: '1px', background: 'rgba(255,255,255,0.06)' }} />
                )}
                {/* Dot */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DOT_COLOR[event.kind], marginTop: '5px', flexShrink: 0, zIndex: 1 }} />
                {/* Content */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.22)', minWidth: '40px', letterSpacing: '0.04em' }}>{event.time}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', color: LABEL_COLOR[event.kind] }}>{event.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.22)' }}>{event.detail}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 28px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            background: 'rgba(255,255,255,0.015)',
          }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.18)', lineHeight: 1.6, letterSpacing: '0.04em', maxWidth: '420px' }}>
              No automated verdict is generated. Interpretation is the instructor's responsibility.
            </span>
            <button
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
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.44)';
              }}
            >
              View Full Replay &rarr;
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default IntegritySection;
