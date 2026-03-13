import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Clipboard,
  Eye,
  Monitor,
  Shield,
  User,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import type { IntegrityEvent, IntegrityEventKind } from '../../types';

// ── Extended interfaces ────────────────────────────────────────
type EventCategory = 'tab' | 'fullscreen' | 'paste' | 'idle' | 'submission' | 'ai' | 'system';
type Severity = 'low' | 'medium' | 'high';
type Confidence = 'low confidence' | 'review suggested' | 'notable cluster';

interface IntegrityEventFull extends IntegrityEvent {
  severity: Severity;
  category: EventCategory;
  confidence?: Confidence;
  expandedDetail?: string;
}

interface ClusterData {
  id: string;
  title: string;
  timeRange: string;
  confidence: Confidence;
  eventCount: number;
  description: string;
  events: string[];
}

interface SessionSummaryFull {
  tabSwitches: number;
  fullscreenExits: number;
  largePastes: number;
  idleSpikes: number;
  submissionMoments: number;
}

interface SessionData {
  id: string;
  studentName: string;
  assessmentName: string;
  duration: string;
  status: 'submitted' | 'in-progress' | 'incomplete';
  questionsAttempted: number;
  totalQuestions: number;
  score: number | null;
  events: IntegrityEventFull[];
  clusters: ClusterData[];
  summary: SessionSummaryFull;
}

