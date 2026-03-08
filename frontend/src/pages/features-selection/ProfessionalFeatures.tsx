import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Code2, Lightbulb, Users, BookMarked, BarChart3 } from 'lucide-react';
import { gsap } from 'gsap';
import './FeaturesSelection.scss';

interface ProfessionalFeature {
  id: string;
  icon: typeof Code2;
  title: string;
  description: string;
  badge?: string;
  route?: string;
}

const professionalFeatures: ProfessionalFeature[] = [
  {
    id: 'algorithm-practice',
    icon: Code2,
    title: 'Algorithm Challenges',
    description: 'Practice data structures and algorithms at your own pace',
    route: '/practice',
  },
  {
    id: 'mock-interview',
    icon: Lightbulb,
    title: 'Mock Interviews',
    description: 'Prepare for technical interviews with realistic scenarios',
    route: '/interview',
  },
  {
    id: 'pair-collab',
    icon: Users,
    title: 'Pair Programming',
    description: 'Collaborate with peers on challenging problems',
    route: '/pair',
  },
  {
    id: 'practice-sets',
    icon: BookMarked,
    title: 'Curated Practice Sets',
    description: 'Topic-based problem collections for focused learning',
    route: '/sets',
  },
];

const ProfessionalFeatures = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations on mount
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }
  }, []);

  const handleFeatureClick = (feature: ProfessionalFeature) => {
    setSelectedFeature(feature.id);
    
    // GSAP exit animation
    const card = document.querySelector(`[data-feature-id="${feature.id}"]`);
    if (card) {
      gsap.to(card, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(card, {
            scale: 0.95,
            opacity: 0,
            duration: 0.2,
          });
        },
      });
    }

    setTimeout(() => {
      if (feature.route) {
        navigate(feature.route);
      } else {
        navigate('/');
      }
    }, 500);
  };

  const handleCardHover = (featureId: string, isHovering: boolean) => {
    setHoveredCard(isHovering ? featureId : null);
    
    const card = document.querySelector(`[data-feature-id="${featureId}"]`);
    if (card && isHovering) {
      gsap.to(card.querySelector('.feature-card__icon'), {
        rotation: 360,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div className="features-selection">
      <div className="features-selection__background">
        <div className="features-selection__grid-bg" />
        <motion.div
          className="features-selection__orb features-selection__orb--left"
          animate={{
            x: [-30, 40, -30],
            y: [-20, 30, -20],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="features-selection__orb features-selection__orb--right"
          animate={{
            x: [40, -30, 40],
            y: [30, -20, 30],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
        <motion.div
          className="features-selection__orb features-selection__orb--center"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <motion.button
        className="features-selection__back"
        onClick={() => navigate('/role')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.05, x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      <motion.button
        className="features-selection__progress-btn"
        onClick={() => navigate('/progress')}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="Progress Tracking"
      >
        <BarChart3 size={18} strokeWidth={1.5} />
        <span>Progress</span>
      </motion.button>

      <div className="features-selection__container">
        <div ref={headerRef} className="features-selection__header">
          <motion.div
            className="features-selection__role-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
            }}
            whileHover={{
              rotate: [0, -10, 10, 0],
              scale: 1.1,
              transition: { duration: 0.5 },
            }}
          >
            <Briefcase size={32} strokeWidth={1.5} />
          </motion.div>
          <motion.h1
            className="features-selection__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Professional Tools
          </motion.h1>
          <motion.p
            className="features-selection__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Select a feature to get started with your coding practice
          </motion.p>
        </div>

        <div ref={cardsRef} className="features-selection__features-grid">
          {professionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isSelected = selectedFeature === feature.id;
            const isHovered = hoveredCard === feature.id;

            return (
              <motion.div
                key={feature.id}
                data-feature-id={feature.id}
                className={`feature-card ${isSelected ? 'feature-card--selected' : ''}`}
                onClick={() => handleFeatureClick(feature)}
                onMouseEnter={() => handleCardHover(feature.id, true)}
                onMouseLeave={() => handleCardHover(feature.id, false)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2 + index * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="feature-card__glow"
                  animate={{
                    opacity: isSelected ? 0.8 : isHovered ? 0.5 : 0,
                    scale: isHovered ? 1.2 : 0.8,
                  }}
                  transition={{ duration: 0.6 }}
                />

                <div className="feature-card__shine" />

                <div className="feature-card__header">
                  <motion.div
                    className="feature-card__icon"
                    animate={
                      isSelected
                        ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 360],
                            transition: { duration: 0.8, ease: 'easeOut' },
                          }
                        : {}
                    }
                  >
                    <motion.div
                      animate={{
                        y: isHovered ? [0, -4, 0] : 0,
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: isHovered ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    >
                      <Icon size={26} strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                  {feature.badge && (
                    <motion.span
                      className="feature-card__badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {feature.badge}
                    </motion.span>
                  )}
                </div>

                <div className="feature-card__content">
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__description">{feature.description}</p>
                </div>

                <motion.div
                  className="feature-card__hover-indicator"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isHovered || isSelected ? '100%' : 0 
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFeatures;