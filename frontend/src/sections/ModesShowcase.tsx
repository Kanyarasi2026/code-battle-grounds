import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TAB_SPRING = { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 };
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const MODES = [
  {
    id: 'solo',
    icon: '◈',
    accent: '#4b5563',
    accentRgb: '75,85,99',
    accentBg: 'rgba(0,0,0,0.03)',
    accentBorder: 'rgba(0,0,0,0.10)',
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
    accent: '#6b7280',
    accentRgb: '107,114,128',
    accentBg: 'rgba(0,0,0,0.02)',
    accentBorder: 'rgba(0,0,0,0.08)',
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
    accent: '#374151',
    accentRgb: '55,65,81',
    accentBg: 'rgba(0,0,0,0.025)',
    accentBorder: 'rgba(0,0,0,0.09)',
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

  const active = MODES.find(m => m.id === activeId) ?? MODES[0]!;

  const sectionStyle: React.CSSProperties = {
    padding: '100px 32px',
    background: 'linear-gradient(180deg, #f8f9fa 0%, #f0f2f5 100%)',
    borderTop: '1px solid rgba(107, 114, 128, 0.12)',
  };

  const innerStyle: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto' };

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    marginBottom: '28px',
    flexWrap: 'wrap' as const,
  };

  return (
    <section id="modes" style={sectionStyle}>
      <div style={innerStyle}>
        {/* Section header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '48px' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#a0aec0', letterSpacing: '0.2em', marginBottom: '12px' }}>PLATFORM MODES</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: '#2d3748', margin: '0 0 16px' }}>Three modes. One platform.</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#a0aec0', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            Every mode is purpose-built. Practice AI helps freely. Assessment AI steps back. Instructor tools see everything — without judging.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div style={tabBarStyle}>
          {MODES.map(mode => {
            const isActive = mode.id === activeId;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setActiveId(mode.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(0,0,0,0.18)' : '1px solid rgba(0,0,0,0.08)',
                  background: 'transparent',
                  color: isActive ? mode.accent : '#718096',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'color 0.22s, border-color 0.2s',
                }}
                whileTap={{ scale: 0.97 }}
                transition={TAB_SPRING}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  if (!isActive) {
                    el.style.borderColor = 'rgba(0,0,0,0.14)';
                    el.style.background = 'rgba(0,0,0,0.03)';
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = isActive ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.08)';
                  el.style.background = 'transparent';
                }}
              >
                {/* Sliding active fill */}
                {isActive && (
                  <motion.div
                    layoutId="active-tab-highlight"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.04)',
                      borderRadius: '9px',
                    }}
                    transition={TAB_SPRING}
                  />
                )}
                {/* Active bottom strip */}
                {isActive && (
                  <motion.div
                    layoutId="active-tab-strip"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '14px',
                      right: '14px',
                      height: '1px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '1px',
                    }}
                    initial={{ opacity: 0, scaleX: 0.4 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0.4 }}
                    transition={TAB_SPRING}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{mode.icon}</span>
                <span style={{ position: 'relative', zIndex: 1 }}>{mode.title}</span>
                <span style={{
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)',
                  color: isActive ? mode.accent : '#9ca3af',
                  transition: 'background 0.22s, color 0.22s',
                }}>
                  {mode.badge}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ type: 'tween', duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            border: `1px solid ${active.accentBorder}`,
            background: active.accentBg,
            borderRadius: '16px',
            padding: '40px',
          }}
          className="hp-modes-panel"
        >
          {/* Left */}
          <div>
            <div style={{ fontSize: '26px', color: active.accent, marginBottom: '16px', fontFamily: 'JetBrains Mono, monospace' }}>{active.icon}</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px', color: '#2d3748', margin: '0 0 12px' }}>{active.title}</h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#a0aec0', lineHeight: 1.7, marginBottom: '24px' }}>{active.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {active.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: active.accent, fontSize: '10px', flexShrink: 0 }}>&#x25A0;</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#718096' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Code preview */}
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }} className="hp-code-preview">
            <div style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>PREVIEW</span>
            </div>
            <pre style={{ padding: '24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.8, color: '#a0aec0', whiteSpace: 'pre-wrap', margin: 0 }}>
              {active.codeSnippet}
            </pre>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, #0d1117)', pointerEvents: 'none' }} />
          </div>
        </motion.div>
        </AnimatePresence>
      </div>
      <style>{`
        @media (max-width: 768px) { .hp-modes-panel { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .hp-code-preview { display: none !important; } }
      `}</style>
    </section>
  );
};

export default ModesShowcase;
