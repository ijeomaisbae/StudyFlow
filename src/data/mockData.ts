import { Course, TaskItem, ExamItem, TimelineSlot, HabitItem, SleepStats, Quote, BurnoutData, FocusScoreData, SemesterMilestone } from '../types';

export const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDGlMYJ7qTeMrjz4wyXEWDEUOQWthLiCTQva2iGSdpTFaAaIRUzN0JNbR0UaSejml8OkW9mXL4Qt4JFIr4RboWJcAInoDkmhgh1CH-47GTRRLj9gAFfuyyMXXGu3fvVSwYDYZrSrpMmFwdYdnBfGzo8_Wj6Vt0_Fz1mhZUgAmiYqQ9lTWyk3JD2iwXwSsk8NIyFOmXDRgk9JsapPYJDx3gE_ITrTQ22AbGn9u5ATxMYoLfYP8ACebyG124fS_ms5T4ODLQl5ucHFw";

export const INITIAL_TASKS: TaskItem[] = [
  { id: '1', title: 'Complete Physics Lab Report', dueTime: 'Due in 2 hours', completed: false, aiPriority: 'High', aiReason: 'Lab submission deadline approaching in 2 hours' },
  { id: '2', title: 'Group Meeting: Capstone Project', dueTime: '2:30 PM', completed: false, aiPriority: 'Medium', aiReason: 'Scheduled team sync' },
  { id: '3', title: 'Review Calculus Lecture Notes', dueTime: '5:00 PM', completed: false, aiPriority: 'High', aiReason: 'Exam readiness in Calculus is currently 54%' },
];

export const INITIAL_EXAMS: ExamItem[] = [
  { id: 'e1', title: 'Biology Midterm', daysLeft: 3, urgency: 'Urgent', subjectCode: 'Biology 101', readinessScore: 82 },
  { id: 'e2', title: 'History Essay', daysLeft: 5, urgency: 'Standard', subjectCode: 'Hist 201', readinessScore: 71 },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'Biology 101',
    title: 'Cellular Structure & Function',
    icon: 'biotech',
    badgeColor: 'tertiary',
    glowClass: 'glow-mint',
    completion: 68,
    pendingAssignments: 4,
    examNotice: 'Exam in 3d',
    description: 'Explore fundamental organelle biology, cell membrane transport mechanisms, mitochondrial ATP synthesis, and mitosis/meiosis genetics.',
    topics: ['Membrane Dynamics', 'ATP Synthesis', 'Genetics & RNA', 'Cell Division'],
    materials: [
      { id: 'm1', name: 'Lab_Report_Template_V2.pdf', type: 'pdf', size: '2.4 MB' },
      { id: 'm2', name: 'Mitochondrial_Respiration_Notes.docx', type: 'note', size: '1.1 MB' },
      { id: 'm3', name: 'Lecture_5_Organelles.pptx', type: 'slide', size: '14.8 MB' }
    ],
    readinessScore: 82,
    readinessBreakdown: {
      syllabusMastery: 85,
      practiceAccuracy: 78,
      mockTestScore: 84,
      activeRecallConfidence: 81,
    }
  },
  {
    id: 'c2',
    code: 'Calculus II',
    title: 'Advanced Integration',
    icon: 'functions',
    badgeColor: 'primary',
    glowClass: 'glow-blue',
    completion: 42,
    pendingAssignments: 6,
    overdueNotice: 'Overdue: 1',
    description: 'Master integration techniques including integration by parts, trigonometric substitutions, partial fractions, and infinite series convergence.',
    topics: ['Integration by Parts', 'Trig Substitution', 'Taylor Series', 'Improper Integrals'],
    materials: [
      { id: 'm4', name: 'Integration_Formula_Sheet.pdf', type: 'pdf', size: '850 KB' },
      { id: 'm5', name: 'Practice_Problems_Set_4.pdf', type: 'pdf', size: '1.8 MB' }
    ],
    readinessScore: 54,
    readinessBreakdown: {
      syllabusMastery: 50,
      practiceAccuracy: 58,
      mockTestScore: 52,
      activeRecallConfidence: 56,
    }
  },
  {
    id: 'c3',
    code: 'Lit Analysis',
    title: 'Modern Gothic Novels',
    icon: 'menu_book',
    badgeColor: 'secondary',
    glowClass: 'glow-purple',
    completion: 85,
    pendingAssignments: 2,
    grade: 'A+ Current',
    description: 'A critical survey of 19th and 20th century Gothic literature examining dark romanticism, psychological horror, and narrative architecture.',
    topics: ['Frankenstein & Romanticism', 'Gothic Tropes', 'Sublime & Uncanny', 'Modern Adaptations'],
    materials: [
      { id: 'm6', name: 'Essay_Draft_Feedback.docx', type: 'note', size: '420 KB' }
    ],
    readinessScore: 91,
    readinessBreakdown: {
      syllabusMastery: 94,
      practiceAccuracy: 88,
      mockTestScore: 92,
      activeRecallConfidence: 90,
    }
  },
  {
    id: 'c4',
    code: 'Art History',
    title: 'The Renaissance Era',
    icon: 'palette',
    badgeColor: 'neutral',
    glowClass: '',
    completion: 12,
    pendingAssignments: 3,
    nextLecture: 'Tomorrow at 10 AM',
    description: 'Comprehensive study of Florentine and Venetian High Renaissance art, architecture, patronage systems, and linear perspective.',
    topics: ['Florentine Frescoes', 'Leonardo & Michelangelo', 'Northern Renaissance', 'Baroque Transitions'],
    materials: [
      { id: 'm7', name: 'Syllabus_Spring2026.pdf', type: 'pdf', size: '500 KB' }
    ],
    readinessScore: 35,
    readinessBreakdown: {
      syllabusMastery: 30,
      practiceAccuracy: 40,
      mockTestScore: 35,
      activeRecallConfidence: 35,
    }
  }
];

