import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HERO_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
};
const HERO_ITEM = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ── Badge pills ────────────────────────────────────────────────────────────────

const BADGES = [
  { label: 'AI Powered', dot: 'rgba(130,210,160,0.80)', glow: 'rgba(130,210,160,0.28)', delay: 0 },
  { label: 'Real Time', dot: 'rgba(120,170,240,0.80)', glow: 'rgba(120,170,240,0.28)', delay: 0.12 },
  { label: 'Fair Assessment', dot: 'rgba(210,170,100,0.80)', glow: 'rgba(210,170,100,0.28)', delay: 0.24 },
];

// ── App UI Preview ──────────────────────────────────────────────────────────────

const CODE_LINES = [
  { n: 1, content: 'def two_sum(nums, target):', kind: 'keyword' },
  { n: 2, content: '    seen = {}', kind: 'code' },
  { n: 3, content: '    for i, n in enumerate(nums):', kind: 'keyword' },
  { n: 4, content: '        diff = target - n', kind: 'code' },
  { n: 5, content: '        if diff in seen:', kind: 'keyword' },
  { n: 6, content: '            return [seen[diff], i]', kind: 'return' },
  { n: 7, content: '        seen[n] = i', kind: 'code' },
  { n: 8, content: '    return -1', kind: 'return' },
];

function AppPreview() {
  return (
    <div style={{
      background: '#0a0d12',
      border: '1px solid rgba(255,255,255,0.08)',
      borderTop: '1px solid rgba(255,255,255,0.14)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 40px 120px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.04)',
      userSelect: 'none',
      pointerEvents: 'none',
    }}>

      {/* Title bar */}
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.75 }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.30)', letterSpacing: '0.06em' }}>
            Assessment #3 · Problem 2/3
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
            color: 'rgba(210,170,100,0.82)', letterSpacing: '0.04em',
            background: 'rgba(210,170,100,0.08)', border: '1px solid rgba(210,170,100,0.18)',
            padding: '2px 9px', borderRadius: '6px',
          }}>
            34:12
          </span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.18)' }}>
          maya_k
        </span>
      </div>

      {/* Main split pane */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>

        {/* Left: Problem panel */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px', background: 'rgba(255,255,255,0.012)' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.14em', marginBottom: '5px' }}>PROBLEM</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: 'rgba(255,255,255,0.82)', marginBottom: '4px' }}>Two Sum</div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(130,210,160,0.65)', background: 'rgba(130,210,160,0.07)', border: '1px solid rgba(130,210,160,0.15)', padding: '2px 7px', borderRadius: '5px' }}>Easy</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.22)' }}>25 pts</span>
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.34)', lineHeight: 1.65 }}>
              Given an array <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.52)', fontSize: '10px' }}>nums</span> and a target, return indices of two numbers that add up to target.
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', marginBottom: '8px' }}>EXAMPLES</div>
            <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '6px', padding: '8px 10px', marginBottom: '6px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.28)', marginBottom: '3px' }}>Input:</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(120,170,240,0.75)' }}>[2,7,11,15], 9</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.28)', marginTop: '4px', marginBottom: '3px' }}>Output:</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(130,210,160,0.75)' }}>[0, 1]</div>
            </div>
          </div>

          {/* Test results */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: '4px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', marginBottom: '8px' }}>TEST CASES</div>
            {[
              { label: 'Case 1', pass: true },
              { label: 'Case 2', pass: true },
              { label: 'Case 3', pass: false },
            ].map(tc => (
              <div key={tc.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>{tc.label}</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: tc.pass ? 'rgba(130,210,160,0.72)' : 'rgba(251,146,60,0.72)',
                }}>
                  {tc.pass ? '✓ pass' : '✗ fail'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code editor */}
        <div style={{ background: '#0c1018' }}>
          {/* Editor toolbar */}
          <div style={{ background: 'rgba(255,255,255,0.018)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.32)' }}>solution.py</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(130,210,160,0.50)', background: 'rgba(130,210,160,0.07)', padding: '1px 6px', borderRadius: '4px' }}>Python 3</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.16)' }}>AI hints disabled · assessment mode</div>
          </div>

          {/* Code */}
          <div style={{ padding: '16px 0', minHeight: '190px' }}>
            {CODE_LINES.map((line) => (
              <div key={line.n} style={{ display: 'flex', gap: '0', lineHeight: '1.7' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.12)', minWidth: '40px', textAlign: 'right', paddingRight: '16px' }}>{line.n}</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                  color: line.kind === 'keyword' ? 'rgba(120,170,240,0.80)'
                    : line.kind === 'return' ? 'rgba(130,210,160,0.75)'
                    : 'rgba(255,255,255,0.55)',
                }}>
                  {line.content}
                </span>
              </div>
            ))}
            {/* Active cursor line */}
            <div style={{ display: 'flex', lineHeight: '1.7' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.12)', minWidth: '40px', textAlign: 'right', paddingRight: '16px' }}>9</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                {'    '}
                <span style={{ display: 'inline-block', width: '2px', height: '14px', background: 'rgba(120,170,240,0.7)', verticalAlign: 'text-bottom', borderRadius: '1px', animation: 'blink 1.1s step-end infinite' }} />
              </span>
            </div>
          </div>

          {/* Bottom status bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', background: 'rgba(120,170,240,0.10)', border: '1px solid rgba(120,170,240,0.18)', color: 'rgba(120,170,240,0.72)', padding: '3px 10px', borderRadius: '5px', cursor: 'default' }}>▶ Run Code</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', background: 'rgba(130,210,160,0.08)', border: '1px solid rgba(130,210,160,0.15)', color: 'rgba(130,210,160,0.65)', padding: '3px 10px', borderRadius: '5px' }}>Submit</span>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.18)' }}>2 / 3 tests passing</span>
          </div>
        </div>
      </div>

      {/* AI Hint row — shown as subtle bottom banner */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', background: 'rgba(130,210,160,0.03)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(130,210,160,0.55)', background: 'rgba(130,210,160,0.08)', border: '1px solid rgba(130,210,160,0.15)', padding: '2px 8px', borderRadius: '5px', flexShrink: 0 }}>AI HINT · T1</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.32)', fontStyle: 'italic', lineHeight: 1.5 }}>What happens when <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(130,210,160,0.65)', fontStyle: 'normal' }}>nums</span> has duplicates? Your lookup might overwrite an earlier index.</span>
      </div>
    </div>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────────────

