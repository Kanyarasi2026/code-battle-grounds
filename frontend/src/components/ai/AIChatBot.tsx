import { AlertCircle, ArrowUp, Loader2, MessageSquare, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { chatWithAI, type ChatMessage } from '../../services/aiService';
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

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim(), timestamp: new Date() };
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
  }, [loading, messages, problemTitle, problemDescription, userCode]);

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
            <p className="ai-chat__empty-title">Ask anything about the problem</p>
            <p className="ai-chat__empty-sub">
              Compare approaches, ask about complexity, or get help with your code.
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
          <div
            key={i}
            className={`ai-chat__msg ai-chat__msg--${msg.role}`}
          >
            <div className="ai-chat__msg-label">
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div className="ai-chat__msg-content">
              {msg.content}
            </div>
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
          placeholder="Ask about the problem…"
          rows={1}
          disabled={loading}
        />
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
