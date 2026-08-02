import React, { useState } from 'react';
import { TimelineSlot } from '../../types';

interface PlannerViewProps {
  timeline: TimelineSlot[];
  onStartSession: (title: string, durationMins: number) => void;
  onAddSlotClick: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  timeline,
  onStartSession,
  onAddSlotClick,
}) => {
  const [selectedDay, setSelectedDay] = useState(12); // default Tue 12

  const days = [
    { dayName: 'Mon', dayNum: 11 },
    { dayName: 'Tue', dayNum: 12 },
    { dayName: 'Wed', dayNum: 13 },
    { dayName: 'Thu', dayNum: 14 },
    { dayName: 'Fri', dayNum: 15 },
    { dayName: 'Sat', dayNum: 16 },
    { dayName: 'Sun', dayNum: 17 },
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Horizontal Date Picker */}
      <section className="flex gap-3 overflow-x-auto py-2 custom-scrollbar">
        {days.map((d) => {
          const isActive = d.dayNum === selectedDay;
          return (
            <button
              key={d.dayNum}
              onClick={() => setSelectedDay(d.dayNum)}
              className={`flex-none w-16 h-20 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'ai-gradient text-white shadow-lg shadow-indigo-500/25 scale-105 font-bold'
                  : 'bg-white/60 text-[#464554] hover:bg-white/90 border border-white/50'
              }`}
            >
              <span className="text-xs">{d.dayName}</span>
              <span className="font-headline text-xl">{d.dayNum}</span>
            </button>
          );
        })}
      </section>

      {/* AI Recommendation Banner */}
      <section className="glass-card p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4648d4]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#6063ee] text-white shadow-md shadow-indigo-500/20">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="font-headline font-bold text-xl text-[#4648d4]">AI Recommendation</h2>
            <p className="text-sm text-[#464554] leading-relaxed">
              AI recommends studying <span className="font-bold text-[#4648d4]">Literature</span> now for{' '}
              <span className="font-bold text-[#4648d4]">45 mins</span> based on your exam next Tuesday.
            </p>
            <button
              onClick={() => onStartSession('Literature Review - Modernist Poetry', 45)}
              className="mt-2 px-6 py-2.5 ai-gradient text-white rounded-full font-semibold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Start Session</span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline View */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-headline font-bold text-xl text-[#191c1e]">Today's Timeline</h3>
            <button
              onClick={onAddSlotClick}
              className="text-xs font-semibold text-[#4648d4] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-3 relative pt-2">
            {timeline.map((slot, index) => {
              const isActive = slot.status === 'active';
              const isBreak = slot.status === 'break';

              return (
                <div key={slot.id} className="flex gap-4 group">
                  <div className="w-14 pt-2 text-right">
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-[#4648d4]' : 'text-[#767586]'
                      }`}
                    >
                      {slot.time}
                    </span>
                  </div>

                  <div className="relative pb-4 flex-1">
                    {/* Circle marker */}
                    <div
                      className={`absolute left-[-13px] top-3 w-5 h-5 rounded-full z-10 ${
                        isActive
                          ? 'bg-[#4648d4] shadow-[0_0_15px_rgba(73,75,214,0.5)] animate-pulse'
                          : 'bg-white border-2 border-slate-300'
                      }`}
                    />

                    {/* Timeline connecting line */}
                    {index < timeline.length - 1 && (
                      <div className="absolute left-[-4px] top-7 bottom-0 w-[2px] timeline-line opacity-30" />
                    )}

                    {/* Slot card */}
                    <div
                      className={`p-4 rounded-2xl ml-4 transition-all flex justify-between items-center ${
                        isActive
                          ? 'bg-[#6063ee]/15 border-l-4 border-[#4648d4] shadow-md shadow-indigo-500/10'
                          : isBreak
                          ? 'glass-card opacity-75 hover:opacity-100'
                          : 'glass-card hover:border-[#4648d4]/40'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-sm ${
                              isActive ? 'text-[#4648d4]' : 'text-[#191c1e]'
                            }`}
                          >
                            {slot.title}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 bg-[#00885d] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#464554] mt-0.5">{slot.subtitle}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isBreak ? (
                          <span className="material-symbols-outlined text-[#767586]">coffee</span>
                        ) : (
                          <button
                            onClick={() => onStartSession(slot.title, slot.durationMins)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isActive
                                ? 'ai-gradient text-white shadow-md'
                                : 'border border-[#4648d4]/30 text-[#4648d4] hover:bg-[#4648d4] hover:text-white'
                            }`}
                            title="Start or Pause Timer"
                          >
                            <span className="material-symbols-outlined text-lg">
                              {isActive ? 'pause' : 'timer'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sidebar Content */}
        <aside className="space-y-6">
          {/* Smart Reminders */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#8127cf]">tips_and_updates</span>
              <h3 className="font-headline font-semibold text-sm text-[#191c1e]">Smart Reminders</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-[#f0dbff]/40 border border-[#ddb7ff]/30 text-xs text-[#2c0051]">
                <span className="material-symbols-outlined text-[#8127cf] text-base mt-0.5">
                  priority_high
                </span>
                <span className="font-medium">Submit English Essay draft by 5 PM tonight.</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/70 border border-slate-200/50 text-xs text-[#464554]">
                <span className="material-symbols-outlined text-[#767586] text-base mt-0.5">
                  notification_important
                </span>
                <span className="font-medium">Biology lab prep needed for tomorrow's session.</span>
              </li>
            </ul>
          </div>

          {/* Daily Progress Widget */}
          <div className="glass-card p-6 rounded-2xl text-center">
            <h3 className="font-headline font-semibold text-sm text-[#191c1e] mb-4">
              Today's Focus Goal
            </h3>
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90">
                <circle
                  className="text-slate-200"
                  cx="64"
                  cy="64"
                  r="56"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-[#4648d4]"
                  cx="64"
                  cy="64"
                  r="56"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="351.8"
                  strokeDashoffset="105.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline font-bold text-2xl text-[#4648d4]">70%</span>
                <span className="text-[10px] uppercase font-bold text-[#767586]">Complete</span>
              </div>
            </div>
            <p className="text-xs text-[#464554]">You're 2 hours ahead of your weekly study target! 🎉</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
