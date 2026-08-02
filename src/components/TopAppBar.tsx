import React, { useState } from 'react';
import { USER_AVATAR } from '../data/mockData';

interface TopAppBarProps {
  userName?: string;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onStartFocusSession?: () => void;
  onOpenThemePicker?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  userName = "Alex",
  unreadNotificationsCount = 2,
  onOpenNotifications,
  onStartFocusSession,
  onOpenThemePicker,
}) => {

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'Biology Midterm in 3 days!', time: '10m ago', urgent: true },
    { id: '2', title: 'Calculus assignment overdue', time: '1h ago', urgent: true },
    { id: '3', title: 'Sleep streak target reached 🎉', time: '5h ago', urgent: false },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_20px_40px_rgba(73,75,214,0.1)]">
      <div className="flex justify-between items-center px-4 md:px-6 py-3 max-w-7xl mx-auto h-16">
        {/* User profile & greeting */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#6063ee]/30 hover:scale-[1.03] transition-transform cursor-pointer shadow-sm">
            <img 
              className="w-full h-full object-cover" 
              src={USER_AVATAR} 
              alt={userName} 
            />
          </div>
          <h1 className="font-headline font-semibold text-lg md:text-xl text-[#4648d4] flex items-center gap-1.5">
            Good Morning, {userName} <span className="inline-block animate-bounce">👋</span>
          </h1>
        </div>

        {/* Action icons & Focus button */}
        <div className="flex items-center gap-2">
          {onOpenThemePicker && (
            <button
              onClick={onOpenThemePicker}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 text-[#4648d4] transition-colors duration-200 cursor-pointer"
              title="Customize Theme & Background Color"
            >
              <span className="material-symbols-outlined text-xl">palette</span>
            </button>
          )}

          {onStartFocusSession && (
            <button
              onClick={onStartFocusSession}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4648d4]/10 hover:bg-[#4648d4]/20 text-[#4648d4] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">timer</span>
              <span>Quick Focus</span>
            </button>
          )}


          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (onOpenNotifications) onOpenNotifications();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors duration-200 relative cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[#464554]">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl border border-white/60 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-headline font-semibold text-sm text-[#191c1e]">Notifications</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#767586] hover:text-[#191c1e]"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs flex justify-between items-start ${
                        n.urgent ? 'bg-red-50 text-red-900 border border-red-100' : 'bg-white/60 text-[#191c1e]'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{n.title}</p>
                        <span className="text-[10px] opacity-70">{n.time}</span>
                      </div>
                      {n.urgent && (
                        <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Alert
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
