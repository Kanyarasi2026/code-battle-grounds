import { useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import AISection from '../../sections/AISection';
import CTASection from '../../sections/CTASection';
import FacultyFeatures from '../../sections/FacultyFeatures';
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
      <Navbar />
      <Hero />
      <ModesShowcase />
      <FacultyFeatures />
      <AISection />
      <IntegritySection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
