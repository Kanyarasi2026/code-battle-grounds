import { motion } from 'framer-motion';
import {
	ArrowLeft,
	ArrowRight,
	BarChart3,
	Brain,
	Building2,
	CheckCircle2,
	ChevronRight,
	Clock,
	Code2,
	Lightbulb,
	MessageSquare,
	Mic,
	Play,
	Shield,
	Sparkles,
	Target,
	Timer,
	TrendingUp,
	Video,
	Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MockInterview.scss';

// ── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
	transition: {
		duration: 0.5,
		delay,
		ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
	},
});

const fadeIn = (delay = 0) => ({
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	transition: { duration: 0.4, delay },
});

const stagger = {
	animate: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
	initial: { opacity: 0, y: 20 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.45,
			ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
		},
	},
};

// ── Data ───────────────────────────────────────────────────────────────────
const MODES = [
	{
		id: 'company',
		color: 'blue',
		icon: Building2,
		title: 'Company-Specific Formats',
		desc: 'Simulate real interview loops from top tech companies — FAANG, startups, and beyond.',
		status: 'available',
		statusLabel: 'Available',
		duration: '45–90 min',
		format: 'Multi-round',
		ai: true,
		cta: 'Start Practice',
		ctaVariant: 'mi-btn--blue',
	},
	{
		id: 'timed',
		color: 'cyan',
		icon: Timer,
		title: 'Timed Problem Sessions',
		desc: 'Sharpen your speed. Race the clock on algorithm and data structure problems under real pressure.',
		status: 'available',
		statusLabel: 'Available',
		duration: '20–40 min',
		format: 'Timed DSA',
		ai: true,
		cta: 'Start Practice',
		ctaVariant: 'mi-btn--cyan',
	},
	{
		id: 'video',
		color: 'violet',
		icon: Video,
		title: 'Video Interview Simulation',
		desc: 'Full-screen interview simulation with webcam, whiteboard, and real-time AI body language analysis.',
		status: 'preview',
		statusLabel: 'Preview',
		duration: '30–60 min',
		format: 'Video + Code',
		ai: true,
		cta: 'Launch Simulation',
		ctaVariant: 'mi-btn--violet',
	},
	{
		id: 'behavioral',
		color: 'amber',
		icon: MessageSquare,
		title: 'Behavioral Question Practice',
		desc: 'Structure your STAR responses. Practice culture-fit, leadership, and conflict scenarios.',
		status: 'available',
		statusLabel: 'Available',
		duration: '15–30 min',
		format: 'Text + Audio',
		ai: true,
		cta: 'Open Behavioral Round',
		ctaVariant: 'mi-btn--amber',
	},
	{
		id: 'feedback',
		color: 'green',
		icon: Lightbulb,
		title: 'Live Feedback & Hints',
		desc: 'Get real-time AI coaching as you type — hints, complexity analysis, and edge-case nudges.',
		status: 'available',
		statusLabel: 'Available',
		duration: 'Continuous',
		format: 'AI-assisted',
		ai: true,
		cta: 'Review Feedback',
		ctaVariant: 'mi-btn--green',
	},
	{
		id: 'analytics',
		color: 'red',
		icon: BarChart3,
		title: 'Performance Analytics',
		desc: 'Deep analysis of your interview trajectory — accuracy trends, weak spots, and readiness scores.',
		status: 'preview',
		statusLabel: 'Preview',
		duration: 'Always on',
		format: 'Dashboard',
		ai: true,
		cta: 'View Analytics',
		ctaVariant: 'mi-btn--red',
	},
];

const FLOW_STEPS = [
	{
		num: '01',
		title: 'Select Format',
		desc: 'Pick interview type, company target, or topic focus.',
	},
	{
		num: '02',
		title: 'Enter the Arena',
		desc: 'Timed session starts. No hints unless you ask the AI.',
	},
	{
		num: '03',
		title: 'Solve Under Pressure',
		desc: 'Code, respond verbally, or structure your answer.',
	},
	{
		num: '04',
		title: 'AI Feedback',
		desc: 'Instant multi-dimensional analysis of your response.',
	},
	{
		num: '05',
		title: 'Review & Iterate',
		desc: 'Weakness detection, gap analysis, re-attempt paths.',
	},
];

