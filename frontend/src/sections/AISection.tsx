import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const REVEAL = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const REVEAL_TRANSITION = { duration: 0.65, ease: EASE };
const CARD_HOVER = { y: -2, transition: { duration: 0.2, ease: 'easeOut' as const } };

const TIERS = [
  { badge: 'T1', label: 'Nudge', desc: 'A guiding question about the edge case', color: 'rgba(130,210,160,0.70)' },
  { badge: 'T2', label: 'Concept', desc: 'The algorithmic pattern you need, explained', color: 'rgba(120,170,240,0.70)' },
  { badge: 'T3', label: 'Pseudocode', desc: 'Step-by-step breakdown without code (assessment: locked)', color: 'rgba(210,170,100,0.70)' },
  { badge: 'T4', label: 'Solution', desc: 'Full solution walkthrough (assessment: locked)', color: 'rgba(200,130,200,0.70)' },
];

const AISection = () => {
  return (
    <section id="ai" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <motion.div
        style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}
        className="hp-ai-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >

        {/* Left */}
        <motion.div variants={REVEAL} transition={REVEAL_TRANSITION}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.22em', marginBottom: '14px' }}>
            AI INTEGRATION
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '44px', letterSpacing: '-0.032em', color: 'rgba(255,255,255,0.90)', margin: '0 0 16px', lineHeight: 1.1 }}>
            An AI coach that<br />teaches, not tells.
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.8, marginBottom: '36px', maxWidth: '440px' }}>
            The Stuck Detection Copilot watches your coding patterns — repeated failures, idle periods after errors, frantic edit cycles. When it detects you're stuck, it intervenes with a calibrated nudge, not a spoiler.
          </p>

          {/* Tier cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.badge}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.008) 100%)',
                  cursor: 'default',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                whileHover={CARD_HOVER}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.13)';
                  el.style.background = 'linear-gradient(160deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.016) 100%)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'linear-gradient(160deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.008) 100%)';
                }}
              >
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: tier.color,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}>
                  {tier.badge}
                </span>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.78)', marginBottom: '2px' }}>{tier.label}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.32)' }}>{tier.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — Demo card */}
        <motion.div
          style={{ border: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.14)', borderRadius: '14px', overflow: 'hidden', background: '#0c1018' }}
          variants={REVEAL}
          transition={{ ...REVEAL_TRANSITION, delay: 0.1 }}
          whileHover={CARD_HOVER}
        >
          {/* Card header */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.52)', letterSpacing: '0.06em' }}>◉ I'M STUCK — GET A HINT</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(130,210,160,0.60)', letterSpacing: '0.1em' }}>● live</span>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Signals box */}
            <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em', marginBottom: '12px' }}>WHY TRIGGERED</div>
              {[
                '● 5 failed runs on test case 3',
                '● 8 min idle after RuntimeError',
                '● Same 3 lines edited 7× in a row',
              ].map((s, i) => (
                <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.34)', marginBottom: i < 2 ? '7px' : 0, lineHeight: 1.5 }}>{s}</div>
              ))}
            </div>

            {/* Hint box */}
            <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(130,210,160,0.04)', border: '1px solid rgba(130,210,160,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '3px 8px', borderRadius: '5px' }}>T1</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>Nudge</span>
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: 'rgba(130,210,160,0.88)', letterSpacing: '0.02em' }}>Reveal</span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.75, fontStyle: 'italic', margin: '0 0 16px' }}>
                Have you considered what happens when{' '}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(130,210,160,0.88)', fontStyle: 'normal' }}>nums</span>
                {' '}contains duplicate values? Your current lookup might overwrite an earlier index.
              </p>
              {/* Locked tiers preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {[
                  { badge: 'T2', label: 'Concept' },
                  { badge: 'T3', label: 'Pseudocode' },
                  { badge: 'T4', label: 'Solution' },
                ].map(t => (
                  <div key={t.badge} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '3px 8px', borderRadius: '5px' }}>{t.badge}</span>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.26)' }}>{t.label}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.18)' }}>🔒</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <style>{`@media (max-width: 900px) { .hp-ai-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

export default AISection;
