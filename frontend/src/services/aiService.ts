// aiService.ts — AI hint & chat service using OpenAI-compatible API
// Reuses the same env vars as interviewService (VITE_GEMINI_*)

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const API_URL = import.meta.env.VITE_GEMINI_FETCH_URL as string;
const MODEL = import.meta.env.VITE_GEMINI_MODEL as string;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string;

// ── Types ─────────────────────────────────────────────────────────────────────

export type HintTier = 1 | 2 | 3 | 4;

export interface HintResult {
	tier: HintTier;
	label: string;
	content: string;
}

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

interface ElevenLabsSTTResponse {
	text?: string;
	transcription?: string;
}

// ── Internal request helper ───────────────────────────────────────────────────

async function aiRequest(
	messages: Array<{ role: string; content: string }>,
	temperature = 0.6,
	maxTokens = 1024,
): Promise<string> {
	if (!API_URL || !API_KEY || !MODEL) {
		throw new Error(
			'AI not configured. Set VITE_GEMINI_FETCH_URL, VITE_GEMINI_API_KEY, and VITE_GEMINI_MODEL.',
		);
	}

	const res = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${API_KEY}`,
		},
		body: JSON.stringify({
			model: MODEL,
			messages,
			temperature,
			max_tokens: maxTokens,
		}),
	});

	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`AI API error: ${res.status} — ${errText}`);
	}

	const data = (await res.json()) as {
		choices?: Array<{ message?: { content?: string } }>;
	};
	return data.choices?.[0]?.message?.content?.trim() ?? '';
}

// ── Tiered Hint System ────────────────────────────────────────────────────────

const TIER_LABELS: Record<HintTier, string> = {
	1: 'Nudge',
	2: 'Concept',
	3: 'Pseudocode',
	4: 'Solution',
};

const TIER_INSTRUCTIONS: Record<HintTier, string> = {
	1: `Give a brief, encouraging nudge. Point the user in the right direction without revealing the approach. 
      For example: "Think about which data structure lets you look up values in O(1) time." 
      Keep it to 1-2 sentences maximum.`,
	2: `Explain the key concept or technique needed to solve this problem. 
      Name the algorithm/pattern (e.g., "two pointers", "sliding window", "hash map"). 
      Explain WHY it applies here and what the high-level approach is. 
      Do NOT write any code. Keep it to a short paragraph.`,
	3: `Provide step-by-step pseudocode for solving this problem. 
      Use plain English with numbered steps. 
      Include the key logic, edge cases, and time/space complexity. 
      Do NOT write actual code in any programming language.`,
	4: `Provide a clean, correct, and well-commented solution in JavaScript. 
      Include brief comments explaining each step. 
      Also state the time and space complexity at the end.`,
};

export async function getHint(
	problemTitle: string,
	problemDescription: string,
	constraints: string[],
	userCode: string,
	tier: HintTier,
): Promise<HintResult> {
	const systemPrompt = `You are a coding tutor helping a student who is stuck on an algorithm problem. 
You must follow the hint tier instructions exactly. Never reveal more than the tier allows.
Be concise and clear.`;

	const userPrompt = `Problem: ${problemTitle}
Description: ${problemDescription}
Constraints: ${constraints.join('; ')}

Student's current code:
\`\`\`
${userCode || '(no code written yet)'}
\`\`\`

Hint Tier ${tier} (${TIER_LABELS[tier]}):
${TIER_INSTRUCTIONS[tier]}`;

	const content = await aiRequest([
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: userPrompt },
	]);

	return {
		tier,
		label: TIER_LABELS[tier],
		content,
	};
}

// ── AI Chat (approach comparison & general help) ──────────────────────────────

export async function chatWithAI(
	problemTitle: string,
	problemDescription: string,
	userCode: string,
	conversationHistory: ChatMessage[],
	userMessage: string,
): Promise<string> {
	const systemPrompt = `You are an expert coding assistant embedded in a code editor. 
The student is working on an algorithm problem. You help by:
- Answering their questions about the problem
- Comparing different approaches (e.g., brute force vs optimal)
- Suggesting which approach is better and why (time/space tradeoffs)
- Explaining concepts without directly giving the full solution unless asked

Be concise. Use markdown formatting for code snippets and comparisons.
When comparing approaches, use a clear structure:
**Approach A**: description, complexity
**Approach B**: description, complexity
**Recommendation**: which is better and why

Problem context:
Title: ${problemTitle}
Description: ${problemDescription}

Student's current code:
\`\`\`
${userCode || '(no code written yet)'}
\`\`\``;

	const messages: Array<{ role: string; content: string }> = [
		{ role: 'system', content: systemPrompt },
	];

	// Add conversation history (last 10 messages to stay within token limits)
	const recent = conversationHistory.slice(-10);
	for (const msg of recent) {
		messages.push({ role: msg.role, content: msg.content });
	}

	messages.push({ role: 'user', content: userMessage });

	return await aiRequest(messages, 0.7, 1500);
}

// ── Audio Transcription via ElevenLabs Scribe ───────────────────────────────

export async function transcribeAudio(
	audioBlob: Blob,
	ext = 'webm',
): Promise<string> {
	if (!ELEVENLABS_API_KEY) {
		throw new Error('ElevenLabs not configured. Set VITE_ELEVENLABS_API_KEY.');
	}

	const formData = new FormData();
	formData.append('file', audioBlob, `audio.${ext}`);
	formData.append('model_id', 'scribe_v1');
	formData.append('language_code', 'en');

	const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
		method: 'POST',
		headers: { 'xi-api-key': ELEVENLABS_API_KEY },
		body: formData,
	});

	if (!res.ok) {
		const errText = await res.text();
		console.error('ElevenLabs STT raw error:', errText);
		throw new Error(`ElevenLabs STT error: ${res.status} — ${errText}`);
	}

	const data = (await res.json()) as ElevenLabsSTTResponse;
	return data.text ?? data.transcription ?? '';
}
