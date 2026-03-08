import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronDown, ChevronUp, Download, RotateCcw, Trash2 } from 'lucide-react';
import {
  loadInterviewSessions,
  type InterviewSession,
} from './video-interview/interviewService';

const SESSIONS_KEY = 'interview_sessions';

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SessionCard({ session, onDelete }: { session: InterviewSession; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const qaMap: Array<{ question: string; answer: string }> = session.questions.map((q) => {
    const answer = session.transcript.find(
      (t) => t.role === 'candidate' && session.transcript.findIndex((x) => x.text === q && x.role === 'interviewer') !== -1
    );
    // Build QA pairs from transcript order
    return { question: q, answer: '' };
  });

  // Build Q&A pairs by pairing consecutive interviewer/candidate transcript entries
  const pairs: Array<{ question: string; answer: string }> = [];
  let i = 0;
  while (i < session.transcript.length) {
    if (session.transcript[i].role === 'interviewer') {
      const q = session.transcript[i].text;
      const a = session.transcript[i + 1]?.role === 'candidate'
        ? session.transcript[i + 1].text
        : '(no answer recorded)';
      pairs.push({ question: q, answer: a });
      i += 2;
    } else {
      i++;
    }
  }

  const handleDownload = () => {
    const json = JSON.stringify(session, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      background: '#141417',
      border: '1px solid #27272a',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        cursor: 'pointer',
      }} onClick={() => setExpanded((e) => !e)}>
        {/* Score badge */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `3px solid ${session.evaluation ? scoreColor(session.evaluation.overallScore) : '#3f3f46'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 16,
          fontWeight: 700,
          color: session.evaluation ? scoreColor(session.evaluation.overallScore) : '#71717a',
        }}>
          {session.evaluation ? session.evaluation.overallScore : '—'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: '#fafafa', fontSize: 15 }}>
              {session.config.role}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: '2px 8px',
              borderRadius: 20, background: '#27272a', color: '#a1a1aa',
            }}>
              {session.config.experienceLevel}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: '2px 8px',
              borderRadius: 20, background: '#27272a', color: '#a1a1aa',
            }}>
              {session.config.interviewType}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>
            {formatDate(session.date)} · {session.questions.length} questions
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
            style={{
              background: 'transparent', border: '1px solid #27272a',
              borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
              color: '#71717a', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
            }}
            title="Download JSON"
          >
            <Download size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              background: 'transparent', border: '1px solid #27272a',
              borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
              color: '#71717a', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
            }}
            title="Delete session"
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={16} color="#71717a" /> : <ChevronDown size={16} color="#71717a" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid #27272a', padding: '20px' }}>
          {/* Q&A pairs */}
          <h3 style={{ color: '#a1a1aa', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            Questions & Answers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {pairs.map((pair, idx) => {
              const fb = session.evaluation?.feedback[idx];
              return (
                <div key={idx} style={{
                  background: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ color: '#e4e4e7', fontSize: 14, fontWeight: 500, margin: 0, flex: 1 }}>
                      Q{idx + 1}: {pair.question}
                    </p>
                    {fb && (
                      <span style={{
                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                        color: scoreColor(fb.score),
                      }}>
                        {fb.score}/100
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: '8px 0 0', lineHeight: 1.5 }}>
                    {pair.answer}
                  </p>
                  {fb?.comment && (
                    <p style={{
                      color: '#71717a', fontSize: 12, margin: '8px 0 0',
                      paddingTop: 8, borderTop: '1px solid #27272a', lineHeight: 1.5,
                    }}>
                      {fb.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Strengths / Improvements */}
          {session.evaluation && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#0a0a0b', border: '1px solid #166534', borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ color: '#22c55e', fontSize: 12, fontWeight: 600, margin: '0 0 8px' }}>
                  Strengths
                </p>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#86efac', fontSize: 13, lineHeight: 1.6 }}>
                  {session.evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div style={{ background: '#0a0a0b', border: '1px solid #92400e', borderRadius: 8, padding: '14px 16px' }}>
                <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 600, margin: '0 0 8px' }}>
                  Areas to Improve
                </p>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#fcd34d', fontSize: 13, lineHeight: 1.6 }}>
                  {session.evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Raw JSON toggle */}
          <details style={{ marginTop: 16 }}>
            <summary style={{
              cursor: 'pointer', color: '#52525b', fontSize: 12,
              userSelect: 'none', listStyle: 'none',
            }}>
              View raw JSON
            </summary>
            <pre style={{
              marginTop: 8, padding: 12, background: '#0a0a0b',
              border: '1px solid #27272a', borderRadius: 6,
              color: '#71717a', fontSize: 11, overflowX: 'auto',
              maxHeight: 300, lineHeight: 1.5,
            }}>
              {JSON.stringify(session, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default function InterviewDashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    setSessions(loadInterviewSessions());
  }, []);

  const deleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    localStorage.removeItem(SESSIONS_KEY);
    setSessions([]);
  };

  const avgScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (s.evaluation?.overallScore ?? 0), 0) /
            sessions.filter((s) => s.evaluation).length || 0
        )
      : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0b',
      color: '#fafafa',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '0 0 60px',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: '1px solid #18181b',
        position: 'sticky',
        top: 0,
        background: '#0a0a0b',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Brain size={22} color="#22c55e" />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Interview Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {sessions.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: 'transparent', border: '1px solid #3f3f46',
                borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
                color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
          <button
            onClick={() => navigate('/video-interview')}
            style={{
              background: '#22c55e', border: 'none', borderRadius: 8,
              padding: '8px 16px', cursor: 'pointer', color: '#000',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <RotateCcw size={14} /> New Interview
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 0' }}>
        {/* Stats row */}
        {sessions.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 28,
          }}>
            {[
              { label: 'Total Sessions', value: sessions.length },
              { label: 'Average Score', value: avgScore != null ? `${avgScore}/100` : '—' },
              {
                label: 'Best Score',
                value: sessions.some((s) => s.evaluation)
                  ? `${Math.max(...sessions.filter((s) => s.evaluation).map((s) => s.evaluation!.overallScore))}/100`
                  : '—',
              },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: '#141417', border: '1px solid #27272a',
                borderRadius: 10, padding: '16px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fafafa' }}>{value}</div>
                <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Session list */}
        {sessions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#52525b',
          }}>
            <Brain size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
            <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 8px', color: '#71717a' }}>
              No interview sessions yet
            </p>
            <p style={{ fontSize: 14, margin: '0 0 24px' }}>
              Complete an interview to see your results here.
            </p>
            <button
              onClick={() => navigate('/video-interview')}
              style={{
                background: '#22c55e', border: 'none', borderRadius: 8,
                padding: '10px 20px', cursor: 'pointer', color: '#000',
                fontSize: 14, fontWeight: 600,
              }}
            >
              Start your first interview
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 14, color: '#71717a', margin: '0 0 16px', fontWeight: 500 }}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} — most recent first
            </h2>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={() => deleteSession(session.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
