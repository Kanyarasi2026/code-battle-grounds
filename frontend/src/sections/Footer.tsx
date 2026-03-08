import { motion } from 'framer-motion';

const SMOOTH = { type: 'tween' as const, duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

const Footer = () => {
  const links = ['Practice', 'Pair', 'Assess', 'Replay', 'Profile'];

  return (
    <footer style={{ borderTop: '1px solid rgba(107, 114, 128, 0.12)', padding: '32px', background: 'linear-gradient(180deg, #f0f2f5 0%, #e8ecf0 100%)' }}>
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
        className="hp-footer-inner"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace' }}>&#x2B21;</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: '#4a5568', letterSpacing: '-0.01em' }}>Code Battlegrounds</span>
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
                color: '#9ca3af',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                display: 'inline-block',
              }}
               whileHover={{ color: '#4b5563', y: -1 }}
              transition={SMOOTH}
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Tech credit */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#9ca3af', letterSpacing: '0.04em' }}>
          Gemini AI · Supabase · Socket.IO · Monaco
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .hp-footer-inner { flex-direction: column !important; text-align: center; } }`}</style>
    </footer>
  );
};

export default Footer;
