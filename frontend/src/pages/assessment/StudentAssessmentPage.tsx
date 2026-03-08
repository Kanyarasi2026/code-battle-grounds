import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Flag,
  Loader2,
  Lock,
  Play,
  RotateCcw,
  Save,
  Shield,
  Upload,
  X,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { registerCodebattlegroundTheme } from '../../config/monacoTheme';
import { executeCode } from '../../api/api';
import { CODE_SNIPPETS } from '../../api/constant';
import type { Language } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import './StudentAssessmentPage.scss';

// Mock data
const mockAssessment = {
  title: 'Data Structures Midterm',
  difficulty: 'Medium',
  type: 'Timed Assessment',
  totalQuestions: 5,
  duration: 90, // minutes
  attemptLimit: 1,
  currentAttempt: 1,
};

const mockQuestions = [
  { id: 1, title: 'Implement Binary Search', status: 'answered', flagged: false },
  { id: 2, title: 'Reverse Linked List', status: 'in-progress', flagged: false },
  { id: 3, title: 'Two Sum Problem', status: 'not-started', flagged: false },
  { id: 4, title: 'Merge Sorted Arrays', status: 'not-started', flagged: true },
  { id: 5, title: 'Valid Parentheses', status: 'not-started', flagged: false },
];

const mockProblem = {
  title: 'Reverse Linked List',
  difficulty: 'Medium',
  topics: ['Linked Lists', 'Pointers', 'Recursion'],
  description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

A linked list can be reversed either iteratively or recursively. Could you implement both?`,
  examples: [
    {
      input: 'head = [1,2,3,4,5]',
      output: '[5,4,3,2,1]',
      explanation: 'The list is reversed from [1→2→3→4→5] to [5→4→3→2→1]',
    },
    {
      input: 'head = [1,2]',
      output: '[2,1]',
    },
    {
      input: 'head = []',
      output: '[]',
    },
  ],
  constraints: [
    'The number of nodes in the list is the range [0, 5000]',
    '-5000 <= Node.val <= 5000',
  ],
  notes: 'Follow-up: A linked list can be reversed either iteratively or recursively. Could you implement both?',
};

const mockTestResults = [
  { id: 1, name: 'Example 1', status: 'passed', time: '12ms', memory: '42.1MB' },
  { id: 2, name: 'Example 2', status: 'passed', time: '8ms', memory: '41.8MB' },
  { id: 3, name: 'Edge: Empty List', status: 'failed', time: '—', memory: '—' },
  { id: 4, name: 'Large Input', status: 'passed', time: '124ms', memory: '48.3MB' },
];

// Language mapping from display name to code
const LANGUAGE_MAP: Record<string, Language> = {
  'JavaScript': 'javascript',
  'Python': 'python',
  'Java': 'java',
  'C++': 'cpp',
  'C': 'c',
};

const StudentAssessmentPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(2);
  const [timeRemaining] = useState(82); // minutes - setter would be used with real timer
  const [lastSaved] = useState('2 seconds ago'); // setter would be used with real autosave
  const [showTestResults, setShowTestResults] = useState(false);
  const [showLowTimeWarning, setShowLowTimeWarning] = useState(false);
  const [showRestrictionWarning, setShowRestrictionWarning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  
  // Code execution state
  const [code, setCode] = useState<string>(CODE_SNIPPETS.javascript);
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string>('');
  const [codeRunCount, setCodeRunCount] = useState(0);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const questionsAnswered = mockQuestions.filter(q => q.status === 'answered').length;
  const progressPercent = (questionsAnswered / mockQuestions.length) * 100;
  const testsPassed = mockTestResults.filter(t => t.status === 'passed').length;

  // Monaco editor setup
  const onMount: OnMount = (ed, monaco) => {
    registerCodebattlegroundTheme(monaco);
    monaco.editor.setTheme('codebattleground');
    editorRef.current = ed;
    ed.focus();
  };

  // Handle language selection change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const displayLang = e.target.value;
    setSelectedLanguage(displayLang);
    const lang = LANGUAGE_MAP[displayLang];
    if (lang) {
      setCode(CODE_SNIPPETS[lang]);
      setOutput('');
      setExecutionError('');
      setShowTestResults(false);
    }
  };

  // Handle code change
  const handleCodeChange = (value: string | undefined) => {
    setCode(value ?? '');
  };

  // Reset code to starter template
  const handleResetCode = () => {
    const lang = LANGUAGE_MAP[selectedLanguage];
    if (lang) {
      setCode(CODE_SNIPPETS[lang]);
      toast.success('Code reset to starter template');
    }
  };

  // Execute code
  const handleRunCode = async () => {
    const lang = LANGUAGE_MAP[selectedLanguage];
    if (!lang) {
      toast.error('Invalid language selected');
      return;
    }

    const sourceCode = editorRef.current?.getValue() || code;
    if (!sourceCode?.trim()) {
      toast.error('No code to run');
      return;
    }

    try {
      setIsExecuting(true);
      setExecutionError('');
      setOutput('');
      setShowTestResults(true);

      const { run: result } = await executeCode(sourceCode, lang, '');
      const outputText = result.output || result.stderr || result.stdout || 'No output';
      const hasError = !!result.stderr || result.code !== 0;

      setOutput(outputText);
      setExecutionError(hasError ? outputText : '');
      setCodeRunCount(prev => prev + 1);

      if (hasError) {
        toast.error('Code execution completed with errors');
      } else {
        toast.success('Code executed successfully');
      }
    } catch (err) {
      const axiosErr = err as { response?: { status?: number }; code?: string };
      let msg = 'Error running code. Please try again.';
      
      if (axiosErr.response?.status === 429) {
        msg = 'Rate limit exceeded. Please wait before running again.';
      } else if (axiosErr.response?.status === 400) {
        msg = 'Invalid code or input. Please check your code.';
      } else if (axiosErr.code === 'ECONNABORTED') {
        msg = 'Request timeout. The code took too long to execute.';
      } else if (!axiosErr.response) {
        msg = 'Network error. Please check your connection.';
      }
      
      toast.error(msg);
      setExecutionError(msg);
      setOutput(msg);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitAssessment = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="student-assessment">
        <div className="student-assessment__background">
          <div className="student-assessment__grid-bg" />
        </div>
        <div className="student-assessment__container">
          <motion.div
            className="submission-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="submission-success__card">
              <div className="submission-success__icon">
                <CheckCircle2 size={64} strokeWidth={1.5} />
              </div>
              <h1 className="submission-success__title">Assessment Submitted Successfully</h1>
              <p className="submission-success__message">
                Your answers have been recorded and will be reviewed by your instructor.
              </p>
              <div className="submission-success__stats">
                <div className="stat">
                  <span className="stat__label">Questions Attempted</span>
                  <span className="stat__value">{questionsAnswered} / {mockAssessment.totalQuestions}</span>
                </div>
                <div className="stat">
                  <span className="stat__label">Test Cases Passed</span>
                  <span className="stat__value">{testsPassed} / {mockTestResults.length}</span>
                </div>
                <div className="stat">
                  <span className="stat__label">Submitted At</span>
                  <span className="stat__value">March 8, 2026 - 2:34 PM</span>
                </div>
                <div className="stat">
                  <span className="stat__label">Review Status</span>
                  <span className="stat__value">Pending</span>
                </div>
              </div>
              <div className="submission-success__note">
                <Shield size={18} strokeWidth={1.8} />
                <p>
                  Your session activity has been recorded for integrity review. This helps ensure fair 
                  assessment for all students.
                </p>
              </div>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-assessment">
      <div className="student-assessment__background">
        <div className="student-assessment__grid-bg" />
      </div>

      <div className="student-assessment__container">
        {/* Warning Banners */}
        {showLowTimeWarning && (
          <motion.div
            className="warning-banner warning-banner--time"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle size={18} strokeWidth={1.8} />
            <span>Only {timeRemaining} minutes remaining. Remember to submit before time expires.</span>
            <button onClick={() => setShowLowTimeWarning(false)}>
              <X size={16} />
            </button>
          </motion.div>
        )}

        {showRestrictionWarning && (
          <motion.div
            className="warning-banner warning-banner--restriction"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={18} strokeWidth={1.8} />
            <span>Tab switch detected. This activity is logged for integrity review.</span>
            <button onClick={() => setShowRestrictionWarning(false)}>
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Header */}
        <div className="student-assessment__header">
          <motion.button
            className="student-assessment__exit-btn"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
            <span>Exit</span>
          </motion.button>

          <div className="student-assessment__header-content">
            <motion.div
              className="student-assessment__icon-badge"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <BookOpen size={20} strokeWidth={1.8} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="student-assessment__title">Assessment Mode</h1>
              <p className="student-assessment__subtitle">
                Complete your coding assessment within the allotted time
              </p>
            </motion.div>
          </div>

          <div className="student-assessment__status-pills">
            <div className="status-pill status-pill--progress">
              <span className="status-pill__dot" />
              In Progress
            </div>
            <div className="status-pill status-pill--neutral">
              Attempt {mockAssessment.currentAttempt}/{mockAssessment.attemptLimit}
            </div>
            <div className="status-pill status-pill--neutral">
              {mockAssessment.difficulty}
            </div>
          </div>
        </div>

        {/* Fixed Status Bar */}
        <motion.div
          className="student-assessment__status-bar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="status-bar-left">
            <div className="timer">
              <Clock size={16} strokeWidth={1.8} />
              <span className="timer__value">{timeRemaining}m remaining</span>
            </div>
            <div className="question-indicator">
              <Code2 size={16} strokeWidth={1.8} />
              <span>Question {currentQuestion} / {mockAssessment.totalQuestions}</span>
            </div>
            <div className="autosave-status">
              <Save size={14} strokeWidth={1.8} />
              <span>Saved {lastSaved}</span>
            </div>
          </div>
          <div className="status-bar-right">
            <div className="integrity-badge">
              <Shield size={14} strokeWidth={1.8} />
              <span>Integrity Tracking</span>
            </div>
            <div className="restrictions-badge">
              <Lock size={14} strokeWidth={1.8} />
              <span>Restricted Mode</span>
            </div>
            <Button variant="primary" size="sm" iconLeft={<Upload size={16} />} onClick={handleSubmitAssessment}>
              Submit Assessment
            </Button>
          </div>
        </motion.div>

        {/* Main 3-Column Layout */}
        <div className="student-assessment__grid">
          {/* Left Sidebar */}
          <div className="student-assessment__sidebar student-assessment__sidebar--left">
            {/* Rules & Restrictions Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Shield size={18} strokeWidth={1.8} />
                    <h3 className="assessment-card__title">Rules & Restrictions</h3>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="restriction-list">
                    <div className="restriction-item restriction-item--active">
                      <Lock size={14} strokeWidth={1.8} />
                      <span>Fullscreen Required</span>
                    </div>
                    <div className="restriction-item restriction-item--active">
                      <Lock size={14} strokeWidth={1.8} />
                      <span>Copy/Paste Restricted</span>
                    </div>
                    <div className="restriction-item restriction-item--active">
                      <Shield size={14} strokeWidth={1.8} />
                      <span>Tab-Switch Tracked</span>
                    </div>
                    <div className="restriction-item restriction-item--active">
                      <Lock size={14} strokeWidth={1.8} />
                      <span>AI Hints Locked</span>
                    </div>
                    <div className="restriction-item restriction-item--enabled">
                      <Check size={14} strokeWidth={1.8} />
                      <span>Autosave Enabled</span>
                    </div>
                  </div>
                  <div className="restriction-note">
                    <p>
                      These settings ensure fair assessment. Your activity is logged for review, 
                      not for automatic penalties. Focus on demonstrating your understanding.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Question Navigator Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Code2 size={18} strokeWidth={1.8} />
                    <h3 className="assessment-card__title">Question Navigator</h3>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="question-grid">
                    {mockQuestions.map((q) => (
                      <button
                        key={q.id}
                        className={`question-bubble ${q.status === 'answered' ? 'question-bubble--answered' : ''} ${
                          q.status === 'in-progress' ? 'question-bubble--active' : ''
                        } ${q.flagged ? 'question-bubble--flagged' : ''}`}
                        onClick={() => setCurrentQuestion(q.id)}
                      >
                        {q.id}
                        {q.flagged && <Flag size={10} className="question-bubble__flag" />}
                      </button>
                    ))}
                  </div>
                  <div className="navigator-legend">
                    <div className="legend-item">
                      <span className="legend-dot legend-dot--answered" />
                      <span>Answered</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot legend-dot--active" />
                      <span>Current</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot legend-dot--flagged" />
                      <span>Flagged</span>
                    </div>
                  </div>
                  <div className="navigator-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      iconLeft={<ChevronLeft size={16} />}
                      disabled={currentQuestion === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      iconRight={<ChevronRight size={16} />}
                      disabled={currentQuestion === mockAssessment.totalQuestions}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Submission Confidence Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                    <h3 className="assessment-card__title">Your Progress</h3>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="progress-label">{Math.round(progressPercent)}% Complete</span>
                  </div>
                  <div className="confidence-stats">
                    <div className="confidence-stat">
                      <span className="confidence-stat__label">Questions Answered</span>
                      <span className="confidence-stat__value">
                        {questionsAnswered} / {mockAssessment.totalQuestions}
                      </span>
                    </div>
                    <div className="confidence-stat">
                      <span className="confidence-stat__label">Test Cases Passed</span>
                      <span className="confidence-stat__value">
                        {testsPassed} / {mockTestResults.length}
                      </span>
                    </div>
                  </div>
                  <div className="confidence-reminder">
                    <AlertCircle size={14} strokeWidth={1.8} />
                    <span>Review your answers before final submission</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Center Main Area */}
          <div className="student-assessment__main">
            {/* Problem Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <Card className="assessment-card problem-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <h2 className="problem-title">{mockProblem.title}</h2>
                    <span className={`difficulty-badge difficulty-badge--${mockProblem.difficulty.toLowerCase()}`}>
                      {mockProblem.difficulty}
                    </span>
                  </div>
                  <div className="problem-topics">
                    {mockProblem.topics.map((topic) => (
                      <span key={topic} className="topic-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="problem-description">
                    <p>{mockProblem.description}</p>
                  </div>

                  <div className="problem-section">
                    <h4 className="problem-section__title">Examples</h4>
                    {mockProblem.examples.map((example, idx) => (
                      <div key={idx} className="example-block">
                        <div className="example-item">
                          <strong>Input:</strong> <code>{example.input}</code>
                        </div>
                        <div className="example-item">
                          <strong>Output:</strong> <code>{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div className="example-item">
                            <strong>Explanation:</strong> {example.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="problem-section">
                    <h4 className="problem-section__title">Constraints</h4>
                    <ul className="constraints-list">
                      {mockProblem.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </div>

                  {mockProblem.notes && (
                    <div className="problem-section">
                      <h4 className="problem-section__title">Notes</h4>
                      <p className="problem-note">{mockProblem.notes}</p>
                    </div>
                  )}

                  <div className="hints-locked">
                    <Lock size={16} strokeWidth={1.8} />
                    <span>Hints are locked during assessment mode</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Code Editor Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <Card className="assessment-card editor-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Code2 size={18} strokeWidth={1.8} />
                    <h3 className="assessment-card__title">Code Editor</h3>
                  </div>
                  <div className="editor-toolbar">
                    <select
                      className="language-selector"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                    >
                      <option>JavaScript</option>
                      <option>Python</option>
                      <option>Java</option>
                      <option>C++</option>
                      <option>C</option>
                    </select>
                    <button className="toolbar-btn" title="Reset code" onClick={handleResetCode}>
                      <RotateCcw size={16} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="code-editor-container">
                    <Editor
                      height="400px"
                      language={LANGUAGE_MAP[selectedLanguage]}
                      value={code}
                      onChange={handleCodeChange}
                      onMount={onMount}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontLigatures: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        bracketPairColorization: { enabled: true },
                        cursorSmoothCaretAnimation: 'on',
                        cursorBlinking: 'smooth',
                        padding: { top: 12, bottom: 12 },
                        renderLineHighlight: 'line',
                        scrollbar: {
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                        lineNumbers: 'on',
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                      }}
                    />
                  </div>
                  <div className="editor-actions">
                    <div className="editor-status">
                      {isExecuting ? (
                        <span className="status-chip status-chip--running">
                          <Loader2 size={12} className="status-chip__spinner" />
                          Running...
                        </span>
                      ) : executionError ? (
                        <span className="status-chip status-chip--error">Error</span>
                      ) : output ? (
                        <span className="status-chip status-chip--success">Success</span>
                      ) : (
                        <span className="status-chip status-chip--idle">Ready</span>
                      )}
                    </div>
                    <div className="editor-buttons">
                      <Button
                        variant="secondary"
                        size="sm"
                        iconLeft={isExecuting ? <Loader2 size={16} className="button-spinner" /> : <Play size={16} />}
                        onClick={handleRunCode}
                        disabled={isExecuting}
                        loading={isExecuting}
                      >
                        Run Code
                      </Button>
                      <Button variant="primary" size="sm" iconLeft={<CheckCircle2 size={16} />}>
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="student-assessment__sidebar student-assessment__sidebar--right">
            {/* Test Results Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                    <h3 className="assessment-card__title">Test Results</h3>
                  </div>
                </div>
                <div className="assessment-card__body">
                  {showTestResults ? (
                    <>
                      {isExecuting ? (
                        <div className="test-results-loading">
                          <Loader2 size={32} strokeWidth={1.5} className="test-results-loading__spinner" />
                          <p>Executing code...</p>
                          <span className="test-results-loading__hint">Running test cases</span>
                        </div>
                      ) : (
                        <>
                          <div className="test-output-section">
                            <h4 className="test-output-section__title">Output</h4>
                            <pre className={`test-output ${executionError ? 'test-output--error' : 'test-output--success'}`}>
                              {output || 'No output'}
                            </pre>
                          </div>
                          
                          {executionError && (
                            <div className="test-message test-message--error">
                              <AlertCircle size={14} strokeWidth={1.8} />
                              <span>Execution Error</span>
                            </div>
                          )}
                          
                          {!executionError && output && (
                            <div className="test-message test-message--success">
                              <CheckCircle2 size={14} strokeWidth={1.8} />
                              <span>Code executed successfully</span>
                            </div>
                          )}

                          <div className="test-summary">
                            <div className="test-summary-stat">
                              <span className={`test-summary-stat__value ${executionError ? 'test-summary-stat__value--failed' : 'test-summary-stat__value--passed'}`}>
                                {executionError ? '0' : '1'}
                              </span>
                              <span className="test-summary-stat__label">Passed</span>
                            </div>
                            <div className="test-summary-stat">
                              <span className={`test-summary-stat__value ${executionError ? 'test-summary-stat__value--failed' : 'test-summary-stat__value--passed'}`}>
                                {executionError ? '1' : '0'}
                              </span>
                              <span className="test-summary-stat__label">Failed</span>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="test-results-empty">
                      <Play size={32} strokeWidth={1.5} />
                      <p>Run your code to see test results</p>
                      <span className="test-results-empty__hint">Output and test cases will appear here</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Assessment Timeline Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Clock size={18} strokeWidth={1.8} />
                    <h3 className="assessment-card__title">Activity Timeline</h3>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="timeline-item">
                    <Save size={14} strokeWidth={1.8} />
                    <div className="timeline-item__content">
                      <span className="timeline-item__label">Last Autosave</span>
                      <span className="timeline-item__value">{lastSaved}</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <Play size={14} strokeWidth={1.8} />
                    <div className="timeline-item__content">
                      <span className="timeline-item__label">Code Runs</span>
                      <span className="timeline-item__value">{codeRunCount} attempts</span>
                    </div>
                  </div>
                  <div className="timeline-item timeline-item--warning">
                    <AlertTriangle size={14} strokeWidth={1.8} />
                    <div className="timeline-item__content">
                      <span className="timeline-item__label">Warning Events</span>
                      <span className="timeline-item__value">2 logged</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <Clock size={14} strokeWidth={1.8} />
                    <div className="timeline-item__content">
                      <span className="timeline-item__label">Session Started</span>
                      <span className="timeline-item__value">1:12 PM</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <Clock size={14} strokeWidth={1.8} />
                    <div className="timeline-item__content">
                      <span className="timeline-item__label">Time Remaining</span>
                      <span className="timeline-item__value">{timeRemaining} minutes</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssessmentPage;
