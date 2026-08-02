import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'courses', label: 'Courses', icon: 'menu_book' },
    { id: 'planner', label: 'Planner', icon: 'calendar_today' },
    { id: 'semester', label: 'Semester', icon: 'calendar_month' },
    { id: 'aitutor', label: 'AI Tutor', icon: 'auto_awesome' },
    { id: 'habits', label: 'Habits', icon: 'monitoring' },
    { id: 'sleep', label: 'Sleep', icon: 'bedtime' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 bg-white/80 backdrop-blur-xl border-t border-white/30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center px-4 py-2 max-w-7xl mx-auto h-20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#6063ee] text-white rounded-full px-5 py-1.5 active-nav-glow scale-100 shadow-md shadow-indigo-500/20'
                  : 'text-[#464554] hover:bg-slate-200/50 rounded-xl p-2 hover:scale-[1.02]'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className={`text-xs font-medium ${isActive ? 'text-white font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
