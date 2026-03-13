import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import './FeatureComingSoon.scss';

interface FeatureComingSoonProps {
	icon: LucideIcon;
	title: string;
	description: string;
	features?: string[];
	badge?: string;
}

const FeatureComingSoon = ({
	icon: Icon,
	title,
	description,
	features,
	badge,
}: FeatureComingSoonProps) => {
	const navigate = useNavigate();

	return (
		<div className="feature-coming-soon">
			<div className="feature-coming-soon__background">
				<div className="feature-coming-soon__grid" />
				<motion.div
					className="feature-coming-soon__orb feature-coming-soon__orb--1"
					animate={{
						x: [-20, 30, -20],
						y: [-30, 20, -30],
						opacity: [0.15, 0.25, 0.15],
					}}
					transition={{
						duration: 18,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					className="feature-coming-soon__orb feature-coming-soon__orb--2"
					animate={{
						x: [30, -20, 30],
						y: [20, -30, 20],
						opacity: [0.12, 0.22, 0.12],
					}}
					transition={{
						duration: 22,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 3,
					}}
				/>
			</div>

			<div className="feature-coming-soon__container">
				<motion.div
					className="feature-coming-soon__content"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<motion.div
						className="feature-coming-soon__icon-wrapper"
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.1,
							type: 'spring',
							stiffness: 200,
						}}
					>
						<div className="feature-coming-soon__icon">
							<Icon size={40} strokeWidth={1.5} />
						</div>
						{badge && (
							<motion.span
								className="feature-coming-soon__badge"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4 }}
							>
								{badge}
							</motion.span>
						)}
					</motion.div>

					<motion.h1
						className="feature-coming-soon__title"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						{title}
					</motion.h1>

					<motion.p
						className="feature-coming-soon__description"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						{description}
					</motion.p>

					{features && features.length > 0 && (
						<motion.div
							className="feature-coming-soon__features"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<h3>What's Coming:</h3>
							<ul>
								{features.map((feature, idx) => (
									<motion.li
										key={idx}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.6 + idx * 0.1 }}
									>
										<span className="feature-coming-soon__dot" />
										{feature}
									</motion.li>
								))}
							</ul>
						</motion.div>
					)}

					<motion.div
						className="feature-coming-soon__status"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.7 }}
					>
						<Sparkles className="feature-coming-soon__sparkle" size={20} />
						<span>Feature Under Development</span>
					</motion.div>

					<motion.div
						className="feature-coming-soon__actions"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
					>
						<Button variant="primary" onClick={() => navigate('/')}>
							Go to Code Editor
						</Button>
						<Button variant="ghost" onClick={() => navigate('/home')}>
							Explore Other Features
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default FeatureComingSoon;
