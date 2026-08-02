import React, { useState, useEffect } from 'react';
import { Course } from '../../types';

interface AiTutorViewProps {
  courses: Course[];
  initialTopic?: string;
  onStartFocusSession?: (subject: string) => void;
}

type TutorMode = 'explain' | 'solve' | 'active_recall' | 'socratic';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  mode?: TutorMode;
  quizOptions?: string[];
  correctAnswer?: string;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  courses,
  initialTopic,
  onStartFocusSession,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.title || 'Biology 101');
  const [tutorMode, setTutorMode] = useState<TutorMode>('explain');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'tutor',
      text: `Hello Alex! I'm your Serene AI Tutor. I can explain complex academic concepts, break down multi-step equations, generate active recall practice quizzes, or guide you through tricky problems. What topic are we mastering today?`,
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    if (initialTopic) {
      setInputQuery(`Can you break down ${initialTopic} step-by-step with key examples?`);
    }
  }, [initialTopic]);

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Course Context: ${selectedCourse}. Mode: ${tutorMode.toUpperCase()}. Question: ${query}`,
          type: 'ai_tutor',
          courseTitle: selectedCourse,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || `Great question regarding ${selectedCourse}! Here is a structured active recall summary:\n\n• **Core Principle**: Always identify fundamental formulas first.\n• **Key Term**: The main mechanism involves feedback control loops.\n• **Active Recall Challenge**: Can you state the 2 primary differences from memory?`;

      const tutorMsg: ChatMessage = {
        id: 'tutor_' + Date.now(),
        sender: 'tutor',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: tutorMode,
      };

      setChatHistory((prev) => [...prev, tutorMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: 'tutor_err_' + Date.now(),
        sender: 'tutor',
        text: `Here is a clear breakdown for ${selectedCourse}:\n\n1. **Core Concept**: Break complex topics into 3 atomic principles.\n2. **Active Recall**: Test your memory by explaining this without reading notes.\n3. **Application**: Work through 1 practice problem right now in a 25-minute focus session!`,
        timestamp: 'Just now',
      };
      setChatHistory((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Header Banner */}
      <section className="glass-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#005236] via-[#4648d4] to-[#8127cf] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>24/7 Personal Study Companion</span>
          </div>
          <h2 className="font-headline font-bold text-3xl md:text-4xl">Serene AI Academic Tutor</h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Get instant, high-clarity answers, step-by-step problem derivations, and active recall quizzes tuned specifically to your courses.
          </p>
        </div>
      </section>

      {/* Mode & Course Selectors */}
      <section className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white">
        {/* Course Select */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4648d4]">menu_book</span>
          <span className="text-xs font-bold uppercase text-[#767586]">Active Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-[#191c1e] border-none focus:ring-2 focus:ring-[#4648d4]/30"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.title}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl text-xs font-semibold">
          {[
            { id: 'explain', label: 'Explain Concept', icon: 'lightbulb' },
            { id: 'solve', label: 'Step-by-Step Problem', icon: 'functions' },
            { id: 'active_recall', label: 'Active Recall Quiz', icon: 'quiz' },
            { id: 'socratic', label: 'Socratic Hints', icon: 'psychology' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setTutorMode(m.id as TutorMode)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                tutorMode === m.id
                  ? 'bg-[#4648d4] text-white shadow-sm font-bold'
                  : 'text-[#464554] hover:bg-slate-200/60'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{m.icon}</span>
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="glass-card p-6 rounded-3xl space-y-6 min-h-[420px] flex flex-col justify-between">
        {/* Messages List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'tutor' && (
                <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-[#4648d4] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
              )}

              <div
                className={`p-4 rounded-3xl max-w-2xl text-sm leading-relaxed space-y-2 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#4648d4] text-white rounded-tr-none'
                    : 'bg-white/90 text-[#191c1e] border border-slate-100 rounded-tl-none'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] opacity-75 pb-1 border-b border-current/10">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.sender === 'user' ? 'You' : 'Serene AI Tutor'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line text-xs sm:text-sm font-sans">{msg.text}</div>

                {msg.sender === 'tutor' && onStartFocusSession && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => onStartFocusSession(selectedCourse)}
                      className="px-3 py-1 rounded-xl bg-indigo-50 text-[#4648d4] hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">timer</span>
                      <span>Start Study Session on this Topic</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-[#2c0051] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs">
                  AX
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#767586] font-medium animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-[#4648d4] flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </div>
              <span>Serene AI Tutor is formulating an active recall breakdown...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold uppercase text-[#767586]">Quick Questions:</span>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              `Explain top 3 exam topics in ${selectedCourse}`,
              `Generate a 3-question active recall quiz for ${selectedCourse}`,
              `What is the most common mistake students make in ${selectedCourse}?`,
              `Give me an analogy to remember the core formula`,
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-1.5 rounded-full bg-indigo-50/80 hover:bg-indigo-100 text-[#4648d4] font-medium transition-colors cursor-pointer border border-indigo-100/60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Bar */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask AI Tutor anything about ${selectedCourse}...`}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-[#191c1e] focus:ring-2 focus:ring-[#4648d4]/30 focus:outline-none shadow-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-6 py-3 rounded-2xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-xs sm:text-sm disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">send</span>
            <span>Ask AI</span>
          </button>
        </div>
      </section>
    </div>
  );
};
