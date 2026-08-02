import React from 'react';
import { TaskItem, ExamItem, Quote, Course, BurnoutData, FocusScoreData, TimelineSlot } from '../../types';
import { BurnoutWidget } from '../widgets/BurnoutWidget';
import { FocusScoreWidget } from '../widgets/FocusScoreWidget';
import { ReadinessMeterWidget } from '../widgets/ReadinessMeterWidget';
import { AdaptivePlannerWidget } from '../widgets/AdaptivePlannerWidget';

interface HomeViewProps {
  tasks: TaskItem[];
  exams: ExamItem[];
  quote: Quote;
  courses: Course[];
  burnoutData: BurnoutData;
  focusScore: FocusScoreData;
  timeline: TimelineSlot[];
  habitStreakDays: number;
  sleepQuality: string;
  onToggleTask: (id: string) => void;
  onAddTaskClick: () => void;
  onResumeSession: () => void;
  onNextQuote: () => void;
  onNavigateTab: (tab: 'courses' | 'planner' | 'semester' | 'aitutor' | 'habits' | 'sleep') => void;
  onAutoBalanceWithAi: () => void;
  onUpdateCourseReadiness?: (courseId: string, newScore: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tasks,
  exams,
  quote,
  courses,
  burnoutData,
  focusScore,
  timeline,
  habitStreakDays,
  sleepQuality,
  onToggleTask,
  onAddTaskClick,
  onResumeSession,
  onNextQuote,
  onNavigateTab,
  onAutoBalanceWithAi,
  onUpdateCourseReadiness,
}) => {
  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Hero Section: Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Study Progress Widget (Large) */}
        <div className="glass-card md:col-span-8 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="relative w-44 h-44 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-[#6063ee]/15"
                cx="88"
                cy="88"
                r="72"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
              />
              <circle
                className="text-[#4648d4] transition-all duration-1000 ease-out"
                cx="88"
                cy="88"
                r="72"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray="452.3"
                strokeDashoffset="135" // ~70% completed
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline font-extrabold text-3xl text-[#4648d4]">4.5</span>
              <span className="text-xs font-medium text-[#464554]">Hours Goal</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#006c49]/15 text-[#006c49] rounded-full text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse" />
              <span>Productivity Peak</span>
            </div>
            <h2 className="font-headline font-bold text-2xl md:text-3xl text-[#191c1e]">
              Focused Study Flow
            </h2>
            <p className="text-[#464554] text-sm md:text-base leading-relaxed">
              You've completed 70% of your daily goal. Join the upcoming deep work session to maintain your Flow State rating.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              <button
                onClick={onResumeSession}
                className="bg-[#4648d4] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-[1.02] transition-transform duration-200 active:scale-95 shadow-lg shadow-indigo-500/25 cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                <span>Resume Focus Session</span>
              </button>

              <button
                onClick={() => onNavigateTab('aitutor')}
                className="bg-purple-50 text-[#8127cf] hover:bg-purple-100 border border-purple-200/80 px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Semester & AI Tutor Shortcuts Card */}
        <div 
          onClick={() => onNavigateTab('semester')}
          className="glass-card md:col-span-4 rounded-2xl p-6 flex flex-col justify-between border-l-4 border-[#8127cf] hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <span className="text-[#464554] text-xs font-bold uppercase tracking-wider">Semester Master Map</span>
            <h3 className="font-headline font-bold text-xl text-[#8127cf] group-hover:underline flex items-center gap-2">
              <span>Semester Planner</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </h3>
            <div className="flex items-center gap-1.5 text-[#464554] text-xs">
              <span className="material-symbols-outlined text-sm">event</span>
              <span className="font-medium">6 Upcoming Midterms & Papers</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[#464554] text-xs">
              <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
              <span className="font-bold text-[#191c1e]">Biology Exam in 3 Days</span>
            </div>
            <div className="w-10 h-10 bg-[#f0dbff] text-[#2c0051] rounded-xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Score Rating Widget */}
      <FocusScoreWidget
        focusScore={focusScore}
        onStartDeepWork={onResumeSession}
      />

      {/* Burnout Risk & Energy Detector */}
      <BurnoutWidget
        burnoutData={burnoutData}
        onScheduleMicroBreak={() => onNavigateTab('planner')}
      />

      {/* Exam & Test Readiness Meter */}
      <ReadinessMeterWidget
        courses={courses}
        onOpenAiTutor={() => onNavigateTab('aitutor')}
        onUpdateCourseReadiness={onUpdateCourseReadiness}
      />

      {/* Adaptive Study Planner Widget */}
      <AdaptivePlannerWidget
        timeline={timeline}
        tasks={tasks}
        onAutoBalanceWithAi={onAutoBalanceWithAi}
        onStartSession={(title) => onResumeSession()}
      />

      {/* Tasks, Health, & Upcoming Exams Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="glass-card rounded-2xl p-6 md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline font-semibold text-sm text-[#464554] uppercase tracking-wider">
                Today's Schedule
              </h4>
              <button
                onClick={onAddTaskClick}
                className="text-[#4648d4] hover:scale-110 transition-transform cursor-pointer p-1"
                title="Add Task"
              >
                <span className="material-symbols-outlined text-2xl">add_circle</span>
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100/60 transition-colors cursor-pointer group border border-transparent hover:border-slate-200"
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-[#4648d4] border-[#4648d4] text-white'
                        : 'border-[#4648d4] group-hover:bg-[#6063ee]/20'
                    }`}
                  >
                    {task.completed && (
                      <span className="material-symbols-outlined text-xs">check</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold text-[#191c1e] ${task.completed ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-[#464554]">{task.dueTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onAddTaskClick}
            className="mt-4 text-xs font-semibold text-[#4648d4] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Add new item to schedule</span>
          </button>
        </div>

        {/* Habits & Sleep Stats */}
        <div className="glass-card rounded-2xl p-6 md:col-span-1 space-y-4 flex flex-col justify-between">
          <h4 className="font-headline font-semibold text-sm text-[#464554] uppercase tracking-wider">
            Health & Habits
          </h4>

          {/* Habit Streak */}
          <div 
            onClick={() => onNavigateTab('habits')}
            className="p-3 bg-[#e1e0ff]/40 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#e1e0ff]/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4648d4] text-white rounded-full flex items-center justify-center shadow-md shadow-indigo-500/20">
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[#464554]">Habit Streak</p>
                <p className="font-headline text-xl font-bold text-[#2f2ebe]">
                  {habitStreakDays} Days
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#4648d4]">trending_up</span>
          </div>

          {/* Sleep Quality */}
          <div 
            onClick={() => onNavigateTab('sleep')}
            className="p-3 bg-[#f0dbff]/40 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#f0dbff]/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8127cf] text-white rounded-full flex items-center justify-center shadow-md shadow-purple-500/20">
                <span className="material-symbols-outlined text-xl">bedtime</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[#464554]">Sleep Quality</p>
                <p className="font-headline text-xl font-bold text-[#6900b3]">
                  {sleepQuality}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#8127cf]">check_circle</span>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="glass-card rounded-2xl p-6 md:col-span-1 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6ffbbe] blur-3xl opacity-25" />
          <div>
            <h4 className="font-headline font-semibold text-sm text-[#464554] uppercase tracking-wider mb-4">
              Upcoming Exams
            </h4>

            <div className="space-y-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 border border-slate-200/80 rounded-xl bg-white/40"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-8 rounded-full ${
                        exam.urgency === 'Urgent' ? 'bg-[#006c49]' : 'bg-[#4648d4]'
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-sm text-[#191c1e]">{exam.title}</p>
                      <p className="text-xs text-[#464554]">{exam.daysLeft} Days Left</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      exam.urgency === 'Urgent'
                        ? 'text-[#006c49] bg-[#006c49]/10'
                        : 'text-[#4648d4] bg-[#4648d4]/10'
                    }`}
                  >
                    {exam.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('semester')}
            className="mt-4 text-xs font-semibold text-[#006c49] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View semester roadmap &rarr;</span>
          </button>
        </div>
      </section>

      {/* Motivational Quote Card */}
      <section className="pt-2">
        <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden border-2 border-[#6063ee]/20 shadow-lg">
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <div className="flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-[#4648d4] text-4xl">format_quote</span>
            </div>
            <p className="font-headline font-semibold text-lg md:text-xl italic text-[#191c1e] leading-relaxed">
              "{quote.text}"
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <p className="text-[#464554] text-sm font-medium">— {quote.author}</p>
              <button
                onClick={onNextQuote}
                className="text-xs text-[#4648d4] hover:bg-indigo-50 p-1 rounded-full transition-colors cursor-pointer"
                title="New Quote"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

