import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FACULTY_FEATURES = [
  { icon: '▣', title: 'Author Assessments', desc: 'Build timed coding assessments with per-problem rules, point values, and student assignments — all in one place.' },
  { icon: '◎', title: 'Integrity Timeline', desc: 'A factual, neutral log of assessment events — tab switches, paste actions, idle periods. Evidence, never accusation.' },
  { icon: '▥', title: 'Practice Sets', desc: 'Curate weekly problem sets for your class. Assign by topic, difficulty, or concept coverage.' },
  { icon: '◈', title: 'Misconception Maps', desc: 'Aggregated class-level data shows you exactly which concepts need re-teaching before the next assessment.' },
];

const FacultyFeatures = () => {
  return (
    <section id="faculty" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header row */}
        <motion.div
          style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginBottom: '60px', flexWrap: 'wrap' }}
          className="hp-faculty-header"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.20)', marginBottom: '14px' }}>
              BUILT FOR EDUCATORS
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '44px', letterSpacing: '-0.032em', color: 'rgba(255,255,255,0.90)', lineHeight: 1.1, margin: '0 0 16px' }}>
              Faculty tools that respect<br />your judgment.
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.78, margin: 0, maxWidth: '480px' }}>
              Code Battlegrounds isn't a proctoring tool. It's a teaching tool. Every feature is designed to give you context and insight — the final call is always yours.
            </p>
          </div>

          {/* Badge card */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
            padding: '24px 36px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.010) 100%)',
            borderRadius: '12px',
            color: 'rgba(255,255,255,0.36)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '20px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.38)' }}>▣</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)' }}>INSTRUCTOR MODE</span>
          </div>
        </motion.div>

        {/* Features grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }} className="hp-features-grid">
          {FACULTY_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              style={{
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                background: 'linear-gradient(160deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.008) 100%)',
                cursor: 'default',
                transition: 'border-color 0.22s, background 0.22s, transform 0.22s',
              }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.55, delay: i * 0.065, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.22, ease: 'easeOut' as const } }}
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
              <span style={{ fontSize: '18px', display: 'block', marginBottom: '14px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.30)', lineHeight: 1 }}>
                {feature.icon}
              </span>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.86)', margin: '0 0 8px' }}>
                {feature.title}
              </h4>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.68, margin: 0 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
      <style>{`
        @media (max-width: 1024px) { .hp-features-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .hp-features-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .hp-faculty-header { flex-direction: column !important; } }
      `}</style>
    </section>
  );
};

export default FacultyFeatures;
