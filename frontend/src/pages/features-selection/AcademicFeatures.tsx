import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ClipboardCheck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './FeaturesSelection.scss';

interface AcademicFeature {
  id: string;
  icon: typeof Users;
  title: string;
  description: string;
  badge?: string;
  route?: string;
  facultyOnly?: boolean;
}

const academicFeatures: AcademicFeature[] = [
	{
		id: 'classrooms',
		icon: Users,
		title: 'Classrooms',
		description: 'Real-time collaborative coding with live cursor presence',
		badge: 'Collaborative',
		route: '/classrooms',
	},
	{
		id: 'assessment',
		icon: ClipboardCheck,
		title: 'Assessment Mode',
		description: 'Timed coding assessments with transparent integrity tracking',
		badge: 'Faculty',
		route: '/assess',
	},
  {
    id: 'integrity',
    icon: Shield,
    title: 'Integrity Insights',
    description: 'Factual session timeline — neutral activity log for instructor review',
    badge: 'Transparency',
    route: '/integrity',
    facultyOnly: true,
  },
];

const AcademicFeatures = () => {
	const navigate = useNavigate();
	const { roleData, loading } = useAuth();
	const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
	const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const visibleFeatures = roleData.requested === 'faculty'
    ? academicFeatures
    : academicFeatures.filter((f) => !f.facultyOnly);

  // Redirect to role selection if user hasn't chosen faculty/student role
  useEffect(() => {
    if (loading) {
      console.log('[AcademicFeatures] Auth still loading...');
      return;
    }

		const hasAcademicRole =
			roleData.requested === 'faculty' || roleData.requested === 'student';
		console.log(
			'[AcademicFeatures] Role data:',
			roleData,
			'hasAcademicRole:',
			hasAcademicRole,
		);

		if (!hasAcademicRole) {
			console.log(
				'[AcademicFeatures] No academic role, redirecting to role selection...',
			);
			navigate('/home', {
				state: {
					academicOnly: true,
					returnTo: '/features/academic',
				},
				replace: true,
			});
		}
	}, [roleData, loading, navigate]);

	const handleFeatureClick = (feature: AcademicFeature) => {
		setSelectedFeature(feature.id);
		setTimeout(() => {
			if (feature.route) {
				navigate(feature.route);
			} else {
				navigate('/');
			}
		}, 300);
	};

	const handleCardHover = (featureId: string, isHovering: boolean) => {
		setHoveredCard(isHovering ? featureId : null);
	};

	return (
		<div className="features-selection">
			<div className="features-selection__background">
				<div className="features-selection__grid-bg" />
				<div className="features-selection__orb features-selection__orb--left" />
				<div className="features-selection__orb features-selection__orb--right" />
				<div className="features-selection__orb features-selection__orb--center" />
			</div>

			<div className="features-selection__container">
				<div className="features-selection__header">
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
					>
						<BookOpen size={32} strokeWidth={1.5} />
					</motion.div>
					<motion.h1
						className="features-selection__title"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						Academic Features
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

        <div className="features-selection__features-grid">
          {visibleFeatures.map((feature, index) => {
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
									ease: [0.22, 1, 0.36, 1],
								}}
								whileTap={{ scale: 0.98 }}
							>
								<motion.div
									className="feature-card__glow"
									animate={{
										opacity: isSelected ? 0.8 : isHovered ? 0.5 : 0,
									}}
									transition={{ duration: 0.3 }}
								/>

								<div className="feature-card__shine" />

								<div className="feature-card__header">
									<div className="feature-card__icon">
										<Icon size={26} strokeWidth={1.5} />
									</div>
									{feature.badge && (
										<span className="feature-card__badge">
											{feature.badge}
										</span>
									)}
								</div>

								<div className="feature-card__content">
									<h3 className="feature-card__title">{feature.title}</h3>
									<p className="feature-card__description">
										{feature.description}
									</p>
								</div>

								<motion.div
									className="feature-card__hover-indicator"
									initial={{ width: 0 }}
									animate={{
										width: isHovered || isSelected ? '100%' : 0,
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

export default AcademicFeatures;
