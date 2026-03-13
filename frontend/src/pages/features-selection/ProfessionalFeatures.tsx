import { motion } from 'framer-motion';
import { BookMarked, Briefcase, Code2, Lightbulb, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
		route: '/create-room',
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

	const handleFeatureClick = (feature: ProfessionalFeature) => {
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

				<div className="features-selection__features-grid">
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

export default ProfessionalFeatures;