// ── Mock data ──────────────────────────────────────────────────
const MOCK_SESSIONS: SessionData[] = [
  {
    id: 's1',
    studentName: 'Maya K.',
    assessmentName: 'Assessment #3',
    duration: '45:01',
    status: 'submitted',
    questionsAttempted: 3,
    totalQuestions: 3,
    score: 78,
    summary: { tabSwitches: 2, fullscreenExits: 1, largePastes: 1, idleSpikes: 1, submissionMoments: 1 },
    clusters: [
      {
        id: 'c1',
        title: 'Tab switch followed by large paste',
        timeRange: '12:47 – 18:33',
        confidence: 'review suggested',
        eventCount: 2,
        description: 'Student left the assessment tab for 3 seconds, then returned and pasted 347 characters. Temporal proximity warrants review.',
        events: ['Left assessment tab · Duration: 3 seconds', 'Large paste detected · 347 characters pasted'],
      },
    ],
    events: [
      { id: 'e1', timestamp: 0, elapsed: '00:00', label: 'Assessment started', detail: 'Fullscreen enabled', kind: 'neutral', severity: 'low', category: 'system' },
      { id: 'e2', timestamp: 252000, elapsed: '04:12', label: 'Left assessment tab', detail: 'Duration: 8 seconds', kind: 'flagged', severity: 'medium', category: 'tab', confidence: 'low confidence', expandedDetail: 'Student navigated away from the assessment window for 8 seconds. No other correlated events within 5 minutes.' },
      { id: 'e3', timestamp: 767000, elapsed: '12:47', label: 'Left assessment tab', detail: 'Duration: 3 seconds', kind: 'flagged', severity: 'low', category: 'tab', confidence: 'review suggested', expandedDetail: 'Brief tab switch, immediately followed by a large paste event at 18:33. Temporal correlation flagged for review.' },
      { id: 'e4', timestamp: 1113000, elapsed: '18:33', label: 'Large paste detected', detail: '347 characters pasted', kind: 'flagged', severity: 'high', category: 'paste', confidence: 'review suggested', expandedDetail: 'A block of 347 characters was pasted into the code editor. Occurred approx. 5 minutes and 46 seconds after the preceding tab switch event.' },
      { id: 'e5', timestamp: 1464000, elapsed: '24:24', label: 'AI help attempted', detail: 'Blocked — assessment mode', kind: 'info', severity: 'low', category: 'ai', expandedDetail: 'Student triggered the AI Copilot shortcut. Request was blocked at the system level by assessment lock settings.' },
      { id: 'e6', timestamp: 1880000, elapsed: '31:20', label: 'Exited fullscreen', detail: 'Returned after 3 seconds', kind: 'neutral', severity: 'low', category: 'fullscreen', expandedDetail: 'Student exited fullscreen mode briefly. Returned to fullscreen within 3 seconds.' },
      { id: 'e7', timestamp: 2324000, elapsed: '38:44', label: 'Idle spike detected', detail: '4 min 20s without keystroke', kind: 'neutral', severity: 'medium', category: 'idle', confidence: 'low confidence', expandedDetail: 'Extended idle period with no keyboard input or mouse activity. Student may have been reading the problem or thinking.' },
      { id: 'e8', timestamp: 2701000, elapsed: '45:01', label: 'Assessment submitted', detail: '3 of 3 problems attempted', kind: 'done', severity: 'low', category: 'submission', expandedDetail: 'All problems attempted and submitted. Assessment session closed.' },
    ],
  },
  {
    id: 's2',
    studentName: 'Raj P.',
    assessmentName: 'Assessment #3',
    duration: '42:10',
    status: 'submitted',
    questionsAttempted: 2,
    totalQuestions: 3,
    score: 52,
    summary: { tabSwitches: 3, fullscreenExits: 1, largePastes: 2, idleSpikes: 0, submissionMoments: 1 },
    clusters: [
      {
        id: 'c1',
        title: 'Repeated tab switches with pastes',
        timeRange: '08:22 – 16:30',
        confidence: 'notable cluster',
        eventCount: 4,
        description: 'Three tab switches and two large paste events occurred in close succession over an 8-minute window. Pattern warrants instructor attention.',
        events: ['Left assessment tab · Duration: 14 seconds', 'Large paste · 892 characters pasted', 'Left assessment tab · Duration: 2 seconds', 'Large paste · 204 characters pasted'],
      },
    ],
    events: [
      { id: 'e1', timestamp: 0, elapsed: '00:00', label: 'Assessment started', detail: 'Fullscreen enabled', kind: 'neutral', severity: 'low', category: 'system' },
      { id: 'e2', timestamp: 502000, elapsed: '08:22', label: 'Left assessment tab', detail: 'Duration: 14 seconds', kind: 'flagged', severity: 'high', category: 'tab', confidence: 'notable cluster', expandedDetail: 'Student left the tab for 14 seconds — the longest tab-away duration in this session. A large paste followed shortly after return.' },
      { id: 'e3', timestamp: 900000, elapsed: '15:00', label: 'Large paste detected', detail: '892 characters pasted', kind: 'flagged', severity: 'high', category: 'paste', confidence: 'notable cluster', expandedDetail: '892-character code block pasted into the editor. Largest paste event in this session.' },
      { id: 'e4', timestamp: 990000, elapsed: '16:30', label: 'Left assessment tab', detail: 'Duration: 2 seconds', kind: 'flagged', severity: 'low', category: 'tab', confidence: 'review suggested', expandedDetail: 'Another short tab exit in the cluster window.' },
      { id: 'e5', timestamp: 1020000, elapsed: '17:00', label: 'Large paste detected', detail: '204 characters pasted', kind: 'flagged', severity: 'medium', category: 'paste', confidence: 'notable cluster', expandedDetail: 'Second paste event in a short time window.' },
      { id: 'e6', timestamp: 1725000, elapsed: '28:45', label: 'Exited fullscreen', detail: 'Duration: 7 seconds', kind: 'neutral', severity: 'medium', category: 'fullscreen', expandedDetail: 'Student left fullscreen for 7 seconds and returned.' },
      { id: 'e7', timestamp: 2130000, elapsed: '35:30', label: 'Left assessment tab', detail: 'Duration: 1 second', kind: 'flagged', severity: 'low', category: 'tab', confidence: 'low confidence', expandedDetail: 'Very brief tab switch, likely accidental.' },
      { id: 'e8', timestamp: 2530000, elapsed: '42:10', label: 'Assessment submitted', detail: '2 of 3 problems attempted', kind: 'done', severity: 'low', category: 'submission', expandedDetail: 'Assessment submitted with 1 problem unattempted.' },
    ],
  },
  {
    id: 's3',
    studentName: 'Alice C.',
    assessmentName: 'Assessment #3',
    duration: '43:18',
    status: 'submitted',
    questionsAttempted: 3,
    totalQuestions: 3,
    score: 94,
    summary: { tabSwitches: 0, fullscreenExits: 0, largePastes: 0, idleSpikes: 1, submissionMoments: 1 },
    clusters: [],
    events: [
      { id: 'e1', timestamp: 0, elapsed: '00:00', label: 'Assessment started', detail: 'Fullscreen enabled', kind: 'neutral', severity: 'low', category: 'system' },
      { id: 'e2', timestamp: 1640000, elapsed: '27:20', label: 'Idle spike detected', detail: '2 min 45s without keystroke', kind: 'neutral', severity: 'low', category: 'idle', confidence: 'low confidence', expandedDetail: 'Brief pause in activity. Likely reading or planning.' },
      { id: 'e3', timestamp: 2598000, elapsed: '43:18', label: 'Assessment submitted', detail: '3 of 3 problems attempted', kind: 'done', severity: 'low', category: 'submission', expandedDetail: 'Clean session. All problems attempted.' },
    ],
  },
];

