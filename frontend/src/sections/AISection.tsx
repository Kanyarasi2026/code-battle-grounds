const AISection = () => {
  return (
    <section id="ai" style={{ padding: '100px 32px', background: 'rgba(0,229,204,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="hp-ai-grid">

        {/* Left */}
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00e5cc', letterSpacing: '0.2em', marginBottom: '12px' }}>AI INTEGRATION</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: '#e2e8f0', margin: '0 0 20px', lineHeight: 1.1 }}>An AI coach that teaches, not tells.</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#6b7280', lineHeight: 1.7, marginBottom: '32px' }}>
            The Stuck Detection Copilot watches your coding patterns — repeated failures, idle periods after errors, frantic edit cycles. When it detects you're stuck, it intervenes with a calibrated nudge, not a spoiler.
          </p>

          {/* Tier cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { badge: 'T1', badgeColor: '#00e5cc', badgeRgb: '0,229,204', label: 'Small nudge', desc: 'A guiding question about the edge case' },
              { badge: 'T2', badgeColor: '#a78bfa', badgeRgb: '167,139,250', label: 'Concept hint', desc: 'The algorithmic pattern you need, explained' },
              { badge: 'T3', badgeColor: '#f5a623', badgeRgb: '245,166,35', label: 'Stronger guidance', desc: 'Pseudocode-level breakdown (assessment: locked)' },
            ].map(tier => (
              <div key={tier.badge} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 18px',
                borderRadius: '10px',
                border: `1px solid rgba(${tier.badgeRgb}, 0.12)`,
                background: `rgba(${tier.badgeRgb}, 0.03)`,
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: tier.badgeColor,
                  background: `rgba(${tier.badgeRgb}, 0.12)`,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}>
                  {tier.badge}
                </span>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: '#e2e8f0', marginBottom: '2px' }}>{tier.label}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#6b7280' }}>{tier.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Demo card */}
        <div style={{ border: '1px solid rgba(0,229,204,0.12)', borderRadius: '14px', overflow: 'hidden', background: '#0d1117' }}>
          {/* Header */}
          <div style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#f5a623' }}>&#x25C9; STUCK DETECTION COPILOT</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4a5568' }}>live</span>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Signals box */}
            <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '10px' }}>Why triggered:</div>
              {['● 5 failed runs on test case 3', '● 8 min idle after RuntimeError', '● Same 3 lines edited 7x in a row'].map((s, i) => (
                <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{s}</div>
              ))}
            </div>

            {/* Hint box */}
            <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(0,229,204,0.04)', border: '1px solid rgba(0,229,204,0.12)' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00e5cc', letterSpacing: '0.1em', marginBottom: '10px' }}>Hint · Tier 1</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#9ca3af', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '14px', margin: '0 0 14px' }}>
                Have you considered what happens when{' '}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e5cc', fontStyle: 'normal' }}>nums</span>
                {' '}contains duplicate values? Your current lookup might overwrite an earlier index.
              </p>
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
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,229,204,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Reveal Tier 2 &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .hp-ai-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

export default AISection;
