import { motion } from 'framer-motion';
import {
  BookmarkCheck,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

// ================= UTILITY COMPONENTS =================

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  icon?: ReactNode;
}

const Badge = ({ children, variant = 'primary', icon }: BadgeProps) => {
  const variants = {
    primary: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    secondary: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

const MetricCard = ({ label, value, icon }: MetricCardProps) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-lg border border-zinc-700/50 hover:border-emerald-500/30 transition-all duration-300">
    {icon && <div className="text-emerald-400">{icon}</div>}
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-zinc-400 text-center">{label}</div>
  </div>
);

interface TimelineCardProps {
  day: number;
  title: string;
  description?: string;
  tasks: string[];
  problems: string[];
  badge?: ReactNode;
  isReview?: boolean;
}

const TimelineCard = ({ day, title, description, tasks, problems, badge, isReview }: TimelineCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: day * 0.05 }}
    className="relative pl-8 pb-8 border-l-2 border-zinc-700/50 last:border-transparent"
  >
    {/* Timeline dot */}
    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-zinc-900" />
    
    <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 rounded-lg border border-zinc-700/50 p-5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-zinc-500">Day {day}</span>
            {badge}
          </div>
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            {isReview ? <RotateCcw size={16} className="text-amber-400" /> : <Target size={16} className="text-emerald-400" />}
            {title}
          </h4>
          {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
        </div>
      </div>

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium text-zinc-500 mb-2">Tasks</div>
          <ul className="space-y-1.5">
            {tasks.map((task, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Problems */}
      {problems.length > 0 && (
        <div>
          <div className="text-xs font-medium text-zinc-500 mb-2">Problems</div>
          <div className="flex flex-wrap gap-2">
            {problems.map((problem, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-zinc-800/80 rounded text-xs text-zinc-400 border border-zinc-700/50 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
              >
                {problem}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-zinc-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-emerald-500 transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
};

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const Select = ({ label, value, onChange, options }: SelectProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-zinc-300">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
    </div>
  </div>
);

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle = ({ label, checked, onChange }: ToggleProps) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-zinc-300">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-zinc-700'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// ================= MOCK DATA =================

const mockRoadmapData = {
  summary: {
    duration: '30 days',
    topics: 6,
    problems: 45,
    revisionDays: 4,
    mockTests: 2,
  },
  insights: [
    'Starting with Arrays & Strings first',
    'Graph focus in Week 2',
    'Revision days placed for review',
    'Mock interviews at key checkpoints',
  ],
  timeline: [
    {
      day: 1,
      title: 'Arrays & Strings',
      description: 'Basics + Easy Problems',
      tasks: ['String Basics', 'String Manipulation', 'Array fundamentals'],
      problems: ['Two Sum', 'Valid Anagram', 'Contains Duplicate'],
      badge: <Badge variant="primary" icon={<Sparkles size={12} />}>Today's Focus</Badge>,
    },
    {
      day: 2,
      title: 'Two Pointers',
      description: 'Medium challenges',
      tasks: ['Two pointer technique', 'Sliding window intro'],
      problems: ['Container With Most Water', '3Sum', 'Remove Duplicates'],
    },
    {
      day: 3,
      title: 'Sliding Window',
      description: 'Pattern mastery',
      tasks: ['Sliding window concepts', 'Fixed & variable windows'],
      problems: ['Longest Substring', 'Min Window Substring', 'Max Subarray'],
    },
    {
      day: 4,
      title: 'Rest & Review',
      description: 'Review past topics',
      tasks: ['Review Arrays & Strings', 'Practice weak areas', 'Consolidate learning'],
      problems: [],
      isReview: true,
      badge: <Badge variant="warning" icon={<RotateCcw size={12} />}>Review Day</Badge>,
    },
    {
      day: 5,
      title: 'Hash Maps & Sets',
      description: 'Data structure patterns',
      tasks: ['HashMap patterns', 'Frequency counting', 'Set operations'],
      problems: ['Group Anagrams', 'Top K Frequent', 'Longest Consecutive'],
    },
    {
      day: 6,
      title: 'Linked Lists',
      description: 'Pointer manipulation',
      tasks: ['Linked list basics', 'Fast & slow pointers', 'Reversal techniques'],
      problems: ['Reverse Linked List', 'Merge Two Lists', 'Cycle Detection'],
    },
    {
      day: 7,
      title: 'Weekly Review',
      description: 'Consolidate Week 1',
      tasks: ['Mock test preparation', 'Review all topics', 'Identify gaps'],
      problems: [],
      isReview: true,
      badge: <Badge variant="warning" icon={<RotateCcw size={12} />}>Review Day</Badge>,
    },
  ],
  progress: {
    completion: 35,
    accuracy: 82,
    averageTime: '23 min',
    nextCheckpoint: 'Day 10 - Mock Interview',
  },
};

// ================= MAIN COMPONENT =================

const CuratedPracticePage = () => {
  const [goal, setGoal] = useState('');
  const [topics, setTopics] = useState('Arrays, Strings, Graphs');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [target, setTarget] = useState('Tech Interviews');
  const [duration, setDuration] = useState('30 days');
  const [studyDays, setStudyDays] = useState('Daily');
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [includeRevision, setIncludeRevision] = useState(true);
  const [roadmapGenerated, setRoadmapGenerated] = useState(true); // Set to true to show mock data

  const quickExamples = [
    'Learn DSA basics in 21 days',
    'Master Graphs in 10 days',
    'Revise Blind 75 in 14 days',
  ];

  const handleGenerateRoadmap = () => {
    setRoadmapGenerated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30">
              <Brain size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Curated Practice Sets
              </h1>
              <p className="text-zinc-400 mt-1">
                Build a day-by-day roadmap from your goal, time, and weaknesses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="md" iconLeft={<BookmarkCheck size={16} />}>
              View Saved Plans
            </Button>
            <Button variant="secondary" size="md" iconLeft={<Play size={16} />}>
              Resume Active Plan
            </Button>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT PANEL - Plan Builder (40%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Section 1: Learning Goal */}
            <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">Set Your Learning Goal</h2>
                </div>
                
                <Input
                  placeholder="What do you want to achieve?"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="bg-zinc-800/80 border-zinc-700/50 text-white placeholder:text-zinc-500"
                />

                <div>
                  <div className="text-xs text-zinc-500 mb-2">Quick Examples</div>
                  <div className="flex flex-wrap gap-2">
                    {quickExamples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGoal(example)}
                        className="px-3 py-1.5 bg-zinc-800/60 hover:bg-emerald-500/20 border border-zinc-700/50 hover:border-emerald-500/50 rounded-lg text-xs text-zinc-400 hover:text-emerald-400 transition-all"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 2: Plan Details */}
            <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap size={20} className="text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Plan Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Select Topics</label>
                    <input
                      type="text"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="Arrays, Strings, Graphs..."
                    />
                  </div>

                  <Select
                    label="Difficulty Level"
                    value={difficulty}
                    onChange={setDifficulty}
                    options={['Beginner', 'Intermediate', 'Advanced']}
                  />

                  <Select
                    label="Target"
                    value={target}
                    onChange={setTarget}
                    options={['Tech Interviews', 'Company Prep', 'Concept Mastery']}
                  />

                  <Select
                    label="Duration"
                    value={duration}
                    onChange={setDuration}
                    options={['7 days', '14 days', '30 days', '60 days']}
                  />
                </div>
              </div>
            </Card>

            {/* Section 3: Time Preferences */}
            <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Time Preferences</h2>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Study Days"
                    value={studyDays}
                    onChange={setStudyDays}
                    options={['Weekdays only', 'Weekends only', 'Daily']}
                  />

                  <Select
                    label="Preferred Time"
                    value={preferredTime}
                    onChange={setPreferredTime}
                    options={['Morning', 'Afternoon', 'Evening']}
                  />

                  <Toggle
                    label="Include Revision Days"
                    checked={includeRevision}
                    onChange={setIncludeRevision}
                  />
                </div>
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-lg shadow-emerald-500/30"
              iconLeft={<Sparkles size={18} />}
              onClick={handleGenerateRoadmap}
            >
              Generate AI Roadmap
            </Button>
          </motion.div>

          {/* RIGHT PANEL - AI Generated Roadmap (60%) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {roadmapGenerated ? (
              <>
                {/* Summary Metrics */}
                <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb size={20} className="text-emerald-400" />
                      <h2 className="text-lg font-semibold text-white">AI Generated Roadmap</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <MetricCard
                        icon={<Calendar size={18} />}
                        value={mockRoadmapData.summary.duration}
                        label="Duration"
                      />
                      <MetricCard
                        icon={<BookOpen size={18} />}
                        value={mockRoadmapData.summary.topics}
                        label="Topics"
                      />
                      <MetricCard
                        icon={<Target size={18} />}
                        value={mockRoadmapData.summary.problems}
                        label="Problems"
                      />
                      <MetricCard
                        icon={<RotateCcw size={18} />}
                        value={mockRoadmapData.summary.revisionDays}
                        label="Revision Days"
                      />
                      <MetricCard
                        icon={<GraduationCap size={18} />}
                        value={mockRoadmapData.summary.mockTests}
                        label="Mock Tests"
                      />
                    </div>
                  </div>
                </Card>

                {/* AI Insights */}
                <Card className="bg-gradient-to-br from-purple-900/20 to-zinc-900/90 border-purple-500/30">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain size={18} className="text-purple-400" />
                      <h3 className="text-sm font-semibold text-purple-400">AI Insights</h3>
                    </div>
                    <ul className="space-y-2">
                      {mockRoadmapData.insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                          <Sparkles size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Roadmap Timeline and Progress Tracker */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Timeline */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <TrendingUp size={20} className="text-emerald-400" />
                          Roadmap Timeline
                        </h3>
                        <div className="space-y-0">
                          {mockRoadmapData.timeline.map((day) => (
                            <TimelineCard key={day.day} {...day} />
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Progress Tracker */}
                  <div className="lg:col-span-1">
                    <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50 sticky top-6">
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <TrendingUp size={20} className="text-blue-400" />
                          Progress Tracker
                        </h3>

                        <div className="flex justify-center">
                          <CircularProgress percentage={mockRoadmapData.progress.completion} />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
                            <span className="text-sm text-zinc-400">Accuracy</span>
                            <span className="text-sm font-semibold text-emerald-400">
                              {mockRoadmapData.progress.accuracy}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
                            <span className="text-sm text-zinc-400">Average Time</span>
                            <span className="text-sm font-semibold text-blue-400">
                              {mockRoadmapData.progress.averageTime}
                            </span>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-purple-900/30 to-zinc-800/60 rounded-lg border border-purple-500/30">
                            <div className="text-xs text-purple-400 mb-1">Next Checkpoint</div>
                            <div className="text-sm font-semibold text-white">
                              {mockRoadmapData.progress.nextCheckpoint}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Brain size={64} className="text-zinc-700 mb-4" />
                  <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                    No Roadmap Generated Yet
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Fill in your learning goals and preferences, then click "Generate AI Roadmap"
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CuratedPracticePage;
