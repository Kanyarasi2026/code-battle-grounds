import { AnimatePresence, motion } from 'framer-motion';
import {
	ArrowLeft,
	BookOpen,
	Brain,
	CheckCircle2,
	ChevronRight,
	Clock,
	Code2,
	GitBranch,
	Layers,
	Lightbulb,
	Network,
	Search,
	SortDesc,
	Sparkles,
	Target,
	Volume2,
	VolumeX,
	X,
} from 'lucide-react';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import './CuratedPracticePage.scss';

// ===================== TYPES =====================

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Problem {
	id: string;
	title: string;
	difficulty: Difficulty;
	topic: string;
	timeEstimate: number;
	description: string;
}

interface PracticeSet {
	id: string;
	title: string;
	description: string;
	icon: ReactNode;
	category: string;
	accent: string;
	borderGlow: string;
	problems: Problem[];
}

// ===================== DATA =====================

const PRACTICE_SETS: PracticeSet[] = [
	{
		id: 'blind-75',
		title: 'Blind 75',
		description:
			'The definitive 75 must-solve problems curated for top-tier technical interviews',
		icon: <Target size={20} />,
		category: 'Interview Prep',
		accent: '#22c55e',
		borderGlow: 'rgba(34,197,94,0.2)',
		problems: [
			{
				id: 'b1',
				title: 'Two Sum',
				difficulty: 'Easy',
				topic: 'Arrays',
				timeEstimate: 15,
				description: 'Find two indices in array that add to target sum',
			},
			{
				id: 'b2',
				title: 'Best Time to Buy and Sell Stock',
				difficulty: 'Easy',
				topic: 'Arrays',
				timeEstimate: 15,
				description: 'Maximize profit from a single buy/sell transaction',
			},
			{
				id: 'b3',
				title: 'Contains Duplicate',
				difficulty: 'Easy',
				topic: 'Arrays',
				timeEstimate: 10,
				description: 'Check if any value appears at least twice in array',
			},
			{
				id: 'b4',
				title: 'Product of Array Except Self',
				difficulty: 'Medium',
				topic: 'Arrays',
				timeEstimate: 25,
				description:
					'Return product of all elements except itself without division',
			},
			{
				id: 'b5',
				title: 'Maximum Subarray',
				difficulty: 'Medium',
				topic: 'Arrays',
				timeEstimate: 20,
				description:
					"Find contiguous subarray with largest sum using Kadane's algorithm",
			},
			{
				id: 'b6',
				title: '3Sum',
				difficulty: 'Medium',
				topic: 'Two Pointers',
				timeEstimate: 30,
				description: 'Find all unique triplets that sum to zero',
			},
			{
				id: 'b7',
				title: 'Container With Most Water',
				difficulty: 'Medium',
				topic: 'Two Pointers',
				timeEstimate: 20,
				description:
					'Maximize water between two vertical lines using two pointers',
			},
			{
				id: 'b8',
				title: 'Climbing Stairs',
				difficulty: 'Easy',
				topic: 'DP',
				timeEstimate: 15,
				description: 'Count distinct ways to climb n stairs (Fibonacci DP)',
			},
			{
				id: 'b9',
				title: 'House Robber',
				difficulty: 'Medium',
				topic: 'DP',
				timeEstimate: 20,
				description: 'Max money robbed without hitting adjacent houses',
			},
			{
				id: 'b10',
				title: 'Longest Common Subsequence',
				difficulty: 'Medium',
				topic: 'DP',
				timeEstimate: 30,
				description: 'Length of longest subsequence common to both strings',
			},
			{
				id: 'b11',
				title: 'Word Break',
				difficulty: 'Medium',
				topic: 'DP',
				timeEstimate: 30,
				description: 'Check if string can be segmented using dictionary words',
			},
			{
				id: 'b12',
				title: 'Number of Islands',
				difficulty: 'Medium',
				topic: 'Graphs',
				timeEstimate: 25,
				description:
					'Count connected land components in a 2D grid using DFS/BFS',
			},
			{
				id: 'b13',
				title: 'Clone Graph',
				difficulty: 'Medium',
				topic: 'Graphs',
				timeEstimate: 30,
				description: 'Deep clone an undirected connected graph',
			},
			{
				id: 'b14',
				title: 'Invert Binary Tree',
				difficulty: 'Easy',
				topic: 'Trees',
				timeEstimate: 10,
				description: 'Mirror a binary tree by swapping children recursively',
			},
			{
				id: 'b15',
				title: 'Validate Binary Search Tree',
				difficulty: 'Medium',
				topic: 'Trees',
				timeEstimate: 20,
				description: 'Check BST property with min/max bounds propagation',
			},
			{
				id: 'b16',
				title: 'Binary Tree Maximum Path Sum',
				difficulty: 'Hard',
				topic: 'Trees',
				timeEstimate: 40,
				description: 'Max path sum between any two nodes in binary tree',
			},
			{
				id: 'b17',
				title: 'Top K Frequent Elements',
				difficulty: 'Medium',
				topic: 'Heap',
				timeEstimate: 20,
				description: 'Return k most frequent elements using a min-heap',
			},
			{
				id: 'b18',
				title: 'Merge K Sorted Lists',
				difficulty: 'Hard',
				topic: 'Heap',
				timeEstimate: 40,
				description: 'Merge k sorted linked lists using priority queue',
			},
			{
				id: 'b19',
				title: 'Search in Rotated Sorted Array',
				difficulty: 'Medium',
				topic: 'Binary Search',
				timeEstimate: 25,
				description: 'Binary search on an array rotated at unknown pivot',
			},
			{
				id: 'b20',
				title: 'Median of Two Sorted Arrays',
				difficulty: 'Hard',
				topic: 'Binary Search',
				timeEstimate: 50,
				description:
					'Find median in O(log(m+n)) using binary search on partition',
			},
		],
	},
	{
		id: 'dp-patterns',
		title: 'DP Patterns',
		description:
			'Master 12 core dynamic programming patterns from 1D to interval DP',
		icon: <Brain size={20} />,
		category: 'Algorithms',
		accent: '#a855f7',
		borderGlow: 'rgba(168,85,247,0.2)',
		problems: [
			{
				id: 'dp1',
				title: 'Fibonacci Number',
				difficulty: 'Easy',
				topic: '1D DP',
				timeEstimate: 10,
				description: 'Classic memoization and tabulation introduction',
			},
			{
				id: 'dp2',
				title: 'Coin Change',
				difficulty: 'Medium',
				topic: '1D DP',
				timeEstimate: 25,
				description: 'Min coins to reach amount — unbounded knapsack variant',
			},
			{
				id: 'dp3',
				title: 'Longest Increasing Subsequence',
				difficulty: 'Medium',
				topic: '1D DP',
				timeEstimate: 25,
				description:
					'Find LIS length with DP or patience sorting in O(n log n)',
			},
			{
				id: 'dp4',
				title: 'Partition Equal Subset Sum',
				difficulty: 'Medium',
				topic: '0/1 Knapsack',
				timeEstimate: 30,
				description: 'Can array be split into two equal-sum subsets',
			},
			{
				id: 'dp5',
				title: 'Target Sum',
				difficulty: 'Medium',
				topic: '0/1 Knapsack',
				timeEstimate: 25,
				description: 'Count ways to assign +/- signs to reach target value',
			},
			{
				id: 'dp6',
				title: 'Edit Distance',
				difficulty: 'Hard',
				topic: '2D DP',
				timeEstimate: 40,
				description:
					'Min operations (insert/delete/replace) to transform one string to another',
			},
			{
				id: 'dp7',
				title: 'Longest Common Subsequence',
				difficulty: 'Medium',
				topic: '2D DP',
				timeEstimate: 30,
				description: 'Classic 2D DP on two string sequences',
			},
			{
				id: 'dp8',
				title: 'Unique Paths',
				difficulty: 'Medium',
				topic: 'Grid DP',
				timeEstimate: 20,
				description: 'Count robot paths in grid from top-left to bottom-right',
			},
			{
				id: 'dp9',
				title: 'Minimum Path Sum',
				difficulty: 'Medium',
				topic: 'Grid DP',
				timeEstimate: 20,
				description: 'Min cost path through grid using DP table',
			},
			{
				id: 'dp10',
				title: 'Burst Balloons',
				difficulty: 'Hard',
				topic: 'Interval DP',
				timeEstimate: 50,
				description: 'Max coins from bursting balloons — choose order wisely',
			},
			{
				id: 'dp11',
				title: 'Regular Expression Matching',
				difficulty: 'Hard',
				topic: 'String DP',
				timeEstimate: 45,
				description: 'Implement regex matching with . and * using 2D DP',
			},
			{
				id: 'dp12',
				title: 'Palindrome Partitioning',
				difficulty: 'Hard',
				topic: 'Interval DP',
				timeEstimate: 45,
				description: 'Min cuts to partition string into palindromes',
			},
		],
	},
	{
		id: 'graph-mastery',
		title: 'Graph Mastery',
		description:
			'Complete graph algorithm coverage from BFS/DFS to Dijkstra and MST',
		icon: <Network size={20} />,
		category: 'Algorithms',
		accent: '#60a5fa',
		borderGlow: 'rgba(96,165,250,0.2)',
		problems: [
			{
				id: 'g1',
				title: 'Number of Islands',
				difficulty: 'Medium',
				topic: 'BFS/DFS',
				timeEstimate: 25,
				description: 'Count connected land components in 2D grid',
			},
			{
				id: 'g2',
				title: 'Rotting Oranges',
				difficulty: 'Medium',
				topic: 'Multi-Source BFS',
				timeEstimate: 25,
				description: 'Spread rot to all oranges — multi-source BFS problem',
			},
			{
				id: 'g3',
				title: 'Course Schedule',
				difficulty: 'Medium',
				topic: 'Topological Sort',
				timeEstimate: 30,
				description:
					'Detect cycle in directed graph to determine course feasibility',
			},
			{
				id: 'g4',
				title: 'Pacific Atlantic Water Flow',
				difficulty: 'Medium',
				topic: 'DFS/BFS',
				timeEstimate: 35,
				description:
					'Find cells that can flow to both Pacific and Atlantic oceans',
			},
			{
				id: 'g5',
				title: 'Network Delay Time',
				difficulty: 'Medium',
				topic: 'Dijkstra',
				timeEstimate: 30,
				description: "Shortest paths from source using Dijkstra's algorithm",
			},
			{
				id: 'g6',
				title: 'Min Cost to Connect Points',
				difficulty: 'Medium',
				topic: 'MST (Prim/Kruskal)',
				timeEstimate: 35,
				description: 'Find Minimum Spanning Tree using Prim or Kruskal',
			},
			{
				id: 'g7',
				title: 'Word Ladder',
				difficulty: 'Hard',
				topic: 'BFS',
				timeEstimate: 45,
				description: 'Shortest word transformation sequence using BFS',
			},
			{
				id: 'g8',
				title: 'Alien Dictionary',
				difficulty: 'Hard',
				topic: 'Topological Sort',
				timeEstimate: 45,
				description: 'Derive character ordering from alien sorted word list',
			},
			{
				id: 'g9',
				title: 'Longest Consecutive Sequence',
				difficulty: 'Medium',
				topic: 'Union Find',
				timeEstimate: 25,
				description: 'Find longest consecutive number sequence in O(n)',
			},
			{
				id: 'g10',
				title: 'Critical Connections (Bridges)',
				difficulty: 'Hard',
				topic: 'Tarjan',
				timeEstimate: 50,
				description: "Find bridge edges in undirected graph using Tarjan's",
			},
		],
	},
	{
		id: 'sliding-window',
		title: 'Sliding Window',
		description:
			'Two pointer and sliding window patterns for optimized array/string problems',
		icon: <Layers size={20} />,
		category: 'Patterns',
		accent: '#fb923c',
		borderGlow: 'rgba(251,146,60,0.2)',
		problems: [
			{
				id: 'sw1',
				title: 'Longest Substring Without Repeating Characters',
				difficulty: 'Medium',
				topic: 'Sliding Window',
				timeEstimate: 20,
				description:
					'Expand window while tracking unique characters in a set/map',
			},
			{
				id: 'sw2',
				title: 'Minimum Window Substring',
				difficulty: 'Hard',
				topic: 'Sliding Window',
				timeEstimate: 40,
				description: 'Smallest window containing all characters of T',
			},
			{
				id: 'sw3',
				title: 'Sliding Window Maximum',
				difficulty: 'Hard',
				topic: 'Monotonic Deque',
				timeEstimate: 35,
				description: 'Max in each window of size k using monotonic deque',
			},
			{
				id: 'sw4',
				title: 'Permutation in String',
				difficulty: 'Medium',
				topic: 'Sliding Window',
				timeEstimate: 25,
				description: 'Check if any permutation of s1 exists as substring in s2',
			},
			{
				id: 'sw5',
				title: 'Longest Repeating Character Replacement',
				difficulty: 'Medium',
				topic: 'Sliding Window',
				timeEstimate: 25,
				description: 'Max window with at most k character replacements',
			},
			{
				id: 'sw6',
				title: 'Trapping Rain Water',
				difficulty: 'Hard',
				topic: 'Two Pointers',
				timeEstimate: 30,
				description:
					'Compute trapped water using two-pointer or stack approach',
			},
			{
				id: 'sw7',
				title: 'Two Sum II - Sorted Array',
				difficulty: 'Medium',
				topic: 'Two Pointers',
				timeEstimate: 15,
				description:
					'Two pointers on sorted array to find pair summing to target',
			},
			{
				id: 'sw8',
				title: 'Fruits Into Baskets',
				difficulty: 'Medium',
				topic: 'Sliding Window',
				timeEstimate: 20,
				description: 'Max fruits collecting at most 2 types — variable window',
			},
		],
	},
	{
		id: 'binary-search',
		title: 'Binary Search',
		description:
			'From classic to advanced — binary search on answer space and rotated arrays',
		icon: <Search size={20} />,
		category: 'Patterns',
		accent: '#34d399',
		borderGlow: 'rgba(52,211,153,0.2)',
		problems: [
			{
				id: 'bs1',
				title: 'Binary Search',
				difficulty: 'Easy',
				topic: 'Classic',
				timeEstimate: 10,
				description: 'Basic binary search on sorted array',
			},
			{
				id: 'bs2',
				title: 'Search in Rotated Sorted Array',
				difficulty: 'Medium',
				topic: 'Modified BS',
				timeEstimate: 25,
				description: 'Handle pivot by checking which half is sorted',
			},
			{
				id: 'bs3',
				title: 'Find Minimum in Rotated Sorted Array',
				difficulty: 'Medium',
				topic: 'Modified BS',
				timeEstimate: 20,
				description: 'Find the inflection point in rotated array',
			},
			{
				id: 'bs4',
				title: 'Koko Eating Bananas',
				difficulty: 'Medium',
				topic: 'BS on Answer',
				timeEstimate: 25,
				description: 'Binary search on eating speed — monotonic predicate',
			},
			{
				id: 'bs5',
				title: 'Capacity To Ship Packages Within D Days',
				difficulty: 'Medium',
				topic: 'BS on Answer',
				timeEstimate: 25,
				description: 'Binary search on minimum capacity feasibility',
			},
			{
				id: 'bs6',
				title: 'Split Array Largest Sum',
				difficulty: 'Hard',
				topic: 'BS on Answer',
				timeEstimate: 40,
				description: 'Minimize max sum when splitting array into k parts',
			},
			{
				id: 'bs7',
				title: 'Median of Two Sorted Arrays',
				difficulty: 'Hard',
				topic: 'Binary Search',
				timeEstimate: 50,
				description:
					'Partition-based binary search to find median in O(log(min(m,n)))',
			},
		],
	},
	{
		id: 'trees-bst',
		title: 'Trees & BST',
		description:
			'Binary trees, BSTs, traversals and tree construction problems',
		icon: <GitBranch size={20} />,
		category: 'Data Structures',
		accent: '#f59e0b',
		borderGlow: 'rgba(245,158,11,0.2)',
		problems: [
			{
				id: 't1',
				title: 'Invert Binary Tree',
				difficulty: 'Easy',
				topic: 'DFS',
				timeEstimate: 10,
				description: 'Swap left and right subtrees recursively',
			},
			{
				id: 't2',
				title: 'Maximum Depth of Binary Tree',
				difficulty: 'Easy',
				topic: 'DFS',
				timeEstimate: 10,
				description: 'Recursive max depth via post-order traversal',
			},
			{
				id: 't3',
				title: 'Level Order Traversal',
				difficulty: 'Medium',
				topic: 'BFS',
				timeEstimate: 20,
				description: 'BFS with queue to traverse level by level',
			},
			{
				id: 't4',
				title: 'Validate Binary Search Tree',
				difficulty: 'Medium',
				topic: 'DFS',
				timeEstimate: 20,
				description: 'Propagate min/max bounds through recursive calls',
			},
			{
				id: 't5',
				title: 'Lowest Common Ancestor of BST',
				difficulty: 'Medium',
				topic: 'DFS',
				timeEstimate: 20,
				description:
					'Split traversal when target nodes are in different subtrees',
			},
			{
				id: 't6',
				title: 'Binary Tree Right Side View',
				difficulty: 'Medium',
				topic: 'BFS',
				timeEstimate: 20,
				description: 'Record last node at each level from BFS traversal',
			},
			{
				id: 't7',
				title: 'Count Good Nodes in Binary Tree',
				difficulty: 'Medium',
				topic: 'DFS',
				timeEstimate: 20,
				description: 'Pass max value seen on path from root, count valid nodes',
			},
			{
				id: 't8',
				title: 'Kth Smallest Element in BST',
				difficulty: 'Medium',
				topic: 'In-order',
				timeEstimate: 15,
				description: 'In-order traversal produces sorted BST elements',
			},
			{
				id: 't9',
				title: 'Construct Binary Tree from Preorder and Inorder',
				difficulty: 'Medium',
				topic: 'Recursion',
				timeEstimate: 30,
				description: 'Use preorder root to split inorder traversal recursively',
			},
			{
				id: 't10',
				title: 'Binary Tree Maximum Path Sum',
				difficulty: 'Hard',
				topic: 'DFS',
				timeEstimate: 40,
				description: 'Track local and global max through post-order DFS',
			},
			{
				id: 't11',
				title: 'Serialize and Deserialize Binary Tree',
				difficulty: 'Hard',
				topic: 'BFS/DFS',
				timeEstimate: 45,
				description:
					'Encode tree to string with null markers, reconstruct via queue',
			},
		],
	},
];

