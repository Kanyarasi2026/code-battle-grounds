import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const DualAudience = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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

  const makeCard = (opts: {
    accent: string;
    rgb: string;
    icon: string;
    roleLabel: string;
    heading: string;
    desc: string;
    features: string[];
    cta: string;
    delay: string;
  }) => ({
    border: `1px solid rgba(${opts.rgb}, 0.12)`,
    background: `rgba(${opts.rgb}, 0.02)`,
    borderRadius: '16px',
    padding: '40px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s ${opts.delay}, transform 0.6s ${opts.delay}`,
  });

  const renderCard = (opts: {
    accent: string;
    rgb: string;
    icon: string;
    roleLabel: string;
    heading: string;
    desc: string;
    features: string[];
    cta: string;
    delay: string;
  }) => (
    <div style={makeCard(opts)}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: opts.accent, opacity: 0.6 }} />
      <div style={{ fontSize: '32px', color: opts.accent, marginBottom: '12px' }}>{opts.icon}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: opts.accent, marginBottom: '10px' }}>{opts.roleLabel}</div>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '26px', color: '#e2e8f0', marginBottom: '14px', margin: '0 0 14px' }}>{opts.heading}</h3>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#6b7280', lineHeight: 1.7, marginBottom: '24px' }}>{opts.desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {opts.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: opts.accent, flexShrink: 0 }}>&#x2713;</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#9ca3af' }}>{f}</span>
          </div>
        ))}
      </div>
      <Link
        to="/login"
        style={{
          display: 'inline-block',
          background: `rgba(${opts.rgb}, 0.1)`,
          color: opts.accent,
          border: `1px solid rgba(${opts.rgb}, 0.25)`,
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          padding: '10px 20px',
          borderRadius: '8px',
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {opts.cta}
      </Link>
    </div>
  );

  return (
    <section id="audience" ref={ref} style={{ background: '#080c10' }}>
      <div style={sectionStyle}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#00e5cc', marginBottom: '12px' }}>CHOOSE YOUR ROLE</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: '#e2e8f0', margin: '0 0 16px' }}>Built for students.<br />Trusted by faculty.</h2>
        </div>
        <div style={gridStyle} className="hp-dual-grid">
          {renderCard({
            accent: '#00e5cc',
            rgb: '0,229,204',
            icon: '◈',
            roleLabel: 'FOR STUDENTS',
            heading: 'Practice. Collaborate. Grow.',
            desc: 'Solve curated DSA problems solo, pair up with a classmate in a shared editor, or enter a timed assessment. Your AI coach watches your patterns and nudges you forward — never spoiling the answer, always building the skill.',
            features: ['AI hint coach (3-tier)', 'Pair programming rooms', 'Personal weakness tracker', 'Learning history & replay'],
            cta: 'Start Practicing →',
            delay: '0s',
          })}
          {renderCard({
            accent: '#f5a623',
            rgb: '245,166,35',
            icon: '▣',
            roleLabel: 'FOR FACULTY',
            heading: 'Author. Assess. Understand.',
            desc: 'Create structured assessments with timed rules, assign practice sets, and review student sessions with full replay. Integrity tools show you what happened — without rendering automatic verdicts so you stay in control.',
            features: ['Assessment builder', 'Session replay & timeline', 'Class misconception analytics', 'Integrity insights (not verdicts)'],
            cta: 'Explore Faculty Tools →',
            delay: '0.15s',
          })}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .hp-dual-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

export default DualAudience;
