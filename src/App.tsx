import { useState, useEffect } from 'react';
import { TabType, TaskItem, Course, HabitItem, TimelineSlot, SemesterMilestone, BurnoutData, FocusScoreData, ThemeConfig } from './types';
import {
  INITIAL_TASKS,
  INITIAL_EXAMS,
  INITIAL_COURSES,
  INITIAL_TIMELINE,
  INITIAL_HABITS,
  INITIAL_SLEEP,
  INITIAL_MOTIVATIONAL_QUOTES,
  INITIAL_BURNOUT_DATA,
  INITIAL_FOCUS_SCORE,
  INITIAL_SEMESTER_MILESTONES,
} from './data/mockData';

import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './components/views/HomeView';
import { CoursesView } from './components/views/CoursesView';
import { PlannerView } from './components/views/PlannerView';
import { SemesterView } from './components/views/SemesterView';
import { AiTutorView } from './components/views/AiTutorView';
import { HabitsView } from './components/views/HabitsView';
import { SleepView } from './components/views/SleepView';
import { FocusSessionModal } from './components/modals/FocusSessionModal';
import { AddItemModal } from './components/modals/AddItemModal';
import { AddMilestoneModal } from './components/modals/AddMilestoneModal';
import { ThemePickerModal } from './components/modals/ThemePickerModal';

