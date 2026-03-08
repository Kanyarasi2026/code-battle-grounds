import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const LIFT = { duration: 0.2, ease: 'easeOut' as const };

const CTASection = () => {
  return (
    <section style={{ padding: '120px 32px', borderTop: '1px solid rgba(107, 114, 128, 0.12)', position: 'relative', overflow: 'hidden', textAlign: 'center', background: '#ffffff' }}>
      {/* Diffuse white haze — non-literal depth, not a spotlight */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '560px', background: 'radial-gradient(ellipse at 50% 42%, rgba(107, 114, 128, 0.05) 0%, rgba(107, 114, 128, 0.02) 40%, transparent 68%)', pointerEvents: 'none' }} />
      {/* Faint edge vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(248, 249, 250, 1) 100%)', pointerEvents: 'none' }} />

      <motion.div
        style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#a0aec0', letterSpacing: '0.2em', marginBottom: '20px' }}>READY TO ENTER THE ARENA?</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '52px', letterSpacing: '-0.03em', color: '#2d3748', lineHeight: 1.08, margin: '0 0 20px' }}>
          Practice smarter. Assess fairly.<br />Learn together.
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#718096', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 44px' }}>
          Code Battlegrounds is free to use. Sign in with Google and start practicing — or set up your first assessment in under 5 minutes.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={LIFT} style={{ display: 'inline-flex' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.92)',
                color: '#060606',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                padding: '14px 28px',
                borderRadius: '10px',
                border: 'none',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                boxShadow: '0 2px 14px rgba(0,0,0,0.28)',
                transition: 'box-shadow 0.22s, background 0.18s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,1)';
                el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.36)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.92)';
                el.style.boxShadow = '0 2px 14px rgba(0,0,0,0.28)';
              }}
            >
              Sign in with Google — It's free
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} transition={LIFT} style={{ display: 'inline-flex' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                color: 'rgba(255,255,255,0.64)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                padding: '14px 24px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.borderColor = 'rgba(255,255,255,0.24)';
                el.style.color = 'rgba(255,255,255,0.88)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'rgba(255,255,255,0.12)';
                el.style.color = 'rgba(255,255,255,0.64)';
              }}
            >
              I'm an Instructor &rarr;
            </Link>
          </motion.div>
        </div>

        <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Free to start', 'No credit card', 'Google login in 1 click'].map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.22)' }}>
              {i > 0 && <span style={{ color: 'rgba(255,255,255,0.12)', marginRight: '0' }}>·</span>}
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
