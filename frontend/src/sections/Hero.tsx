import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ── Motion variants ──────────────────────────────────────────────────────────

const HERO_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const HERO_ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};
const LIFT_FAST = { duration: 0.2, ease: 'easeOut' as const };

// ── TypingTerminal ──────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    label: '// solo practice',
    accentColor: 'rgba(255,255,255,0.88)',
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
    accentColor: 'rgba(255,255,255,0.60)',
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
    accentColor: 'rgba(255,255,255,0.72)',
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
    return <span style={{ color: 'rgba(255,255,255,0.28)', fontStyle: 'italic' }}>{line}</span>;
  }
  const firstWord = line.trimStart().split(/[\s(]/)[0] ?? '';
  if (KEYWORDS.includes(firstWord)) {
    const idx = line.indexOf(firstWord);
    return (
      <>
        <span style={{ color: 'rgba(255,255,255,0.72)' }}>{line.slice(0, idx)}</span>
        <span style={{ color: accentColor }}>{firstWord}</span>
        <span style={{ color: 'rgba(255,255,255,0.72)' }}>{line.slice(idx + firstWord.length)}</span>
      </>
    );
  }
  return <span style={{ color: 'rgba(255,255,255,0.72)' }}>{line}</span>;
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
    background: '#f8f9fa',
    border: '1px solid rgba(107, 114, 128, 0.15)',
    borderRadius: '12px',
    boxShadow: '0 32px 80px rgba(107, 114, 128, 0.08), 0 0 0 1px rgba(107, 114, 128, 0.08)',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    background: '#f1f3f5',
    borderBottom: '1px solid rgba(107, 114, 128, 0.12)',
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
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#e2e8f0' }}>
          code_battlegrounds
        </span>
      </div>

      <div style={bodyStyle}>
        {/* Command prompt line */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#cbd5e0', marginBottom: '12px' }}>
          {`> cbg run --mode ${modeLabel}`}
        </div>

        {/* Displayed lines */}
        {displayedLines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', lineHeight: '1.6', marginBottom: '2px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#edf2f7', minWidth: '16px', textAlign: 'right' }}>
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
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#edf2f7', minWidth: '16px', textAlign: 'right' }}>
              {displayedLines.length + 1}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
              {highlightLine(currentLine, scenario.accentColor)}
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                background: 'rgba(255,255,255,0.7)',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
                marginLeft: '1px',
              }} />
            </span>
          </div>
        )}

        {/* Bottom fade */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(transparent, rgba(248, 249, 250, 0.95))',
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
    background: '#ffffff',
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
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '999px',
    padding: '6px 14px',
    marginBottom: '28px',
  };

  const h1Style: React.CSSProperties = {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '66px',
    lineHeight: 1.08,
    letterSpacing: '-0.03em',
    margin: '0 0 28px',
    color: '#2d3748',
  };

  const primaryBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.92)',
    color: '#0a0a0a',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '15px',
    padding: '13px 26px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
    transition: 'box-shadow 0.22s, background 0.2s',
  };

  const secondaryBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    color: '#4a5568',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '15px',
    padding: '13px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.10)',
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    transition: 'background 0.2s, border-color 0.2s',
  };

  return (
    <div style={wrapperStyle}>
      {/* Background grid texture — fine, low-contrast */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Ambient haze — restrained, center-right */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 72% 36%, rgba(255,255,255,0.022) 0%, transparent 40%)', pointerEvents: 'none' }} />
      {/* Counter-haze — bottom-left depth */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 14% 80%, rgba(255,255,255,0.009) 0%, transparent 38%)', pointerEvents: 'none' }} />
      {/* Edge vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 32%, rgba(0,0,0,0.52) 100%)', pointerEvents: 'none' }} />

      <div style={sectionStyle}>
        <div style={gridStyle} className="hp-hero-grid">

          {/* Left content — stagger container */}
          <motion.div initial="hidden" animate="visible" variants={HERO_CONTAINER}>

            {/* Status badge */}
            <motion.div variants={HERO_ITEM}>
              <div style={statusBadgeStyle}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.38)', animation: 'shimmer 3.5s ease-in-out infinite', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#718096', letterSpacing: '0.04em' }}>
                  AI-Powered · Real-Time · Fair Assessment
                </span>
              </div>
            </motion.div>

            {/* H1 */}
            <motion.div variants={HERO_ITEM}>
              <h1 style={h1Style} className="hp-hero-h1">
                <span style={{ display: 'block', color: '#4a5568', fontWeight: 700 }}>The Arena</span>
                <span style={{ display: 'block' }}>Where Code</span>
                <span style={{ display: 'block' }}>
                  Meets{' '}
                  <span style={{
                    background: 'linear-gradient(175deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.70) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Learning
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={HERO_ITEM}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '17px', color: '#4a5568', lineHeight: 1.75, maxWidth: '520px', margin: '0 0 28px' }}>
                One platform for solo coding practice, pair programming, and instructor-led assessments — with an AI coach that guides without spoiling and integrity tools that inform without accusing.
              </p>
            </motion.div>

            {/* Audience pills */}
            <motion.div variants={HERO_ITEM}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }} className="hp-audience-pills">
                <span style={{ background: 'rgba(107, 114, 128, 0.12)', border: '1px solid rgba(107, 114, 128, 0.3)', color: '#4b5563', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.05em', padding: '5px 13px', borderRadius: '999px' }}>STUDENT</span>
                <span style={{ background: 'rgba(107, 114, 128, 0.06)', border: '1px solid rgba(107, 114, 128, 0.15)', color: '#a0aec0', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.05em', padding: '5px 13px', borderRadius: '999px' }}>FACULTY</span>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={HERO_ITEM}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '52px' }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  transition={LIFT_FAST}
                  style={{ display: 'inline-flex' }}
                >
                  <Link
                    to="/login"
                    style={primaryBtnStyle}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(255,255,255,1)';
                      el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.45)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(255,255,255,0.92)';
                      el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.35)';
                    }}
                  >
                    Continue with Google &rarr;
                  </Link>
                </motion.div>
                <motion.button
                  style={secondaryBtnStyle}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  transition={LIFT_FAST}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                  }}
                >
                  Watch Demo &rarr;
                </motion.button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={HERO_ITEM}>
              <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '28px' }} className="hp-stats">
                {STATS.map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      padding: '0 18px',
                      borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      cursor: 'default',
                    }}
                    onMouseEnter={() => setHoveredStat(i)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '26px', letterSpacing: '-0.02em', color: hoveredStat === i ? '#2d3748' : '#718096', transition: 'color 0.3s ease' }}>{stat.value}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#cbd5e0', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '3px 0 4px' }}>{stat.label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#e2e8f0' }}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Terminal with entry animation + hover float */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            whileHover={{ y: -2, transition: { duration: 0.3, ease: 'easeOut' } }}
          >
            <TypingTerminal />
            <div style={{ marginTop: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#e2e8f0' }}>
              <span style={{ color: 'rgba(255,255,255,0.50)' }}>&#x25CF;</span> Live preview &middot; cycling through all 3 modes
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: 'absolute', bottom: '32px', left: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          initial={{ opacity: 0, y: 8, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          transition={{ duration: 0.65, delay: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)', borderRadius: '2px' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.15em' }}>SCROLL</span>
        </motion.div>
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
