import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Play,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { executeCode } from '../../api/api';
import { buildTestRunner, dsaProblems, type DSAProblem } from '../../data/dsaProblems';
import type { Language } from '../../types';
import HintPanel from '../../components/ai/HintPanel';
import AIChatBot from '../../components/ai/AIChatBot';
import './ChallengeSolve.scss';

const STORAGE_KEY = 'cbg_completed_challenges';

const LANG_CONFIG: Record<Language, { label: string; monacoId: string; badgeColor: string; badgeBg: string }> = {
  javascript: { label: 'JavaScript', monacoId: 'javascript', badgeColor: '#f7df1e', badgeBg: 'rgba(247,223,30,0.12)' },
  python:     { label: 'Python',     monacoId: 'python',     badgeColor: '#4ade80', badgeBg: 'rgba(74,222,128,0.12)' },
  java:       { label: 'Java',       monacoId: 'java',       badgeColor: '#fb923c', badgeBg: 'rgba(251,146,60,0.12)'  },
  cpp:        { label: 'C++',        monacoId: 'cpp',        badgeColor: '#a78bfa', badgeBg: 'rgba(167,139,250,0.12)' },
  c:          { label: 'C',          monacoId: 'c',          badgeColor: '#94a3b8', badgeBg: 'rgba(148,163,184,0.12)' },
};

function getCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set<string>(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function markCompleted(slug: string) {
  const s = getCompleted();
  s.add(slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
  window.dispatchEvent(new Event('storage'));
}

function buildStarterForLanguage(problem: DSAProblem, lang: Language): string {
  const match = problem.functionSignature.match(/\(([^)]*)\)/);
  const params = match?.[1] ?? '';
  const fnName = problem.functionSignature.replace(/^function\s+/, '').split('(')[0];
  switch (lang) {
    case 'python':
      return `def ${fnName}(${params}):\n    # Your code here\n    pass`;
    case 'java':
      return `import java.util.*;\nimport java.util.Arrays;\n\nclass Solution {\n    public static Object ${fnName}(${params.split(',').map((p) => `Object ${p.trim()}`).join(', ')}) {\n        // Your code here\n        return null;\n    }\n\n    public static void main(String[] args) {\n        // Call ${fnName}() and print results\n    }\n}`;
    case 'cpp':
      return `#include <bits/stdc++.h>\nusing namespace std;\n\nauto ${fnName}(${params}) {\n    // Your code here\n}\n\nint main() {\n    // Call ${fnName}() and print results\n    return 0;\n}`;
    case 'c':
      return `#include <stdio.h>\n#include <stdlib.h>\n\n// TODO: implement ${fnName}(${params})\n\nint main() {\n    // Call your function and print results\n    return 0;\n}`;
    default: // javascript
      return `function ${fnName}(${params}) {\n  // Your code here\n  \n}`;
  }
}

interface TestResult {
  case: number;
  pass: boolean;
  result?: unknown;
  expected?: unknown;
  error?: string;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

export default function ChallengeSolve() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const problemIndex = dsaProblems.findIndex((p) => p.slug === slug);
  const problem = problemIndex >= 0 ? dsaProblems[problemIndex] : null;

  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [allPass, setAllPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(getCompleted);
  const editorRef = useRef<unknown>(null);

  // Reset state when problem or language changes
  useEffect(() => {
    if (!problem) return;
    setCode(buildStarterForLanguage(problem, language));
    setResults(null);
    setAllPass(false);
    setError(null);
  }, [problem, language]);

  // Sync completed status
  useEffect(() => {
    const handler = () => setCompleted(getCompleted());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const isCompleted = problem ? completed.has(problem.slug) : false;

  const handleRun = useCallback(async () => {
    if (!problem) return;
    setRunning(true);
    setResults(null);
    setError(null);
    setAllPass(false);

    try {
      const runnerCode = buildTestRunner(problem, code, language);
      const response = await executeCode(runnerCode, language);
      const stdout = response.run.stdout;
      const stderr = response.run.stderr;

      if (stderr && !stdout) {
        setError(stderr.trim());
        return;
      }

      const parsed: TestResult[] = stdout
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          try {
            return JSON.parse(line) as TestResult;
          } catch {
            return null;
          }
        })
        .filter((r): r is TestResult => r !== null);

      setResults(parsed);

      const passed = parsed.length > 0 && parsed.every((r) => r.pass);
      setAllPass(passed);

      if (passed && problem) {
        markCompleted(problem.slug);
        setCompleted(getCompleted());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed. Is the backend running?');
    } finally {
      setRunning(false);
    }
  }, [problem, code, language]);

  // Navigate to sibling problem
  function navigateTo(delta: number) {
    if (delta > 0 && !isCompleted) return; // must solve current before going forward
    const diff = problem?.difficulty ?? 'easy';
    const siblings = dsaProblems.filter((p) => p.difficulty === diff);
    const sibIdx = siblings.findIndex((p) => p.slug === slug);
    const next = siblings[sibIdx + delta];
    if (next) navigate(`/practice/${next.slug}`);
  }

  const siblingProblems = problem ? dsaProblems.filter((p) => p.difficulty === problem.difficulty) : [];
  const sibIdx = siblingProblems.findIndex((p) => p.slug === slug);

  if (!problem) {
    return (
      <div className="challenge-solve challenge-solve--not-found">
        <p>Problem not found.</p>
        <button onClick={() => navigate('/practice')}>← Back to challenges</button>
      </div>
    );
  }

  const diffColor = DIFFICULTY_COLOR[problem.difficulty] ?? '#a1a1aa';

  return (
    <div className="challenge-solve">
      {/* Top bar */}
      <header className="challenge-solve__topbar">
        <button
          className="challenge-solve__back"
          onClick={() => navigate('/practice')}
        >
          <ChevronLeft size={16} />
          Challenges
        </button>

        <div className="challenge-solve__meta">
          <span
            className="challenge-solve__diff"
            style={{ color: diffColor, borderColor: diffColor + '44', background: diffColor + '11' }}
          >
            {problem.difficulty}
          </span>
          <span className="challenge-solve__problem-title">{problem.title}</span>
          {isCompleted && (
            <CheckCircle2 size={16} className="challenge-solve__check" />
          )}
        </div>

        <div className="challenge-solve__nav">
          <button
            className="challenge-solve__nav-btn"
            onClick={() => navigateTo(-1)}
            disabled={sibIdx <= 0}
            title="Previous problem"
          >
            <ArrowLeft size={15} />
          </button>
          <span className="challenge-solve__nav-label">
            {sibIdx + 1} / {siblingProblems.length}
          </span>
          <button
            className={`challenge-solve__nav-btn ${!isCompleted ? 'challenge-solve__nav-btn--locked' : ''}`}
            onClick={() => navigateTo(1)}
            disabled={sibIdx >= siblingProblems.length - 1 || !isCompleted}
            title={!isCompleted ? 'Solve this problem to unlock the next one' : 'Next problem'}
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      <div className="challenge-solve__body">
        {/* Left panel: problem description */}
        <aside className="challenge-solve__panel challenge-solve__panel--left">
          <div className="challenge-solve__section">
            <h2 className="challenge-solve__section-heading">Problem</h2>
            <p className="challenge-solve__description">{problem.description}</p>
          </div>

          <div className="challenge-solve__section">
            <h3 className="challenge-solve__section-subheading">Constraints</h3>
            <ul className="challenge-solve__list">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="challenge-solve__section">
            <h3 className="challenge-solve__section-subheading">Example Test Cases</h3>
            <div className="challenge-solve__cases">
              {problem.testCases.slice(0, 3).map((tc, i) => (
                <div key={i} className="challenge-solve__case">
                  <div className="challenge-solve__case-row">
                    <span className="challenge-solve__case-label">Input:</span>
                    <code className="challenge-solve__case-code">
                      {Object.entries(tc.input)
                        .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
                        .join(', ')}
                    </code>
                  </div>
                  <div className="challenge-solve__case-row">
                    <span className="challenge-solve__case-label">Expected:</span>
                    <code className="challenge-solve__case-code">
                      {JSON.stringify(tc.expected)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="challenge-solve__tags">
            {problem.tags.map((t) => (
              <span key={t} className="challenge-solve__tag">
                {t.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          {/* AI Hint Panel */}
          <HintPanel
            key={problem.slug}
            problemTitle={problem.title}
            problemDescription={problem.description}
            constraints={problem.constraints}
            userCode={code}
          />
        </aside>

        {/* Right panel: editor + output */}
        <main className="challenge-solve__panel challenge-solve__panel--right">
          <div className="challenge-solve__editor-wrap">
            <div className="challenge-solve__editor-bar">
              <select
                className="challenge-solve__lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                {(Object.keys(LANG_CONFIG) as Language[]).map((lang) => (
                  <option key={lang} value={lang}>
                    {LANG_CONFIG[lang].label}
                  </option>
                ))}
              </select>
              <button
                className={`challenge-solve__run-btn ${running ? 'challenge-solve__run-btn--loading' : ''}`}
                onClick={() => void handleRun()}
                disabled={running}
              >
                {running ? (
                  <>
                    <Loader2 size={14} className="spin" />
                    Running…
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Run Tests
                  </>
                )}
              </button>
            </div>

            <Editor
              height="100%"
              language={LANG_CONFIG[language].monacoId}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                bracketPairColorization: { enabled: true },
                renderWhitespace: 'none',
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Output panel */}
          <div className="challenge-solve__output">
            {!results && !error && !running && (
              <p className="challenge-solve__output-hint">
                Click <strong>Run Tests</strong> to execute your solution against all test cases.
              </p>
            )}

            {running && (
              <div className="challenge-solve__output-loading">
                <Loader2 size={20} className="spin" />
                <span>Executing…</span>
              </div>
            )}

            {error && (
              <div className="challenge-solve__error">
                <XCircle size={16} />
                <pre>{error}</pre>
              </div>
            )}

            {results && (
              <div className="challenge-solve__results">
                {allPass ? (
                  <motion.div
                    className="challenge-solve__all-pass"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <CheckCircle2 size={20} />
                    All {results.length} test cases passed!
                    {!isCompleted && (
                      <span className="challenge-solve__unlocked">Level unlocked 🎉</span>
                    )}
                  </motion.div>
                ) : (
                  <p className="challenge-solve__partial">
                    {results.filter((r) => r.pass).length} / {results.length} passed
                  </p>
                )}

                <div className="challenge-solve__test-list">
                  {results.map((r, i) => (
                    <div
                      key={i}
                      className={`challenge-solve__test-item ${r.pass ? 'challenge-solve__test-item--pass' : 'challenge-solve__test-item--fail'}`}
                    >
                      <div className="challenge-solve__test-header">
                        {r.pass ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}
                        <span>Case {r.case + 1}</span>
                      </div>
                      <div className="challenge-solve__test-detail">
                        {r.error ? (
                          <span className="challenge-solve__test-error">{r.error}</span>
                        ) : (
                          <>
                            <div className={`challenge-solve__test-row ${
                              r.pass ? 'challenge-solve__test-row--pass' : 'challenge-solve__test-row--got'
                            }`}>
                              <span className="challenge-solve__test-row-label">
                                {r.pass ? 'OUTPUT' : 'YOUR OUTPUT'}
                              </span>
                              <code className="challenge-solve__test-row-value">
                                {JSON.stringify(r.result)}
                              </code>
                            </div>
                            {!r.pass && (
                              <div className="challenge-solve__test-row challenge-solve__test-row--expected">
                                <span className="challenge-solve__test-row-label">EXPECTED</span>
                                <code className="challenge-solve__test-row-value">
                                  {JSON.stringify(r.expected)}
                                </code>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* AI Chat Bot */}
      <AIChatBot
        problemTitle={problem.title}
        problemDescription={problem.description}
        userCode={code}
      />
    </div>
  );
}