const DEFAULT_THEME: ThemeConfig = {
  bgColor: '#f7f9fb',
  accentColor: '#4648d4',
  presetName: 'Default Soft Light',
  isDarkMode: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Theme State with localStorage persistence
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('study_flow_theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_THEME;
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Application Data State

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [exams] = useState(INITIAL_EXAMS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [timeline, setTimeline] = useState<TimelineSlot[]>(INITIAL_TIMELINE);
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [sleepStats] = useState(INITIAL_SLEEP);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // New Feature States
  const [burnoutData, setBurnoutData] = useState<BurnoutData>(INITIAL_BURNOUT_DATA);
  const [focusScore, setFocusScore] = useState<FocusScoreData>(INITIAL_FOCUS_SCORE);
  const [semesterMilestones, setSemesterMilestones] = useState<SemesterMilestone[]>(INITIAL_SEMESTER_MILESTONES);
  const [aiTutorInitialTopic, setAiTutorInitialTopic] = useState<string>('');

  // Focus Session Modal State
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [focusSubjectTitle, setFocusSubjectTitle] = useState('Focused Study Flow');
  const [focusDurationMins, setFocusDurationMins] = useState(25);

  // Add Item & Milestone Modal State
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [addItemType, setAddItemType] = useState<'task' | 'course' | 'habit' | 'timeline'>('task');
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);

  // FAB Popup State
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INITIAL_MOTIVATIONAL_QUOTES.length);
  };

  const handleStartFocusSession = (title: string = 'Focused Study Flow', durationMins: number = 25) => {
    setFocusSubjectTitle(title);
    setFocusDurationMins(durationMins);
    setIsFocusModalOpen(true);
    setShowFabMenu(false);
  };

  const handleOpenAiTutorWithTopic = (topic: string) => {
    setAiTutorInitialTopic(topic);
    setActiveTab('aitutor');
  };

  const handleOpenAddItem = (type: 'task' | 'course' | 'habit' | 'timeline') => {
    setAddItemType(type);
    setIsAddItemModalOpen(true);
    setShowFabMenu(false);
  };

  const handleAutoBalanceScheduleWithAi = () => {
    // Re-order timeline slots according to high-priority exam preparation
    setTimeline((prev) => [
      {
        id: 'tb_1',
        time: '14:00',
        title: 'Calculus II Deep Integration',
        subtitle: 'AI Prioritized: 54% Exam Readiness • 60 mins',
        durationMins: 60,
        status: 'upcoming',
        icon: 'functions',
        isAiAdaptive: true,
      },
      ...prev,
    ]);
  };

  const handleUpdateCourseReadiness = (courseId: string, newScore: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, readinessScore: newScore } : c))
    );
  };

  const handleApplyTheme = (newTheme: ThemeConfig) => {
    setTheme(newTheme);
    localStorage.setItem('study_flow_theme', JSON.stringify(newTheme));
  };

  const handleResetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.setItem('study_flow_theme', JSON.stringify(DEFAULT_THEME));
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 selection:bg-indigo-100 ${
        theme.isDarkMode ? 'dark text-slate-100' : 'text-[#191c1e]'
      }`}
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Sticky Top Header */}
      <TopAppBar
        userName="Alex"
        unreadNotificationsCount={2}
        onStartFocusSession={() => handleStartFocusSession('Quick Focus Session', 25)}
        onOpenThemePicker={() => setIsThemeModalOpen(true)}
      />


      {/* Main Content Area */}
      <main className="pt-24 px-4 md:px-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        {activeTab === 'home' && (
          <HomeView
            tasks={tasks}
            exams={exams}
            quote={INITIAL_MOTIVATIONAL_QUOTES[quoteIndex]}
            courses={courses}
            burnoutData={burnoutData}
            focusScore={focusScore}
            timeline={timeline}
            habitStreakDays={12}
            sleepQuality="8h 12m"
            onToggleTask={handleToggleTask}
            onAddTaskClick={() => handleOpenAddItem('task')}
            onResumeSession={() => handleStartFocusSession('Focused Study Flow', 25)}
            onNextQuote={handleNextQuote}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onAutoBalanceWithAi={handleAutoBalanceScheduleWithAi}
            onUpdateCourseReadiness={handleUpdateCourseReadiness}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesView
            courses={courses}
            onStartCourseSession={(courseTitle) => handleStartFocusSession(courseTitle, 45)}
            onAddCourseClick={() => handleOpenAddItem('course')}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerView
            timeline={timeline}
            onStartSession={(title, mins) => handleStartFocusSession(title, mins)}
            onAddSlotClick={() => handleOpenAddItem('timeline')}
          />
        )}

        {activeTab === 'semester' && (
          <SemesterView
            milestones={semesterMilestones}
            courses={courses}
            onAddMilestoneClick={() => setIsAddMilestoneModalOpen(true)}
            onOpenAiTutor={handleOpenAiTutorWithTopic}
          />
        )}

        {activeTab === 'aitutor' && (
          <AiTutorView
            courses={courses}
            initialTopic={aiTutorInitialTopic}
            onStartFocusSession={(subject) => handleStartFocusSession(subject, 30)}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            sleepStats={sleepStats}
            streakDays={12}
            onToggleHabit={handleToggleHabit}
            onAddHabitClick={() => handleOpenAddItem('habit')}
          />
        )}

        {activeTab === 'sleep' && <SleepView sleepStats={sleepStats} />}
      </main>

      {/* Floating Action Button (FAB) */}
      <div className="fixed right-6 bottom-24 z-40 flex flex-col items-end">
        {showFabMenu && (
          <div className="mb-3 space-y-2 flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => handleStartFocusSession('Deep Work Session', 45)}
              className="px-4 py-2 bg-white text-[#4648d4] font-semibold text-xs rounded-full shadow-lg border border-slate-200 flex items-center gap-2 hover:bg-indigo-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">timer</span>
              <span>Start Focus Timer</span>
            </button>

            <button
              onClick={() => setActiveTab('aitutor')}
              className="px-4 py-2 bg-[#8127cf] text-white font-semibold text-xs rounded-full shadow-lg flex items-center gap-2 hover:bg-[#9c48ea] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              <span>Ask AI Tutor</span>
            </button>

            <button
              onClick={() => setIsAddMilestoneModalOpen(true)}
              className="px-4 py-2 bg-white text-[#4648d4] font-semibold text-xs rounded-full shadow-lg border border-slate-200 flex items-center gap-2 hover:bg-indigo-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">event</span>
              <span>Add Semester Milestone</span>
            </button>

            <button
              onClick={() => handleOpenAddItem('task')}
              className="px-4 py-2 bg-white text-[#4648d4] font-semibold text-xs rounded-full shadow-lg border border-slate-200 flex items-center gap-2 hover:bg-indigo-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>Add Schedule Task</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className="w-14 h-14 bg-[#4648d4] text-white rounded-2xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          title="Quick Action"
        >
          <span
            className={`material-symbols-outlined text-3xl transition-transform duration-300 ${
              showFabMenu ? 'rotate-45' : 'group-hover:rotate-90'
            }`}
          >
            add
          </span>
        </button>
      </div>

      {/* Bottom Sticky Navigation */}
      <BottomNavBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Modals */}
      <FocusSessionModal
        isOpen={isFocusModalOpen}
        initialSubjectTitle={focusSubjectTitle}
        initialDurationMins={focusDurationMins}
        onClose={() => setIsFocusModalOpen(false)}
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        type={addItemType}
        onClose={() => setIsAddItemModalOpen(false)}
        onAddTask={(task) => setTasks([task, ...tasks])}
        onAddCourse={(course) => setCourses([course, ...courses])}
        onAddHabit={(habit) => setHabits([...habits, habit])}
        onAddTimeline={(title, subtitle, time) =>
          setTimeline([
            ...timeline,
            {
              id: 't_' + Date.now(),
              time,
              title,
              subtitle,
              durationMins: 30,
              status: 'upcoming',
              icon: 'timer',
            },
          ])
        }
      />

      <AddMilestoneModal
        isOpen={isAddMilestoneModalOpen}
        courses={courses}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        onAddMilestone={(m) => setSemesterMilestones([m, ...semesterMilestones])}
      />

      <ThemePickerModal
        isOpen={isThemeModalOpen}
        currentTheme={theme}
        onClose={() => setIsThemeModalOpen(false)}
        onApplyTheme={handleApplyTheme}
        onResetTheme={handleResetTheme}
      />
    </div>
  );
}