export const INITIAL_TIMELINE: TimelineSlot[] = [
  {
    id: 't1',
    time: '09:00',
    title: 'Literature Review',
    subtitle: 'Modernist Poetry • 45 mins',
    durationMins: 45,
    status: 'past',
    icon: 'timer'
  },
  {
    id: 't2',
    time: '10:00',
    title: 'Calculus II',
    subtitle: 'Integration Techniques • 60 mins',
    durationMins: 60,
    status: 'active',
    icon: 'pause',
    isAiAdaptive: true
  },
  {
    id: 't3',
    time: '11:30',
    title: 'Quick Break',
    subtitle: 'Stretch & Hydrate • 15 mins',
    durationMins: 15,
    status: 'break',
    icon: 'coffee'
  },
  {
    id: 't4',
    time: '13:00',
    title: 'Data Structures',
    subtitle: 'Trees & Graphs • 90 mins',
    durationMins: 90,
    status: 'upcoming',
    icon: 'timer',
    isAiAdaptive: true
  }
];

export const INITIAL_HABITS: HabitItem[] = [
  { id: 'h1', name: 'Read', detail: '30 pages today', completed: true, icon: 'auto_stories', color: 'primary' },
  { id: 'h2', name: 'Exercise', detail: 'Morning yoga or gym', completed: true, icon: 'fitness_center', color: 'secondary' },
  { id: 'h3', name: 'Drink Water', detail: 'Goal: 2.5 Liters', completed: false, icon: 'water_drop', color: 'tertiary' },
];

export const INITIAL_SLEEP: SleepStats = {
  bedtime: '11:15 PM',
  wakeup: '06:45 AM',
  score: 92,
  weeklyLogs: [
    { day: 'Mon', hours: 7.75, label: '7h 45m' },
    { day: 'Tue', hours: 6.25, label: '6h 15m' },
    { day: 'Wed', hours: 8.16, label: '8h 10m' },
    { day: 'Thu', hours: 7.5, label: '7h 30m' },
    { day: 'Fri', hours: 7.83, label: '7h 50m' },
  ]
};

export const INITIAL_MOTIVATIONAL_QUOTES: Quote[] = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Focus is a muscle. The more you practice deep work, the easier it becomes.", author: "Cal Newport" },
];

export const INITIAL_BURNOUT_DATA: BurnoutData = {
  riskLevel: 'Moderate',
  fatigueScore: 48,
  sleepDeficitHours: 1.5,
  consecutiveStudyDays: 6,
  weeklyStudyHours: 32.5,
  cognitiveLoadPercent: 72,
  recoveryRecommendation: "You've logged 32.5 study hours in 6 days with a slight 1.5h sleep deficit. Take a 20-minute restorative outdoor walk and avoid intense late-night cramming."
};

export const INITIAL_FOCUS_SCORE: FocusScoreData = {
  overallScore: 88,
  levelLabel: 'Flow State Master',
  weeklyChangePercent: 6,
  breakdown: {
    deepWorkHours: 32,
    habitConsistency: 23,
    sleepRecovery: 21,
    onTimeDeliverables: 12,
  }
};

export const INITIAL_SEMESTER_MILESTONES: SemesterMilestone[] = [
  {
    id: 'sm1',
    courseCode: 'Biology 101',
    title: 'Midterm Examination',
    date: 'Oct 14, 2026',
    weekNumber: 6,
    type: 'exam',
    status: 'urgent',
    weight: '30% of Grade',
    description: 'Covers Cellular Respiration, Organelles, Genetics & Mitosis.'
  },
  {
    id: 'sm2',
    courseCode: 'Calculus II',
    title: 'Integration Problem Set & Quiz 3',
    date: 'Oct 18, 2026',
    weekNumber: 6,
    type: 'paper',
    status: 'upcoming',
    weight: '15% of Grade',
    description: 'Trigonometric substitution & integration by parts.'
  },
  {
    id: 'sm3',
    courseCode: 'ALL',
    title: 'Fall Mid-Semester Reading Break',
    date: 'Oct 24 - Oct 28',
    weekNumber: 8,
    type: 'break',
    status: 'upcoming',
    weight: 'Rest & Recovery',
    description: 'No lectures scheduled. Perfect time for burnout recovery and review.'
  },
  {
    id: 'sm4',
    courseCode: 'Lit Analysis',
    title: 'Gothic Criticism Research Essay',
    date: 'Nov 12, 2026',
    weekNumber: 10,
    type: 'project',
    status: 'upcoming',
    weight: '25% of Grade',
    description: '2,500 word paper comparing Mary Shelley and Bram Stoker.'
  },
  {
    id: 'sm5',
    courseCode: 'Art History',
    title: 'Renaissance Fresco Presentation',
    date: 'Nov 20, 2026',
    weekNumber: 11,
    type: 'project',
    status: 'upcoming',
    weight: '20% of Grade',
    description: '10-minute slide analysis on Masaccio vs Giotto.'
  },
  {
    id: 'sm6',
    courseCode: 'ALL',
    title: 'Final Examination Week',
    date: 'Dec 10 - Dec 18',
    weekNumber: 15,
    type: 'exam',
    status: 'upcoming',
    weight: '40% Overall',
    description: 'Comprehensive exams for all 4 enrolled courses.'
  }
];

