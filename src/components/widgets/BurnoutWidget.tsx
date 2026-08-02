import React, { useState } from 'react';
import { BurnoutData } from '../../types';

interface BurnoutWidgetProps {
  burnoutData: BurnoutData;
  onScheduleMicroBreak?: () => void;
  onLogEnergyLevel?: (level: number) => void;
}

export const BurnoutWidget: React.FC<BurnoutWidgetProps> = ({
  burnoutData,
  onScheduleMicroBreak,
  onLogEnergyLevel,
}) => {
  const [userEnergy, setUserEnergy] = useState<number>(3); // 1-5 scale
  const [logged, setLogged] = useState(false);

  const getRiskBadge = (level: BurnoutData['riskLevel']) => {
    switch (level) {
      case 'Low':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          text: 'Optimal Energy • Low Risk',
          icon: 'check_circle',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          text: 'Moderate Fatigue • Rest Suggested',
          icon: 'warning',
        };
      case 'High':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          text: 'High Burnout Warning • Mandatory Break',
          icon: 'error',
        };
    }
  };

  const badge = getRiskBadge(burnoutData.riskLevel);

  return (
    <div className="glass-card p-6 rounded-3xl space-y-5 border border-white/80 shadow-sm relative overflow-hidden">
      {/* Widget Header */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8127cf]">monitor_heart</span>
            <span className="font-headline font-bold text-xs uppercase text-[#8127cf] tracking-wider">
              Burnout Risk & Energy Detector
            </span>
          </div>
          <h3 className="font-headline font-bold text-xl text-[#191c1e] mt-1">Cognitive Health Analysis</h3>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm ${badge.bg}`}
        >
          <span className="material-symbols-outlined text-sm">{badge.icon}</span>
          <span>{badge.text}</span>
        </span>
      </div>

      {/* Primary Fatigue Meter */}
      <div className="space-y-2 bg-white/70 p-4 rounded-2xl border border-slate-100">
        <div className="flex justify-between text-xs font-bold text-[#191c1e]">
          <span>Fatigue & Workload Pressure</span>
          <span className="text-[#8127cf]">{burnoutData.fatigueScore} / 100</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${
              burnoutData.fatigueScore < 35
                ? 'bg-emerald-500'
                : burnoutData.fatigueScore < 65
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${burnoutData.fatigueScore}%` }}
          />
        </div>
        <p className="text-xs text-[#464554] mt-1 leading-relaxed">
          {burnoutData.recoveryRecommendation}
        </p>
      </div>

      {/* Sub-metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white/60 rounded-2xl border border-slate-100 text-center">
          <span className="text-[10px] font-bold text-[#767586] uppercase">Sleep Deficit</span>
          <p className="font-headline font-bold text-lg text-[#191c1e] mt-0.5">
            -{burnoutData.sleepDeficitHours} hrs
          </p>
        </div>

        <div className="p-3 bg-white/60 rounded-2xl border border-slate-100 text-center">
          <span className="text-[10px] font-bold text-[#767586] uppercase">Consecutive Study</span>
          <p className="font-headline font-bold text-lg text-[#191c1e] mt-0.5">
            {burnoutData.consecutiveStudyDays} Days
          </p>
        </div>

        <div className="p-3 bg-white/60 rounded-2xl border border-slate-100 text-center">
          <span className="text-[10px] font-bold text-[#767586] uppercase">Weekly Study</span>
          <p className="font-headline font-bold text-lg text-[#191c1e] mt-0.5">
            {burnoutData.weeklyStudyHours}h
          </p>
        </div>

        <div className="p-3 bg-white/60 rounded-2xl border border-slate-100 text-center">
          <span className="text-[10px] font-bold text-[#767586] uppercase">Cognitive Load</span>
          <p className="font-headline font-bold text-lg text-[#8127cf] mt-0.5">
            {burnoutData.cognitiveLoadPercent}%
          </p>
        </div>
      </div>

      {/* Interactive Rest & Energy Tracker */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[#191c1e]">Log Energy Today:</span>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setUserEnergy(lvl);
                setLogged(true);
                if (onLogEnergyLevel) onLogEnergyLevel(lvl);
              }}
              className={`w-7 h-7 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                userEnergy === lvl
                  ? 'bg-[#8127cf] text-white scale-105 shadow-sm'
                  : 'bg-slate-100 text-[#464554] hover:bg-slate-200'
              }`}
            >
              {lvl}⚡
            </button>
          ))}
          {logged && <span className="text-emerald-600 font-bold text-[11px]">Recorded!</span>}
        </div>

        {onScheduleMicroBreak && (
          <button
            onClick={onScheduleMicroBreak}
            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#8127cf] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">coffee</span>
            <span>Schedule 15-Min Power Rest</span>
          </button>
        )}
      </div>
    </div>
  );
};
