import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import AISection from '../../sections/AISection';
import CTASection from '../../sections/CTASection';
import Footer from '../../sections/Footer';
import Hero from '../../sections/Hero';
import IntegritySection from '../../sections/IntegritySection';
import ModesShowcase from '../../sections/ModesShowcase';

const HomePage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{
      background: '#07090d',
      minHeight: '100vh',
      color: 'rgba(255,255,255,0.88)',
      fontFamily: 'DM Sans, sans-serif',
      overflowX: 'hidden',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          opacity: 0.026,
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Header */}
      <nav style={{
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
        background: 'rgba(8,8,10,0.72)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '8px',
          }}>
            <Code2 size={18} color="rgba(255,255,255,0.72)" strokeWidth={1.5} />
          </div>
          <span style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.90)',
          }}>
            Code<span style={{ color: '#22c55e' }}>Battlegrounds</span>
          </span>
        </Link>
        <Link
          to="/login1"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.80)',
            border: '1px solid rgba(255,255,255,0.10)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            padding: '8px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            transition: 'background 0.18s, border-color 0.18s, color 0.18s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.background = 'rgba(255,255,255,0.12)';
            el.style.borderColor = 'rgba(255,255,255,0.20)';
            el.style.color = 'rgba(255,255,255,1)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.background = 'rgba(255,255,255,0.06)';
            el.style.borderColor = 'rgba(255,255,255,0.10)';
            el.style.color = 'rgba(255,255,255,0.80)';
          }}
        >
          Log in
        </Link>
      </nav>

      <Hero />
      <ModesShowcase />
      <AISection />
      <IntegritySection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
