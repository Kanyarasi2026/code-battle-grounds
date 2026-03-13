import { Mic, MicOff, RotateCcw, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AudioInterview.scss';
import type { InterviewConfig } from './interviewService';
import { useInterview, type InterviewState } from './useInterview';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SetupFormState {
	role: string;
	experienceLevel: InterviewConfig['experienceLevel'];
	interviewType: InterviewConfig['interviewType'];
}

const JOB_ROLES = [
	'Software Engineer',
	'Frontend Engineer',
	'Backend Engineer',
	'Full Stack Engineer',
	'Data Engineer',
	'Machine Learning Engineer',
	'DevOps Engineer',
	'Product Manager',
	'Engineering Manager',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(date: Date): string {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({
	onStart,
	isLoading,
	error,
}: {
	onStart: (config: InterviewConfig) => void;
	isLoading: boolean;
	error: string | null;
}) {
	const [form, setForm] = useState<SetupFormState>({
		role: 'Software Engineer',
		experienceLevel: 'Mid',
		interviewType: 'Technical',
	});

	return (
		<div className="video-interview__setup">
			<div className="video-interview__setup-card">
				<div className="video-interview__setup-header">
					<div className="video-interview__setup-icon">
						<Mic size={24} />
					</div>
					<h1 className="video-interview__setup-title">Mock Interview</h1>
					<p className="video-interview__setup-sub">
						Practice with voice-based interview simulation. Choose your setup
						below to get started.
					</p>
				</div>

				<div className="video-interview__form-group">
					<label htmlFor="vi-role">Job Role</label>
					<select
						id="vi-role"
						className="video-interview__select"
						value={form.role}
						onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
					>
						{JOB_ROLES.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</div>

				<div className="video-interview__form-group">
					<label>Experience Level</label>
					<div className="video-interview__segment">
						{(['Junior', 'Mid', 'Senior'] as const).map((lvl) => (
							<button
								key={lvl}
								type="button"
								className={[
									'video-interview__segment-btn',
									form.experienceLevel === lvl
										? 'video-interview__segment-btn--active'
										: '',
								]
									.filter(Boolean)
									.join(' ')}
								onClick={() => setForm((f) => ({ ...f, experienceLevel: lvl }))}
							>
								{lvl}
							</button>
						))}
					</div>
				</div>

				<div className="video-interview__form-group">
					<label>Interview Type</label>
					<div className="video-interview__segment">
						{(['Technical', 'Behavioral', 'Mixed'] as const).map((type) => (
							<button
								key={type}
								type="button"
								className={[
									'video-interview__segment-btn',
									form.interviewType === type
										? 'video-interview__segment-btn--active'
										: '',
								]
									.filter(Boolean)
									.join(' ')}
								onClick={() => setForm((f) => ({ ...f, interviewType: type }))}
							>
								{type}
							</button>
						))}
					</div>
				</div>

				{error && <div className="video-interview__error">⚠ {error}</div>}

				<button
					type="button"
					className="video-interview__start-btn"
					onClick={() =>
						onStart({
							role: form.role,
							experienceLevel: form.experienceLevel,
							interviewType: form.interviewType,
						})
					}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<div
								className="video-interview__spinner"
								style={{ width: 18, height: 18, borderWidth: 2 }}
							/>
							Generating questions…
						</>
					) : (
						<>
							<Mic size={16} />
							Start Interview
						</>
					)}
				</button>
			</div>
		</div>
	);
}

// ── Loading Screen ─────────────────────────────────────────────────────────────
function LoadingScreen() {
	return (
		<div className="video-interview__loading">
			<div className="video-interview__spinner" />
			<p className="video-interview__loading-text">
				Generating your interview questions…
			</p>
		</div>
	);
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AudioInterview() {
	const navigate = useNavigate();
	const {
		state,
		questions,
		currentIndex,
		transcript,
		evaluation,
		isSpeaking,
		isRecording,
		error,
		startInterview,
		startRecording,
		stopRecording,
		resetInterview,
	} = useInterview();

	const transcriptEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll transcript on new entries
	useEffect(() => {
		transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [transcript]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			resetInterview();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const ACTIVE_STATES: InterviewState[] = [
		'active',
		'speaking',
		'recording',
		'processing',
	];
	const isActive = ACTIVE_STATES.includes(state);
	const canRecord = state === 'active' && !isSpeaking && !isRecording;
	const totalQuestions = questions.length || 5;
	const progress =
		questions.length > 0 ? Math.min(currentIndex / totalQuestions, 1) : 0;
	const currentQuestion =
		questions.length > 0
			? questions[Math.min(currentIndex, questions.length - 1)]
			: '';

	// ── Setup screen ───────────────────────────────────────────────────────────
	if (state === 'setup') {
		return (
			<div className="video-interview">
				<SetupScreen onStart={startInterview} isLoading={false} error={error} />
			</div>
		);
	}

	// ── Loading screen ─────────────────────────────────────────────────────────
	if (state === 'loading') {
		return (
			<div className="video-interview">
				<LoadingScreen />
			</div>
		);
	}

	// ── Results screen ─────────────────────────────────────────────────────────
	if (state === 'results') {
		return (
			<div className="video-interview">
				<div className="video-interview__results">
					<div className="video-interview__results-header">
						<span className="video-interview__results-icon">🎉</span>
						<h1 className="video-interview__results-title">
							Interview Complete
						</h1>
						<p className="video-interview__results-sub">
							Here's how you performed across {questions.length} questions.
						</p>
					</div>

					{evaluation ? (
						<>
							<div className="video-interview__score-card">
								<div className="video-interview__score-value">
									{evaluation.overallScore}
								</div>
								<p className="video-interview__score-label">
									Overall Score / 100
								</p>
							</div>

							{evaluation.feedback.length > 0 && (
								<>
									<h2 className="video-interview__section-title">
										📋 Feedback by Question
									</h2>
									<div className="video-interview__feedback-list">
										{evaluation.feedback.map((item, i) => (
											<div key={i} className="video-interview__feedback-item">
												<p className="video-interview__feedback-q">
													Q{i + 1}: {item.question}
												</p>
												{item.answer && (
													<p className="video-interview__feedback-a">
														Your answer: {item.answer}
													</p>
												)}
												<div className="video-interview__feedback-score">
													Score: {item.score}/100
												</div>
												<p className="video-interview__feedback-comment">
													{item.comment}
												</p>
											</div>
										))}
									</div>
								</>
							)}

							<div className="video-interview__strengths-grid">
								<div className="video-interview__strengths-card">
									<p className="video-interview__strengths-title video-interview__strengths-title--green">
										✓ Strengths
									</p>
									<ul className="video-interview__strengths-list">
										{evaluation.strengths.map((s, i) => (
											<li key={i}>{s}</li>
										))}
									</ul>
								</div>
								<div className="video-interview__strengths-card">
									<p className="video-interview__strengths-title video-interview__strengths-title--amber">
										↗ Areas to Improve
									</p>
									<ul className="video-interview__strengths-list">
										{evaluation.improvements.map((s, i) => (
											<li key={i}>{s}</li>
										))}
									</ul>
								</div>
							</div>
						</>
					) : (
						<div className="video-interview__score-card">
							<p style={{ color: '#94a3b8', margin: 0 }}>
								Evaluation could not be generated. Your transcript is saved
								above.
							</p>
						</div>
					)}

					<div className="video-interview__results-actions">
						<button
							type="button"
							className="video-interview__restart-btn"
							onClick={resetInterview}
						>
							<RotateCcw size={16} />
							Try Another Interview
						</button>
						<button
							type="button"
							className="video-interview__skip-btn"
							onClick={() => navigate('/interview-dashboard')}
							style={{ padding: '14px 24px' }}
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</div>
		);
	}

	// ── Active interview screen ────────────────────────────────────────────────
	if (!isActive) return null;

	return (
		<div className="video-interview">
			{/* ── Header ───────────────────────────────────────────────────────── */}
			<header className="video-interview__header">
				<div className="video-interview__logo">
					<Mic size={16} />
					Interview
				</div>

				<div className="video-interview__progress-wrap">
					<p className="video-interview__progress-label">
						Question {Math.min(currentIndex + 1, totalQuestions)} of{' '}
						{totalQuestions}
					</p>
					<div className="video-interview__progress-bar">
						<div
							className="video-interview__progress-fill"
							style={{ width: `${progress * 100}%` }}
						/>
					</div>
				</div>

				<button
					type="button"
					className="video-interview__end-btn"
					onClick={resetInterview}
				>
					End Session
				</button>
			</header>

			{/* ── Body ─────────────────────────────────────────────────────────── */}
			<div className="video-interview__body">
				{/* Left: AI Avatar Panel */}
				<div className="video-interview__avatar-panel">
					{/* Animated avatar */}
					<div className="video-interview__avatar-wrap">
						<div
							className={[
								'video-interview__avatar-ring-2',
								isSpeaking ? 'video-interview__avatar-ring-2--speaking' : '',
							]
								.filter(Boolean)
								.join(' ')}
						/>
						<div
							className={[
								'video-interview__avatar-ring',
								isSpeaking ? 'video-interview__avatar-ring--speaking' : '',
							]
								.filter(Boolean)
								.join(' ')}
						/>
						<div
							className={[
								'video-interview__avatar',
								isSpeaking ? 'video-interview__avatar--speaking' : '',
							]
								.filter(Boolean)
								.join(' ')}
						>
							🤖
						</div>
					</div>

					<p className="video-interview__ai-label">
						<span
							className={[
								'video-interview__ai-status-dot',
								isSpeaking
									? 'video-interview__ai-status-dot--speaking'
									: 'video-interview__ai-status-dot--active',
							].join(' ')}
						/>
						Interviewer ·{' '}
						{isSpeaking
							? 'Speaking'
							: state === 'processing'
								? 'Processing…'
								: 'Listening'}
					</p>

					{/* Audio waveform bars */}
					<div className="video-interview__waveform">
						{Array.from({ length: 7 }).map((_, i) => (
							<div
								key={i}
								className={[
									'video-interview__wave-bar',
									isSpeaking
										? 'video-interview__wave-bar--active'
										: 'video-interview__wave-bar--inactive',
								].join(' ')}
							/>
						))}
					</div>

					{/* Current question */}
					{currentQuestion && (
						<div className="video-interview__question-display">
							<p className="video-interview__question-label">
								Current Question
							</p>
							<p className="video-interview__question-text">
								{currentQuestion}
							</p>
						</div>
					)}

					{/* Mic controls */}
					<div className="video-interview__controls">
						<div className="video-interview__mic-wrap">
							<button
								type="button"
								className={[
									'video-interview__mic-btn',
									isRecording ? 'video-interview__mic-btn--recording' : '',
								]
									.filter(Boolean)
									.join(' ')}
								onMouseDown={() => {
									if (canRecord) void startRecording();
								}}
								onMouseUp={() => {
									if (isRecording) void stopRecording();
								}}
								onTouchStart={() => {
									if (canRecord) void startRecording();
								}}
								onTouchEnd={() => {
									if (isRecording) void stopRecording();
								}}
								disabled={!canRecord && !isRecording}
								aria-label={
									isRecording
										? 'Release to submit answer'
										: 'Hold to record answer'
								}
							>
								{isRecording ? <MicOff size={28} /> : <Mic size={28} />}
							</button>
							<span className="video-interview__mic-label">
								{isRecording
									? 'Release to submit'
									: canRecord
										? 'Hold to answer'
										: '…'}
							</span>
						</div>

						<button
							type="button"
							className="video-interview__skip-btn"
							onClick={() => {
								if (isRecording) void stopRecording();
							}}
							disabled={!isRecording}
						>
							<SkipForward size={14} />
							Skip
						</button>
					</div>

					{error && (
						<div className="video-interview__error" style={{ marginTop: 0 }}>
							⚠ {error}
						</div>
					)}
				</div>

				{/* Right: Transcript Panel */}
				<div className="video-interview__transcript-panel">
					<div className="video-interview__transcript-header">Transcript</div>

					<div className="video-interview__transcript-scroll">
						{transcript.length === 0 ? (
							<p className="video-interview__transcript-empty">
								Conversation will appear here…
							</p>
						) : (
							transcript.map((entry, i) => (
								<div
									key={i}
									className={`video-interview__message video-interview__message--${entry.role}`}
								>
									<div className="video-interview__message-meta">
										<span className="video-interview__message-role">
											{entry.role === 'interviewer' ? 'Interviewer' : 'You'}
										</span>
										<span className="video-interview__message-time">
											{formatTime(entry.timestamp)}
										</span>
									</div>
									<div className="video-interview__message-bubble">
										{entry.text}
									</div>
								</div>
							))
						)}
						<div ref={transcriptEndRef} />
					</div>

					{state === 'processing' && (
						<div className="video-interview__processing-indicator">
							<span className="video-interview__processing-dot" />
							Transcribing your answer…
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