// ── Filter categories ──────────────────────────────────────────
type FilterOption = 'all' | 'paste' | 'idle' | 'tab' | 'ai' | 'submission';
const FILTER_LABELS: Record<FilterOption, string> = {
  all: 'All',
  paste: 'Paste events',
  idle: 'Idle spikes',
  tab: 'Focus changes',
  ai: 'AI help',
  submission: 'Submission moments',
};

// ── Style constants ────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DOT: Record<IntegrityEventKind, string> = {
  neutral: 'rgba(255,255,255,0.28)',
  flagged: 'rgba(251,146,60,0.85)',
  done: 'rgba(74,222,128,0.7)',
  info: 'rgba(99,179,237,0.8)',
};

const LABEL: Record<IntegrityEventKind, string> = {
  neutral: 'rgba(255,255,255,0.65)',
  flagged: 'rgba(251,146,60,0.92)',
  done: 'rgba(74,222,128,0.82)',
  info: 'rgba(99,179,237,0.9)',
};

const SEV_STYLE: Record<Severity, React.CSSProperties> = {
  low: { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.08)' },
  medium: { background: 'rgba(251,191,36,0.06)', color: 'rgba(251,191,36,0.72)', border: '1px solid rgba(251,191,36,0.14)' },
  high: { background: 'rgba(239,68,68,0.07)', color: 'rgba(239,68,68,0.78)', border: '1px solid rgba(239,68,68,0.16)' },
};

const CONF_STYLE: Record<Confidence, React.CSSProperties> = {
  'low confidence': { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.30)', border: '1px solid rgba(255,255,255,0.07)' },
  'review suggested': { background: 'rgba(251,146,60,0.06)', color: 'rgba(251,146,60,0.70)', border: '1px solid rgba(251,146,60,0.14)' },
  'notable cluster': { background: 'rgba(239,68,68,0.07)', color: 'rgba(239,68,68,0.78)', border: '1px solid rgba(239,68,68,0.16)' },
};

const CAT_ICON: Record<EventCategory, React.ReactNode> = {
  system: <Shield size={11} strokeWidth={2} />,
  tab: <Monitor size={11} strokeWidth={2} />,
  fullscreen: <Eye size={11} strokeWidth={2} />,
  paste: <Clipboard size={11} strokeWidth={2} />,
  idle: <Clock size={11} strokeWidth={2} />,
  submission: <CheckCircle2 size={11} strokeWidth={2} />,
  ai: <Zap size={11} strokeWidth={2} />,
};

// ── Sub-components ─────────────────────────────────────────────
function SessionOverviewStrip({ session }: { session: SessionData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '14px',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={15} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.45)' }} />
        </div>
        <div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>{session.studentName}</div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,0.30)', letterSpacing: '0.05em' }}>{session.assessmentName}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { icon: <Clock size={11} strokeWidth={2} />, label: session.duration },
          { icon: <CheckCircle2 size={11} strokeWidth={2} />, label: session.status === 'submitted' ? 'Submitted' : 'In Progress' },
          { icon: <Shield size={11} strokeWidth={2} />, label: `${session.questionsAttempted}/${session.totalQuestions} attempted` },
          ...(session.score !== null ? [{ icon: <Zap size={11} strokeWidth={2} />, label: `${session.score}%` }] : []),
        ].map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'rgba(255,255,255,0.42)', padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {item.icon}{item.label}
          </span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: session.status === 'submitted' ? 'rgba(74,222,128,0.72)' : 'rgba(251,146,60,0.72)', padding: '4px 10px', borderRadius: '8px', background: session.status === 'submitted' ? 'rgba(74,222,128,0.06)' : 'rgba(251,146,60,0.06)', border: `1px solid ${session.status === 'submitted' ? 'rgba(74,222,128,0.14)' : 'rgba(251,146,60,0.14)'}` }}>
          {session.status === 'submitted' ? <CheckCircle2 size={11} strokeWidth={2} /> : <Clock size={11} strokeWidth={2} />}
          {session.status === 'submitted' ? 'Finished' : 'Active'}
        </span>
      </div>
    </motion.div>
  );
}

