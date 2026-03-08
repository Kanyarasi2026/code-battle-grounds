import { useState } from 'react';

const MODES = [
  {
    id: 'solo',
    icon: '◈',
    accent: '#00e5cc',
    accentRgb: '0,229,204',
    title: 'Solo Practice',
    badge: 'STUDENT',
    desc: "Solve DSA problems at your own pace. The AI detects when you're stuck before you even ask — and delivers hints in tiers so you learn, not copy.",
    features: ['Tiered AI hint system', 'Test case-level feedback', 'Personalized learning memory', 'Progress tracking'],
    codeSnippet: `# AI detected: 4 failed runs on edge case
# Hint tier 1 of 3:
# "What happens when left > right?"`,
  },
  {
    id: 'pair',
    icon: '⟡',
    accent: '#a78bfa',
    accentRgb: '167,139,250',
    title: 'Pair Programming',
    badge: 'COLLABORATIVE',
    desc: 'Two engineers, one editor. Real-time presence, contribution tracking, and an AI moderator that compares your approaches and suggests how to merge them.',
    features: ['Live shared Monaco editor', 'Cursor presence + typing signals', 'AI approach debate mode', 'Contribution analytics'],
    codeSnippet: `// AI Moderator comparing approaches:
// A: O(n log n) — cleaner, sortable
// B: O(n) — faster, hash-based
// Recommendation: use B in interview`,
  },
  {
    id: 'assess',
    icon: '▣',
    accent: '#f5a623',
    accentRgb: '245,166,35',
    title: 'Assessment Mode',
    badge: 'FACULTY',
    desc: 'Faculty create timed, structured assessments. Students code under fair constraints. Every session is transparent — not proctored, but reviewable.',
    features: ['Timed locked sessions', 'Integrity timeline (not verdict)', 'Full session replay', 'Instructor analytics'],
    codeSnippet: `// Assessment transparency:
// 2 tab switches logged
// 1 large paste flagged
// -> Review session replay`,
  },
];

const ModesShowcase = () => {
  const [activeId, setActiveId] = useState('solo');
  const [panelOpacity, setPanelOpacity] = useState(1);

  const active = MODES.find(m => m.id === activeId) ?? MODES[0]!;

  const switchMode = (id: string) => {
    setPanelOpacity(0);
    setTimeout(() => { setActiveId(id); setPanelOpacity(1); }, 200);
  };

  const sectionStyle: React.CSSProperties = {
    padding: '100px 32px',
    background: 'rgba(255,255,255,0.01)',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  };

  const innerStyle: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto' };

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap' as const,
  };

  return (
    <section id="modes" style={sectionStyle}>
      <div style={innerStyle}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00e5cc', letterSpacing: '0.2em', marginBottom: '12px' }}>PLATFORM MODES</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: '#e2e8f0', margin: '0 0 16px' }}>Three modes. One platform.</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#6b7280', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            Every mode is purpose-built. Practice AI helps freely. Assessment AI steps back. Instructor tools see everything — without judging.
          </p>
        </div>

        {/* Tab bar */}
        <div style={tabBarStyle}>
          {MODES.map(mode => {
            const isActive = mode.id === activeId;
            return (
              <button
                key={mode.id}
                onClick={() => switchMode(mode.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: isActive ? `1px solid ${mode.accent}` : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? `rgba(${mode.accentRgb}, 0.08)` : 'transparent',
                  color: isActive ? mode.accent : '#6b7280',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span>{mode.icon}</span>
                <span>{mode.title}</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: isActive ? `rgba(${mode.accentRgb}, 0.15)` : 'rgba(255,255,255,0.05)',
                  color: isActive ? mode.accent : '#4a5568',
                }}>
                  {mode.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          border: `1px solid rgba(${active.accentRgb}, 0.12)`,
          background: `rgba(${active.accentRgb}, 0.02)`,
          borderRadius: '16px',
          padding: '40px',
          opacity: panelOpacity,
          transition: 'opacity 0.2s ease, border-color 0.3s, background 0.3s',
        }} className="hp-modes-panel">
          {/* Left */}
          <div>
            <div style={{ fontSize: '36px', color: active.accent, marginBottom: '16px' }}>{active.icon}</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px', color: '#e2e8f0', margin: '0 0 12px' }}>{active.title}</h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#6b7280', lineHeight: 1.7, marginBottom: '24px' }}>{active.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {active.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: active.accent, fontSize: '10px' }}>&#x25A0;</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#9ca3af' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Code preview */}
          <div style={{ background: '#0d1117', border: `1px solid rgba(${active.accentRgb}, 0.1)`, borderRadius: '12px', overflow: 'hidden', position: 'relative' }} className="hp-code-preview">
            <div style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#4a5568' }}>PREVIEW</span>
            </div>
            <pre style={{ padding: '24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.8, color: '#9ca3af', whiteSpace: 'pre-wrap', margin: 0 }}>
              {active.codeSnippet}
            </pre>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, #0d1117)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .hp-modes-panel { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .hp-code-preview { display: none !important; } }
      `}</style>
    </section>
  );
};

export default ModesShowcase;
