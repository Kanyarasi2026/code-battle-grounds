const Footer = () => {
  const links = ['Practice', 'Pair', 'Assess', 'Replay', 'Profile'];

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '32px', background: '#080c10' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }} className="hp-footer-inner">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#00e5cc', fontSize: '18px' }}>&#x2B21;</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>Code Battlegrounds</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#4a5568', letterSpacing: '0.06em', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Tech credit */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2d3748', letterSpacing: '0.04em' }}>
          Built with Gemini AI · Supabase · Socket.IO · Monaco Editor
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .hp-footer-inner { flex-direction: column !important; text-align: center; } }`}</style>
    </footer>
  );
};

export default Footer;