function IntegritySummaryCard({ icon, label, count, flagged }: { icon: React.ReactNode; label: string; count: number; flagged?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      style={{
        flex: '1 1 0',
        minWidth: '100px',
        border: `1px solid ${flagged && count > 0 ? 'rgba(251,146,60,0.18)' : 'rgba(255,255,255,0.07)'}`,
        borderTop: `2px solid ${flagged && count > 0 ? 'rgba(251,146,60,0.40)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: '12px',
        background: flagged && count > 0 ? 'linear-gradient(160deg,rgba(251,146,60,0.05) 0%,rgba(255,255,255,0.02) 100%)' : 'linear-gradient(160deg,rgba(255,255,255,0.025) 0%,rgba(255,255,255,0.008) 100%)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: flagged && count > 0 ? 'rgba(251,146,60,0.65)' : 'rgba(255,255,255,0.30)' }}>{icon}</span>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '22px', fontWeight: 700, color: flagged && count > 0 ? 'rgba(251,146,60,0.90)' : count === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.80)' }}>{count}</span>
      </div>
      <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.3 }}>{label}</span>
    </motion.div>
  );
}

function EventLegend() {
  const items = [
    { kind: 'neutral' as IntegrityEventKind, label: 'Neutral / System' },
    { kind: 'flagged' as IntegrityEventKind, label: 'Flagged event' },
    { kind: 'done' as IntegrityEventKind, label: 'Submission / completion' },
    { kind: 'info' as IntegrityEventKind, label: 'Informational' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '14px 20px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: 'rgba(255,255,255,0.015)' }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase', marginRight: '4px' }}>Legend</span>
      {items.map(item => (
        <div key={item.kind} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DOT[item.kind] }} />
          <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function TimelineEventRow({ event, index, isLast }: { event: IntegrityEventFull; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!event.expandedDetail;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: EASE }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', paddingBottom: isLast ? 0 : '20px' }}
    >
      {!isLast && (
        <div style={{ position: 'absolute', left: '3.5px', top: '14px', bottom: 0, width: '1px', background: 'rgba(255,255,255,0.06)' }} />
      )}
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DOT[event.kind], marginTop: '5px', flexShrink: 0, zIndex: 1, boxShadow: event.kind === 'flagged' ? '0 0 6px rgba(251,146,60,0.35)' : undefined }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'rgba(255,255,255,0.22)', minWidth: '36px', flexShrink: 0, letterSpacing: '0.04em' }}>{event.elapsed}</span>
          <span style={{ fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '13px', color: LABEL[event.kind] }}>{event.label}</span>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{event.detail}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', padding: '2px 7px', borderRadius: '6px', ...SEV_STYLE[event.severity] }}>
            {CAT_ICON[event.category]}
            {event.severity}
          </span>
          {event.confidence && (
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', padding: '2px 8px', borderRadius: '6px', ...CONF_STYLE[event.confidence] }}>
              {event.confidence}
            </span>
          )}
          {hasDetail && (
            <button
              onClick={() => setExpanded(v => !v)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', color: 'rgba(255,255,255,0.28)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', marginLeft: '2px', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
            >
              <ChevronDown size={11} style={{ transform: expanded ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
              {expanded ? 'less' : 'details'}
            </button>
          )}
        </div>

        <AnimatePresence>
          {expanded && event.expandedDetail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: '10px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'DM Sans,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.65 }}>
                {event.expandedDetail}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ClusterCard({ cluster }: { cluster: ClusterData }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{
        border: `1px solid ${cluster.confidence === 'notable cluster' ? 'rgba(239,68,68,0.18)' : 'rgba(251,146,60,0.18)'}`,
        borderLeft: `3px solid ${cluster.confidence === 'notable cluster' ? 'rgba(239,68,68,0.55)' : 'rgba(251,146,60,0.50)'}`,
        borderRadius: '10px',
        background: cluster.confidence === 'notable cluster' ? 'rgba(239,68,68,0.04)' : 'rgba(251,146,60,0.03)',
        padding: '14px 18px',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(v => !v)}
      whileHover={{ scale: 1.003 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <AlertTriangle size={13} strokeWidth={2} style={{ color: cluster.confidence === 'notable cluster' ? 'rgba(239,68,68,0.72)' : 'rgba(251,146,60,0.72)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>{cluster.title}</span>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', padding: '2px 8px', borderRadius: '6px', ...CONF_STYLE[cluster.confidence] }}>{cluster.confidence}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>{cluster.timeRange}</span>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,0.22)' }}>{cluster.eventCount} events</span>
          </div>
        </div>
        <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.30)', flexShrink: 0, transform: expanded ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: '0 0 10px' }}>{cluster.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {cluster.events.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(251,146,60,0.50)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,0.32)' }}>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main page component ─────────────────────────────────────────
const IntegrityTimeline = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(MOCK_SESSIONS[0].id);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const session = MOCK_SESSIONS.find(s => s.id === selectedSessionId) ?? MOCK_SESSIONS[0];

  const filteredEvents = session.events.filter(ev => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'paste') return ev.category === 'paste';
    if (activeFilter === 'idle') return ev.category === 'idle';
    if (activeFilter === 'tab') return ev.category === 'tab' || ev.category === 'fullscreen';
    if (activeFilter === 'ai') return ev.category === 'ai';
    if (activeFilter === 'submission') return ev.category === 'submission';
    return true;
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg,#0a0a0b 0%,#0d0d10 60%,#0a0a0b 100%)', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%,black 0%,transparent 100%)', opacity: 0.5 }} />
        <motion.div animate={{ y: [-20, 20, -20], opacity: [0.10, 0.18, 0.10] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,146,60,0.06) 0%,transparent 70%)', filter: 'blur(80px)' }} />
        <motion.div animate={{ y: [20, -20, 20], opacity: [0.07, 0.14, 0.07] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }} style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,179,237,0.05) 0%,transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem', boxSizing: 'border-box' }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.18)', marginBottom: '18px', textTransform: 'uppercase' }}>
            Assessment Transparency
          </div>
          <h1 style={{ fontFamily: 'Syne,Arial,sans-serif', fontWeight: 800, fontSize: 'clamp(36px,6vw,62px)', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)', margin: '0 0 18px', lineHeight: 1.08 }}>
            Integrity insights,<br />not verdicts.
          </h1>
          <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto', letterSpacing: '-0.01em' }}>
            We don&apos;t call it cheat detection. We call it the Integrity Timeline — a factual, neutral log of session events that puts the instructor in control of interpretation.
          </p>
        </motion.div>

        {/* Student selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}
        >
          {MOCK_SESSIONS.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedSessionId(s.id); setActiveFilter('all'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9px', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', fontWeight: 500, transition: 'all 0.18s ease',
                background: selectedSessionId === s.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: selectedSessionId === s.id ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.07)',
                color: selectedSessionId === s.id ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.38)',
              }}
              onMouseEnter={e => { if (selectedSessionId !== s.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.58)'; } }}
              onMouseLeave={e => { if (selectedSessionId !== s.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; } }}
            >
              <User size={12} strokeWidth={2} />
              {s.studentName}
              {(s.summary.tabSwitches + s.summary.largePastes) > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(251,146,60,0.18)', color: 'rgba(251,146,60,0.80)', fontSize: '9px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>
                  {s.summary.tabSwitches + s.summary.largePastes}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Session overview strip */}
        <SessionOverviewStrip session={session} />

        {/* Anomaly summary cards */}
        <motion.div
          key={`summary-${session.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}
        >
          <IntegritySummaryCard icon={<Monitor size={15} strokeWidth={1.8} />} label="Tab switches" count={session.summary.tabSwitches} flagged />
          <IntegritySummaryCard icon={<Eye size={15} strokeWidth={1.8} />} label="Fullscreen exits" count={session.summary.fullscreenExits} />
          <IntegritySummaryCard icon={<Clipboard size={15} strokeWidth={1.8} />} label="Paste events" count={session.summary.largePastes} flagged />
          <IntegritySummaryCard icon={<Clock size={15} strokeWidth={1.8} />} label="Idle spikes" count={session.summary.idleSpikes} />
          <IntegritySummaryCard icon={<CheckCircle2 size={15} strokeWidth={1.8} />} label="Submission moments" count={session.summary.submissionMoments} />
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          style={{ display: 'flex', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}
        >
          {(Object.keys(FILTER_LABELS) as FilterOption[]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '5px 13px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: '12px', fontWeight: 500, transition: 'all 0.15s ease',
                background: activeFilter === f ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
                border: activeFilter === f ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.07)',
                color: activeFilter === f ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.32)',
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </motion.div>

        {/* Main timeline card */}
        <motion.div
          key={`timeline-${session.id}-${activeFilter}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ border: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.14)', borderRadius: '16px', overflow: 'hidden', background: '#0c1018', marginBottom: '20px' }}
        >
          {/* Timeline header */}
          <div style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
              Session · {session.studentName}{' — '}{session.assessmentName}
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {session.summary.tabSwitches > 0 && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '10px', background: 'rgba(251,146,60,0.08)', color: 'rgba(251,146,60,0.72)', border: '1px solid rgba(251,146,60,0.18)' }}>{session.summary.tabSwitches} tab switch{session.summary.tabSwitches !== 1 ? 'es' : ''}</span>}
              {session.summary.fullscreenExits > 0 && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.08)' }}>{session.summary.fullscreenExits} fullscreen exit{session.summary.fullscreenExits !== 1 ? 's' : ''}</span>}
              {session.summary.largePastes > 0 && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '10px', background: 'rgba(251,146,60,0.08)', color: 'rgba(251,146,60,0.72)', border: '1px solid rgba(251,146,60,0.18)' }}>{session.summary.largePastes} large paste{session.summary.largePastes !== 1 ? 's' : ''}</span>}
              {session.summary.tabSwitches === 0 && session.summary.fullscreenExits === 0 && session.summary.largePastes === 0 && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '10px', background: 'rgba(74,222,128,0.06)', color: 'rgba(74,222,128,0.60)', border: '1px solid rgba(74,222,128,0.14)' }}>no signals</span>}
            </div>
          </div>

          {/* Events list */}
          <div style={{ padding: '24px 28px', position: 'relative' }}>
            {filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <Shield size={32} strokeWidth={1.4} style={{ color: 'rgba(255,255,255,0.15)' }} />
                <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>No events in this category</p>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>Try selecting &quot;All&quot; to view the full timeline</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={`events-${activeFilter}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {filteredEvents.map((event, i) => (
                    <TimelineEventRow key={event.id} event={event} index={i} isLast={i === filteredEvents.length - 1} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Footer disclaimer */}
          <div style={{ padding: '14px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.012)' }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: 'rgba(255,255,255,0.18)', lineHeight: 1.6, letterSpacing: '0.04em', maxWidth: '480px' }}>
              No automated verdict is generated. Interpretation is the instructor&apos;s responsibility.
            </span>
            <button
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'rgba(255,255,255,0.42)', background: 'transparent', border: '1px solid rgba(255,255,255,0.10)', padding: '6px 14px', borderRadius: '7px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.42)'; }}
            >
              View Full Replay &rarr;
            </button>
          </div>
        </motion.div>

        {/* Flagged clusters */}
        {session.clusters.length > 0 && (
          <motion.div
            key={`clusters-${session.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
            style={{ marginBottom: '20px' }}
          >
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.20)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Flagged Clusters
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {session.clusters.map(cluster => (
                <ClusterCard key={cluster.id} cluster={cluster} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <EventLegend />
        </motion.div>
      </div>
    </div>
  );
};

export default IntegrityTimeline;
