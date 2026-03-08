import { useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import AISection from '../../sections/AISection';
import CTASection from '../../sections/CTASection';
import DualAudience from '../../sections/DualAudience';
import FacultyFeatures from '../../sections/FacultyFeatures';
import Footer from '../../sections/Footer';
import Hero from '../../sections/Hero';
import IntegritySection from '../../sections/IntegritySection';
import ModesShowcase from '../../sections/ModesShowcase';
import '../../styles/_tokens.scss';

const HomePage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: '#080c10', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <DualAudience />
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
