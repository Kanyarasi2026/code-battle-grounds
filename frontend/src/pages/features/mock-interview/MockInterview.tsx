import { ArrowLeft, ArrowRight, BarChart3, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MockInterview.scss';

const MockInterview = () => {
	const navigate = useNavigate();

	return (
		<div className="mi-page">
			{/* Header */}
			<header className="mi-page__header">
				<button className="mi-page__back" onClick={() => navigate(-1)}>
					<ArrowLeft size={14} />
					Back
				</button>
			</header>

			{/* Hero */}
			<section className="mi-page__hero">
				<span className="mi-page__badge">Mock Interview</span>
				<h1 className="mi-page__title">Practice Interviews</h1>
				<p className="mi-page__subtitle">
					Simulate real technical interviews with AI-powered voice interaction.
					Get instant feedback on your answers and track your progress.
				</p>

				<div className="mi-page__actions">
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
				</div>
			</section>

			{/* Info cards */}
			<section className="mi-page__info">
				<div className="mi-page__card">
					<h3 className="mi-page__card-title">How it works</h3>
					<ul className="mi-page__card-list">
						<li>Choose your role and experience level</li>
						<li>AI generates tailored interview questions</li>
						<li>Answer using voice — hold the mic button to speak</li>
						<li>Get scored feedback and areas to improve</li>
					</ul>
				</div>

				<div className="mi-page__card">
					<h3 className="mi-page__card-title">Interview types</h3>
					<div className="mi-page__tags">
						<span className="mi-page__tag">Technical</span>
						<span className="mi-page__tag">Behavioral</span>
						<span className="mi-page__tag">Mixed</span>
					</div>
					<p className="mi-page__card-text">
						Covers system design, algorithms, leadership scenarios, and more.
						Each session adapts to your level.
					</p>
				</div>

				<div className="mi-page__card">
					<h3 className="mi-page__card-title">Track progress</h3>
					<p className="mi-page__card-text">
						Review past sessions, compare scores, and identify patterns in your
						interview performance over time.
					</p>
				</div>
			</section>
		</div>
	);
};

export default MockInterview;
