import { useEffect, useRef, useState } from 'react';

const FACULTY_FEATURES = [
  { icon: '📋', title: 'Author Assessments', desc: 'Build timed coding assessments with per-problem rules, point values, and student assignments — all in one place.' },
  { icon: '📊', title: 'Class Analytics', desc: 'See which problems trip students up most, common error patterns, and where the AI was called most across your whole class.' },
  { icon: '🎬', title: 'Session Replay', desc: 'Replay any student session keystroke-by-keystroke. See the full coding journey, not just the final answer.' },
  { icon: '🔍', title: 'Integrity Timeline', desc: 'A factual, neutral log of assessment events — tab switches, paste actions, idle periods. Evidence, never accusation.' },
  { icon: '📚', title: 'Practice Sets', desc: 'Curate weekly problem sets for your class. Assign by topic, difficulty, or concept coverage.' },
  { icon: '🧠', title: 'Misconception Maps', desc: 'Aggregated class-level data shows you exactly which concepts need re-teaching before the next assessment.' },
];

const FacultyFeatures = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(FACULTY_FEATURES.length).fill(false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCards(prev => { const next = [...prev]; next[i] = true; return next; });
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <section id="faculty" style={{ padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#080c10' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header row */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '56px', flexWrap: 'wrap' }} className="hp-faculty-header">
          {/* Left */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#f5a623', marginBottom: '12px' }}>BUILT FOR EDUCATORS</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', color: '#e2e8f0', lineHeight: 1.1, margin: '0 0 16px' }}>Faculty tools that respect<br />your judgment.</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
              Code Battlegrounds isn't a proctoring tool. It's a teaching tool. Every feature is designed to give you context and insight — the final call is always yours.
            </p>
          </div>
          {/* Right - Badge card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 32px', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '12px', background: 'rgba(245,166,35,0.04)', color: '#f5a623', flexShrink: 0 }}>
            <span style={{ fontSize: '28px' }}>▣</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>INSTRUCTOR MODE</span>
          </div>
        </div>

        {/* Features grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="hp-features-grid">
          {FACULTY_FEATURES.map((feature, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              style={{
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.01)',
                transition: `transform 0.25s, border-color 0.25s, opacity 0.5s ${i * 0.08}s, transform 0.5s ${i * 0.08}s`,
                opacity: visibleCards[i] ? 1 : 0,
                transform: visibleCards[i] ? 'translateY(0)' : 'translateY(16px)',
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,204,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '14px' }}>{feature.icon}</span>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', color: '#e2e8f0', margin: '0 0 8px' }}>{feature.title}</h4>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{feature.desc}</p>
            </div>
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