const CATEGORIES = [
	'All',
	'Interview Prep',
	'Algorithms',
	'Patterns',
	'Data Structures',
];

const STORAGE_KEY = 'cbg_curated_completed';

const DIFFICULTY_COLORS: Record<Difficulty, { text: string; bg: string }> = {
	Easy: { text: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
	Medium: { text: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
	Hard: { text: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

// ===================== HELPERS =====================

function loadCompleted(): Set<string> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw
			? new Set<string>(JSON.parse(raw) as string[])
			: new Set<string>();
	} catch {
		return new Set<string>();
	}
}

function saveCompleted(set: Set<string>) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

// ===================== SUB-COMPONENTS =====================

interface DiffBadgeProps {
	difficulty: Difficulty;
}
const DiffBadge = ({ difficulty }: DiffBadgeProps) => {
	const colors = DIFFICULTY_COLORS[difficulty];
	return (
		<span
			className="diff-badge"
			style={{
				color: colors.text,
				background: colors.bg,
				border: `1px solid ${colors.text}30`,
			}}
		>
			{difficulty}
		</span>
	);
};

interface SetCardProps {
	set: PracticeSet;
	solved: number;
	total: number;
	onClick: () => void;
}
const SetCard = ({ set, solved, total, onClick }: SetCardProps) => {
	const pct = Math.round((solved / total) * 100);
	return (
		<motion.button
			className="set-card"
			onClick={onClick}
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -2 }}
			whileTap={{ scale: 0.98 }}
			style={
				{
					'--accent': set.accent,
					'--glow': set.borderGlow,
				} as React.CSSProperties
			}
		>
			<div className="set-card__top">
				<div
					className="set-card__icon"
					style={{ color: set.accent, background: `${set.accent}15` }}
				>
					{set.icon}
				</div>
				<span className="set-card__category">{set.category}</span>
			</div>

			<div className="set-card__body">
				<h3 className="set-card__title">{set.title}</h3>
				<p className="set-card__desc">{set.description}</p>
			</div>

			<div className="set-card__footer">
				<div className="set-card__stats">
					<span className="set-card__stat">
						<Code2 size={12} />
						{total} problems
					</span>
					<span className="set-card__stat">
						<CheckCircle2 size={12} style={{ color: set.accent }} />
						{solved} done
					</span>
				</div>
				<div className="set-card__progress">
					<div className="set-card__progress-bar">
						<motion.div
							className="set-card__progress-fill"
							style={{ background: set.accent }}
							initial={{ width: 0 }}
							animate={{ width: `${pct}%` }}
							transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
						/>
					</div>
					<span className="set-card__pct" style={{ color: set.accent }}>
						{pct}%
					</span>
				</div>
			</div>

			<ChevronRight size={16} className="set-card__arrow" />
		</motion.button>
	);
};

