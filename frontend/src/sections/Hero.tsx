import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ── TypingTerminal ──────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    label: '// solo practice',
    accentColor: '#00e5cc',
    lines: [
      'def two_sum(nums, target):',
      '    seen = {}',
      '    for i, n in enumerate(nums):',
      '        diff = target - n',
      '        if diff in seen:',
      '            return [seen[diff], i]',
      '        seen[n] = i',
    ],
  },
  {
    label: '// pair programming',
    accentColor: '#a78bfa',
    lines: [
      '// Alex is typing...',
      'function mergeIntervals(intervals) {',
      '  intervals.sort((a,b) => a[0]-b[0]);',
      '  const res = [intervals[0]];',
      '  for (let [s,e] of intervals.slice(1)) {',
      '    if (s <= res.at(-1)[1])',
      '      res.at(-1)[1] = Math.max(res.at(-1)[1], e);',
    ],
  },
  {
    label: '// assessment mode',
    accentColor: '#f5a623',
    lines: [
      'public class Solution {',
      '  // Time remaining: 34:12',
      '  // AI hints disabled',
      '  public int[] findMedian(',
      '    int[] arr1, int[] arr2) {',
      '    // your implementation',
      '    int m = arr1.length;',
    ],
  },
];

const KEYWORDS = ['def', 'return', 'for', 'if', 'function', 'public', 'class', 'let', 'const', 'import', 'from'];

function highlightLine(line: string, accentColor: string): React.ReactNode {
  const isComment = line.trimStart().startsWith('//') || line.trimStart().startsWith('#');
  if (isComment) {
    return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;
  }
  const firstWord = line.trimStart().split(/[\s(]/)[0] ?? '';
  if (KEYWORDS.includes(firstWord)) {
    const idx = line.indexOf(firstWord);
    return (
      <>
        <span style={{ color: '#e2e8f0' }}>{line.slice(0, idx)}</span>
        <span style={{ color: accentColor }}>{firstWord}</span>
        <span style={{ color: '#e2e8f0' }}>{line.slice(idx + firstWord.length)}</span>
      </>
    );
  }
  return <span style={{ color: '#e2e8f0' }}>{line}</span>;
}

function TypingTerminal() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pause' | 'clearing'>('typing');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS[scenarioIdx]!;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (phase === 'typing') {
      const targetLine = scenario.lines[lineIdx];
      if (targetLine === undefined) {
        setPhase('pause');
        return;
      }
      if (charIdx < targetLine.length) {
        const delay = 28 + Math.random() * 20;
        timerRef.current = setTimeout(() => {
          setCurrentLine(targetLine.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, delay);
      } else {
        // Line complete
        timerRef.current = setTimeout(() => {
          setDisplayedLines(prev => [...prev, targetLine]);
          setCurrentLine('');
          setCharIdx(0);
          setLineIdx(l => l + 1);
        }, 80);
      }
    } else if (phase === 'pause') {
      timerRef.current = setTimeout(() => setPhase('clearing'), 2200);
    } else if (phase === 'clearing') {
      timerRef.current = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine('');
        setLineIdx(0);
        setCharIdx(0);
        setScenarioIdx(i => (i + 1) % SCENARIOS.length);
        setPhase('typing');
      }, 400);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, charIdx, lineIdx, scenarioIdx]);

  const containerStyle: React.CSSProperties = {
    background: '#0d1117',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,204,0.05)',
    overflow: 'hidden',
    animation: 'fadeUp 0.7s 0.3s ease forwards',
    opacity: 0,
  };

  const headerStyle: React.CSSProperties = {
    background: '#161b22',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const dotsStyle: React.CSSProperties = { display: 'flex', gap: '6px', alignItems: 'center' };

  const bodyStyle: React.CSSProperties = {
    padding: '20px 24px',
    minHeight: '280px',
    overflow: 'hidden',
    position: 'relative',
  };

  const modeLabel =
    scenarioIdx === 0 ? 'solo' : scenarioIdx === 1 ? 'pair' : 'assess';

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={dotsStyle}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: scenario.accentColor }}>
          {scenario.label}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4a5568' }}>
          code_battlegrounds
        </span>
      </div>

      <div style={bodyStyle}>
        {/* Command prompt line */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#718096', marginBottom: '12px' }}>
          {`> cbg run --mode ${modeLabel}`}
        </div>

        {/* Displayed lines */}
        {displayedLines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', lineHeight: '1.6', marginBottom: '2px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#2d3748', minWidth: '16px', textAlign: 'right' }}>
              {i + 1}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
              {highlightLine(line, scenario.accentColor)}
            </span>
          </div>
        ))}

        {/* Currently typing line */}
        {phase === 'typing' && (
          <div style={{ display: 'flex', gap: '16px', lineHeight: '1.6' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#2d3748', minWidth: '16px', textAlign: 'right' }}>
              {displayedLines.length + 1}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
              {highlightLine(currentLine, scenario.accentColor)}
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                background: '#00e5cc',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
                marginLeft: '1px',
              }} />
            </span>
          </div>
        )}

        {/* Bottom glow */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: `linear-gradient(transparent, rgba(${scenarioIdx === 0 ? '0,229,204' : scenarioIdx === 1 ? '167,139,250' : '245,166,35'}, 0.03))`,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '3', label: 'Core Modes', sub: 'Practice · Pair · Assess' },
  { value: '5+', label: 'Languages', sub: 'Python · JS · Java · C++ · C' },
  { value: 'AI', label: 'Powered Coach', sub: 'Layered hints, zero spoilers' },
  { value: '∞', label: 'Replay Sessions', sub: 'Every keystroke, replayed' },
];

