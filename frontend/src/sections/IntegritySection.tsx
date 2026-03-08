const EVENTS = [
  { time: '04:12', color: '#4a5568', label: 'Assessment started', detail: 'Fullscreen enabled', severity: 'info' as const },
  { time: '12:47', color: '#febc2e', label: 'Left assessment tab', detail: 'Duration: 8 seconds', severity: 'warning' as const },
  { time: '18:33', color: '#febc2e', label: 'Large paste detected', detail: '347 characters pasted', severity: 'warning' as const },
  { time: '31:20', color: '#4a5568', label: 'Exited fullscreen', detail: 'Returned after 3 seconds', severity: 'info' as const },
  { time: '45:01', color: '#28c840', label: 'Assessment submitted', detail: '3 of 3 problems attempted', severity: 'success' as const },
];

const severityColors = { info: '#9ca3af', warning: '#febc2e', success: '#28c840' };

const IntegritySection = () => {
  const pillStyle = (amber: boolean): React.CSSProperties => ({
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    padding: '3px 10px',
    borderRadius: '10px',
    background: amber ? 'rgba(254,188,46,0.1)' : 'rgba(255,255,255,0.05)',
    color: amber ? '#febc2e' : '#6b7280',
    border: amber ? '1px solid rgba(254,188,46,0.2)' : '1px solid rgba(255,255,255,0.08)',
  });

  return (
    <section id="integrity" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#080c10' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00e5cc', letterSpacing: '0.2em', marginBottom: '12px' }}>ASSESSMENT TRANSPARENCY</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: '#e2e8f0', margin: '0 0 16px' }}>Integrity insights, not verdicts.</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#6b7280', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            We don't call it cheat detection. We call it the Integrity Timeline — a factual, neutral log of session events that puts the instructor in control of interpretation.
          </p>
        </div>

        {/* Demo card */}
        <div style={{ maxWidth: '760px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', background: '#0d1117' }}>
          {/* Card header */}
          <div style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#e2e8f0' }}>Session: Maya K. — Assessment #3</span>
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
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: event.color, marginTop: '4px', flexShrink: 0, zIndex: 1, boxShadow: `0 0 8px ${event.color}40` }} />
                {/* Content */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#4a5568', minWidth: '40px' }}>{event.time}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px', color: severityColors[event.severity] }}>{event.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#4a5568' }}>{event.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4a5568', lineHeight: 1.5 }}>
              No automated verdict is generated. Interpretation is the instructor's responsibility.
            </span>
            <button
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: '#00e5cc',
                background: 'transparent',
                border: '1px solid rgba(0,229,204,0.2)',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,229,204,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              View Full Replay &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegritySection;
