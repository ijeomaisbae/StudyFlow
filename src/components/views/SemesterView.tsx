import React, { useState } from 'react';
import { SemesterMilestone, Course } from '../../types';

interface SemesterViewProps {
  milestones: SemesterMilestone[];
  courses: Course[];
  onAddMilestoneClick: () => void;
  onOpenAiTutor: (topic: string) => void;
}

export const SemesterView: React.FC<SemesterViewProps> = ({
  milestones,
  courses,
  onAddMilestoneClick,
  onOpenAiTutor,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  const filteredMilestones = milestones.filter((m) => {
    const matchesCourse = selectedCourseFilter === 'ALL' || m.courseCode === selectedCourseFilter;
    const matchesType = selectedTypeFilter === 'ALL' || m.type === selectedTypeFilter;
    return matchesCourse && matchesType;
  });

  const getMilestoneTypeColor = (type: SemesterMilestone['type']) => {
    switch (type) {
      case 'exam':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'project':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'paper':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'break':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getMilestoneIcon = (type: SemesterMilestone['type']) => {
    switch (type) {
      case 'exam':
        return 'quiz';
      case 'project':
        return 'assignment';
      case 'paper':
        return 'article';
      case 'break':
        return 'beach_access';
      default:
        return 'event';
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Header Banner */}
      <section className="glass-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#2c0051] via-[#4648d4] to-[#005236] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span>16-Week Academic Master Map</span>
            </div>
            <h2 className="font-headline font-bold text-3xl md:text-4xl">Semester Planner & Milestones</h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Track major assignment drops, midterm waves, research papers, and break periods across your whole semester.
            </p>
          </div>

          <button
            onClick={onAddMilestoneClick}
            className="px-5 py-3 rounded-2xl bg-white text-[#2c0051] font-bold text-xs md:text-sm hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Add Milestone</span>
          </button>
        </div>
      </section>

      {/* Course Milestone Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="glass-card p-5 rounded-2xl space-y-3 border border-white/60">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-[#4648d4] font-bold text-xs uppercase tracking-wider">
                {c.code}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {c.readinessScore}% Ready
              </span>
            </div>
            <h4 className="font-headline font-bold text-base text-[#191c1e] line-clamp-1">{c.title}</h4>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#4648d4] h-2 rounded-full transition-all duration-500"
                style={{ width: `${c.completion}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#767586]">
              <span>{c.completion}% Syllabus Complete</span>
              <button
                onClick={() => onOpenAiTutor(c.title)}
                className="text-[#4648d4] font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">auto_awesome</span>
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase text-[#767586] mr-2">Filter Course:</span>
          <button
            onClick={() => setSelectedCourseFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedCourseFilter === 'ALL'
                ? 'bg-[#4648d4] text-white shadow-sm'
                : 'bg-slate-100 text-[#464554] hover:bg-slate-200'
            }`}
          >
            All Courses
          </button>
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseFilter(c.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedCourseFilter === c.code
                  ? 'bg-[#4648d4] text-white shadow-sm'
                  : 'bg-slate-100 text-[#464554] hover:bg-slate-200'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-[#767586]">Type:</span>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-[#191c1e] border-none focus:ring-2 focus:ring-[#4648d4]/30"
          >
            <option value="ALL">All Types</option>
            <option value="exam">Exams</option>
            <option value="project">Projects</option>
            <option value="paper">Papers</option>
            <option value="break">Breaks</option>
          </select>
        </div>
      </div>

      {/* Semester Timeline List */}
      <section className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-headline font-bold text-xl text-[#191c1e]">Semester Roadmap</h3>
            <p className="text-xs text-[#464554]">Chronological breakdown of key dates and deliverables</p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-[#4648d4] text-xs font-bold rounded-full">
            {filteredMilestones.length} Milestones
          </span>
        </div>

        <div className="relative border-l-2 border-indigo-100/80 ml-4 pl-6 space-y-8">
          {filteredMilestones.map((m) => (
            <div key={m.id} className="relative group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all ${
                  m.status === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-[#4648d4]'
                }`}
              />

              <div className="glass-card p-5 rounded-2xl hover:bg-white transition-all space-y-3 border border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getMilestoneTypeColor(
                        m.type
                      )}`}
                    >
                      <span className="material-symbols-outlined text-sm">{getMilestoneIcon(m.type)}</span>
                      <span className="capitalize">{m.type}</span>
                    </span>
                    <span className="text-xs font-bold text-[#4648d4] uppercase bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                      {m.courseCode}
                    </span>
                    <span className="text-xs text-[#767586] font-medium">Week {m.weekNumber}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-[#191c1e]">
                    <span className="material-symbols-outlined text-sm text-[#767586]">event</span>
                    <span>{m.date}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-headline font-bold text-lg text-[#191c1e]">{m.title}</h4>
                    {m.description && <p className="text-xs text-[#464554] mt-1">{m.description}</p>}
                  </div>
                  <span className="text-xs font-extrabold text-[#2c0051] bg-[#f0dbff] px-3 py-1 rounded-xl whitespace-nowrap">
                    {m.weight}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => onOpenAiTutor(`Help me prepare for ${m.title} in ${m.courseCode}`)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#4648d4] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    <span>Generate AI Study Guide</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