const STATS = [
  { display: '3', target: 3, plus: false, numeric: true, label: 'Core Modes', sub: 'Practice · Pair · Assess' },
  { display: '5+', target: 5, plus: true, numeric: true, label: 'Languages', sub: 'Python · JS · Java · C++' },
  { display: 'AI', target: null, plus: false, numeric: false, label: 'Powered Coach', sub: 'Hints, zero spoilers' },
  { display: '∞', target: null, plus: false, numeric: false, label: 'Replay Sessions', sub: 'Every keystroke' },
];

// ── Hero ───────────────────────────────────────────────────────────────────────

const Hero = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const numericEls = statsRef.current.querySelectorAll<HTMLElement>('[data-counter]');
    const ctx = gsap.context(() => {
      numericEls.forEach(el => {
        const target = parseInt(el.dataset.target ?? '0', 10);
        const plus = el.dataset.plus === 'true';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate() { el.textContent = `${Math.round(obj.val)}${plus ? '+' : ''}`; },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(gridRef.current, {
        y: 80,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: '40% top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#07090d', overflow: 'hidden' }}>

      {/* Dot-grid background */}
      <div ref={gridRef} style={{
        position: 'absolute',
        inset: '-10%',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 38%, rgba(0,0,0,0.55) 0%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 38%, rgba(0,0,0,0.55) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '-8%', left: '-6%', width: '55%', height: '65%', background: 'radial-gradient(ellipse at center, rgba(80,100,150,0.09) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '-8%', width: '45%', height: '55%', background: 'radial-gradient(ellipse at center, rgba(60,80,120,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Bottom edge fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(transparent, #07090d)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '128px 32px 96px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center', width: '100%' }} className="hp-hero-grid">

          {/* Left — text */}
          <motion.div initial="hidden" animate="visible" variants={HERO_CONTAINER}>

            {/* Three badge pills with effects */}
            <motion.div variants={HERO_ITEM}>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {BADGES.map((badge) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, delay: 0.3 + badge.delay, ease: EASE }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '999px', padding: '5px 13px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Glow behind dot */}
                    <span style={{
                      position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)',
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: badge.glow,
                      filter: 'blur(6px)',
                      pointerEvents: 'none',
                    }} />
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: badge.dot,
                      display: 'inline-block', flexShrink: 0, position: 'relative',
                      animation: 'livePulse 2.8s ease-in-out infinite',
                    }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.04em', position: 'relative' }}>
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={HERO_ITEM}>
              <h1 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '68px',
                lineHeight: 1.03,
                letterSpacing: '-0.036em',
                margin: '0 0 10px',
              }} className="hp-hero-h1">
                <span style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 400, letterSpacing: '0.20em', color: 'rgba(255,255,255,0.24)', marginBottom: '14px' }}>
                  CODE BATTLEGROUNDS
                </span>
                {['Learn,', 'Code,', 'Compete,', 'Conquer!'].map((word, i) => (
                  <motion.span
                    key={word}
                    style={{
                      display: 'block',
                      color: i < 2 ? 'rgba(255,255,255,0.90)' : i === 2 ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.28)',
                      lineHeight: 1.05,
                    }}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.65, delay: 0.15 + i * 0.08, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={HERO_ITEM}>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.38)',
                lineHeight: 1.82,
                maxWidth: '460px',
                margin: '18px 0 36px',
                fontWeight: 400,
              }}>
                One platform for solo coding practice, pair programming, and instructor-led assessments — with an AI coach that guides without spoiling.
              </p>
            </motion.div>

            {/* CTA — Watch Demo only */}
            <motion.div variants={HERO_ITEM}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '56px' }}>
                <motion.button
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '9px',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.72)',
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '15px',
                    padding: '13px 26px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer', letterSpacing: '-0.01em',
                    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                  }}
                  whileHover={{ y: -2 }} whileTap={{ y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.92)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
                  }}
                >
                  <span style={{ fontSize: '14px', opacity: 0.8 }}>▶</span>
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={HERO_ITEM}>
              <div
                ref={statsRef}
                style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px' }}
                className="hp-stats"
              >
                {STATS.map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1, padding: '0 16px',
                      borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      cursor: 'default',
                    }}
                    onMouseEnter={() => setHoveredStat(i)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '26px',
                      letterSpacing: '-0.025em',
                      color: hoveredStat === i ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.46)',
                      transition: 'color 0.28s ease',
                    }}>
                      {stat.numeric ? (
                        <span data-counter data-target={stat.target} data-plus={stat.plus ? 'true' : 'false'}>
                          {stat.display}
                        </span>
                      ) : stat.display}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '5px 0 4px' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.26)' }}>
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </motion.div>

          {/* Right — App UI Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
            whileHover={{ y: -4, transition: { duration: 0.35, ease: 'easeOut' } }}
          >
            <AppPreview />
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(130,210,160,0.55)', display: 'inline-block' }} />
              App preview · assessment mode shown
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes livePulse { 0%,100%{opacity:0.78} 50%{opacity:1} }
        @media (max-width: 1024px) { .hp-hero-h1 { font-size: 52px !important; } }
        @media (max-width: 768px) {
          .hp-hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hp-hero-h1 { font-size: 44px !important; }
          .hp-stats { display: none !important; }
        }
        @media (max-width: 480px) { .hp-hero-h1 { font-size: 36px !important; } }
      `}</style>
    </div>
  );
};

export default Hero;
