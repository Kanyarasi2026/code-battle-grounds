import { motion } from 'framer-motion';

const EVENTS = [
  { time: '04:12', color: 'rgba(255,255,255,0.18)', label: 'Assessment started', detail: 'Fullscreen enabled', severity: 'info' as const },
  { time: '12:47', color: 'rgba(255,255,255,0.76)', label: 'Left assessment tab', detail: 'Duration: 8 seconds', severity: 'warning' as const },
  { time: '18:33', color: 'rgba(255,255,255,0.76)', label: 'Large paste detected', detail: '347 characters pasted', severity: 'warning' as const },
  { time: '31:20', color: 'rgba(255,255,255,0.18)', label: 'Exited fullscreen', detail: 'Returned after 3 seconds', severity: 'info' as const },
  { time: '45:01', color: 'rgba(255,255,255,0.48)', label: 'Assessment submitted', detail: '3 of 3 problems attempted', severity: 'success' as const },
];

const severityColors = { info: 'rgba(255,255,255,0.28)', warning: 'rgba(255,255,255,0.76)', success: 'rgba(255,255,255,0.50)' };

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const IntegritySection = () => {
  const pillStyle = (flagged: boolean): React.CSSProperties => ({
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    padding: '3px 10px',
    borderRadius: '10px',
    background: flagged ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
    color: flagged ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.38)',
    border: flagged ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.06)',
  });

  return (
    <section id="integrity" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '48px' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.2em', marginBottom: '12px' }}>ASSESSMENT TRANSPARENCY</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: 'rgba(255,255,255,0.96)', margin: '0 0 16px' }}>Integrity insights, not verdicts.</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            We don't call it cheat detection. We call it the Integrity Timeline — a factual, neutral log of session events that puts the instructor in control of interpretation.
          </p>
        </motion.div>

        {/* Demo card */}
        <motion.div
          style={{ maxWidth: '760px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', background: '#0f0f10' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          whileHover={{ y: -2, transition: { duration: 0.22, ease: 'easeOut' as const } }}
        >
          {/* Card header */}
          <div style={{ background: '#141416', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.88)' }}>Session: Maya K. — Assessment #3</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={pillStyle(true)}>2 tab switches</span>
              <span style={pillStyle(false)}>1 fullscreen exit</span>
              <span style={pillStyle(true)}>1 large paste</span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ padding: '24px 28px', position: 'relative' }}>
            {EVENTS.map((event, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', paddingBottom: i < EVENTS.length - 1 ? '20px' : 0 }}>
                {/* Connector line */}
                {i < EVENTS.length - 1 && (
                  <div style={{ position: 'absolute', left: '4px', top: '14px', bottom: 0, width: '1px', background: 'rgba(255,255,255,0.06)' }} />
                )}
                {/* Dot */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: event.color, marginTop: '5px', flexShrink: 0, zIndex: 1 }} />
                {/* Content */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.22)', minWidth: '40px' }}>{event.time}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', color: severityColors[event.severity] }}>{event.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.22)' }}>{event.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
              No automated verdict is generated. Interpretation is the instructor's responsibility.
            </span>
            <button
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.60)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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