// ===================== MAIN COMPONENT =====================

export default function CuratedPracticePage() {
	const [category, setCategory] = useState('All');
	const [activeSet, setActiveSet] = useState<PracticeSet | null>(null);
	const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
	const [hint, setHint] = useState('');
	const [hintLoading, setHintLoading] = useState(false);
	const [hintError, setHintError] = useState('');
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [ttsLoading, setTtsLoading] = useState(false);
	const [completed, setCompleted] = useState<Set<string>>(loadCompleted);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const filteredSets =
		category === 'All'
			? PRACTICE_SETS
			: PRACTICE_SETS.filter((s) => s.category === category);

	const getProgress = useCallback(
		(set: PracticeSet) => {
			const solved = set.problems.filter((p) => completed.has(p.id)).length;
			return { solved, total: set.problems.length };
		},
		[completed],
	);

	const toggleComplete = (id: string) => {
		setCompleted((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			saveCompleted(next);
			return next;
		});
	};

	const fetchHint = async (problem: Problem) => {
		if (hintLoading) return;
		setActiveProblem(problem);
		setHint('');
		setHintError('');
		setHintLoading(true);

		const url = import.meta.env['VITE_GEMINI_FETCH_URL'] as string;
		const key = import.meta.env['VITE_GEMINI_API_KEY'] as string;
		const model = import.meta.env['VITE_GEMINI_MODEL'] as string;

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${key}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model,
					messages: [
						{
							role: 'system',
							content:
								'You are a concise coding interview coach. Provide a focused, practical hint to help the student approach the problem — do NOT give the full solution. 2-3 sentences max. Be direct and use algorithm/data-structure terminology.',
						},
						{
							role: 'user',
							content: `Problem: ${problem.title}\nTopic: ${problem.topic}\nDifficulty: ${problem.difficulty}\nBrief: ${problem.description}\n\nGive me a targeted hint.`,
						},
					],
					max_tokens: 180,
					temperature: 0.7,
				}),
			});

			if (!res.ok) throw new Error(`API error ${res.status}`);
			const data = (await res.json()) as {
				choices?: { message?: { content?: string } }[];
			};
			setHint(data.choices?.[0]?.message?.content ?? 'No hint returned.');
		} catch {
			setHintError('Failed to fetch hint. Check your API key or connection.');
		} finally {
			setHintLoading(false);
		}
	};

	const speakWithBrowser = (text: string) => {
		if (!('speechSynthesis' in window)) return;
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = 0.92;
		utterance.pitch = 1;
		utterance.onstart = () => setIsSpeaking(true);
		utterance.onend = () => setIsSpeaking(false);
		utterance.onerror = () => setIsSpeaking(false);
		setIsSpeaking(true);
		window.speechSynthesis.speak(utterance);
	};

	const speakHint = async () => {
		if (!hint || isSpeaking || ttsLoading) return;

		const elevenKey = import.meta.env['VITE_ELEVENLABS_API_KEY'] as string;

		if (!elevenKey || elevenKey === 'your_elevenlabs_api_key') {
			speakWithBrowser(hint);
			return;
		}

		const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel
		setTtsLoading(true);

		try {
			const res = await fetch(
				`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
				{
					method: 'POST',
					headers: {
						'xi-api-key': elevenKey,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text: hint,
						model_id: 'eleven_turbo_v2_5',
						voice_settings: { stability: 0.5, similarity_boost: 0.5 },
					}),
				},
			);

			if (!res.ok) throw new Error(`TTS API error ${res.status}`);

			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);
			const audio = new Audio(blobUrl);
			audioRef.current = audio;

			audio.onended = () => {
				setIsSpeaking(false);
				URL.revokeObjectURL(blobUrl);
			};
			audio.onerror = () => {
				setIsSpeaking(false);
				URL.revokeObjectURL(blobUrl);
			};

			setTtsLoading(false);
			try {
				await audio.play();
				setIsSpeaking(true);
			} catch {
				// Autoplay blocked or audio error — fall back to browser TTS
				URL.revokeObjectURL(blobUrl);
				audioRef.current = null;
				speakWithBrowser(hint);
			}
		} catch {
			setTtsLoading(false);
			speakWithBrowser(hint);
		}
	};

	const stopSpeaking = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			audioRef.current = null;
		}
		window.speechSynthesis?.cancel();
		setIsSpeaking(false);
	};

	const closeSet = () => {
		setActiveSet(null);
		setActiveProblem(null);
		setHint('');
		setHintError('');
		stopSpeaking();
	};

	// ---- render: detail view ----
	if (activeSet) {
		const setCompleted = activeSet.problems.filter((p) =>
			completed.has(p.id),
		).length;
		const pct = Math.round((setCompleted / activeSet.problems.length) * 100);

		return (
			<div className="curated-page">
				{/* Header */}
				<header className="curated-page__header">
					<button className="curated-page__back" onClick={closeSet}>
						<ArrowLeft size={16} />
						<span>Back to Sets</span>
					</button>
					<div className="curated-page__header-title">
						<span style={{ color: activeSet.accent }}>{activeSet.icon}</span>
						<h1>{activeSet.title}</h1>
					</div>
					<div
						className="curated-page__header-pill"
						style={{
							color: activeSet.accent,
							borderColor: activeSet.borderGlow,
						}}
					>
						<CheckCircle2 size={13} />
						{setCompleted} / {activeSet.problems.length} solved
					</div>
				</header>

				{/* Progress bar */}
				<div className="curated-page__prog-wrap">
					<motion.div
						className="curated-page__prog-fill"
						style={{ background: activeSet.accent }}
						initial={{ width: 0 }}
						animate={{ width: `${pct}%` }}
						transition={{ duration: 0.7, ease: 'easeOut' }}
					/>
				</div>

				{/* Body: problem list + hint panel */}
				<div className="detail-layout">
					{/* Problem list */}
					<div className="problem-list">
						<div className="problem-list__header">
							<BookOpen size={16} />
							<span>{activeSet.problems.length} Problems</span>
						</div>

						{activeSet.problems.map((problem, idx) => {
							const isDone = completed.has(problem.id);
							const isActive = activeProblem?.id === problem.id;
							return (
								<motion.div
									key={problem.id}
									className={`problem-row ${isActive ? 'problem-row--active' : ''} ${isDone ? 'problem-row--done' : ''}`}
									initial={{ opacity: 0, x: -12 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: idx * 0.03 }}
									style={isActive ? { borderColor: activeSet.accent } : {}}
								>
									<button
										className="problem-row__check"
										onClick={() => toggleComplete(problem.id)}
										style={
											isDone
												? {
														background: activeSet.accent,
														borderColor: activeSet.accent,
													}
												: {}
										}
										title={isDone ? 'Mark as unsolved' : 'Mark as solved'}
									>
										{isDone && <CheckCircle2 size={12} />}
									</button>

									<div
										className="problem-row__body"
										onClick={() => {
											void fetchHint(problem);
										}}
									>
										<div className="problem-row__meta">
											<span className="problem-row__num">{idx + 1}</span>
											<span className="problem-row__topic">
												{problem.topic}
											</span>
											<DiffBadge difficulty={problem.difficulty} />
										</div>
										<p className="problem-row__title">{problem.title}</p>
									</div>

									<div className="problem-row__right">
										<span className="problem-row__time">
											<Clock size={11} />
											{problem.timeEstimate}m
										</span>
										<button
											className={`problem-row__hint-btn ${isActive && hint ? 'problem-row__hint-btn--active' : ''}`}
											onClick={() => {
												void fetchHint(problem);
											}}
											title="Get AI hint"
											style={
												isActive && hint
													? {
															color: activeSet.accent,
															borderColor: activeSet.accent,
														}
													: {}
											}
										>
											<Lightbulb size={13} />
											Hint
										</button>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Hint panel */}
					<div className="hint-panel">
						<AnimatePresence mode="wait">
							{!activeProblem && (
								<motion.div
									key="empty"
									className="hint-panel__empty"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									<div className="hint-panel__empty-icon">
										<Sparkles size={28} />
									</div>
									<p className="hint-panel__empty-title">AI Hint Assistant</p>
									<p className="hint-panel__empty-sub">
										Click a problem or press "Hint" to get a targeted hint
										powered by AI — no full solutions, just the right nudge.
									</p>
									<div className="hint-panel__api-tags">
										<span className="hint-panel__api-tag">Gemini-3-Flash</span>
										<span className="hint-panel__api-tag">ElevenLabs TTS</span>
									</div>
								</motion.div>
							)}

							{activeProblem && (
								<motion.div
									key={activeProblem.id}
									className="hint-panel__content"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									<div className="hint-panel__prob-header">
										<div>
											<p className="hint-panel__prob-topic">
												{activeProblem.topic}
											</p>
											<h3 className="hint-panel__prob-title">
												{activeProblem.title}
											</h3>
										</div>
										<DiffBadge difficulty={activeProblem.difficulty} />
									</div>

									<p className="hint-panel__prob-desc">
										{activeProblem.description}
									</p>

									<div className="hint-panel__divider" />

									{/* Hint area */}
									<div className="hint-panel__hint-area">
										<div className="hint-panel__hint-label">
											<Lightbulb
												size={14}
												style={{ color: activeSet.accent }}
											/>
											<span style={{ color: activeSet.accent }}>AI Hint</span>
										</div>

										{hintLoading && (
											<div className="hint-panel__loading">
												<div className="hint-panel__dots">
													{[0, 1, 2].map((i) => (
														<motion.span
															key={i}
															className="hint-panel__dot"
															animate={{ opacity: [0.3, 1, 0.3] }}
															transition={{
																duration: 1.2,
																repeat: Infinity,
																delay: i * 0.2,
															}}
															style={{ background: activeSet.accent }}
														/>
													))}
												</div>
												<span className="hint-panel__loading-text">
													Generating hint...
												</span>
											</div>
										)}

										{hintError && !hintLoading && (
											<div className="hint-panel__error">
												<X size={14} />
												{hintError}
											</div>
										)}

										{hint && !hintLoading && (
											<motion.div
												className="hint-panel__hint-text"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.4 }}
											>
												{hint}
											</motion.div>
										)}

										{!hint && !hintLoading && !hintError && (
											<p className="hint-panel__hint-placeholder">
												Fetching hint...
											</p>
										)}
									</div>

									{/* TTS controls */}
									{hint && !hintLoading && (
										<motion.div
											className="hint-panel__tts"
											initial={{ opacity: 0, y: 6 }}
											animate={{ opacity: 1, y: 0 }}
										>
											<button
												className={`hint-panel__tts-btn ${isSpeaking ? 'hint-panel__tts-btn--active' : ''}`}
												onClick={
													isSpeaking
														? stopSpeaking
														: () => {
																void speakHint();
															}
												}
												disabled={ttsLoading}
												style={
													isSpeaking
														? {
																background: `${activeSet.accent}20`,
																borderColor: activeSet.accent,
																color: activeSet.accent,
															}
														: {}
												}
											>
												{ttsLoading ? (
													<>
														<motion.span
															animate={{ rotate: 360 }}
															transition={{
																duration: 1,
																repeat: Infinity,
																ease: 'linear',
															}}
															style={{ display: 'inline-flex' }}
														>
															<SortDesc size={14} />
														</motion.span>
														Loading audio...
													</>
												) : isSpeaking ? (
													<>
														<VolumeX size={14} />
														Stop Speaking
													</>
												) : (
													<>
														<Volume2 size={14} />
														Read Hint Aloud
													</>
												)}
											</button>
											<button
												className="hint-panel__refresh-btn"
												onClick={() => {
													void fetchHint(activeProblem);
												}}
												title="Get a different hint"
											>
												<Sparkles size={13} />
												New Hint
											</button>
										</motion.div>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		);
	}

	// ---- render: browse view ----
	return (
		<div className="curated-page">
			{/* Header */}
			<header className="curated-page__header">
				<div className="curated-page__header-title">
					<BookOpen size={20} style={{ color: '#22c55e' }} />
					<h1>Curated Practice Sets</h1>
				</div>
				<div className="curated-page__header-pill">
					<Target size={13} />
					{PRACTICE_SETS.length} sets available
				</div>
			</header>

			{/* Category tabs */}
			<div className="curated-page__tabs">
				{CATEGORIES.map((cat) => (
					<button
						key={cat}
						className={`curated-page__tab ${category === cat ? 'curated-page__tab--active' : ''}`}
						onClick={() => setCategory(cat)}
					>
						{cat}
						{cat !== 'All' && (
							<span className="curated-page__tab-count">
								{PRACTICE_SETS.filter((s) => s.category === cat).length}
							</span>
						)}
					</button>
				))}
			</div>

			{/* Summary bar */}
			<div className="curated-page__summary">
				<div className="curated-page__summary-stat">
					<Code2 size={14} style={{ color: '#22c55e' }} />
					<span>
						{PRACTICE_SETS.reduce((a, s) => a + s.problems.length, 0)} total
						problems
					</span>
				</div>
				<div className="curated-page__summary-stat">
					<CheckCircle2 size={14} style={{ color: '#60a5fa' }} />
					<span>
						{PRACTICE_SETS.reduce(
							(a, s) =>
								a + s.problems.filter((p) => completed.has(p.id)).length,
							0,
						)}{' '}
						solved
					</span>
				</div>
				<div className="curated-page__summary-stat">
					<Sparkles size={14} style={{ color: '#a855f7' }} />
					<span>AI hints &amp; TTS on every problem</span>
				</div>
			</div>

			{/* Set grid */}
			<div className="curated-page__grid">
				<AnimatePresence mode="popLayout">
					{filteredSets.map((set, idx) => {
						const { solved, total } = getProgress(set);
						return (
							<motion.div
								key={set.id}
								layout
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.2, delay: idx * 0.04 }}
							>
								<SetCard
									set={set}
									solved={solved}
									total={total}
									onClick={() => setActiveSet(set)}
								/>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
}
