import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const TAB_SPRING = {
	type: 'spring' as const,
	stiffness: 420,
	damping: 34,
	mass: 0.8,
};

const MODES = [
	{
		id: 'solo',
		icon: '◈',
		badge: 'STUDENT',
		title: 'Solo Practice',
		desc: "Solve DSA problems at your own pace. The AI detects when you're stuck before you even ask — and delivers hints in tiers so you learn, not copy.",
		features: [
			'Tiered AI hint system',
			'Test case-level feedback',
			'Personalized learning memory',
			'Progress tracking',
		],
		codeSnippet: `# AI detected: 4 failed runs on edge case
# Hint tier 1 of 3:
# "What happens when left > right?"

def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2`,
		accentColor: 'rgba(130,210,160,0.80)',
	},
	{
		id: 'pair',
		icon: '⟡',
		badge: 'COLLABORATIVE',
		title: 'Pair Programming',
		desc: 'Two engineers, one editor. Real-time presence, contribution tracking, and an AI moderator that compares your approaches and suggests how to merge them.',
		features: [
			'Live shared Monaco editor',
			'Cursor presence + typing signals',
			'AI approach debate mode',
			'Contribution analytics',
		],
		codeSnippet: `// AI Moderator comparing approaches:
// A: O(n log n) — cleaner, sortable
// B: O(n)       — faster, hash-based
// Recommendation: use B in interview

// Alex is typing...
function mergeIntervals(intervals) {
  intervals.sort((a,b) => a[0]-b[0]);`,
		accentColor: 'rgba(120,170,240,0.80)',
	},
	{
		id: 'assess',
		icon: '▣',
		badge: 'FACULTY',
		title: 'Assessment Mode',
		desc: 'Faculty create timed, structured assessments. Students code under fair constraints. Every session is transparent — not proctored, but reviewable.',
		features: [
			'Timed locked sessions',
			'Integrity timeline (not verdict)',
			'Academic progress tracking',
			'Transparent evaluation',
		],
		codeSnippet: `// Assessment session — AI hints disabled
// Time remaining: 34:12
// 2 tab switches logged (no verdict)

public class Solution {
  public int[] findMedian(
    int[] arr1, int[] arr2) {
    // your implementation here`,
		accentColor: 'rgba(210,170,100,0.80)',
	},
];

