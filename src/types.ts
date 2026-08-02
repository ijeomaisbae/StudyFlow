export type TabType = 'home' | 'courses' | 'planner' | 'semester' | 'aitutor' | 'habits' | 'sleep';

export interface TaskItem {
  id: string;
  title: string;
  dueTime: string;
  completed: boolean;
  aiPriority?: 'High' | 'Medium' | 'Low';
  aiReason?: string;
}

export interface ExamItem {
  id: string;
  title: string;
  daysLeft: number;
  urgency: 'Urgent' | 'Standard';
  subjectCode: string;
  readinessScore?: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  icon: string;
  badgeColor: 'tertiary' | 'primary' | 'secondary' | 'neutral';
  glowClass: string;
  completion: number;
  pendingAssignments: number;
  examNotice?: string;
  overdueNotice?: string;
  grade?: string;
  nextLecture?: string;
  description?: string;
  topics: string[];
  materials: { id: string; name: string; type: 'pdf' | 'note' | 'slide'; size: string }[];
  readinessScore: number;
  readinessBreakdown?: {
    syllabusMastery: number;
    practiceAccuracy: number;
    mockTestScore: number;
    activeRecallConfidence: number;
  };
}

export interface TimelineSlot {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  durationMins: number;
  status: 'past' | 'active' | 'upcoming' | 'break';
  icon?: string;
  isAiAdaptive?: boolean;
}

export interface HabitItem {
  id: string;
  name: string;
  detail: string;
  completed: boolean;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

export interface SleepStats {
  bedtime: string;
  wakeup: string;
  score: number;
  weeklyLogs: { day: string; hours: number; label: string }[];
}

export interface Quote {
  text: string;
  author: string;
}

export interface StudySessionState {
  isActive: boolean;
  isPaused: boolean;
  subjectTitle: string;
  totalSeconds: number;
  secondsRemaining: number;
  ambientSound: 'none' | 'rain' | 'waves' | 'lofi' | 'white_noise';
}

export interface BurnoutData {
  riskLevel: 'Low' | 'Moderate' | 'High';
  fatigueScore: number; // 0 - 100
  sleepDeficitHours: number;
  consecutiveStudyDays: number;
  weeklyStudyHours: number;
  cognitiveLoadPercent: number;
  recoveryRecommendation: string;
}

export interface FocusScoreData {
  overallScore: number; // e.g. 88
  levelLabel: string; // "Flow State Master"
  weeklyChangePercent: number; // +6%
  breakdown: {
    deepWorkHours: number; // max 35
    habitConsistency: number; // max 25
    sleepRecovery: number; // max 25
    onTimeDeliverables: number; // max 15
  };
}

export interface SemesterMilestone {
  id: string;
  courseCode: string;
  title: string;
  date: string;
  weekNumber: number;
  type: 'exam' | 'project' | 'paper' | 'break' | 'event';
  status: 'upcoming' | 'completed' | 'urgent';
  weight: string; // e.g. "25% of Grade"
  description?: string;
}

export interface ThemeConfig {
  bgColor: string;
  accentColor: string;
  presetName: string;
  isDarkMode: boolean;
}


