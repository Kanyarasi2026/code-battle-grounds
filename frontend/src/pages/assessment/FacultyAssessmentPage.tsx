import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Eye,
  EyeOff,
  Filter,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import './FacultyAssessmentPage.scss';

// Mock data
const mockQuestions = [
  {
    id: '1',
    title: 'Implement Binary Search',
    difficulty: 'Easy' as const,
    topics: ['Arrays', 'Search'],
    selected: true,
  },
  {
    id: '2',
    title: 'Reverse Linked List',
    difficulty: 'Medium' as const,
    topics: ['Linked Lists', 'Pointers'],
    selected: true,
  },
  {
    id: '3',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard' as const,
    topics: ['Heap', 'Linked Lists'],
    selected: false,
  },
  {
    id: '4',
    title: 'Two Sum Problem',
    difficulty: 'Easy' as const,
    topics: ['Arrays', 'Hash Table'],
    selected: false,
  },
];

const mockSubmissions = [
  {
    id: '1',
    student: 'Alice Chen',
    status: 'Completed',
    score: 85,
    submittedAt: '2 hours ago',
    integrityFlags: 0,
  },
  {
    id: '2',
    student: 'Bob Smith',
    status: 'In Progress',
    score: null,
    submittedAt: 'Active',
    integrityFlags: 1,
  },
  {
    id: '3',
    student: 'Carol Davis',
    status: 'Completed',
    score: 92,
    submittedAt: '5 hours ago',
    integrityFlags: 0,
  },
];

const mockRubricItems = [
  { criterion: 'Code correctness', weight: 40 },
  { criterion: 'Code efficiency', weight: 25 },
  { criterion: 'Code readability', weight: 20 },
  { criterion: 'Edge case handling', weight: 15 },
];

