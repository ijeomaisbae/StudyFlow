import React, { useState } from 'react';
import { SemesterMilestone, Course } from '../../types';

interface AddMilestoneModalProps {
  isOpen: boolean;
  courses: Course[];
  onClose: () => void;
  onAddMilestone: (milestone: SemesterMilestone) => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  courses,
  onClose,
  onAddMilestone,
}) => {
  const [courseCode, setCourseCode] = useState<string>(courses[0]?.code || 'Biology 101');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Nov 15, 2026');
  const [weekNumber, setWeekNumber] = useState<number>(8);
  const [type, setType] = useState<SemesterMilestone['type']>('exam');
  const [weight, setWeight] = useState('25% of Grade');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMilestone({
      id: 'sm_' + Date.now(),
      courseCode,
      title: title.trim(),
      date: date || 'Upcoming',
      weekNumber: Number(weekNumber) || 1,
      type,
      status: 'upcoming',
      weight: weight || 'Key Milestone',
      description: description.trim() || undefined,
    });

    // Reset & close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-card bg-white/95 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-headline font-bold text-lg text-[#191c1e]">Add Semester Milestone</h3>
          <button onClick={onClose} className="text-[#767586] hover:text-[#191c1e] cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Course</label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#191c1e]"
              >
                <option value="ALL">All Enrolled</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SemesterMilestone['type'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#191c1e]"
              >
                <option value="exam">Exam / Test</option>
                <option value="project">Project / Lab</option>
                <option value="paper">Essay / Paper</option>
                <option value="break">Reading Break</option>
                <option value="event">Academic Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm 2 / Lab Report 3"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#191c1e]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Nov 15, 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Week #</label>
              <input
                type="number"
                min="1"
                max="16"
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#191c1e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Grade Weight</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 20% of Grade"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#191c1e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Description / Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key topics, exam format, or group members..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#191c1e]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#767586] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#4648d4] text-white text-xs font-semibold hover:bg-[#6063ee] cursor-pointer shadow-md shadow-indigo-500/20"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
