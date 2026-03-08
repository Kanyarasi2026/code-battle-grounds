import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DualAudience = () => {
  const renderCard = (opts: {
    borderLeft: string;
    topHighlight: string;
    icon: string;
    roleLabel: string;
    roleColor: string;
    heading: string;
    desc: string;
    features: string[];
    cta: string;
    delay: number;
  }) => (
    <motion.div
      style={{
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: opts.borderLeft,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.026) 0%, rgba(255,255,255,0.010) 100%)',
        borderRadius: '16px',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.7, delay: opts.delay, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: 0.22, ease: 'easeOut' as const } }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'linear-gradient(160deg, rgba(255,255,255,0.040) 0%, rgba(255,255,255,0.016) 100%)';
        el.style.borderColor = 'rgba(255,255,255,0.12)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'linear-gradient(160deg, rgba(255,255,255,0.026) 0%, rgba(255,255,255,0.010) 100%)';
        el.style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      {/* Tapered top shimmer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: opts.topHighlight }} />

      <div style={{ fontSize: '20px', marginBottom: '14px', fontFamily: 'JetBrains Mono, monospace', color: opts.roleColor, lineHeight: 1 }}>
        {opts.icon}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: opts.roleColor, marginBottom: '14px' }}>
        {opts.roleLabel}
      </div>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '27px', letterSpacing: '-0.028em', color: 'rgba(255,255,255,0.90)', margin: '0 0 14px', lineHeight: 1.15 }}>
        {opts.heading}
      </h3>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.40)', lineHeight: 1.8, marginBottom: '28px' }}>
        {opts.desc}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
        {opts.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: opts.roleColor, flexShrink: 0, fontSize: '9px', marginTop: '5px', opacity: 0.7 }}>▪</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.52)' }}>{f}</span>
          </div>
        ))}
      </div>
      <Link
        to="/login"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'transparent',
          color: 'rgba(255,255,255,0.38)',
          border: '1px solid rgba(255,255,255,0.10)',
          fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
          padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
          letterSpacing: '-0.01em',
          transition: 'background 0.18s, border-color 0.18s, color 0.18s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(255,255,255,0.05)';
          el.style.borderColor = 'rgba(255,255,255,0.18)';
          el.style.color = 'rgba(255,255,255,0.78)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'transparent';
          el.style.borderColor = 'rgba(255,255,255,0.10)';
          el.style.color = 'rgba(255,255,255,0.38)';
        }}
      >
        {opts.cta}
      </Link>
    </motion.div>
  );

  return (
    <section id="audience" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <motion.div
          style={{ textAlign: 'center', marginBottom: '60px' }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.20)', marginBottom: '14px' }}>
            CHOOSE YOUR ROLE
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '44px', letterSpacing: '-0.032em', color: 'rgba(255,255,255,0.90)', margin: 0, lineHeight: 1.12 }}>
            Built for students.<br />Trusted by faculty.
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="hp-dual-grid">
          {renderCard({
            borderLeft: '2px solid rgba(255,255,255,0.22)',
            topHighlight: 'linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
            icon: '◈',
            roleLabel: 'FOR STUDENTS',
            roleColor: 'rgba(255,255,255,0.72)',
            heading: 'Practice. Collaborate. Grow.',
            desc: 'Solve curated DSA problems solo, pair up with a classmate in a shared editor, or enter a timed assessment. Your AI coach watches your patterns and nudges you forward — never spoiling the answer, always building the skill.',
            features: ['AI hint coach (3-tier)', 'Pair programming rooms', 'Personal weakness tracker', 'Learning history & replay'],
            cta: 'Start Practicing →',
            delay: 0,
          })}
          {renderCard({
            borderLeft: '2px solid rgba(255,255,255,0.08)',
            topHighlight: 'linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
            icon: '▣',
            roleLabel: 'FOR FACULTY',
            roleColor: 'rgba(255,255,255,0.36)',
            heading: 'Author. Assess. Understand.',
            desc: 'Create structured assessments with timed rules, assign practice sets, and review student sessions with full replay. Integrity tools show you what happened — without rendering automatic verdicts so you stay in control.',
            features: ['Assessment builder', 'Integrity timeline insights', 'Practice set curation', 'Academic progress tracking'],
            cta: 'Explore Faculty Tools →',
            delay: 0.09,
          })}
        </div>

      </div>
      <style>{`@media (max-width: 768px) { .hp-dual-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

export default DualAudience;
