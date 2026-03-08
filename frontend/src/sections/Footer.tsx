import { motion } from 'framer-motion';

const SMOOTH = { type: 'tween' as const, duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

const Footer = () => {
  const links = ['Practice', 'Pair', 'Assess', 'Replay', 'Profile'];

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px' }}>
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
        className="hp-footer-inner"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace' }}>&#x2B21;</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.42)', letterSpacing: '-0.01em' }}>Code Battlegrounds</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {links.map(link => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.22)',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              whileHover={{ color: 'rgba(255,255,255,0.58)', y: -1 }}
              transition={SMOOTH}
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Tech credit */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.16)', letterSpacing: '0.04em' }}>
          Gemini AI · Supabase · Socket.IO · Monaco
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .hp-footer-inner { flex-direction: column !important; text-align: center; } }`}</style>
    </footer>
  );
};

export default Footer;
