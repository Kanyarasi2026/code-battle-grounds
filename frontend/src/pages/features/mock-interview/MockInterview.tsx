import { ArrowLeft, ArrowRight, BarChart3, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './MockInterview.scss';

const MockInterview = () => {
	const navigate = useNavigate();

	return (
		<div className="mi-page">
			{/* Header */}
			<header className="mi-page__header">
				<motion.button
					className="mi-page__back"
					onClick={() => navigate(-1)}
					initial={{ opacity: 0, x: -12 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.35 }}
				>
					<ArrowLeft size={14} />
					Back
				</motion.button>
			</header>

			{/* Hero */}
			<section className="mi-page__hero">
				<motion.span
					className="mi-page__badge"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<span className="mi-page__badge-dot" />
					Mock Interview
				</motion.span>

				<motion.h1
					className="mi-page__title"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}
				>
					Practice Interviews
				</motion.h1>

				<motion.p
					className="mi-page__subtitle"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					Simulate real technical interviews with AI-powered voice interaction.
					Get instant feedback on your answers and track your progress.
				</motion.p>

				<motion.div
					className="mi-page__actions"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.35 }}
				>
					<button
						className="mi-page__btn mi-page__btn--primary"
						onClick={() => navigate('/video-interview')}
					>
						<Mic size={16} />
						Start Interview
						<ArrowRight size={14} />
					</button>
					<button
						className="mi-page__btn mi-page__btn--secondary"
						onClick={() => navigate('/interview-dashboard')}
					>
						<BarChart3 size={16} />
						Dashboard
					</button>
				</motion.div>
			</section>

			{/* Info cards */}
			<section className="mi-page__info">
				{[
					{
						title: 'How it works',
						content: (
							<ul className="mi-page__card-list">
								<li>Choose your role and experience level</li>
								<li>AI generates tailored interview questions</li>
								<li>Answer using voice — hold the mic button to speak</li>
								<li>Get scored feedback and areas to improve</li>
							</ul>
						),
					},
					{
						title: 'Interview types',
						content: (
							<>
								<div className="mi-page__tags">
									<span className="mi-page__tag">Technical</span>
									<span className="mi-page__tag">Behavioral</span>
									<span className="mi-page__tag">Mixed</span>
								</div>
								<p className="mi-page__card-text">
									Covers system design, algorithms, leadership scenarios, and more.
									Each session adapts to your level.
								</p>
							</>
						),
					},
					{
						title: 'Track progress',
						content: (
							<p className="mi-page__card-text">
								Review past sessions, compare scores, and identify patterns in your
								interview performance over time.
							</p>
						),
					},
				].map((card, i) => (
					<motion.div
						key={card.title}
						className="mi-page__card"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.45 + i * 0.1 }}
					>
						<h3 className="mi-page__card-title">{card.title}</h3>
						{card.content}
					</motion.div>
				))}
			</section>
		</div>
	);
};

export default MockInterview;
