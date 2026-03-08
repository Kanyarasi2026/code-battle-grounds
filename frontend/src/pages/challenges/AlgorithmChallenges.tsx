import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Play, Trophy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	easyProblems,
	hardProblems,
	mediumProblems,
	type DSAProblem,
} from '../../data/dsaProblems';
import './AlgorithmChallenges.scss';

type Difficulty = 'easy' | 'medium' | 'hard';

const STORAGE_KEY = 'cbg_completed_challenges';

const DIFFICULTY_CONFIG: Record<
	Difficulty,
	{ label: string; color: string; accent: string; problems: DSAProblem[] }
> = {
	easy: {
		label: 'Easy',
		color: '#22c55e',
		accent: '#16a34a',
		problems: easyProblems,
	},
	medium: {
		label: 'Medium',
		color: '#f59e0b',
		accent: '#d97706',
		problems: mediumProblems,
	},
	hard: {
		label: 'Hard',
		color: '#ef4444',
		accent: '#dc2626',
		problems: hardProblems,
	},
};

function getCompleted(): Set<string> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		return new Set<string>(JSON.parse(raw) as string[]);
	} catch {
		return new Set();
	}
}

export default function AlgorithmChallenges() {
	const navigate = useNavigate();
	const [active, setActive] = useState<Difficulty>('easy');
	const [completed, setCompleted] = useState<Set<string>>(getCompleted);

	useEffect(() => {
		const handler = () => setCompleted(getCompleted());
		window.addEventListener('storage', handler);
		return () => window.removeEventListener('storage', handler);
	}, []);

	const config = DIFFICULTY_CONFIG[active];

	const getStatus = useCallback(
		(
			problem: DSAProblem,
			index: number,
		): 'completed' | 'unlocked' | 'locked' => {
			if (completed.has(problem.slug)) return 'completed';
			if (index === 0) return 'unlocked';
			const prev = config.problems[index - 1];
			if (prev && completed.has(prev.slug)) return 'unlocked';
			return 'locked';
		},
		[completed, config.problems],
	);

	const completedCount = config.problems.filter((p) =>
		completed.has(p.slug),
	).length;

	return (
		<div className="algo-challenges">
			{/* Header */}
			<header className="algo-challenges__header">
				<div className="algo-challenges__title-group">
					<Trophy size={28} className="algo-challenges__trophy" />
					<h1 className="algo-challenges__title">Algorithm Challenges</h1>
				</div>

				<div className="algo-challenges__progress-pill">
					<CheckCircle2 size={14} />
					<span>
						{completed.size} /{' '}
						{easyProblems.length + mediumProblems.length + hardProblems.length}{' '}
						solved
					</span>
				</div>
			</header>

			{/* Tabs */}
			<div className="algo-challenges__tabs">
				{(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => {
					const dc = DIFFICULTY_CONFIG[diff];
					const done = dc.problems.filter((p) => completed.has(p.slug)).length;
					return (
						<button
							key={diff}
							className={`algo-challenges__tab ${active === diff ? 'algo-challenges__tab--active' : ''}`}
							onClick={() => setActive(diff)}
							style={
								active === diff
									? { borderColor: dc.color, color: dc.color }
									: {}
							}
						>
							<span
								className="algo-challenges__tab-dot"
								style={{ background: dc.color }}
							/>
							{dc.label}
							<span className="algo-challenges__tab-count">
								{done}/{dc.problems.length}
							</span>
						</button>
					);
				})}
			</div>

			{/* Progress bar */}
			<div className="algo-challenges__bar-wrap">
				<div
					className="algo-challenges__bar-fill"
					style={{
						width: `${config.problems.length ? (completedCount / config.problems.length) * 100 : 0}%`,
						background: config.color,
					}}
				/>
			</div>

			{/* Level grid */}
			<div className="algo-challenges__grid">
				{config.problems.map((problem, idx) => {
					const status = getStatus(problem, idx);
					return (
						<motion.button
							key={problem.slug}
							className={`level-card level-card--${status}`}
							onClick={() =>
								status !== 'locked' && navigate(`/practice/${problem.slug}`)
							}
							disabled={status === 'locked'}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25, delay: idx * 0.02 }}
							whileHover={status !== 'locked' ? { scale: 1.03 } : {}}
							whileTap={status !== 'locked' ? { scale: 0.97 } : {}}
						>
							{/* Level badge */}
							<div
								className="level-card__badge"
								style={status !== 'locked' ? { background: config.color } : {}}
							>
								{status === 'completed' ? (
									<CheckCircle2 size={14} />
								) : status === 'locked' ? (
									<Lock size={12} />
								) : (
									<Play size={12} />
								)}
								<span>Level {idx + 1}</span>
							</div>

							{/* Content */}
							<div className="level-card__body">
								<p className="level-card__topic">
									{problem.topic.replace(/-/g, ' ')}
								</p>
								<h3 className="level-card__name">{problem.title}</h3>
							</div>

							{/* Status glow */}
							{status === 'completed' && (
								<div
									className="level-card__glow"
									style={{ background: config.color }}
								/>
							)}
						</motion.button>
					);
				})}
			</div>
		</div>
	);
}