const ModesShowcase = () => {
	const [activeId, setActiveId] = useState('solo');
	const active = MODES.find((m) => m.id === activeId) ?? MODES[0]!;
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleLaunchPair = () => {
		const username =
			(user?.user_metadata?.['full_name'] as string | undefined) ??
			user?.email ??
			'User';
		navigate(`/home`, { state: { username } });
	};

	return (
		<section
			id="modes"
			style={{
				padding: '100px 32px',
				borderTop: '1px solid rgba(255,255,255,0.05)',
			}}
		>
			<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
				{/* Header */}
				<motion.div
					style={{ textAlign: 'center', marginBottom: '52px' }}
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.16 }}
					transition={{ duration: 0.65, ease: EASE }}
				>
					<div
						style={{
							fontFamily: 'JetBrains Mono, monospace',
							fontSize: '10px',
							color: 'rgba(255,255,255,0.20)',
							letterSpacing: '0.22em',
							marginBottom: '14px',
						}}
					>
						PLATFORM MODES
					</div>
					<h2
						style={{
							fontFamily: 'Syne, sans-serif',
							fontWeight: 800,
							fontSize: '44px',
							letterSpacing: '-0.032em',
							color: 'rgba(255,255,255,0.90)',
							margin: '0 0 16px',
							lineHeight: 1.1,
						}}
					>
						Three modes. One platform.
					</h2>
					<p
						style={{
							fontFamily: 'DM Sans, sans-serif',
							fontSize: '16px',
							color: 'rgba(255,255,255,0.36)',
							lineHeight: 1.75,
							maxWidth: '520px',
							margin: '0 auto',
						}}
					>
						Every mode is purpose-built. Practice AI helps freely. Assessment AI
						steps back. Instructor tools see everything — without judging.
					</p>
				</motion.div>

				{/* Tab bar */}
				<div
					style={{
						display: 'flex',
						gap: '8px',
						marginBottom: '24px',
						flexWrap: 'wrap',
					}}
				>
					{MODES.map((mode) => {
						const isActive = mode.id === activeId;
						return (
							<motion.button
								key={mode.id}
								onClick={() => setActiveId(mode.id)}
								style={{
									position: 'relative',
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									padding: '9px 18px',
									borderRadius: '10px',
									border: isActive
										? '1px solid rgba(255,255,255,0.14)'
										: '1px solid rgba(255,255,255,0.07)',
									background: isActive
										? 'rgba(255,255,255,0.06)'
										: 'transparent',
									color: isActive
										? 'rgba(255,255,255,0.88)'
										: 'rgba(255,255,255,0.38)',
									fontFamily: 'DM Sans, sans-serif',
									fontWeight: 600,
									fontSize: '14px',
									cursor: 'pointer',
									overflow: 'hidden',
									transition: 'color 0.2s, border-color 0.2s, background 0.2s',
								}}
								whileTap={{ scale: 0.97 }}
								transition={TAB_SPRING}
								onMouseEnter={(e) => {
									if (!isActive) {
										e.currentTarget.style.borderColor =
											'rgba(255,255,255,0.12)';
										e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
										e.currentTarget.style.color = 'rgba(255,255,255,0.62)';
									}
								}}
								onMouseLeave={(e) => {
									if (!isActive) {
										e.currentTarget.style.borderColor =
											'rgba(255,255,255,0.07)';
										e.currentTarget.style.background = 'transparent';
										e.currentTarget.style.color = 'rgba(255,255,255,0.38)';
									}
								}}
							>
								{/* Active indicator */}
								{isActive && (
									<motion.div
										layoutId="tab-highlight"
										style={{
											position: 'absolute',
											inset: 0,
											background: 'rgba(255,255,255,0.04)',
											borderRadius: '9px',
										}}
										transition={TAB_SPRING}
									/>
								)}
								<span
									style={{ position: 'relative', zIndex: 1, fontSize: '14px' }}
								>
									{mode.icon}
								</span>
								<span style={{ position: 'relative', zIndex: 1 }}>
									{mode.title}
								</span>
								<span
									style={{
										position: 'relative',
										zIndex: 1,
										fontFamily: 'JetBrains Mono, monospace',
										fontSize: '9px',
										letterSpacing: '0.12em',
										padding: '2px 7px',
										borderRadius: '10px',
										background: isActive
											? 'rgba(255,255,255,0.08)'
											: 'rgba(255,255,255,0.03)',
										color: isActive
											? 'rgba(255,255,255,0.52)'
											: 'rgba(255,255,255,0.22)',
										transition: 'background 0.2s, color 0.2s',
									}}
								>
									{mode.badge}
								</span>
							</motion.button>
						);
					})}
				</div>

				{/* Detail panel */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeId}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '40px',
							border: '1px solid rgba(255,255,255,0.08)',
							background:
								'linear-gradient(160deg, rgba(255,255,255,0.024) 0%, rgba(255,255,255,0.010) 100%)',
							borderRadius: '16px',
							padding: '40px',
						}}
						className="hp-modes-panel"
					>
						{/* Left */}
						<div>
							<div
								style={{
									fontSize: '22px',
									color: active.accentColor,
									marginBottom: '16px',
									fontFamily: 'JetBrains Mono, monospace',
								}}
							>
								{active.icon}
							</div>
							<h3
								style={{
									fontFamily: 'Syne, sans-serif',
									fontWeight: 800,
									fontSize: '32px',
									letterSpacing: '-0.028em',
									color: 'rgba(255,255,255,0.90)',
									margin: '0 0 12px',
									lineHeight: 1.1,
								}}
							>
								{active.title}
							</h3>
							<p
								style={{
									fontFamily: 'DM Sans, sans-serif',
									fontSize: '15px',
									color: 'rgba(255,255,255,0.40)',
									lineHeight: 1.8,
									marginBottom: '28px',
								}}
							>
								{active.desc}
							</p>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '11px',
								}}
							>
								{active.features.map((f, i) => (
									<div
										key={i}
										style={{
											display: 'flex',
											gap: '10px',
											alignItems: 'center',
										}}
									>
										<span
											style={{
												color: active.accentColor,
												fontSize: '9px',
												flexShrink: 0,
												opacity: 0.8,
											}}
										>
											▪
										</span>
										<span
											style={{
												fontFamily: 'JetBrains Mono, monospace',
												fontSize: '12px',
												color: 'rgba(255,255,255,0.48)',
											}}
										>
											{f}
										</span>
									</div>
								))}
							</div>

							{activeId === 'pair' && (
								<motion.button
									onClick={handleLaunchPair}
									style={{
										marginTop: '28px',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '10px',
										padding: '12px 24px',
										borderRadius: '10px',
										background: 'rgba(120,170,240,0.10)',
										border: '1px solid rgba(120,170,240,0.28)',
										color: 'rgba(120,170,240,0.90)',
										fontFamily: 'DM Sans, sans-serif',
										fontWeight: 600,
										fontSize: '14px',
										cursor: 'pointer',
										letterSpacing: '-0.01em',
										transition:
											'background 0.2s, border-color 0.2s, color 0.2s',
									}}
									whileHover={{ y: -2 }}
									whileTap={{ y: 0, scale: 0.98 }}
									transition={{ duration: 0.18, ease: 'easeOut' }}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = 'rgba(120,170,240,0.18)';
										e.currentTarget.style.borderColor =
											'rgba(120,170,240,0.45)';
										e.currentTarget.style.color = 'rgba(120,170,240,1)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = 'rgba(120,170,240,0.10)';
										e.currentTarget.style.borderColor =
											'rgba(120,170,240,0.28)';
										e.currentTarget.style.color = 'rgba(120,170,240,0.90)';
									}}
								>
									<span style={{ fontSize: '15px' }}>⟡</span>
									Launch Pair Session
									<span style={{ fontSize: '12px', opacity: 0.7 }}>→</span>
								</motion.button>
							)}
						</div>

						{/* Right - code preview */}
						<div
							style={{
								background: '#0c1018',
								border: '1px solid rgba(255,255,255,0.08)',
								borderRadius: '12px',
								overflow: 'hidden',
								position: 'relative',
							}}
							className="hp-code-preview"
						>
							<div
								style={{
									background: 'rgba(255,255,255,0.025)',
									borderBottom: '1px solid rgba(255,255,255,0.07)',
									padding: '10px 16px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<div style={{ display: 'flex', gap: '5px' }}>
									{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
										<div
											key={c}
											style={{
												width: '9px',
												height: '9px',
												borderRadius: '50%',
												background: c,
												opacity: 0.7,
											}}
										/>
									))}
								</div>
								<span
									style={{
										fontFamily: 'JetBrains Mono, monospace',
										fontSize: '10px',
										color: 'rgba(255,255,255,0.22)',
										letterSpacing: '0.08em',
									}}
								>
									PREVIEW · {active.id.toUpperCase()}
								</span>
							</div>
							<pre
								style={{
									padding: '24px',
									margin: 0,
									fontFamily: 'JetBrains Mono, monospace',
									fontSize: '12px',
									lineHeight: 1.85,
									color: 'rgba(255,255,255,0.48)',
									whiteSpace: 'pre-wrap',
									wordBreak: 'break-word',
								}}
							>
								<span style={{ color: active.accentColor }}>
									{active.codeSnippet.split('\n').slice(0, 3).join('\n')}
								</span>
								{'\n'}
								<span style={{ color: 'rgba(255,255,255,0.55)' }}>
									{active.codeSnippet.split('\n').slice(4).join('\n')}
								</span>
							</pre>
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									right: 0,
									height: '48px',
									background: 'linear-gradient(transparent, #0c1018)',
									pointerEvents: 'none',
								}}
							/>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>
			<style>{`
        @media (max-width: 768px) { .hp-modes-panel { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .hp-code-preview { display: none !important; } }
      `}</style>
		</section>
	);
};

export default ModesShowcase;
