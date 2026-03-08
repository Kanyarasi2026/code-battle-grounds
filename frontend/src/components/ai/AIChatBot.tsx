import {
	AlertCircle,
	ArrowUp,
	Loader2,
	MessageSquare,
	Mic,
	MicOff,
	X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	chatWithAI,
	transcribeAudio,
	type ChatMessage,
} from '../../services/aiService';
import './AIChatBot.scss';

interface AIChatBotProps {
	problemTitle: string;
	problemDescription: string;
	userCode: string;
}

const QUICK_PROMPTS = [
	'Compare brute force vs optimal approach',
	'What data structure should I use?',
	'What is the time complexity of my code?',
	'How can I optimize my solution?',
];

export default function AIChatBot({
	problemTitle,
	problemDescription,
	userCode,
}: AIChatBotProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const [isListening, setIsListening] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);

	// Auto-scroll on new messages
	useEffect(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}, [messages]);

	// Focus input when opened
	useEffect(() => {
		if (isOpen) inputRef.current?.focus();
	}, [isOpen]);

	const sendMessage = useCallback(
		async (text: string) => {
			if (!text.trim() || loading) return;

			const userMsg: ChatMessage = {
				role: 'user',
				content: text.trim(),
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, userMsg]);
			setInput('');
			setLoading(true);
			setError(null);

			try {
				const response = await chatWithAI(
					problemTitle,
					problemDescription,
					userCode,
					[...messages, userMsg],
					text.trim(),
				);

				const assistantMsg: ChatMessage = {
					role: 'assistant',
					content: response,
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, assistantMsg]);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to get response');
			} finally {
				setLoading(false);
			}
		},
		[loading, messages, problemTitle, problemDescription, userCode],
	);

	const toggleMic = useCallback(async () => {
		// Second tap: stop recording → triggers onstop → transcribe → send
		if (isListening) {
			mediaRecorderRef.current?.stop();
			return;
		}

		setError(null);
		audioChunksRef.current = [];

		let stream: MediaStream;
		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		} catch {
			setError(
				'Microphone access denied. Allow microphone permissions and try again.',
			);
			return;
		}

		const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
			? 'audio/webm;codecs=opus'
			: 'audio/webm';

		const recorder = new MediaRecorder(stream, { mimeType });

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) audioChunksRef.current.push(e.data);
		};

		recorder.onstart = () => setIsListening(true);

		recorder.onstop = async () => {
			stream.getTracks().forEach((t) => t.stop());
			setIsListening(false);
			setIsTranscribing(true);
			try {
				const blob = new Blob(audioChunksRef.current, { type: mimeType });
				const ext = mimeType.includes('mp4')
					? 'mp4'
					: mimeType.includes('ogg')
						? 'ogg'
						: 'webm';
				const text = await transcribeAudio(blob, ext);
				if (text.trim()) {
					await sendMessage(text.trim());
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Transcription failed.');
			} finally {
				setIsTranscribing(false);
				mediaRecorderRef.current = null;
				inputRef.current?.focus();
			}
		};

		mediaRecorderRef.current = recorder;
		recorder.start();
	}, [isListening, sendMessage]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			void sendMessage(input);
		}
	};

	if (!isOpen) {
		return (
			<button
				className="ai-chat-fab"
				onClick={() => setIsOpen(true)}
				title="AI Assistant"
			>
				<MessageSquare size={18} />
			</button>
		);
	}

	return (
		<div className="ai-chat">
			{/* Header */}
			<div className="ai-chat__header">
				<div className="ai-chat__header-left">
					<MessageSquare size={14} />
					<span>AI Assistant</span>
				</div>
				<button className="ai-chat__close" onClick={() => setIsOpen(false)}>
					<X size={14} />
				</button>
			</div>

			{/* Messages */}
			<div className="ai-chat__messages" ref={scrollRef}>
				{messages.length === 0 && (
					<div className="ai-chat__empty">
						<p className="ai-chat__empty-title">
							Ask anything about the problem
						</p>
						<p className="ai-chat__empty-sub">
							Compare approaches, ask about complexity, or get help with your
							code.
						</p>
						<div className="ai-chat__quick-prompts">
							{QUICK_PROMPTS.map((q) => (
								<button
									key={q}
									className="ai-chat__quick-btn"
									onClick={() => void sendMessage(q)}
								>
									{q}
								</button>
							))}
						</div>
					</div>
				)}

				{messages.map((msg, i) => (
					<div key={i} className={`ai-chat__msg ai-chat__msg--${msg.role}`}>
						<div className="ai-chat__msg-label">
							{msg.role === 'user' ? 'You' : 'AI'}
						</div>
						<div className="ai-chat__msg-content">{msg.content}</div>
					</div>
				))}

				{loading && (
					<div className="ai-chat__msg ai-chat__msg--assistant">
						<div className="ai-chat__msg-label">AI</div>
						<div className="ai-chat__msg-loading">
							<Loader2 size={13} className="ai-chat__spin" />
							Thinking…
						</div>
					</div>
				)}

				{error && (
					<div className="ai-chat__error">
						<AlertCircle size={13} />
						{error}
					</div>
				)}
			</div>

			{/* Input */}
			<div className="ai-chat__input-wrap">
				<textarea
					ref={inputRef}
					className="ai-chat__input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={
						isListening
							? 'Recording… tap mic to stop & send'
							: isTranscribing
								? 'Transcribing…'
								: 'Ask about the problem…'
					}
					rows={1}
					disabled={loading || isListening || isTranscribing}
				/>
				<button
					className={`ai-chat__mic${
						isListening
							? ' ai-chat__mic--active'
							: isTranscribing
								? ' ai-chat__mic--transcribing'
								: ''
					}`}
					onClick={() => {
						void toggleMic();
					}}
					disabled={loading || isTranscribing}
					title={
						isListening
							? 'Stop & send'
							: isTranscribing
								? 'Transcribing…'
								: 'Speak your question'
					}
				>
					{isTranscribing ? (
						<Loader2 size={14} className="ai-chat__spin" />
					) : isListening ? (
						<MicOff size={14} />
					) : (
						<Mic size={14} />
					)}
				</button>
				<button
					className="ai-chat__send"
					onClick={() => void sendMessage(input)}
					disabled={!input.trim() || loading}
				>
					<ArrowUp size={14} />
				</button>
			</div>
		</div>
	);
}
