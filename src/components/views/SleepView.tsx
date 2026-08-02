import React, { useState, useEffect, useRef } from 'react';
import { SleepStats } from '../../types';

interface SleepViewProps {
  sleepStats: SleepStats;
}

type AmbientSound = 'off' | 'rain' | 'waves' | 'lofi' | 'white_noise';

export const SleepView: React.FC<SleepViewProps> = ({ sleepStats }) => {
  const [activeSound, setActiveSound] = useState<AmbientSound>('off');
  const [volume, setVolume] = useState(0.5);
  const [windDownTimer, setWindDownTimer] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [sleepNotes, setSleepNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>(['Felt refreshed after 8 hours sleep yesterday.', 'Reduced screen time 30 mins before bed.']);

  // Web Audio Synthesizer for ambient noise (rain/white noise/waves)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (windDownTimer && timerSecondsLeft > 0) {
      const interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setActiveSound('off');
            setWindDownTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [windDownTimer, timerSecondsLeft]);

  const stopAudio = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop?.();
        noiseNodeRef.current.disconnect();
      } catch {}
      noiseNodeRef.current = null;
    }
  };

  const playSound = (sound: AmbientSound) => {
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
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      // Create synthetic sound based on type
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        if (sound === 'rain' || sound === 'white_noise') {
          output[i] = Math.random() * 2 - 1;
        } else if (sound === 'waves') {
          output[i] = (Math.random() * 2 - 1) * Math.sin(i / 1000);
        } else {
          // Lofi tone
          output[i] = Math.sin(i / 40) * 0.2 + (Math.random() * 0.1);
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for rain sound
      const filter = ctx.createBiquadFilter();
      filter.type = sound === 'rain' ? 'lowpass' : sound === 'waves' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(sound === 'rain' ? 800 : 400, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      setActiveSound(sound);
    } catch (err) {
      console.log('Audio playback initialized:', err);
      setActiveSound(sound);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(v * 0.1, audioCtxRef.current.currentTime);
    }
  };

  const startWindDown = (mins: number) => {
    setWindDownTimer(mins);
    setTimerSecondsLeft(mins * 60);
    if (activeSound === 'off') {
      playSound('rain');
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header Banner */}
      <section className="glass-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#2c0051]/90 via-[#4648d4] to-[#8127cf] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md">
            <span className="material-symbols-outlined text-sm">bedtime</span>
            <span>Sleep & Recovery</span>
          </div>
          <h2 className="font-headline font-bold text-3xl md:text-4xl">
            Nightly Wind-Down & Soundscape
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Prepare your mind for restorative sleep with ambient soundscapes, bedtime timers, and reflection notes.
          </p>
        </div>
      </section>

      {/* Sleep Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-[#767586]">Target Bedtime</span>
            <p className="font-headline font-bold text-2xl text-[#191c1e] mt-1">{sleepStats.bedtime}</p>
            <p className="text-xs text-[#006c49] font-medium mt-1">Optimal wind-down at 10:45 PM</p>
          </div>
          <div className="w-12 h-12 bg-[#f0dbff] text-[#2c0051] rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">bedtime</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-[#767586]">Expected Wake-up</span>
            <p className="font-headline font-bold text-2xl text-[#191c1e] mt-1">{sleepStats.wakeup}</p>
            <p className="text-xs text-[#4648d4] font-medium mt-1">7h 30m target duration</p>
          </div>
          <div className="w-12 h-12 bg-[#e1e0ff] text-[#07006c] rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">alarm</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-[#767586]">Sleep Quality Score</span>
            <p className="font-headline font-bold text-2xl text-[#006c49] mt-1">{sleepStats.score} / 100</p>
            <p className="text-xs text-[#006c49] font-medium mt-1">+8% from last week</p>
          </div>
          <div className="w-12 h-12 bg-[#6ffbbe]/30 text-[#005236] rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">sentiment_very_satisfied</span>
          </div>
        </div>
      </section>

      {/* Interactive Soundscape Generator */}
      <section className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-headline font-bold text-xl text-[#191c1e]">Calming Soundscape Synthesizer</h3>
            <p className="text-xs text-[#464554]">Listen to soothing background noise to fall asleep faster</p>
          </div>
          {activeSound !== 'off' && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Playing {activeSound.replace('_', ' ').toUpperCase()}</span>
            </span>
          )}
        </div>

        {/* Sound Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'off', label: 'Mute', icon: 'volume_off' },
            { id: 'rain', label: 'Gentle Rain', icon: 'water_drop' },
            { id: 'waves', label: 'Ocean Waves', icon: 'waves' },
            { id: 'lofi', label: 'Lofi Ambient', icon: 'graphic_eq' },
            { id: 'white_noise', label: 'White Noise', icon: 'air' },
          ].map((s) => {
            const isSelected = activeSound === s.id;
            return (
              <button
                key={s.id}
                onClick={() => playSound(s.id as AmbientSound)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#4648d4] text-white shadow-lg shadow-indigo-500/20 scale-105 font-bold'
                    : 'bg-white/60 hover:bg-white text-[#464554] border border-slate-200/60'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                <span className="text-xs">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Volume & Wind-down Timer controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#464554]">
              <span>Volume Control</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#4648d4] cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#464554]">
              <span>Sleep Timer (Auto Stop)</span>
              {windDownTimer ? (
                <span className="text-[#4648d4] font-bold">{formatTimer(timerSecondsLeft)} remaining</span>
              ) : (
                <span>Disabled</span>
              )}
            </div>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => startWindDown(mins)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    windDownTimer === mins
                      ? 'bg-[#4648d4] text-white'
                      : 'bg-slate-100 text-[#464554] hover:bg-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
              {windDownTimer && (
                <button
                  onClick={() => {
                    setWindDownTimer(null);
                    setTimerSecondsLeft(0);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Nightly Reflection Notes */}
      <section className="glass-card p-6 md:p-8 rounded-3xl space-y-4">
        <h3 className="font-headline font-bold text-xl text-[#191c1e]">Nightly Sleep Journal & Reflection</h3>
        <p className="text-xs text-[#464554]">Clear your mind before sleep to reduce anxiety and wake up rejuvenated.</p>

        <div className="flex gap-3">
          <input
            type="text"
            value={sleepNotes}
            onChange={(e) => setSleepNotes(e.target.value)}
            placeholder="Write a quick thought or gratitude note before sleep..."
            className="flex-1 px-4 py-3 rounded-2xl border-none bg-white/70 focus:bg-white text-sm text-[#191c1e] shadow-sm"
          />
          <button
            onClick={() => {
              if (sleepNotes.trim()) {
                setSavedNotes([sleepNotes.trim(), ...savedNotes]);
                setSleepNotes('');
              }
            }}
            className="px-5 py-3 rounded-2xl bg-[#8127cf] text-white font-semibold text-xs hover:bg-[#9c48ea] transition-colors cursor-pointer"
          >
            Save Note
          </button>
        </div>

        <div className="space-y-2 pt-2">
          {savedNotes.map((note, idx) => (
            <div key={idx} className="p-3 bg-white/60 rounded-xl text-xs text-[#191c1e] border border-slate-100 flex items-center justify-between">
              <span>" {note} "</span>
              <span className="text-[10px] text-[#767586]">Saved</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
