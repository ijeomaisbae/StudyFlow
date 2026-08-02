import React from 'react';
import { FocusScoreData } from '../../types';

interface FocusScoreWidgetProps {
  focusScore: FocusScoreData;
  onStartDeepWork: () => void;
}

export const FocusScoreWidget: React.FC<FocusScoreWidgetProps> = ({
  focusScore,
  onStartDeepWork,
}) => {
  return (
    <div className="glass-card p-6 rounded-3xl space-y-5 border border-white/80 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]">auto_awesome</span>
            <span className="font-headline font-bold text-xs uppercase text-[#4648d4] tracking-wider">
              Daily Focus Rating
            </span>
          </div>
          <h3 className="font-headline font-bold text-xl text-[#191c1e] mt-1">
            Focus & Flow Index
          </h3>
        </div>

        <span className="px-3 py-1 bg-indigo-50 text-[#4648d4] text-xs font-bold rounded-full border border-indigo-100 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>+{focusScore.weeklyChangePercent}% this week</span>
        </span>
      </div>

      {/* Main Score Display & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score Ring */}
        <div className="flex flex-col items-center justify-center p-4 bg-white/70 rounded-2xl border border-slate-100 text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-slate-100"
                cx="56"
                cy="56"
                r="44"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
              />
              <circle
                className="text-[#4648d4]"
                cx="56"
                cy="56"
                r="44"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="276.4"
                strokeDashoffset={276.4 - (276.4 * focusScore.overallScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline font-extrabold text-3xl text-[#191c1e]">
                {focusScore.overallScore}
              </span>
              <span className="text-[10px] text-[#767586] font-bold uppercase">/ 100</span>
            </div>
          </div>
          <p className="font-headline font-bold text-sm text-[#4648d4] mt-2">{focusScore.levelLabel}</p>
        </div>

        {/* Factors Breakdown */}
        <div className="md:col-span-2 space-y-3">
          {/* Factor 1: Deep Work */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#191c1e] mb-1">
              <span>Deep Work Duration</span>
              <span className="text-[#4648d4] font-bold">{focusScore.breakdown.deepWorkHours} / 35 pts</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-[#4648d4] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(focusScore.breakdown.deepWorkHours / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Factor 2: Habit Consistency */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#191c1e] mb-1">
              <span>Habit Streak Consistency</span>
              <span className="text-[#8127cf] font-bold">{focusScore.breakdown.habitConsistency} / 25 pts</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-[#8127cf] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(focusScore.breakdown.habitConsistency / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Factor 3: Sleep Recovery */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#191c1e] mb-1">
              <span>Sleep & Circadian Alignment</span>
              <span className="text-emerald-600 font-bold">{focusScore.breakdown.sleepRecovery} / 25 pts</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(focusScore.breakdown.sleepRecovery / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Factor 4: Timely Deliverables */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#191c1e] mb-1">
              <span>On-Time Milestone Rate</span>
              <span className="text-amber-600 font-bold">{focusScore.breakdown.onTimeDeliverables} / 15 pts</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(focusScore.breakdown.onTimeDeliverables / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-end pt-2 border-t border-slate-100">
        <button
          onClick={onStartDeepWork}
          className="px-5 py-2.5 rounded-2xl bg-[#4648d4] text-white font-bold text-xs hover:bg-[#6063ee] transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">play_arrow</span>
          <span>Boost Score with 25-Min Focus Session</span>
        </button>
      </div>
    </div>
  );
};
