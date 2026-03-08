import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  BookmarkCheck,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
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

interface DayCompletion {
  tasks: boolean[];
  problems: boolean[];
}

interface DayCompletions {
  [key: number]: DayCompletion;
}

interface TimelineCardProps {
  day: number;
  title: string;
  description?: string;
  tasks: string[];
  problems: string[];
  badge?: ReactNode;
  isReview?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  completion: DayCompletion;
  onTaskToggle: (idx: number) => void;
  onProblemToggle: (idx: number) => void;
  completionPercentage: number;
  status: 'completed' | 'active' | 'upcoming';
}

const TimelineCard = ({ 
  day, 
  title, 
  description, 
  tasks, 
  problems, 
  badge, 
  isReview,
  isExpanded,
  onToggleExpand,
  completion,
  onTaskToggle,
  onProblemToggle,
  completionPercentage,
  status
}: TimelineCardProps) => {
  const isCompleted = completionPercentage === 100;

  const getStatusStyle = () => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500/50 bg-gradient-to-br from-emerald-900/30 to-zinc-900/60';
      case 'active':
        return 'border-blue-500/50 bg-gradient-to-br from-blue-900/30 to-zinc-900/60';
      default:
        return 'border-zinc-700/50 bg-gradient-to-br from-zinc-800/60 to-zinc-900/60';
    }
  };

  const getStatusDotStyle = () => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 shadow-lg shadow-emerald-500/50';
      case 'active':
        return 'bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse';
      default:
        return 'bg-zinc-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: day * 0.05 }}
      className="relative pl-8 pb-8 border-l-2 border-zinc-700/50 last:border-transparent"
    >
      {/* Timeline dot */}
      <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-zinc-900 transition-all duration-300 ${getStatusDotStyle()}`} />
      
      <motion.div
        className={`rounded-lg border p-5 transition-all duration-300 cursor-pointer ${getStatusStyle()} hover:shadow-lg ${isExpanded ? 'shadow-lg' : ''}`}
        onClick={onToggleExpand}
        whileHover={{ scale: 1.01 }}
        animate={isCompleted ? {
          scale: [1, 1.02, 1],
          borderColor: ['rgba(16, 185, 129, 0.5)', 'rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.5)'],
        } : {}}
        transition={isCompleted ? { duration: 2, repeat: 0 } : {}}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-zinc-500">Day {day}</span>
              {badge}
              {status === 'completed' && <Badge variant="success" icon={<CheckCircle2 size={12} />}>Completed</Badge>}
              {status === 'active' && <Badge variant="info" icon={<Play size={12} />}>Active</Badge>}
            </div>
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                {isReview ? <RotateCcw size={16} className="text-amber-400" /> : <Target size={16} className="text-emerald-400" />}
                {title}
              </h4>
              {completionPercentage > 0 && completionPercentage < 100 && (
                <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">
                  {completionPercentage}%
                </span>
              )}
            </div>
            {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-3"
          >
            <ChevronRight size={20} className="text-zinc-400" />
          </motion.div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-4 pt-4 border-t border-zinc-700/50 space-y-4">
                {/* Learning Objective */}
                {description && (
                  <div>
                    <div className="text-xs font-medium text-zinc-500 mb-2 flex items-center gap-1">
                      <Target size={12} />
                      Learning Objective
                    </div>
                    <p className="text-sm text-zinc-300">{description}</p>
                  </div>
                )}

                {/* Tasks */}
                {tasks.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-zinc-500 mb-2">Tasks</div>
                    <div className="space-y-2">
                      {tasks.map((task, idx) => (
                        <label
                          key={idx}
                          className="flex items-start gap-3 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={completion.tasks[idx] || false}
                            onChange={() => onTaskToggle(idx)}
                            className="mt-0.5 w-4 h-4 rounded border-2 border-zinc-600 bg-zinc-800 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-all"
                          />
                          <span className={`flex-1 ${completion.tasks[idx] ? 'line-through text-zinc-500' : ''}`}>
                            {task}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Problems */}
                {problems.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-zinc-500 mb-2 flex items-center gap-2">
                      <span>Problems for the Day</span>
                      <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
                        {problems.filter((_, idx) => completion.problems[idx]).length}/{problems.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {problems.map((problem, idx) => (
                        <label
                          key={idx}
                          className="flex items-start gap-3 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={completion.problems[idx] || false}
                            onChange={() => onProblemToggle(idx)}
                            className="mt-0.5 w-4 h-4 rounded border-2 border-zinc-600 bg-zinc-800 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-all"
                          />
                          <span className={`flex-1 ${completion.problems[idx] ? 'line-through text-zinc-500' : ''}`}>
                            {problem}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Difficulty Breakdown & Estimated Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="text-xs text-zinc-500 mb-1">Difficulty</div>
                    <div className="flex items-center gap-2">
                      {isReview ? (
                        <Badge variant="warning">Review</Badge>
                      ) : (
                        <><Badge variant="success">Easy: {Math.floor(problems.length * 0.4)}</Badge>
                        <Badge variant="info">Med: {Math.ceil(problems.length * 0.6)}</Badge></>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="text-xs text-zinc-500 mb-1">Estimated Time</div>
                    <div className="flex items-center gap-1.5 text-white font-semibold">
                      <Clock size={14} className="text-blue-400" />
                      <span>{isReview ? '30-45' : '45-60'} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Completion Animation */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -right-2 -top-2 z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.6, repeat: 0 }}
              className="bg-emerald-500 rounded-full p-2 shadow-lg shadow-emerald-500/50"
            >
              <CheckCircle2 size={16} className="text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="text-emerald-500"
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </motion.div>
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

// ================= LEARNING SPEED ANALYTICS =================

interface SolveTimeTrend {
  day: string;
  time: number; // in minutes
}

interface LearningAnalytics {
  problemsSolved: number;
  avgSolveTime: number; // in minutes
  hintsUsed: number;
  dailyStreak: number;
  solveTimeTrend: SolveTimeTrend[];
  insights: string[];
  paceImprovement: number; // percentage
}

const mockAnalytics: LearningAnalytics = {
  problemsSolved: 23,
  avgSolveTime: 18,
  hintsUsed: 7,
  dailyStreak: 5,
  solveTimeTrend: [
    { day: 'Mon', time: 25 },
    { day: 'Tue', time: 22 },
    { day: 'Wed', time: 20 },
    { day: 'Thu', time: 19 },
    { day: 'Fri', time: 17 },
    { day: 'Sat', time: 16 },
    { day: 'Sun', time: 18 },
  ],
  insights: [
    'Your solve time improved by 12% this week',
    'You are spending longer on graph problems',
    'Consider adding a revision day after Day 10',
  ],
  paceImprovement: 12,
};

// Mini Chart Component
interface MiniChartProps {
  data: SolveTimeTrend[];
  width?: number;
  height?: number;
}

const MiniChart = ({ data, width = 280, height = 100 }: MiniChartProps) => {
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxTime = Math.max(...data.map(d => d.time));
  const minTime = Math.min(...data.map(d => d.time));
  const timeRange = maxTime - minTime || 1;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.time - minTime) / timeRange) * chartHeight;
    return { x, y, time: d.time, day: d.day };
  });
  
  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
  ).join(' ');
  
  const areaPathData = `${pathData} L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
  
  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#3f3f46"
          strokeWidth="1"
        />
        
        {/* Area fill */}
        <path
          d={areaPathData}
          fill="url(#gradient)"
          opacity="0.2"
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#10b981"
              className="hover:r-5 transition-all"
            />
            <text
              x={p.x}
              y={height - 5}
              textAnchor="middle"
              className="text-[10px] fill-zinc-500"
            >
              {p.day}
            </text>
          </g>
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Learning Speed Analytics Card
const LearningSpeedAnalytics = ({ analytics }: { analytics: LearningAnalytics }) => {
  const paceInfo = calculateLearningPace(analytics.avgSolveTime);
  
  return (
    <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Learning Speed Analytics</h3>
          </div>
          <Badge variant={paceInfo.variant} icon={paceInfo.icon}>
            {paceInfo.label}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gradient-to-br from-emerald-900/30 to-zinc-800/60 rounded-lg border border-emerald-500/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-xs text-zinc-500">Problems Solved</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.problemsSolved}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-blue-900/30 to-zinc-800/60 rounded-lg border border-blue-500/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-blue-400" />
              <span className="text-xs text-zinc-500">Avg Solve Time</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.avgSolveTime} min</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-br from-amber-900/30 to-zinc-800/60 rounded-lg border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={16} className="text-amber-400" />
              <span className="text-xs text-zinc-500">Hints Used</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.hintsUsed}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-br from-orange-900/30 to-zinc-800/60 rounded-lg border border-orange-500/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Flame size={16} className="text-orange-400" />
              <span className="text-xs text-zinc-500">Daily Streak</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.dailyStreak} days</div>
          </motion.div>
        </div>

        {/* Solve Time Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-zinc-300">Solve Time Trend (7 Days)</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              ↓ {analytics.paceImprovement}% improvement
            </span>
          </div>
          <MiniChart data={analytics.solveTimeTrend} />
        </motion.div>

        {/* Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-gradient-to-br from-purple-900/20 to-zinc-800/60 rounded-lg border border-purple-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">AI Insights</span>
          </div>
          <div className="space-y-2">
            {analytics.insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <Sparkles size={12} className="text-purple-400 mt-1 flex-shrink-0" />
                <span>{insight}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Card>
  );
};

// ================= PROGRESS TRACKING =================

type LearningPace = 'fast' | 'balanced' | 'slow';

interface LearningPaceInfo {
  pace: LearningPace;
  label: string;
  variant: 'success' | 'info' | 'warning';
  icon: ReactNode;
}

const calculateLearningPace = (averageTimeMinutes: number): LearningPaceInfo => {
  if (averageTimeMinutes < 15) {
    return {
      pace: 'fast',
      label: 'Fast Learner',
      variant: 'success',
      icon: <Zap size={14} />,
    };
  } else if (averageTimeMinutes <= 30) {
    return {
      pace: 'balanced',
      label: 'Balanced Pace',
      variant: 'info',
      icon: <Activity size={14} />,
    };
  } else {
    return {
      pace: 'slow',
      label: 'Needs Improvement',
      variant: 'warning',
      icon: <AlertCircle size={14} />,
    };
  }
};

interface LearningPaceBadgeProps {
  averageTimeMinutes: number;
}

const LearningPaceBadge = ({ averageTimeMinutes }: LearningPaceBadgeProps) => {
  const paceInfo = calculateLearningPace(averageTimeMinutes);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <Badge variant={paceInfo.variant} icon={paceInfo.icon}>
        {paceInfo.label}
      </Badge>
    </motion.div>
  );
};

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
    completion: 32,
    completedDays: 9,
    totalDays: 30,
    accuracy: 78,
    averageTimeMinutes: 18,
    nextCheckpoint: 'Day 7 - Weekly Review',
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
  
  // Interactive roadmap state
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1])); // Day 1 expanded by default
  const [dayCompletions, setDayCompletions] = useState<DayCompletions>(() => {
    // Initialize completions for all days
    const initial: DayCompletions = {};
    mockRoadmapData.timeline.forEach(day => {
      initial[day.day] = {
        tasks: new Array(day.tasks.length).fill(false),
        problems: new Array(day.problems.length).fill(false),
      };
    });
    return initial;
  });

  const quickExamples = [
    'Learn DSA basics in 21 days',
    'Master Graphs in 10 days',
    'Revise Blind 75 in 14 days',
  ];

  const handleGenerateRoadmap = () => {
    setRoadmapGenerated(true);
  };

  // Toggle day expansion
  const toggleDayExpansion = (day: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (day: number, taskIdx: number) => {
    setDayCompletions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        tasks: prev[day].tasks.map((completed, idx) => 
          idx === taskIdx ? !completed : completed
        ),
      },
    }));
  };

  // Toggle problem completion
  const toggleProblemCompletion = (day: number, problemIdx: number) => {
    setDayCompletions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        problems: prev[day].problems.map((completed, idx) => 
          idx === problemIdx ? !completed : completed
        ),
      },
    }));
  };

  // Calculate day completion percentage
  const calculateDayCompletion = (day: number): number => {
    const dayData = mockRoadmapData.timeline.find(d => d.day === day);
    if (!dayData) return 0;

    const completion = dayCompletions[day];
    if (!completion) return 0;

    const totalItems = dayData.tasks.length + dayData.problems.length;
    if (totalItems === 0) return 100; // Review days with no tasks

    const completedItems = 
      completion.tasks.filter(Boolean).length + 
      completion.problems.filter(Boolean).length;

    return Math.round((completedItems / totalItems) * 100);
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalDays = mockRoadmapData.timeline.length;
    const completedDays = mockRoadmapData.timeline.filter(
      day => calculateDayCompletion(day.day) === 100
    ).length;

    return {
      percentage: Math.round((completedDays / totalDays) * 100),
      completedDays,
      totalDays,
    };
  };

  // Determine day status
  const getDayStatus = (day: number): 'completed' | 'active' | 'upcoming' => {
    const completion = calculateDayCompletion(day);
    if (completion === 100) return 'completed';

    // Find first incomplete day
    const firstIncomplete = mockRoadmapData.timeline.find(
      d => calculateDayCompletion(d.day) < 100
    );
    
    if (firstIncomplete && firstIncomplete.day === day) return 'active';
    return 'upcoming';
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30">
                <Brain size={32} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Curated Practice Sets
                </h1>
                <p className="text-zinc-400 mt-1 text-sm">
                  Build a day-by-day roadmap from your goal, time, and weaknesses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="ghost" size="md" iconLeft={<BookmarkCheck size={16} />}>
                Saved Plans
              </Button>
              <Button variant="secondary" size="md" iconLeft={<Play size={16} />}>
                Resume Plan
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          {/* LEFT PANEL - Plan Builder (40%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
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
            className="lg:col-span-7 space-y-6"
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

                {/* Learning Speed Analytics */}
                <LearningSpeedAnalytics analytics={mockAnalytics} />

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
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Timeline */}
                  <div className="xl:col-span-2">
                    <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <TrendingUp size={20} className="text-emerald-400" />
                          Roadmap Timeline
                        </h3>
                        <div className="space-y-0">
                          {mockRoadmapData.timeline.map((day) => (
                            <TimelineCard 
                              key={day.day} 
                              {...day}
                              isExpanded={expandedDays.has(day.day)}
                              onToggleExpand={() => toggleDayExpansion(day.day)}
                              completion={dayCompletions[day.day] || { tasks: [], problems: [] }}
                              onTaskToggle={(idx) => toggleTaskCompletion(day.day, idx)}
                              onProblemToggle={(idx) => toggleProblemCompletion(day.day, idx)}
                              completionPercentage={calculateDayCompletion(day.day)}
                              status={getDayStatus(day.day)}
                            />
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Progress Tracker */}
                  <div className="xl:col-span-1">
                    <div className="sticky top-6">
                      <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-700/50">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                              <TrendingUp size={20} className="text-blue-400" />
                              Progress
                            </h3>
                            <LearningPaceBadge averageTimeMinutes={mockRoadmapData.progress.averageTimeMinutes} />
                          </div>

                        <div className="flex justify-center">
                          <CircularProgress percentage={overallProgress.percentage} />
                        </div>

                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-between items-center p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50"
                          >
                            <span className="text-sm text-zinc-400">Completed Days</span>
                            <span className="text-sm font-semibold text-emerald-400">
                              {overallProgress.completedDays} / {overallProgress.totalDays}
                            </span>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-between items-center p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50"
                          >
                            <span className="text-sm text-zinc-400">Accuracy</span>
                            <span className="text-sm font-semibold text-emerald-400">
                              {mockRoadmapData.progress.accuracy}%
                            </span>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex justify-between items-center p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50"
                          >
                            <span className="text-sm text-zinc-400">Average Time</span>
                            <span className="text-sm font-semibold text-blue-400">
                              {mockRoadmapData.progress.averageTimeMinutes} min
                            </span>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="p-3 bg-gradient-to-br from-purple-900/30 to-zinc-800/60 rounded-lg border border-purple-500/30"
                          >
                            <div className="text-xs text-purple-400 mb-1">Next Checkpoint</div>
                            <div className="text-sm font-semibold text-white">
                              {mockRoadmapData.progress.nextCheckpoint}
                            </div>
                          </motion.div>
                        </div>
                        </div>
                      </Card>
                    </div>
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
