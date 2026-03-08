import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '64px',
    background: scrolled ? 'rgba(8,12,16,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(0,229,204,0.08)' : '1px solid transparent',
    transition: 'all 0.3s ease',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  };

  const logoIconStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,229,204,0.1)',
    border: '1px solid rgba(0,229,204,0.3)',
    borderRadius: '8px',
    fontSize: '18px',
    color: '#00e5cc',
  };

  const logoTextStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  };

  const logoNameStyle: React.CSSProperties = {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '15px',
    color: '#e2e8f0',
    lineHeight: 1,
  };

  const logoSubStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '9px',
    color: '#00e5cc',
    letterSpacing: '0.2em',
    lineHeight: 1,
  };

  const centerNavStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '12px',
    letterSpacing: '0.08em',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.2s',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  };

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const studentPillStyle: React.CSSProperties = {
    background: 'rgba(0,229,204,0.08)',
    border: '1px solid rgba(0,229,204,0.2)',
    color: '#00e5cc',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.1em',
    padding: '4px 10px',
    borderRadius: '999px',
    cursor: 'pointer',
  };

  const facultyPillStyle: React.CSSProperties = {
    background: 'rgba(245,166,35,0.08)',
    border: '1px solid rgba(245,166,35,0.2)',
    color: '#f5a623',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.1em',
    padding: '4px 10px',
    borderRadius: '999px',
    cursor: 'pointer',
  };

  const ctaStyle: React.CSSProperties = {
    background: '#00e5cc',
    color: '#080c10',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '13px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  };

  const hamburgerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px',
  };

  const lineStyle: React.CSSProperties = {
    width: '22px',
    height: '2px',
    background: '#e2e8f0',
    borderRadius: '2px',
  };

  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '280px',
    background: '#0d1117',
    zIndex: 200,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 199,
    display: mobileOpen ? 'block' : 'none',
  };

  const navLinks = ['Practice', 'Pair', 'Assess', 'Replay'];

  // Suppress unused variable warning for location
  void location;

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          <div style={logoIconStyle}>&#x2B21;</div>
          <div style={logoTextStyle}>
            <span style={logoNameStyle}>Code Battlegrounds</span>
            <span style={logoSubStyle}>Arena</span>
          </div>
        </Link>

        {/* Center Links - hidden on mobile */}
        <div style={{ ...centerNavStyle, display: 'flex' }} className="hp-nav-center">
          {navLinks.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#00e5cc')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right - hidden on mobile */}
        <div style={rightStyle} className="hp-nav-right">
          <span style={studentPillStyle}>Student</span>
          <span style={facultyPillStyle}>Faculty</span>
          <Link to="/login" style={ctaStyle}>Sign in with Google</Link>
        </div>

        {/* Hamburger - mobile only */}
        <button
          style={{ ...hamburgerStyle, display: 'none' }}
          className="hp-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span style={lineStyle} />
          <span style={lineStyle} />
          <span style={lineStyle} />
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      <div style={overlayStyle} onClick={() => setMobileOpen(false)} />

      {/* Mobile drawer */}
      <div style={drawerStyle}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', color: '#e2e8f0', fontSize: '24px', cursor: 'pointer' }}
          >
            &#x2715;
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {navLinks.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{ ...navLinkStyle, fontSize: '15px', color: '#9ca3af' }}
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={studentPillStyle}>Student</span>
          <span style={facultyPillStyle}>Faculty</span>
        </div>
        <Link to="/login" style={{ ...ctaStyle, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
          Sign in with Google
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hp-nav-center { display: none !important; }
          .hp-nav-right { display: none !important; }
          .hp-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
