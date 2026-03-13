import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
	BarChart3,
	BookMarked,
	BookOpen,
	Briefcase,
	ClipboardCheck,
	Code2,
	Lightbulb,
	Users,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ParticleField from '../../components/effects/ParticleField';
import './FeaturesSelection.scss';

type Role = 'academic' | 'professional';

interface Feature {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
	badge?: string;
	route?: string;
}

interface FeaturesByRole {
	academic: Feature[];
	professional: Feature[];
}

const features: FeaturesByRole = {
  academic: [
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
  ],
  professional: [
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
      route: '/create-room',
    },
    {
      id: 'practice-sets',
      icon: BookMarked,
      title: 'Curated Practice Sets',
      description: 'Topic-based problem collections for focused learning',
      route: '/sets',
    },
  ],
};

const FeaturesSelection = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const role =
		(location.state as { role?: Role } | undefined)?.role || 'academic';
	const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
	const [hoveredCard, setHoveredCard] = useState<string | null>(null);

	const currentFeatures = features[role];
	const roleTitle =
		role === 'academic' ? 'Academic Features' : 'Professional Tools';

	const handleFeatureClick = (feature: Feature) => {
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
				<ParticleField />
				<div className="features-selection__grid-bg" />
				<div className="features-selection__orb features-selection__orb--left" />
				<div className="features-selection__orb features-selection__orb--right" />
				<div className="features-selection__orb features-selection__orb--center" />
			</div>

			{role === 'professional' && (
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
			)}

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
						{role === 'academic' ? (
							<BookOpen size={32} strokeWidth={1.5} />
						) : (
							<Briefcase size={32} strokeWidth={1.5} />
						)}
					</motion.div>
					<motion.h1
						className="features-selection__title"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						{roleTitle}
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
					{currentFeatures.map((feature, index) => {
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
										scale: isHovered ? 1.2 : 0.8,
									}}
									transition={{ duration: 0.6 }}
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

export default FeaturesSelection;