const FacultyAssessmentPage = () => {
  const navigate = useNavigate();
  const [assessmentTitle, setAssessmentTitle] = useState('Data Structures Midterm');
  const [description, setDescription] = useState('Comprehensive assessment covering arrays, linked lists, and search algorithms');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [duration, setDuration] = useState(90);
  const [language, setLanguage] = useState('JavaScript');
  const [cohort, setCohort] = useState('CS 101 - Fall 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [questions, setQuestions] = useState(mockQuestions);
  
  // Integrity toggles
  const [fullscreenRequired, setFullscreenRequired] = useState(true);
  const [copyPasteRestricted, setCopyPasteRestricted] = useState(true);
  const [tabSwitchTracking, setTabSwitchTracking] = useState(true);
  const [aiHelpDisabled, setAiHelpDisabled] = useState(false);

  const selectedQuestions = questions.filter(q => q.selected);
  const displayedQuestions = questions.filter(q => 
    (filterDifficulty === 'All' || q.difficulty === filterDifficulty) &&
    (searchQuery === '' || q.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleQuestionSelection = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, selected: !q.selected } : q
    ));
  };

  return (
    <div className="faculty-assessment">
      <div className="faculty-assessment__background">
        <div className="faculty-assessment__grid-bg" />
        <motion.div
          className="faculty-assessment__orb faculty-assessment__orb--left"
          animate={{
            x: [-20, 30, -20],
            y: [-15, 25, -15],
            opacity: [0.12, 0.18, 0.12],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="faculty-assessment__orb faculty-assessment__orb--right"
          animate={{
            x: [30, -20, 30],
            y: [25, -15, 25],
            opacity: [0.10, 0.16, 0.10],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />
      </div>

      <div className="faculty-assessment__container">
        {/* Top action row */}
        <div className="faculty-assessment__top-bar">
          <motion.button
            className="faculty-assessment__back-btn"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
            <span>Back</span>
          </motion.button>

          <div className="faculty-assessment__header-content">
            <motion.div
              className="faculty-assessment__icon-badge"
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
              <h1 className="faculty-assessment__title">Faculty Assessment</h1>
              <p className="faculty-assessment__subtitle">
                Create, publish, and review coding assessments with transparent integrity settings
              </p>
            </motion.div>
          </div>

          <div className="faculty-assessment__actions">
            <Button variant="secondary" size="sm" iconLeft={<Save size={16} />}>
              Save Draft
            </Button>
            <Button variant="primary" size="sm" iconLeft={<Upload size={16} />}>
              Publish Assessment
            </Button>
          </div>
        </div>

        {/* Sticky status strip */}
        <motion.div
          className="faculty-assessment__status-strip"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="status-pill status-pill--draft">
            <span className="status-pill__dot" />
            Draft
          </div>
          <div className="status-item">
            <Code2 size={14} strokeWidth={1.8} />
            <span>{selectedQuestions.length} Questions</span>
          </div>
          <div className="status-item">
            <Clock size={14} strokeWidth={1.8} />
            <span>{duration} minutes</span>
          </div>
          <div className="status-item">
            <Users size={14} strokeWidth={1.8} />
            <span>Faculty</span>
          </div>
          <div className="status-item status-item--integrity">
            <Shield size={14} strokeWidth={1.8} />
            <span>Integrity Enabled</span>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="faculty-assessment__grid">
          {/* Left column */}
          <div className="faculty-assessment__col faculty-assessment__col--left">
            {/* Assessment Builder Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Settings size={20} strokeWidth={1.8} />
                    <h2 className="assessment-card__title">Assessment Builder</h2>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <Input
                    label="Assessment Title"
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    placeholder="e.g., Data Structures Midterm"
                  />
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of this assessment"
                      rows={3}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Difficulty</label>
                      <select
                        className="form-select"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration (min)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Language</label>
                      <select
                        className="form-select"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option>JavaScript</option>
                        <option>Python</option>
                        <option>Java</option>
                        <option>C++</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cohort / Class</label>
                      <select
                        className="form-select"
                        value={cohort}
                        onChange={(e) => setCohort(e.target.value)}
                      >
                        <option>CS 101 - Fall 2026</option>
                        <option>CS 201 - Fall 2026</option>
                        <option>CS 301 - Fall 2026</option>
                      </select>
                    </div>
                  </div>

                  <div className="divider" />

                  <div className="integrity-section">
                    <h3 className="integrity-section__title">
                      <Shield size={16} strokeWidth={1.8} />
                      Integrity Settings
                    </h3>
                    <p className="integrity-section__note">
                      These settings track behavior, not accusations. All data is for review, not automatic verdicts.
                    </p>

                    <div className="toggle-list">
                      <div className="toggle-item">
                        <div className="toggle-item__content">
                          <label className="toggle-item__label">Fullscreen Required</label>
                          <span className="toggle-item__helper">Students must stay in fullscreen mode</span>
                        </div>
                        <button
                          className={`toggle-switch ${fullscreenRequired ? 'toggle-switch--on' : ''}`}
                          onClick={() => setFullscreenRequired(!fullscreenRequired)}
                          aria-label="Toggle fullscreen"
                        >
                          <span className="toggle-switch__slider" />
                        </button>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-item__content">
                          <label className="toggle-item__label">Copy/Paste Restrictions</label>
                          <span className="toggle-item__helper">Prevent copy-paste from external sources</span>
                        </div>
                        <button
                          className={`toggle-switch ${copyPasteRestricted ? 'toggle-switch--on' : ''}`}
                          onClick={() => setCopyPasteRestricted(!copyPasteRestricted)}
                          aria-label="Toggle copy/paste restrictions"
                        >
                          <span className="toggle-switch__slider" />
                        </button>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-item__content">
                          <label className="toggle-item__label">Tab-Switch Tracking</label>
                          <span className="toggle-item__helper">Log when students switch browser tabs</span>
                        </div>
                        <button
                          className={`toggle-switch ${tabSwitchTracking ? 'toggle-switch--on' : ''}`}
                          onClick={() => setTabSwitchTracking(!tabSwitchTracking)}
                          aria-label="Toggle tab-switch tracking"
                        >
                          <span className="toggle-switch__slider" />
                        </button>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-item__content">
                          <label className="toggle-item__label">AI Help Disabled</label>
                          <span className="toggle-item__helper">Disable in-platform AI assistance</span>
                        </div>
                        <button
                          className={`toggle-switch ${aiHelpDisabled ? 'toggle-switch--on' : ''}`}
                          onClick={() => setAiHelpDisabled(!aiHelpDisabled)}
                          aria-label="Toggle AI help"
                        >
                          <span className="toggle-switch__slider" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Question Selection Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Code2 size={20} strokeWidth={1.8} />
                    <h2 className="assessment-card__title">Question Selection</h2>
                    <span className="question-count-badge">{selectedQuestions.length}</span>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="search-bar">
                    <Search size={16} strokeWidth={1.8} />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="filter-chips">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((level) => (
                      <button
                        key={level}
                        className={`filter-chip ${filterDifficulty === level ? 'filter-chip--active' : ''}`}
                        onClick={() => setFilterDifficulty(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  <div className="question-list">
                    {displayedQuestions.map((question) => (
                      <div key={question.id} className="question-item">
                        <div className="question-item__content">
                          <h4 className="question-item__title">{question.title}</h4>
                          <div className="question-item__meta">
                            <span className={`difficulty-badge difficulty-badge--${question.difficulty.toLowerCase()}`}>
                              {question.difficulty}
                            </span>
                            {question.topics.map((topic) => (
                              <span key={topic} className="topic-tag">{topic}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          className={`add-remove-btn ${question.selected ? 'add-remove-btn--selected' : ''}`}
                          onClick={() => toggleQuestionSelection(question.id)}
                        >
                          {question.selected ? <X size={16} /> : <Plus size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedQuestions.length > 0 && (
                    <>
                      <div className="divider" />
                      <div className="selected-questions-preview">
                        <h4 className="preview-title">Selected Questions ({selectedQuestions.length})</h4>
                        <div className="selected-list">
                          {selectedQuestions.map((q) => (
                            <div key={q.id} className="selected-chip">
                              {q.title}
                              <button onClick={() => toggleQuestionSelection(q.id)}>
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Rubric & Rules Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <CheckCircle2 size={20} strokeWidth={1.8} />
                    <h2 className="assessment-card__title">Rubric & Rules</h2>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="rubric-list">
                    {mockRubricItems.map((item, index) => (
                      <div key={index} className="rubric-item">
                        <span className="rubric-item__criterion">{item.criterion}</span>
                        <span className="rubric-item__weight">{item.weight}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="divider" />

                  <div className="integrity-note">
                    <Shield size={16} strokeWidth={1.8} />
                    <p>
                      <strong>Integrity Insights:</strong> All tracked behavior provides context for review, 
                      not automatic cheating verdicts. Use this data to understand student patterns and support learning.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="faculty-assessment__col faculty-assessment__col--right">
            {/* Assessment Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <Card className="assessment-card summary-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Eye size={20} strokeWidth={1.8} />
                    <h2 className="assessment-card__title">Assessment Summary</h2>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-item__label">Availability</span>
                      <span className="summary-item__value">Not set</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">Est. Time</span>
                      <span className="summary-item__value">{duration} min</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">Questions</span>
                      <span className="summary-item__value">{selectedQuestions.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">Total Points</span>
                      <span className="summary-item__value">{selectedQuestions.length * 100}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">Integrity Features</span>
                      <span className="summary-item__value">
                        {[fullscreenRequired, copyPasteRestricted, tabSwitchTracking, aiHelpDisabled].filter(Boolean).length} enabled
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">Visibility</span>
                      <span className="summary-item__value">Draft</span>
                    </div>
                  </div>

                  <div className="divider" />

                  <Button variant="secondary" className="preview-btn" iconLeft={<Eye size={16} />}>
                    Preview as Student
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Recent Submissions / Review Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Users size={20} strokeWidth={1.8} />
                    <h2 className="assessment-card__title">Recent Submissions</h2>
                  </div>
                </div>
                <div className="assessment-card__body">
                  {mockSubmissions.length > 0 ? (
                    <div className="submissions-table">
                      {mockSubmissions.map((submission) => (
                        <div key={submission.id} className="submission-row">
                          <div className="submission-row__student">{submission.student}</div>
                          <div className="submission-row__status">
                            <span className={`status-badge status-badge--${submission.status === 'Completed' ? 'completed' : 'progress'}`}>
                              {submission.status}
                            </span>
                          </div>
                          <div className="submission-row__score">
                            {submission.score !== null ? `${submission.score}%` : '—'}
                          </div>
                          <div className="submission-row__time">{submission.submittedAt}</div>
                          <div className="submission-row__integrity">
                            {submission.integrityFlags > 0 ? (
                              <span className="integrity-flag">{submission.integrityFlags} flag</span>
                            ) : (
                              <CheckCircle2 size={14} strokeWidth={1.8} className="integrity-check" />
                            )}
                          </div>
                          <button className="review-btn-small">Review</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <EyeOff size={32} strokeWidth={1.5} />
                      <p>No submissions yet</p>
                      <span className="empty-state__hint">Students will appear here once they start</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Analytics Snapshot Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              <Card className="assessment-card">
                <div className="assessment-card__header">
                  <div className="assessment-card__header-left">
                    <Filter size={20} strokeWidth={1.8} />
                    <h2 className="assessment-card__title">Analytics Snapshot</h2>
                  </div>
                </div>
                <div className="assessment-card__body">
                  <div className="analytics-metrics">
                    <div className="metric-card">
                      <span className="metric-card__value">12</span>
                      <span className="metric-card__label">Assessments Created</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-card__value">87%</span>
                      <span className="metric-card__label">Avg Completion Rate</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-card__value">3</span>
                      <span className="metric-card__label">Flagged Reviews</span>
                    </div>
                  </div>

                  <div className="divider" />

                  <div className="analytics-chart">
                    <span className="analytics-chart__placeholder">
                      📊 Chart visualization placeholder
                    </span>
                  </div>

                  <div className="divider" />

                  <div className="error-tags">
                    <h4 className="error-tags__title">Common Misconceptions</h4>
                    <div className="tag-list">
                      <span className="tag">Off-by-one errors</span>
                      <span className="tag">Null pointer</span>
                      <span className="tag">Loop termination</span>
                      <span className="tag">Edge cases</span>
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

export default FacultyAssessmentPage;
