import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Download, RotateCcw, Trash2 } from 'lucide-react';
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
      background: '#111113',
      border: '1px solid #1e1e22',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        cursor: 'pointer',
      }} onClick={() => setExpanded((e) => !e)}>
        {/* Score badge */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: `2px solid ${session.evaluation ? scoreColor(session.evaluation.overallScore) : '#2a2a30'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 14,
          fontWeight: 700,
          color: session.evaluation ? scoreColor(session.evaluation.overallScore) : '#71717a',
        }}>
          {session.evaluation ? session.evaluation.overallScore : '—'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: '#f4f4f5', fontSize: 14 }}>
              {session.config.role}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: '2px 8px',
              borderRadius: 20, background: '#1a1a1f', color: '#a1a1aa',
              border: '1px solid #1e1e22',
            }}>
              {session.config.experienceLevel}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: '2px 8px',
              borderRadius: 20, background: '#1a1a1f', color: '#a1a1aa',
              border: '1px solid #1e1e22',
            }}>
              {session.config.interviewType}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>
            {formatDate(session.date)} · {session.questions.length} questions
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
            style={{
              background: 'transparent', border: '1px solid #1e1e22',
              borderRadius: 6, padding: '5px 8px', cursor: 'pointer',
              color: '#71717a', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
            }}
            title="Download JSON"
          >
            <Download size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              background: 'transparent', border: '1px solid #1e1e22',
              borderRadius: 6, padding: '5px 8px', cursor: 'pointer',
              color: '#71717a', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
            }}
            title="Delete session"
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={15} color="#52525b" /> : <ChevronDown size={15} color="#52525b" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid #1e1e22', padding: '18px' }}>
          <h3 style={{ color: '#71717a', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
            Questions & Answers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            {pairs.map((pair, idx) => {
              const fb = session.evaluation?.feedback[idx];
              return (
                <div key={idx} style={{
                  background: '#0a0a0b',
                  border: '1px solid #1e1e22',
                  borderRadius: 8,
                  padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ color: '#e4e4e7', fontSize: 13, fontWeight: 500, margin: 0, flex: 1 }}>
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
                  <p style={{ color: '#a1a1aa', fontSize: 13, margin: '6px 0 0', lineHeight: 1.5 }}>
                    {pair.answer}
                  </p>
                  {fb?.comment && (
                    <p style={{
                      color: '#71717a', fontSize: 12, margin: '8px 0 0',
                      paddingTop: 8, borderTop: '1px solid #1e1e22', lineHeight: 1.5,
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#0a0a0b', border: '1px solid #1e1e22', borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ color: '#22c55e', fontSize: 11, fontWeight: 600, margin: '0 0 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Strengths
                </p>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#a1a1aa', fontSize: 13, lineHeight: 1.6 }}>
                  {session.evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div style={{ background: '#0a0a0b', border: '1px solid #1e1e22', borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ color: '#f59e0b', fontSize: 11, fontWeight: 600, margin: '0 0 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Areas to Improve
                </p>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#a1a1aa', fontSize: 13, lineHeight: 1.6 }}>
                  {session.evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}

          <details style={{ marginTop: 14 }}>
            <summary style={{
              cursor: 'pointer', color: '#52525b', fontSize: 12,
              userSelect: 'none', listStyle: 'none',
            }}>
              View raw JSON
            </summary>
            <pre style={{
              marginTop: 8, padding: 10, background: '#0a0a0b',
              border: '1px solid #1e1e22', borderRadius: 6,
              color: '#71717a', fontSize: 11, overflowX: 'auto',
              maxHeight: 280, lineHeight: 1.5,
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
  const [sessions, setSessions] = useState<InterviewSession[]>(() => loadInterviewSessions());

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/interview', { replace: true });
  };

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
      color: '#f4f4f5',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: '0 0 60px',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid #1e1e22',
        position: 'sticky',
        top: 0,
        background: '#0a0a0b',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid #2a2a30',
              borderRadius: 6, padding: '5px 12px', cursor: 'pointer',
              color: '#a1a1aa', fontSize: 13, fontWeight: 500,
            }}
          >
            <ArrowLeft size={13} />
            Back
          </button>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#f4f4f5' }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {sessions.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: 'transparent', border: '1px solid #1e1e22',
                borderRadius: 6, padding: '7px 12px', cursor: 'pointer',
                color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <Trash2 size={13} /> Clear all
            </button>
          )}
          <button
            onClick={() => navigate('/video-interview')}
            style={{
              background: '#22c55e', border: 'none', borderRadius: 6,
              padding: '7px 14px', cursor: 'pointer', color: '#fff',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <RotateCcw size={13} /> New Interview
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 0' }}>
        {/* Stats row */}
        {sessions.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 24,
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
                background: '#111113', border: '1px solid #1e1e22',
                borderRadius: 8, padding: '14px 18px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f5' }}>{value}</div>
                <div style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Session list */}
        {sessions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '72px 0',
            color: '#52525b',
          }}>
            <p style={{ fontSize: 15, fontWeight: 500, margin: '0 0 6px', color: '#71717a' }}>
              No interview sessions yet
            </p>
            <p style={{ fontSize: 13, margin: '0 0 20px', color: '#52525b' }}>
              Complete an interview to see your results here.
            </p>
            <button
              onClick={() => navigate('/video-interview')}
              style={{
                background: '#22c55e', border: 'none', borderRadius: 6,
                padding: '10px 20px', cursor: 'pointer', color: '#fff',
                fontSize: 13, fontWeight: 600,
              }}
            >
              Start your first interview
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 13, color: '#71717a', margin: '0 0 14px', fontWeight: 500 }}>
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
