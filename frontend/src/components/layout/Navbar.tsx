import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = ['Practice', 'Pair', 'Assess', 'Replay'];
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 28 };
const SMOOTH = { type: 'tween' as const, duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    NAV_LINKS.forEach(link => {
      const el = document.getElementById(link.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        style={{
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
        }}
        animate={{
          background: scrolled ? 'rgba(8,8,10,0.72)' : 'rgba(8,8,10,0)',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Logo */}
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <motion.div
            style={{
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '8px',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.72)',
            }}
            whileHover={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.18)' }}
            transition={SMOOTH}
          >
            &#x2B21;
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'rgba(255,255,255,0.92)', lineHeight: 1 }}>
              Code Battlegrounds
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', lineHeight: 1 }}>
              ARENA
            </span>
          </div>
        </Link>

        {/* Center nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hp-nav-center">
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.toLowerCase();
            return (
              <div key={link} style={{ position: 'relative', paddingBottom: '5px' }}>
                <motion.a
                  href={`#${link.toLowerCase()}`}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    color: isActive ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.42)',
                    textDecoration: 'none',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                  whileHover={{ y: -1, color: 'rgba(255,255,255,0.84)' }}
                  whileTap={{ y: 0 }}
                  transition={SPRING}
                  onClick={() => setActiveSection(link.toLowerCase())}
                >
                  {link}
                </motion.a>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'rgba(255,255,255,0.72)',
                        borderRadius: '1px',
                      }}
                      initial={{ opacity: 0, scaleX: 0.5 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.5 }}
                      transition={SPRING}
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right — CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hp-nav-right">
          <motion.div
            style={{ display: 'inline-flex' }}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            transition={SPRING}
          >
            <Link
              to="/login"
              style={{
                background: 'rgba(255,255,255,0.92)',
                color: '#0a0a0a',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                letterSpacing: '-0.01em',
                boxShadow: '0 1px 8px rgba(0,0,0,0.22)',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.92)';
                e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.22)';
              }}
            >
              Sign in
            </Link>
          </motion.div>
        </div>

        {/* Hamburger — mobile only */}
        <button
          style={{ display: 'none', flexDirection: 'column', gap: '5px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}
          className="hp-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span style={{ width: '22px', height: '2px', background: 'rgba(255,255,255,0.7)', borderRadius: '2px', display: 'block' }} />
          <span style={{ width: '22px', height: '2px', background: 'rgba(255,255,255,0.7)', borderRadius: '2px', display: 'block' }} />
          <span style={{ width: '22px', height: '2px', background: 'rgba(255,255,255,0.7)', borderRadius: '2px', display: 'block' }} />
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-overlay"
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 199,
                backdropFilter: 'blur(4px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="mobile-drawer"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '280px',
                background: 'rgba(8,8,10,0.92)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                zIndex: 200,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
              initial={{ x: '100%', opacity: 0.6 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '100%', opacity: 0.6 }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.46)', fontSize: '20px', cursor: 'pointer', padding: '4px' }}
                >
                  &#x2715;
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {NAV_LINKS.map(link => (
                  <motion.a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '13px',
                      letterSpacing: '0.06em',
                      color: 'rgba(255,255,255,0.52)',
                      textDecoration: 'none',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                    whileHover={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.84)' }}
                    transition={SMOOTH}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>

              <Link
                to="/login"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  color: '#0a0a0a',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '-0.01em',
                }}
                onClick={() => setMobileOpen(false)}
              >
                Sign in with Google
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