const TOPICS = [
	{ icon: '⚡', name: 'DSA', count: '200+ problems' },
	{ icon: '🏗️', name: 'System Design', count: '40 scenarios' },
	{ icon: '💬', name: 'Behavioral', count: '90+ questions' },
	{ icon: '🐛', name: 'Debugging', count: '50 sessions' },
	{ icon: '🔧', name: 'OOP / Core CS', count: '60 topics' },
	{ icon: '📄', name: 'Resume-Based', count: 'Dynamic' },
	{ icon: '🔁', name: 'Follow-Up Rounds', count: 'Adaptive' },
	{ icon: '🎙️', name: 'Communication', count: 'Under Pressure' },
	{ icon: '🧮', name: 'Math / Logic', count: '35 problems' },
	{ icon: '🌐', name: 'Networking', count: '25 topics' },
	{ icon: '🔐', name: 'Security Concepts', count: '20 topics' },
	{ icon: '🧵', name: 'Concurrency', count: '30 problems' },
];

const STATS = [
	{
		color: 'cyan',
		iconColor: 'rgba(34,211,238,0.12)',
		iconTextColor: 'var(--mi-cyan)',
		icon: CheckCircle2,
		label: 'Sessions Completed',
		value: '1,284',
		sub: 'Across all interview formats',
		trend: 'up',
		trendLabel: '+18% this week',
	},
	{
		color: 'green',
		iconColor: 'rgba(16,185,129,0.12)',
		iconTextColor: 'var(--mi-green)',
		icon: TrendingUp,
		label: 'Accuracy Trend',
		value: '76.4%',
		sub: 'Avg. correct response rate',
		trend: 'up',
		trendLabel: '+4.2% from baseline',
	},
	{
		color: 'blue',
		iconColor: 'rgba(59,130,246,0.12)',
		iconTextColor: 'var(--mi-blue)',
		icon: Clock,
		label: 'Avg. Response Time',
		value: '24 min',
		sub: 'Time-to-solution, medium problems',
		trend: 'down',
		trendLabel: '-6 min improvement',
	},
	{
		color: 'amber',
		iconColor: 'rgba(245,158,11,0.12)',
		iconTextColor: 'var(--mi-amber)',
		icon: Zap,
		label: 'Strongest Area',
		value: 'Graphs',
		sub: 'Consistent high-accuracy category',
		trend: 'neutral',
		trendLabel: 'Stable performance',
	},
	{
		color: 'red',
		iconColor: 'rgba(244,63,94,0.12)',
		iconTextColor: 'var(--mi-red)',
		icon: Target,
		label: 'Needs Improvement',
		value: 'DP',
		sub: 'Dynamic programming edge cases',
		trend: 'neutral',
		trendLabel: 'Practice recommended',
	},
	{
		color: 'violet',
		iconColor: 'rgba(139,92,246,0.12)',
		iconTextColor: 'var(--mi-violet)',
		icon: Shield,
		label: 'Interview Readiness',
		value: '83 / 100',
		sub: 'AI composite readiness score',
		trend: 'up',
		trendLabel: '+7 pts since last week',
	},
];

