import { motion } from 'framer-motion';
import { BookOpen, Briefcase, ChevronRight, GraduationCap, Users2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import './RoleSelection.scss';

type Role = 'academic' | 'professional';
type AcademicRole = 'faculty' | 'student';

interface RoleCard {
  id: Role;
  icon: typeof BookOpen;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

const roles: RoleCard[] = [
  {
    id: 'academic',
    icon: BookOpen,
    title: 'Professor / Student',
    subtitle: 'Academic Environment',
    description: 'Practice, learn, and assess in a structured academic setting with AI-powered coaching and transparent evaluation tools.',
    features: [
      'Solo practice with tiered AI hints',
      'Pair programming sessions',
      'Instructor-led assessments',
      'Academic progress tracking',
    ],
  },
  {
    id: 'professional',
    icon: Briefcase,
    title: 'Professional',
    subtitle: 'Technical Practice',
    description: 'Sharpen your coding skills with algorithm challenges, mock interviews, and collaborative problem-solving.',
    features: [
      'Algorithm challenges',
      'Mock interview preparation',
      'Real-time collaboration',
      'Performance tracking',
    ],
  },
];

interface AcademicRoleCard {
  id: AcademicRole;
  icon: typeof GraduationCap;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

const academicRoles: AcademicRoleCard[] = [
  {
    id: 'faculty',
    icon: GraduationCap,
    title: 'Faculty / Instructor',
    subtitle: 'Teaching & Assessment',
    description: 'Create and manage assessments, track student progress, and maintain academic integrity.',
    features: [
      'Create timed assessments',
      'Monitor student submissions',
      'Integrity tracking dashboard',
      'Class analytics and reports',
    ],
  },
  {
    id: 'student',
    icon: Users2,
    title: 'Student',
    subtitle: 'Learning & Practice',
    description: 'Take assessments, practice coding problems, and track your progress.',
    features: [
      'Complete timed assessments',
      'Real-time code execution',
      'Progress tracking',
      'Transparent evaluation',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const RoleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, requestRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedAcademicRole, setSelectedAcademicRole] = useState<AcademicRole | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showAcademicModal, setShowAcademicModal] = useState(false);

  // Check if we're in academic-only mode (for faculty/student selection)
  const locationState = location.state as { academicOnly?: boolean; returnTo?: string } | null;
  const academicOnly = locationState?.academicOnly || false;
  const returnTo = locationState?.returnTo || '/';

  const handleRoleSelect = (role: Role) => {
    if (isAnimating) return;
    setSelectedRole(role);
    setIsAnimating(true);

    // For academic role, show the faculty/student selection modal
    if (role === 'academic') {
      setTimeout(() => {
        setShowAcademicModal(true);
        setIsAnimating(false);
      }, 400);
    } else {
      // For professional, navigate to professional features
      setTimeout(() => {
        navigate('/features/professional');
      }, 600);
    }
  };

  const handleAcademicRoleSelect = (role: AcademicRole) => {
    if (isAnimating) return;
    setSelectedAcademicRole(role);
    setIsAnimating(true);

    // Set the role in auth context
    requestRole(role as UserRole);

    setTimeout(() => {
      // If we're in academicOnly mode (coming from a protected route), go back
      // Otherwise, navigate to academic features page
      if (academicOnly) {
        navigate(returnTo, { replace: true });
      } else {
        navigate('/features/academic', { replace: true });
      }
    }, 600);
  };

  // If in academic-only mode OR showAcademicModal is true, show faculty/student selection
  if (academicOnly || showAcademicModal) {
    return (
      <div className="role-selection">
        <div className="role-selection__background">
          <div className="role-selection__grid" />
          <motion.div
            className="role-selection__orb role-selection__orb--top"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="role-selection__orb role-selection__orb--bottom"
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
              opacity: [0.08, 0.18, 0.08],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </div>

        <motion.div
          className="role-selection__container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="role-selection__header" variants={itemVariants}>
            <p className="role-selection__welcome">Welcome, {user?.user_metadata?.['full_name'] || user?.email?.split('@')[0]}</p>
            <h1 className="role-selection__title">Select Your Academic Role</h1>
            <p className="role-selection__subtitle">
              Choose your role to access the appropriate assessment features
            </p>
          </motion.div>

          <motion.div className="role-selection__cards" variants={containerVariants}>
            {academicRoles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedAcademicRole === role.id;
              const isOtherSelected = selectedAcademicRole && selectedAcademicRole !== role.id;
              const isHovered = hoveredCard === role.id;

              return (
                <motion.div
                  key={role.id}
                  className={`role-card ${isSelected ? 'role-card--selected' : ''} ${isOtherSelected ? 'role-card--dimmed' : ''}`}
                  variants={itemVariants}
                  onClick={() => handleAcademicRoleSelect(role.id)}
                  onHoverStart={() => setHoveredCard(role.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={!isAnimating ? { 
                    y: -8,
                    transition: { duration: 0.3, ease: 'easeOut' }
                  } : {}}
                  whileTap={!isAnimating ? { scale: 0.98 } : {}}
                >
                  <motion.div
                    className="role-card__glow"
                    animate={{
                      opacity: isSelected ? 1 : isHovered ? 0.6 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="role-card__icon-wrapper">
                    <motion.div
                      className="role-card__icon"
                      animate={
                        isSelected
                          ? {
                              scale: [1, 1.15, 1],
                              rotate: [0, 10, 0],
                              transition: { duration: 0.6, ease: 'easeOut' },
                            }
                          : isHovered
                          ? {
                              rotate: [0, -5, 5, 0],
                              transition: { duration: 0.5, ease: 'easeInOut' },
                            }
                          : {}
                      }
                    >
                      <motion.div
                        animate={{
                          scale: isHovered ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: isHovered ? Infinity : 0,
                          ease: 'easeInOut',
                        }}
                      >
                        <Icon size={28} strokeWidth={1.5} />
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="role-card__content">
                    <motion.div
                      className="role-card__badge"
                      animate={{
                        scale: isHovered ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {role.subtitle}
                    </motion.div>
                    <h2 className="role-card__title">{role.title}</h2>
                    <p className="role-card__description">{role.description}</p>

                    <ul className="role-card__features">
                      {role.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                              delay: 0.3 + idx * 0.08,
                              duration: 0.4,
                            }
                          }}
                          whileHover={{
                            x: 6,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <motion.span 
                            className="role-card__feature-dot"
                            animate={{
                              scale: isHovered ? [1, 1.3, 1] : 1,
                            }}
                            transition={{
                              duration: 2,
                              repeat: isHovered ? Infinity : 0,
                              delay: idx * 0.2,
                            }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.div
                    className="role-card__arrow"
                    animate={{
                      x: isSelected ? 6 : isHovered ? 4 : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight size={20} strokeWidth={2} />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Default role selection (academic vs professional)

  return (
    <div className="role-selection">
      <div className="role-selection__background">
        <div className="role-selection__grid" />
        <motion.div
          className="role-selection__orb role-selection__orb--top"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="role-selection__orb role-selection__orb--bottom"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <motion.div
        className="role-selection__container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="role-selection__header" variants={itemVariants}>
          <p className="role-selection__welcome">Welcome, {user?.user_metadata?.['full_name'] || user?.email?.split('@')[0]}</p>
          <h1 className="role-selection__title">Choose Your Path</h1>
          <p className="role-selection__subtitle">
            Select your role to customize your experience and access relevant features
          </p>
        </motion.div>

        <motion.div className="role-selection__cards" variants={containerVariants}>
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isOtherSelected = selectedRole && selectedRole !== role.id;
            const isHovered = hoveredCard === role.id;

            return (
              <motion.div
                key={role.id}
                className={`role-card ${isSelected ? 'role-card--selected' : ''} ${isOtherSelected ? 'role-card--dimmed' : ''}`}
                variants={itemVariants}
                onClick={() => handleRoleSelect(role.id)}
                onHoverStart={() => setHoveredCard(role.id)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={!isAnimating ? { 
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' }
                } : {}}
                whileTap={!isAnimating ? { scale: 0.98 } : {}}
              >
                <motion.div
                  className="role-card__glow"
                  animate={{
                    opacity: isSelected ? 1 : isHovered ? 0.6 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                />

                <div className="role-card__icon-wrapper">
                  <motion.div
                    className="role-card__icon"
                    animate={
                      isSelected
                        ? {
                            scale: [1, 1.15, 1],
                            rotate: [0, 10, 0],
                            transition: { duration: 0.6, ease: 'easeOut' },
                          }
                        : isHovered
                        ? {
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.5, ease: 'easeInOut' },
                          }
                        : {}
                    }
                  >
                    <motion.div
                      animate={{
                        scale: isHovered ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isHovered ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    >
                      <Icon size={28} strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="role-card__content">
                  <motion.div
                    className="role-card__badge"
                    animate={{
                      scale: isHovered ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {role.subtitle}
                  </motion.div>
                  <h2 className="role-card__title">{role.title}</h2>
                  <p className="role-card__description">{role.description}</p>

                  <ul className="role-card__features">
                    {role.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: {
                            delay: 0.3 + idx * 0.08,
                            duration: 0.4,
                          }
                        }}
                        whileHover={{
                          x: 6,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.span 
                          className="role-card__feature-dot"
                          animate={{
                            scale: isHovered ? [1, 1.3, 1] : 1,
                          }}
                          transition={{
                            duration: 2,
                            repeat: isHovered ? Infinity : 0,
                            delay: idx * 0.2,
                          }}
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div
                  className="role-card__arrow"
                  animate={{
                    x: isSelected ? 6 : isHovered ? 4 : 0,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <ChevronRight size={18} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
