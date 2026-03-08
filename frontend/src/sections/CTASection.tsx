import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section style={{ padding: '120px 32px', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden', textAlign: 'center', background: '#080c10' }}>
      {/* Background orb */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,204,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00e5cc', letterSpacing: '0.2em', marginBottom: '20px' }}>READY TO ENTER THE ARENA?</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '52px', color: '#e2e8f0', lineHeight: 1.1, margin: '0 0 20px' }}>
          Practice smarter. Assess fairly.<br />Learn together.
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#6b7280', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
          Code Battlegrounds is free to use. Sign in with Google and start practicing — or set up your first assessment in under 5 minutes.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#00e5cc',
              color: '#080c10',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              padding: '14px 28px',
              borderRadius: '10px',
              border: 'none',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,229,204,0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,229,204,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,229,204,0.2)'; }}
          >
            Sign in with Google — It's free
          </Link>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'transparent',
              color: '#9ca3af',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
              padding: '14px 24px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            I'm an Instructor &rarr;
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Free to start', 'No credit card', 'Google login in 1 click'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#4a5568' }}>
              <span style={{ color: '#00e5cc' }}>&#x2713;</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