// ── Component ───────────────────────────────────────────────────────────────
const MockInterview = () => {
	const navigate = useNavigate();

	return (
		<div className="mi">
			{/* Background */}
			<div className="mi__bg">
				<div className="mi__grid" />
				<motion.div
					className="mi__orb mi__orb--blue"
					animate={{
						x: [-20, 30, -20],
						y: [-20, 20, -20],
						opacity: [0.18, 0.24, 0.18],
					}}
					transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
				/>
				<motion.div
					className="mi__orb mi__orb--violet"
					animate={{
						x: [30, -20, 30],
						y: [20, -20, 20],
						opacity: [0.12, 0.18, 0.12],
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 4,
					}}
				/>
				<motion.div
					className="mi__orb mi__orb--cyan"
					animate={{
						x: [-10, 20, -10],
						y: [10, -15, 10],
						opacity: [0.08, 0.13, 0.08],
					}}
					transition={{
						duration: 30,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 8,
					}}
				/>
			</div>

			<div className="mi__wrapper">
				{/* Back button */}
				<motion.button
					className="mi__back"
					onClick={() => navigate(-1)}
					{...fadeIn(0)}
					whileHover={{ x: -3 }}
				>
					<ArrowLeft size={13} />
					back
				</motion.button>

				{/* ── HERO ─────────────────────────────────────────────────────────── */}
				<section className="mi-hero">
					<div className="mi-hero__left">
						<motion.div className="mi-hero__eyebrow" {...fadeUp(0.05)}>
							<div className="mi-hero__icon-badge">
								<Brain size={16} />
							</div>
							<span className="mi-hero__label">Mock Interviews</span>
						</motion.div>

						<motion.h1 className="mi-hero__title" {...fadeUp(0.1)}>
							Interview-Ready
							<br />
							<span>From Day&nbsp;One</span>
						</motion.h1>

						<motion.p className="mi-hero__subtitle" {...fadeUp(0.15)}>
							Prepare for technical interviews with realistic scenarios and
							comprehensive feedback. Every session adapts to your gaps.
						</motion.p>

						<motion.p className="mi-hero__tagline" {...fadeUp(0.18)}>
							// AI-powered · multi-format · real-time analysis
						</motion.p>

						<motion.div className="mi-hero__pills" {...fadeUp(0.22)}>
							{['Technical', 'Behavioral', 'Video', 'Timed', 'AI Feedback'].map(
								(p) => (
									<span key={p} className="mi-hero__pill">
										<span className="dot" />
										{p}
									</span>
								),
							)}
						</motion.div>

						<motion.div className="mi-hero__ctas" {...fadeUp(0.28)}>
							<motion.button
								className="mi-btn mi-btn--primary"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Play size={15} />
								Start Mock Interview
							</motion.button>
							<motion.button
								className="mi-btn mi-btn--secondary"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Explore Formats
								<ChevronRight size={15} />
							</motion.button>
						</motion.div>
					</div>

					{/* Hero Preview Card */}
					<motion.div
						className="mi-hero__preview"
						initial={{ opacity: 0, x: 24, y: 8 }}
						animate={{ opacity: 1, x: 0, y: 0 }}
						transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
					>
						<div className="mi-hero__preview-header">
							<div className="mi-hero__preview-dots">
								<span />
								<span />
								<span />
							</div>
							<span className="mi-hero__preview-title">INTERVIEW SESSION</span>
							<span className="mi-hero__preview-badge">
								<span className="live-dot" />
								LIVE
							</span>
						</div>

						<div className="mi-hero__preview-body">
							<div className="mi-hero__preview-row">
								<div className="mi-hero__preview-chip">
									<span className="chip-label">Round</span>
									<span className="chip-value chip-value--cyan">
										Round 2 / 3
									</span>
								</div>
								<div className="mi-hero__preview-chip">
									<span className="chip-label">Timer</span>
									<span
										className="chip-value chip-value--amber"
										style={{
											fontFamily: 'JetBrains Mono, monospace',
											animation: 'timerBlink 2s ease-in-out infinite',
										}}
									>
										18:42
									</span>
								</div>
							</div>

							<div className="mi-hero__preview-question">
								<p className="q-label">Current Question</p>
								<p className="q-text">
									Design a rate limiter that supports 10k req/sec across
									distributed nodes.
								</p>
								<div className="q-tag-row">
									<span className="q-tag q-tag--blue">System Design</span>
									<span className="q-tag q-tag--violet">Hard</span>
								</div>
							</div>

							<div className="mi-hero__preview-ai">
								<Sparkles size={16} className="ai-icon" />
								<div className="ai-text">
									<p className="ai-title">AI Coach · Active</p>
									<p className="ai-status">
										Analyzing your response structure…
									</p>
								</div>
							</div>

							<div className="mi-hero__preview-row">
								<div className="mi-hero__preview-chip">
									<span className="chip-label">Confidence</span>
									<span className="chip-value chip-value--green">High</span>
								</div>
								<div className="mi-hero__preview-chip">
									<span className="chip-label">Hint Ready</span>
									<span className="chip-value chip-value--violet">1 left</span>
								</div>
							</div>

							<div className="mi-hero__preview-meter">
								{[
									{
										label: 'Technical Depth',
										val: '72%',
										fill: 72,
										color: 'linear-gradient(90deg,#22d3ee,#3b82f6)',
									},
									{
										label: 'Communication',
										val: '86%',
										fill: 86,
										color: 'linear-gradient(90deg,#8b5cf6,#3b82f6)',
									},
									{
										label: 'Problem Solving',
										val: '64%',
										fill: 64,
										color: 'linear-gradient(90deg,#10b981,#22d3ee)',
									},
								].map((m) => (
									<div key={m.label}>
										<div className="meter-row">
											<span>{m.label}</span>
											<span className="meter-val">{m.val}</span>
										</div>
										<div className="meter-bar">
											<div
												className="meter-fill"
												style={{ width: `${m.fill}%`, background: m.color }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</section>

				<hr className="mi__divider" />

				{/* ── MODE CARDS ───────────────────────────────────────────────────── */}
				<section className="mi-modes">
					<div className="mi-modes-grid">
						<div className="mi__section">
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}
							>
								<div className="mi-sh">
									<span className="mi-sh__label">Modes</span>
									<h2 className="mi-sh__title">Choose Your Interview Mode</h2>
								</div>
								<p className="mi-sh__sub">
									Six precision-engineered formats covering every dimension of a
									real technical interview.
								</p>
							</motion.div>

							<motion.div
								className="grid"
								variants={stagger}
								initial="initial"
								whileInView="animate"
								viewport={{ once: true, margin: '-60px' }}
							>
								{MODES.map((m) => {
									const Icon = m.icon;
									return (
										<motion.div
											key={m.id}
											className={`mi-card mi-card--${m.color}`}
											variants={cardVariant}
											whileHover={{ y: -3 }}
										>
											<div className="mi-card__header">
												<div
													className={`mi-card__icon mi-card__icon--${m.color}`}
												>
													<Icon size={20} strokeWidth={1.6} />
												</div>
												<span
													className={`mi-status-pill mi-status-pill--${m.status}`}
												>
													<span className="sdot" />
													{m.statusLabel}
												</span>
											</div>

											<p className="mi-card__title">{m.title}</p>
											<p className="mi-card__desc">{m.desc}</p>

											<div className="mi-card__meta">
												<span className="meta-item">
													<Clock size={11} />
													{m.duration}
												</span>
												<span className="meta-item">
													<Code2 size={11} />
													{m.format}
												</span>
												{m.ai && (
													<span className="meta-item">
														<Sparkles size={11} />
														AI
													</span>
												)}
											</div>

											<div className="mi-card__cta">
												<motion.button
													className={`mi-btn mi-btn--sm ${m.ctaVariant}`}
													whileHover={{ scale: 1.03 }}
													whileTap={{ scale: 0.97 }}
												>
													{m.cta}
													<ArrowRight size={13} />
												</motion.button>
											</div>
										</motion.div>
									);
								})}
							</motion.div>
						</div>
					</div>
				</section>

				<hr className="mi__divider" />

				{/* ── FLOW PIPELINE ────────────────────────────────────────────────── */}
				{/* <section className="mi-flow">
					<div className="mi-flow__inner">
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							style={{ marginBottom: '48px' }}
						>
							<div className="mi-sh">
								<span className="mi-sh__label">Pipeline</span>
								<h2 className="mi-sh__title">The Interview Flow</h2>
							</div>
							<p className="mi-sh__sub">
								A structured execution path from session start to performance
								insight.
							</p>
						</motion.div>

						<motion.div
							className="mi-flow__steps"
							variants={stagger}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true, margin: '-40px' }}
						>
							{FLOW_STEPS.map((s) => (
								<motion.div
									key={s.num}
									className="mi-flow__step"
									variants={cardVariant}
								>
									<div className="mi-flow__step-num">{s.num}</div>
									<div className="mi-flow__step-content">
										<p className="mi-flow__step-title">{s.title}</p>
										<p className="mi-flow__step-desc">{s.desc}</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section> */}

				<hr className="mi__divider" />

				{/* ── TOPIC CHIPS ──────────────────────────────────────────────────── */}
				{/* <section className="mi-topics">
					<div className="mi-topics__inner">
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							style={{ marginBottom: '32px' }}
						>
							<div className="mi-sh">
								<span className="mi-sh__label">Scope</span>
								<h2 className="mi-sh__title">What You Can Practice</h2>
							</div>
							<p className="mi-sh__sub">
								Twelve distinct interview domains, each with curated content and
								adaptive difficulty.
							</p>
						</motion.div>

						<motion.div
							className="mi-topics__grid"
							variants={stagger}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true, margin: '-30px' }}
						>
							{TOPICS.map((t) => (
								<motion.div
									key={t.name}
									className="mi-topic-chip"
									variants={cardVariant}
									whileHover={{ y: -2 }}
								>
									<span className="chip-icon">{t.icon}</span>
									<span className="chip-name">{t.name}</span>
									<span className="chip-count">{t.count}</span>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section> 

				<hr className="mi__divider" /> */}

				{/* ── STATS ────────────────────────────────────────────────────────── */}
				{/* <section className="mi-stats">
					<div className="mi-stats__inner">
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							style={{ marginBottom: '36px' }}
						>
							<div className="mi-sh">
								<span className="mi-sh__label">Intelligence</span>
								<h2 className="mi-sh__title">Your Interview Metrics</h2>
							</div>
							<p className="mi-sh__sub">
								Every session feeds into a persistent performance model. The
								data speaks precisely.
							</p>
						</motion.div>

						<motion.div
							className="mi-stats__grid"
							variants={stagger}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true, margin: '-40px' }}
						>
							{STATS.map((s) => {
								const StatIcon = s.icon;
								return (
									<motion.div
										key={s.label}
										className={`mi-stat-card mi-stat-card--${s.color}`}
										variants={cardVariant}
										whileHover={{ y: -2 }}
									>
										<div className="mi-stat-card__header">
											<span className="mi-stat-card__label">{s.label}</span>
											<div
												className="mi-stat-card__icon"
												style={{
													background: s.iconColor,
													color: s.iconTextColor,
												}}
											>
												<StatIcon size={14} />
											</div>
										</div>
										<p className="mi-stat-card__value">{s.value}</p>
										<p className="mi-stat-card__sub">{s.sub}</p>
										<span
											className={`mi-stat-card__trend mi-stat-card__trend--${s.trend}`}
										>
											{s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'}{' '}
											{s.trendLabel}
										</span>
									</motion.div>
								);
							})}
						</motion.div>
					</div>
				</section>

				<hr className="mi__divider" /> */}

				{/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
				{/* <section className="mi-cta">
					<div className="mi-cta__inner">
						<motion.div
							className="mi-cta__card"
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						>
							<p className="mi-cta__eyebrow">
								<span className="dot" />
								Ready when you are
							</p>
							<h2 className="mi-cta__title">
								Start Your Next
								<br />
								Mock Interview
							</h2>
							<p className="mi-cta__sub">
								Each session is a calibrated signal. Run enough of them and
								you'll know exactly where you stand before the real thing.
							</p>
							<div className="mi-cta__actions">
								<motion.button
									className="mi-btn mi-btn--primary"
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
								>
									<Play size={15} />
									Start Technical Round
								</motion.button>
								<motion.button
									className="mi-btn mi-btn--secondary"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<MessageSquare size={15} />
									Practice Behavioral
								</motion.button>
								<motion.button
									className="mi-btn mi-btn--ghost"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<BarChart3 size={15} />
									Review Analytics
								</motion.button>
							</div>
						</motion.div>
					</div>
				</section> */}
			</div>
		</div>
	);
};

export default MockInterview;
