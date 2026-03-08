import { motion } from 'framer-motion';

const FACULTY_FEATURES = [
  { icon: '▣', title: 'Author Assessments', desc: 'Build timed coding assessments with per-problem rules, point values, and student assignments — all in one place.' },
  { icon: '▤', title: 'Class Analytics', desc: 'See which problems trip students up most, common error patterns, and where the AI was called most across your whole class.' },
  { icon: '▷', title: 'Session Replay', desc: 'Replay any student session keystroke-by-keystroke. See the full coding journey, not just the final answer.' },
  { icon: '◎', title: 'Integrity Timeline', desc: 'A factual, neutral log of assessment events — tab switches, paste actions, idle periods. Evidence, never accusation.' },
  { icon: '▥', title: 'Practice Sets', desc: 'Curate weekly problem sets for your class. Assign by topic, difficulty, or concept coverage.' },
  { icon: '◈', title: 'Misconception Maps', desc: 'Aggregated class-level data shows you exactly which concepts need re-teaching before the next assessment.' },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const FacultyFeatures = () => {
  return (
    <section id="faculty" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header row */}
        <motion.div
          style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '56px', flexWrap: 'wrap' }}
          className="hp-faculty-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          {/* Left */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)', marginBottom: '12px' }}>BUILT FOR EDUCATORS</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: 'rgba(255,255,255,0.96)', lineHeight: 1.1, margin: '0 0 16px' }}>Faculty tools that respect<br />your judgment.</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, margin: 0 }}>
              Code Battlegrounds isn't a proctoring tool. It's a teaching tool. Every feature is designed to give you context and insight — the final call is always yours.
            </p>
          </div>
          {/* Right - Badge card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '24px 32px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)', boxShadow: '0 8px 24px rgba(0,0,0,0.24)', color: 'rgba(255,255,255,0.52)', flexShrink: 0 }}>
            <span style={{ fontSize: '22px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.40)' }}>▣</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>INSTRUCTOR MODE</span>
          </div>
        </motion.div>

        {/* Features grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="hp-features-grid">
          {FACULTY_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              style={{
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
                cursor: 'default',
                transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              whileHover={{ y: -2, transition: { duration: 0.22, ease: 'easeOut' as const } }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.14)';
                el.style.boxShadow = '0 18px 48px rgba(0,0,0,0.38)';
                el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.020) 100%)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.08)';
                el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.28)';
                el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)';
              }}
            >
              <span style={{ fontSize: '20px', display: 'block', marginBottom: '14px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.38)', lineHeight: 1 }}>{feature.icon}</span>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', color: 'rgba(255,255,255,0.92)', margin: '0 0 8px' }}>{feature.title}</h4>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) { .hp-features-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .hp-features-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

export default FacultyFeatures;
