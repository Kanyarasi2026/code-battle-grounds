import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const REVEAL = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const REVEAL_TRANSITION = { duration: 0.65, ease: EASE };
const CARD_HOVER = { y: -2, transition: { duration: 0.2, ease: 'easeOut' as const } };

const AISection = () => {
  return (
    <section id="ai" style={{ padding: '100px 32px', background: '#ffffff', borderTop: '1px solid rgba(107, 114, 128, 0.12)' }}>
      <motion.div
        style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}
        className="hp-ai-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >

        {/* Left */}
        <motion.div variants={REVEAL} transition={REVEAL_TRANSITION}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#a0aec0', letterSpacing: '0.2em', marginBottom: '12px' }}>AI INTEGRATION</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: '#2d3748', margin: '0 0 20px', lineHeight: 1.1 }}>An AI coach that teaches, not tells.</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#a0aec0', lineHeight: 1.7, marginBottom: '32px' }}>
            The Stuck Detection Copilot watches your coding patterns — repeated failures, idle periods after errors, frantic edit cycles. When it detects you're stuck, it intervenes with a calibrated nudge, not a spoiler.
          </p>

          {/* Tier cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { badge: 'T1', badgeColor: '#718096', label: 'Small nudge', desc: 'A guiding question about the edge case' },
              { badge: 'T2', badgeColor: '#4a5568', label: 'Concept hint', desc: 'The algorithmic pattern you need, explained' },
              { badge: 'T3', badgeColor: '#2d3748', label: 'Stronger guidance', desc: 'Pseudocode-level breakdown (assessment: locked)' },
            ].map(tier => (
              <motion.div
                key={tier.badge}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(107, 114, 128, 0.15)',
                  background: 'rgba(107, 114, 128, 0.04)',
                }}
                whileHover={CARD_HOVER}
              >
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: tier.badgeColor,
                  background: 'rgba(107, 114, 128, 0.12)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}>
                  {tier.badge}
                </span>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2d3748', marginBottom: '2px' }}>{tier.label}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#a0aec0' }}>{tier.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Demo card */}
        <motion.div
          style={{ border: '1px solid rgba(107, 114, 128, 0.15)', borderRadius: '14px', overflow: 'hidden', background: '#f8f9fa' }}
          variants={REVEAL}
          transition={{ ...REVEAL_TRANSITION, delay: 0.1 }}
          whileHover={CARD_HOVER}
        >
          {/* Header */}
          <div style={{ background: '#f1f3f5', borderBottom: '1px solid rgba(107, 114, 128, 0.12)', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.72)' }}>&#x25C9; STUCK DETECTION COPILOT</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.22)' }}>live</span>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Signals box */}
            <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', marginBottom: '10px' }}>Why triggered:</div>
              {['● 5 failed runs on test case 3', '● 8 min idle after RuntimeError', '● Same 3 lines edited 7x in a row'].map((s, i) => (
                <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.34)', marginBottom: '6px' }}>{s}</div>
              ))}
            </div>

            {/* Hint box */}
            <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.88)', letterSpacing: '0.1em', marginBottom: '10px' }}>Hint · Tier 1</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.56)', lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 14px' }}>
                Have you considered what happens when{' '}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.88)', fontStyle: 'normal' }}>nums</span>
                {' '}contains duplicate values? Your current lookup might overwrite an earlier index.
              </p>
              <button
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.70)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.14)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Reveal Tier 2 &rarr;
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <style>{`@media (max-width: 900px) { .hp-ai-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

export default AISection;
