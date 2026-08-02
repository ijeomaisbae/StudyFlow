import React, { useState } from 'react';
import { TimelineSlot, TaskItem } from '../../types';

interface AdaptivePlannerWidgetProps {
  timeline: TimelineSlot[];
  tasks: TaskItem[];
  onAutoBalanceWithAi: () => void;
  onStartSession: (title: string, mins: number) => void;
}

export const AdaptivePlannerWidget: React.FC<AdaptivePlannerWidgetProps> = ({
  timeline,
  tasks,
  onAutoBalanceWithAi,
  onStartSession,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedMessage, setOptimizedMessage] = useState<string | null>(null);

  const handleRunAiOptimizer = () => {
    setIsOptimizing(true);
    setOptimizedMessage(null);
    setTimeout(() => {
      onAutoBalanceWithAi();
      setIsOptimizing(false);
      setOptimizedMessage('AI optimized your schedule for peak afternoon energy & prioritized Calculus exam preparation!');
    }, 1200);
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-5 border border-white/80 shadow-sm relative overflow-hidden">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]">tune</span>
            <span className="font-headline font-bold text-xs uppercase text-[#4648d4] tracking-wider">
              Adaptive AI Study Planner
            </span>
          </div>
          <h3 className="font-headline font-bold text-xl text-[#191c1e] mt-1">
            Dynamic Peak-Energy Schedule
          </h3>
        </div>

        <button
          onClick={handleRunAiOptimizer}
          disabled={isOptimizing}
          className="px-4 py-2.5 rounded-2xl ai-gradient text-white font-bold text-xs hover:scale-105 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span>{isOptimizing ? 'Auto-Balancing...' : 'Auto-Balance Schedule'}</span>
        </button>
      </div>

      {optimizedMessage && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-[#4648d4] font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{optimizedMessage}</span>
        </div>
      )}

      {/* Recommended Priority Slots */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase text-[#767586]">AI High-Priority Allocations Today</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timeline.slice(0, 4).map((slot) => (
            <div
              key={slot.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                slot.status === 'active'
                  ? 'bg-indigo-50/80 border-[#4648d4] shadow-sm'
                  : 'bg-white/70 border-slate-100 hover:bg-white'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#4648d4]">{slot.time}</span>
                  {slot.isAiAdaptive && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#8127cf] text-[10px] font-extrabold flex items-center gap-0.5">
                      <span>⚡ AI Priority</span>
                    </span>
                  )}
                </div>
                <p className="font-headline font-bold text-sm text-[#191c1e]">{slot.title}</p>
                <p className="text-[11px] text-[#464554]">{slot.subtitle}</p>
              </div>

              <button
                onClick={() => onStartSession(slot.title, slot.durationMins)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-[#4648d4] text-xs font-bold border border-slate-200/80 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                <span>Start</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task Priority Tags */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold uppercase text-[#767586]">Adaptive Task Prioritization</span>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 bg-white/60 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                    task.aiPriority === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : task.aiPriority === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {task.aiPriority || 'Standard'} Priority
                </span>
                <span className={`font-semibold ${task.completed ? 'line-through text-[#767586]' : 'text-[#191c1e]'}`}>
                  {task.title}
                </span>
              </div>
              <span className="text-[11px] text-[#767586] font-medium">{task.dueTime}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
