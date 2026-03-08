// interviewService.ts — Pure async service functions for interview API calls
// NOTE: Function names say "Gemini" but the backend is OpenAI-compatible (gpt-4o-mini).
// Swap VITE_GEMINI_* env vars to point at any OpenAI-compatible endpoint.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_FETCH_URL = import.meta.env.VITE_GEMINI_FETCH_URL as string;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL as string;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string;
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const SESSIONS_KEY = 'interview_sessions';

export interface TranscriptEntry {
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: Date;
}

export interface FeedbackItem {
  question: string;
  answer: string;
  score: number;
  comment: string;
}

export interface EvaluationResult {
  overallScore: number;
  feedback: FeedbackItem[];
  strengths: string[];
  improvements: string[];
}

export interface InterviewConfig {
  role: string;
  experienceLevel: 'Junior' | 'Mid' | 'Senior';
  interviewType: 'Technical' | 'Behavioral' | 'Mixed';
}

export interface InterviewSession {
  id: string;
  date: string;
  config: InterviewConfig;
  questions: string[];
  transcript: TranscriptEntry[];
  evaluation: EvaluationResult | null;
}

const FALLBACK_QUESTIONS = [
  'Tell me about yourself and your background.',
  'Describe a challenging technical problem you solved.',
  'How do you handle tight deadlines and pressure?',
  'What are your greatest strengths as a developer?',
  'Where do you see yourself in 5 years?',
];

interface ElevenLabsSTTResponse {
  text?: string;
  transcription?: string;
}

// Uses OpenAI-compatible chat completions API.
// Env vars intentionally named "GEMINI_*" to keep function names consistent.
async function geminiRequest(prompt: string): Promise<string> {
  if (!GEMINI_FETCH_URL || !GEMINI_API_KEY || !GEMINI_MODEL) {
    throw new Error(
      'Missing env vars: VITE_GEMINI_FETCH_URL, VITE_GEMINI_API_KEY, or VITE_GEMINI_MODEL'
    );
  }

  const res = await fetch(GEMINI_FETCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI API error: ${res.status} — ${errText}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? '';
}

export async function generateQuestions(config: InterviewConfig): Promise<string[]> {
  const prompt = `You are an expert interviewer. Generate exactly 5 interview questions for:
Role: ${config.role}
Experience: ${config.experienceLevel}
Type: ${config.interviewType}

Return ONLY a valid JSON array of strings. No markdown, no explanation.
Example: ["Question 1?", "Question 2?", ...]`;

  try {
    const raw = await geminiRequest(prompt);
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const questions = JSON.parse(cleaned) as string[];
    if (!Array.isArray(questions) || questions.length === 0)
      throw new Error('Invalid questions format');
    return questions.slice(0, 5);
  } catch (err) {
    console.error('generateQuestions failed, using fallback:', err);
    return FALLBACK_QUESTIONS;
  }
}

export async function speakText(
  text: string,
  onStart: () => void,
  onEnd: () => void,
): Promise<HTMLAudioElement | null> {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );

    if (!response.ok) throw new Error(`ElevenLabs TTS error: ${response.status}`);
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onplay = onStart;
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      onEnd();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      onEnd();
    };

    await audio.play();
    return audio;
  } catch (err) {
    console.error('speakText failed, falling back to silent display:', err);
    onEnd();
    return null;
  }
}

export async function transcribeAudio(audioBlob: Blob, ext = 'webm'): Promise<string> {
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

export async function evaluateInterview(transcript: TranscriptEntry[]): Promise<EvaluationResult> {
  const evalPrompt = `You are an expert interview coach. Evaluate this interview transcript:
${JSON.stringify(transcript)}

Return ONLY valid JSON (no markdown):
{
  "overallScore": number (0-100),
  "feedback": [{ "question": string, "answer": string, "score": number, "comment": string }],
  "strengths": string[],
  "improvements": string[]
}`;

  const raw = await geminiRequest(evalPrompt);
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned) as EvaluationResult;
}

// ── Session persistence ────────────────────────────────────────────────────────

export function saveInterviewSession(
  config: InterviewConfig,
  questions: string[],
  transcript: TranscriptEntry[],
  evaluation: EvaluationResult | null,
): InterviewSession {
  const session: InterviewSession = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    config,
    questions,
    transcript,
    evaluation,
  };

  try {
    const existing = loadInterviewSessions();
    existing.unshift(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(existing));
  } catch {
    // Storage full or unavailable — silently skip
  }

  return session;
}

export function loadInterviewSessions(): InterviewSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as InterviewSession[]) : [];
  } catch {
    return [];
  }
}
