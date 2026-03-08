import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LIFT = { duration: 0.2, ease: 'easeOut' as const };

const TRUST_ITEMS = ['Free to start', 'No credit card', 'Google login in 1 click'];

const CTASection = () => {
  return (
    <section style={{ padding: '140px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>

      {/* Ambient radial glow — wide, low-opacity */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -52%)',
        width: '900px', height: '600px',
        background: 'radial-gradient(ellipse at 50% 44%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.018) 28%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle vignette pulling edges to base color */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(7,9,13,0.82) 100%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.22em', marginBottom: '20px' }}>
          READY TO ENTER THE ARENA?
        </div>

        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '52px', letterSpacing: '-0.034em', color: 'rgba(255,255,255,0.90)', lineHeight: 1.08, margin: '0 0 20px' }}>
          Practice smarter.<br />Assess fairly.<br />Learn together.
        </h2>

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.78, maxWidth: '460px', margin: '0 auto 48px' }}>
          Code Battlegrounds is free to use. Sign in with Google and start practicing — or set up your first assessment in under 5 minutes.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>

          {/* Primary CTA */}
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={LIFT} style={{ display: 'inline-flex' }}>
            <Link
              to="/login1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.94)',
                color: '#060606',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 28px',
                borderRadius: '10px',
                textDecoration: 'none',
                letterSpacing: '-0.012em',
                boxShadow: '0 2px 20px rgba(255,255,255,0.10)',
                transition: 'box-shadow 0.22s, background 0.18s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,1)';
                el.style.boxShadow = '0 8px 36px rgba(255,255,255,0.18)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.94)';
                el.style.boxShadow = '0 2px 20px rgba(255,255,255,0.10)';
              }}
            >
              Sign in with Google — It's free
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} transition={LIFT} style={{ display: 'inline-flex' }}>
            <Link
              to="/login1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                color: 'rgba(255,255,255,0.44)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                padding: '14px 24px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.10)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.borderColor = 'rgba(255,255,255,0.22)';
                el.style.color = 'rgba(255,255,255,0.82)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'rgba(255,255,255,0.10)';
                el.style.color = 'rgba(255,255,255,0.44)';
              }}
            >
              I'm an Instructor &rarr;
            </Link>
          </motion.div>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {TRUST_ITEMS.map((item, i) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && <span style={{ color: 'rgba(255,255,255,0.10)', fontSize: '12px' }}>·</span>}
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.20)' }}>{item}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