const Hero = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const sectionStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '100px 32px 60px',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    background: '#080c10',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'center',
    width: '100%',
  };

  const statusBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '999px',
    padding: '6px 14px',
    marginBottom: '24px',
    animation: 'fadeUp 0.7s ease forwards',
    opacity: 0,
  };

  const h1Style: React.CSSProperties = {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '66px',
    lineHeight: 1.05,
    margin: '0 0 24px',
    color: '#e2e8f0',
  };

  const primaryBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#00e5cc',
    color: '#080c10',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '15px',
    padding: '13px 24px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 4px 24px rgba(0,229,204,0.2)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const secondaryBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    color: '#9ca3af',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '15px',
    padding: '13px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  return (
    <div style={wrapperStyle}>
      {/* Background decorative elements */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,229,204,0.06) 0%, transparent 70%)', animation: 'gridFloat 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)', animation: 'gridFloat 10s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      <div style={sectionStyle}>
        <div style={gridStyle} className="hp-hero-grid">
          {/* Left content */}
          <div>
            {/* Status badge */}
            <div style={statusBadgeStyle}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5cc', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6b7280' }}>
                AI-Powered · Real-Time · Fair Assessment
              </span>
            </div>

            {/* H1 */}
            <h1 style={h1Style} className="hp-hero-h1">
              <span style={{ display: 'block', animation: 'fadeUp 0.7s 0.1s ease forwards', opacity: 0 }}>The Arena</span>
              <span style={{ display: 'block', animation: 'fadeUp 0.7s 0.2s ease forwards', opacity: 0 }}>Where Code</span>
              <span style={{ display: 'block', animation: 'fadeUp 0.7s 0.3s ease forwards', opacity: 0 }}>
                Meets{' '}
                <span style={{ background: 'linear-gradient(135deg, #00e5cc 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Learning
                </span>
              </span>
            </h1>

            {/* Description */}
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '17px', color: '#9ca3af', lineHeight: 1.7, maxWidth: '480px', margin: '0 0 24px', animation: 'fadeUp 0.7s 0.4s ease forwards', opacity: 0 }}>
              One platform for solo coding practice, pair programming, and instructor-led assessments — with an AI coach that guides without spoiling and integrity tools that inform without accusing.
            </p>

            {/* Audience pills */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', animation: 'fadeUp 0.7s 0.45s ease forwards', opacity: 0 }} className="hp-audience-pills">
              <span style={{ background: 'rgba(0,229,204,0.08)', border: '1px solid rgba(0,229,204,0.2)', color: '#00e5cc', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', padding: '6px 14px', borderRadius: '999px' }}>For Students</span>
              <span style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', color: '#f5a623', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', padding: '6px 14px', borderRadius: '999px' }}>For Faculty</span>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px', animation: 'fadeUp 0.7s 0.5s ease forwards', opacity: 0 }}>
              <Link
                to="/login"
                style={primaryBtnStyle}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,229,204,0.35)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,229,204,0.2)'; }}
              >
                Continue with Google &rarr;
              </Link>
              <button
                style={secondaryBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Watch Demo &rarr;
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', animation: 'fadeUp 0.7s 0.6s ease forwards', opacity: 0 }} className="hp-stats">
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: '0 20px',
                    borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    cursor: 'default',
                  }}
                  onMouseEnter={() => setHoveredStat(i)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '28px', color: hoveredStat === i ? '#00e5cc' : '#e2e8f0', transition: 'color 0.2s' }}>{stat.value}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#4a5568' }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Terminal */}
          <div>
            <TypingTerminal />
            <div style={{ marginTop: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4a5568' }}>
              <span style={{ color: '#00e5cc' }}>&#x25CF;</span> Live preview &middot; cycling through all 3 modes
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'fadeUp 1s 1s ease forwards', opacity: 0 }}>
          <div style={{ width: '2px', height: '24px', background: 'linear-gradient(to bottom, #00e5cc, transparent)', borderRadius: '2px' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em' }}>scroll to explore</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .hp-hero-h1 { font-size: 52px !important; } }
        @media (max-width: 768px) {
          .hp-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hp-hero-h1 { font-size: 42px !important; }
          .hp-stats { display: none !important; }
        }
        @media (max-width: 480px) {
          .hp-hero-h1 { font-size: 34px !important; }
          .hp-audience-pills { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
