import React, { useState } from 'react';
import { HabitItem, SleepStats } from '../../types';

interface HabitsViewProps {
  habits: HabitItem[];
  sleepStats: SleepStats;
  streakDays: number;
  onToggleHabit: (id: string) => void;
  onAddHabitClick: () => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  sleepStats,
  streakDays,
  onToggleHabit,
  onAddHabitClick,
}) => {
  const [reminderScheduled, setReminderScheduled] = useState(false);

  const completedCount = habits.filter((h) => h.completed).length;

  // Heatmap intensity pattern (31 days)
  const heatmapCells = [
    3, 4, 2, 4, 1, 4, 4,
    2, 4, 3, 4, 2, 4, 3,
    4, 4, 4, 2, 3, 4, 1,
    1, 4, 2, 3, 4, 1, 4,
    4, 4, 2
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Habits & Streaks Bento Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Daily Habits Checklist */}
        <div className="md:col-span-5 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline font-bold text-xl text-[#191c1e]">Daily Habits</h2>
              <span className="text-xs font-semibold text-[#4648d4] bg-[#4648d4]/10 px-3 py-1 rounded-full">
                {completedCount}/{habits.length} Today
              </span>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => {
                let iconColor = 'text-[#4648d4]';
                if (habit.color === 'secondary') iconColor = 'text-[#8127cf]';
                if (habit.color === 'tertiary') iconColor = 'text-[#006c49]';

                return (
                  <label
                    key={habit.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 cursor-pointer transition-all border border-transparent hover:border-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      onChange={() => onToggleHabit(habit.id)}
                      className="w-5 h-5 rounded border-slate-300 text-[#4648d4] focus:ring-[#4648d4] cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold text-sm text-[#191c1e] ${habit.completed ? 'line-through opacity-60' : ''}`}>
                        {habit.name}
                      </p>
                      <p className="text-xs text-[#464554]">{habit.detail}</p>
                    </div>
                    <span className={`material-symbols-outlined text-xl ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {habit.icon}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            onClick={onAddHabitClick}
            className="mt-4 text-xs font-semibold text-[#4648d4] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add custom habit</span>
          </button>
        </div>

        {/* Heatmap & Streaks */}
        <div className="md:col-span-7 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-headline font-bold text-xl text-[#191c1e]">Consistency</h2>
                <p className="text-sm text-[#464554]">You've hit your goals for {streakDays} days straight!</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-headline font-extrabold text-[#4648d4] block leading-none">
                  {streakDays}
                </span>
                <span className="text-[10px] font-bold text-[#767586] uppercase tracking-wider">
                  Day Streak
                </span>
              </div>
            </div>

            {/* Monthly Heatmap */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2 text-xs">
                <p className="font-semibold text-[#191c1e]">October 2023</p>
                <div className="flex gap-1.5 items-center">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" title="Low" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#4648d4]/40" title="Medium" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#4648d4]" title="High" />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {heatmapCells.map((val, idx) => {
                  let bgClass = 'bg-slate-200';
                  if (val === 2) bgClass = 'bg-[#4648d4]/30';
                  if (val === 3) bgClass = 'bg-[#4648d4]/60';
                  if (val === 4) bgClass = 'bg-[#4648d4]';

                  return (
                    <div
                      key={idx}
                      className={`h-7 rounded-md ${bgClass} transition-transform hover:scale-110 cursor-pointer`}
                      title={`Day ${idx + 1}: ${val * 25}% target completed`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Habit Tip */}
          <div className="mt-6 ai-glow bg-white/70 border border-[#4648d4]/20 p-3.5 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4648d4] text-xl">auto_awesome</span>
            <p className="text-xs text-[#191c1e] leading-snug">
              <span className="font-bold">AI Habit Tip:</span> You are 20% more likely to exercise on days you read in the morning.
            </p>
          </div>
        </div>
      </section>

      {/* Sleep Tracker Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sleep Stats Card */}
        <div className="md:col-span-5 glass-card p-6 rounded-2xl space-y-4">
          <h2 className="font-headline font-bold text-xl text-[#191c1e]">Sleep Analysis</h2>

          <div className="flex items-center justify-between gap-3">
            <div className="text-center p-3 glass-card bg-white/60 border-none rounded-xl flex-1">
              <span className="material-symbols-outlined text-[#8127cf] block mb-1">bedtime</span>
              <p className="text-[11px] text-[#464554] uppercase font-bold">Bedtime</p>
              <p className="font-headline font-bold text-base text-[#191c1e]">{sleepStats.bedtime}</p>
            </div>
            <div className="text-center p-3 glass-card bg-white/60 border-none rounded-xl flex-1">
              <span className="material-symbols-outlined text-[#006c49] block mb-1">light_mode</span>
              <p className="text-[11px] text-[#464554] uppercase font-bold">Wake-up</p>
              <p className="font-headline font-bold text-base text-[#191c1e]">{sleepStats.wakeup}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="pt-2">
            <div className="flex justify-between items-end h-28 gap-2 px-2">
              {sleepStats.weeklyLogs.map((log) => {
                const heightPercent = Math.min(100, (log.hours / 9) * 100);
                return (
                  <div key={log.day} className="w-full bg-[#f0dbff]/30 rounded-t-full relative group">
                    <div
                      className="absolute bottom-0 w-full bg-[#8127cf] rounded-t-full transition-all duration-700"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#191c1e] opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow">
                      {log.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[#767586] px-2 font-bold uppercase">
              {sleepStats.weeklyLogs.map((l) => (
                <span key={l.day}>{l.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sleep Score & AI Insights */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-6">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-200"
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-[#006c49]"
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="301.5"
                  strokeDashoffset="24"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline font-bold text-2xl text-[#191c1e] leading-none">
                  {sleepStats.score}
                </span>
                <span className="text-[9px] font-bold text-[#767586] uppercase">Score</span>
              </div>
            </div>

            <div>
              <h3 className="font-headline font-bold text-lg text-[#191c1e]">Excellent Rest</h3>
              <p className="text-xs text-[#464554] mt-1 leading-relaxed">
                Your deep sleep phase was 25% longer than your monthly average.
              </p>
              <span className="inline-flex text-xs font-semibold text-[#006c49] bg-[#006c49]/10 px-2.5 py-1 rounded-full items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>Restorative</span>
              </span>
            </div>
          </div>

          {/* Focused AI Insight Card */}
          <div className="bg-[#4648d4]/5 border border-[#4648d4]/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="relative flex items-start gap-4">
              <div className="p-2.5 bg-[#4648d4] rounded-xl text-white">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="font-headline font-bold text-[#4648d4] text-sm">AI Sleep Insight</h4>
                <p className="text-sm text-[#191c1e] leading-snug">
                  "Sleeping <span className="font-bold text-[#4648d4]">30 mins earlier</span> tonight will boost your{' '}
                  <span className="font-bold text-[#8127cf]">focus score by 15%</span> tomorrow."
                </p>
                <button
                  onClick={() => setReminderScheduled(true)}
                  className="text-xs font-bold text-[#4648d4] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <span>{reminderScheduled ? '✓ Reminder Scheduled for 10:45 PM' : 'Schedule reminder'}</span>
                  {!reminderScheduled && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calm Focus Banner */}
      <section className="w-full py-8 rounded-2xl glass-card border-none text-center">
        <h2 className="font-headline font-bold text-2xl text-[#4648d4]">Calm Focus</h2>
        <p className="text-sm text-[#464554] mt-1">
          Track your habits. Master your sleep. Flow through your studies.
        </p>
      </section>
    </div>
  );
};
