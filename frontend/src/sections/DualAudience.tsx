import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const DualAudience = () => {
  const sectionStyle: React.CSSProperties = {
    padding: '100px 32px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  };

  const renderCard = (opts: {
    topBar: string;
    leftBorder: string;
    accent: string;
    icon: string;
    roleLabel: string;
    heading: string;
    desc: string;
    features: string[];
    cta: string;
    delay: number;
  }) => (
    <motion.div
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: opts.leftBorder,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
        borderRadius: '16px',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, background 0.25s',
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6, delay: opts.delay, ease: EASE }}
      whileHover={{ y: -2, transition: { duration: 0.22, ease: 'easeOut' as const } }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = '0 20px 52px rgba(0,0,0,0.40)';
        el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.020) 100%)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.28)';
        el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)';
      }}
    >
      {/* Tapered top highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: opts.topBar }} />
      <div style={{ fontSize: '22px', color: opts.accent, marginBottom: '14px', lineHeight: 1, fontFamily: 'JetBrains Mono, monospace' }}>{opts.icon}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: opts.accent, marginBottom: '14px' }}>{opts.roleLabel}</div>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.96)', margin: '0 0 14px' }}>{opts.heading}</h3>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.44)', lineHeight: 1.75, marginBottom: '28px' }}>{opts.desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
        {opts.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: opts.accent, flexShrink: 0, fontSize: '11px', marginTop: '3px' }}>&#x25AA;</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.56)' }}>{f}</span>
          </div>
        ))}
      </div>
      <Link
        to="/login"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'transparent',
          color: 'rgba(255,255,255,0.56)',
          border: '1px solid rgba(255,255,255,0.10)',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          padding: '10px 20px',
          borderRadius: '8px',
          textDecoration: 'none',
          letterSpacing: '-0.01em',
          transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(255,255,255,0.05)';
          el.style.borderColor = 'rgba(255,255,255,0.20)';
          el.style.color = 'rgba(255,255,255,0.88)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'transparent';
          el.style.borderColor = 'rgba(255,255,255,0.10)';
          el.style.color = 'rgba(255,255,255,0.56)';
        }}
      >
        {opts.cta}
      </Link>
    </motion.div>
  );

  return (
    <section id="audience" style={{ background: '#0a0a0a' }}>
      <div style={sectionStyle}>
        {/* Section header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '56px' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.32)', marginBottom: '12px' }}>CHOOSE YOUR ROLE</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: 'rgba(255,255,255,0.96)', margin: '0 0 16px' }}>Built for students.<br />Trusted by faculty.</h2>
        </motion.div>
        <div style={gridStyle} className="hp-dual-grid">
          {renderCard({
            topBar: 'linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 55%, transparent 100%)',
            leftBorder: '2px solid rgba(255,255,255,0.18)',
            accent: 'rgba(255,255,255,0.78)',
            icon: '◈',
            roleLabel: 'FOR STUDENTS',
            heading: 'Practice. Collaborate. Grow.',
            desc: 'Solve curated DSA problems solo, pair up with a classmate in a shared editor, or enter a timed assessment. Your AI coach watches your patterns and nudges you forward — never spoiling the answer, always building the skill.',
            features: ['AI hint coach (3-tier)', 'Pair programming rooms', 'Personal weakness tracker', 'Learning history & replay'],
            cta: 'Start Practicing →',
            delay: 0,
          })}
          {renderCard({
            topBar: 'linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 55%, transparent 100%)',
            leftBorder: '2px solid rgba(255,255,255,0.07)',
            accent: 'rgba(255,255,255,0.38)',
            icon: '▣',
            roleLabel: 'FOR FACULTY',
            heading: 'Author. Assess. Understand.',
            desc: 'Create structured assessments with timed rules, assign practice sets, and review student sessions with full replay. Integrity tools show you what happened — without rendering automatic verdicts so you stay in control.',
            features: ['Assessment builder', 'Session replay & timeline', 'Class misconception analytics', 'Integrity insights (not verdicts)'],
            cta: 'Explore Faculty Tools →',
            delay: 0.1,
          })}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .hp-dual-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

export default DualAudience;
