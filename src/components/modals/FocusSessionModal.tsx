import React, { useState, useEffect, useRef } from 'react';

interface FocusSessionModalProps {
  isOpen: boolean;
  initialSubjectTitle?: string;
  initialDurationMins?: number;
  onClose: () => void;
  onSessionComplete?: (minutesSpent: number) => void;
}

export const FocusSessionModal: React.FC<FocusSessionModalProps> = ({
  isOpen,
  initialSubjectTitle = "Focused Study Flow",
  initialDurationMins = 25,
  onClose,
  onSessionComplete,
}) => {
  const [subject, setSubject] = useState(initialSubjectTitle);
  const [totalSeconds, setTotalSeconds] = useState(initialDurationMins * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(initialDurationMins * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeSound, setActiveSound] = useState<'off' | 'rain' | 'waves' | 'lofi'>('off');

  // AI Quick Question during study
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Sync initial props
  useEffect(() => {
    setSubject(initialSubjectTitle);
    const secs = initialDurationMins * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
    setIsActive(false);
  }, [initialSubjectTitle, initialDurationMins, isOpen]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      if (onSessionComplete) {
        onSessionComplete(Math.round(totalSeconds / 60));
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, totalSeconds, onSessionComplete]);

  // Web Audio Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const stopAudio = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop?.();
        noiseNodeRef.current.disconnect();
      } catch {}
      noiseNodeRef.current = null;
    }
  };

  const playSound = (sound: 'off' | 'rain' | 'waves' | 'lofi') => {
    stopAudio();
    if (sound === 'off') {
      setActiveSound('off');
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNode.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        if (sound === 'rain') {
          output[i] = Math.random() * 2 - 1;
        } else if (sound === 'waves') {
          output[i] = (Math.random() * 2 - 1) * Math.sin(i / 1000);
        } else {
          output[i] = Math.sin(i / 35) * 0.2 + (Math.random() * 0.1);
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      setActiveSound(sound);
    } catch {
      setActiveSound(sound);
    }
  };

  const handleAskAi = async () => {
    if (!aiQuery.trim()) return;
    setIsAskingAi(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Quick study help for subject '${subject}': ${aiQuery}`,
          courseTitle: subject,
        }),
      });
      const data = await res.json();
      setAiResponse(data.reply || 'Key tip: breakdown complex concepts into 3 key bullet points and test yourself!');
    } catch {
      setAiResponse('Active recall response: focus on breaking down definitions and testing yourself on core equations.');
    } finally {
      setIsAskingAi(false);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
  const strokeDashoffset = 452.3 - (452.3 * (100 - progressPercent)) / 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-card bg-white/95 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl border border-white text-center relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]">schedule</span>
            <span className="font-headline font-bold text-sm text-[#4648d4] uppercase tracking-wider">
              Deep Work Focus Session
            </span>
          </div>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#767586] hover:text-[#191c1e] cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Subject Title */}
        <div>
          <h2 className="font-headline font-bold text-2xl text-[#191c1e]">{subject}</h2>
          <p className="text-xs text-[#464554] mt-1">Sustain high focus. Eliminate distractions.</p>
        </div>

        {/* Timer Ring */}
        <div className="relative w-56 h-56 mx-auto my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-slate-100"
              cx="112"
              cy="112"
              r="72"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="12"
            />
            <circle
              className="text-[#4648d4] transition-all duration-500 ease-out"
              cx="112"
              cy="112"
              r="72"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray="452.3"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-headline font-extrabold text-4xl md:text-5xl text-[#191c1e] tracking-tight">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span className="text-xs font-semibold text-[#4648d4] uppercase tracking-wider mt-1">
              {isActive ? 'Session in progress' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-3 rounded-full ai-gradient text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined">{isActive ? 'pause' : 'play_arrow'}</span>
            <span>{isActive ? 'Pause' : 'Start Session'}</span>
          </button>

          <button
            onClick={() => {
              setIsActive(false);
              setSecondsRemaining(totalSeconds);
            }}
            className="p-3 rounded-full bg-slate-100 text-[#767586] hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset Timer"
          >
            <span className="material-symbols-outlined text-xl">restart_alt</span>
          </button>
        </div>

        {/* Ambient Noise Bar */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-bold text-[#767586] uppercase mb-2">Ambient Background Sound</p>
          <div className="flex justify-center gap-2 text-xs">
            {[
              { id: 'off', label: 'Mute' },
              { id: 'rain', label: 'Rain' },
              { id: 'waves', label: 'Waves' },
              { id: 'lofi', label: 'Lofi Drone' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => playSound(s.id as any)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeSound === s.id
                    ? 'bg-[#4648d4] text-white font-semibold'
                    : 'bg-slate-100 text-[#464554] hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ask AI Assistant inline */}
        <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-left space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4] text-sm">auto_awesome</span>
            <span className="font-headline font-bold text-xs text-[#4648d4]">Ask AI Assistant During Study</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
              placeholder="e.g. Explain integration by parts in 2 sentences..."
              className="flex-1 px-3 py-1.5 rounded-xl border-none bg-white text-xs text-[#191c1e]"
            />
            <button
              onClick={handleAskAi}
              disabled={isAskingAi}
              className="px-3 py-1.5 rounded-xl bg-[#4648d4] text-white text-xs font-semibold cursor-pointer"
            >
              {isAskingAi ? '...' : 'Ask'}
            </button>
          </div>
          {aiResponse && (
            <p className="text-xs text-[#191c1e] bg-white p-2.5 rounded-xl border border-indigo-100 leading-relaxed">
              {aiResponse}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
