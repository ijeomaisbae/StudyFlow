import React, { useState } from 'react';
import { TaskItem, Course, HabitItem } from '../../types';

interface AddItemModalProps {
  isOpen: boolean;
  type: 'task' | 'course' | 'habit' | 'timeline';
  onClose: () => void;
  onAddTask: (task: TaskItem) => void;
  onAddCourse: (course: Course) => void;
  onAddHabit: (habit: HabitItem) => void;
  onAddTimeline: (title: string, subtitle: string, time: string) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  type,
  onClose,
  onAddTask,
  onAddCourse,
  onAddHabit,
  onAddTimeline,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [timeOrDue, setTimeOrDue] = useState('2:00 PM');
  const [code, setCode] = useState('');
  const [icon, setIcon] = useState('menu_book');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === 'task') {
      onAddTask({
        id: 'task_' + Date.now(),
        title: title.trim(),
        dueTime: timeOrDue || 'Today',
        completed: false,
      });
    } else if (type === 'course') {
      onAddCourse({
        id: 'c_' + Date.now(),
        code: code.trim() || 'SUBJ 101',
        title: title.trim(),
        icon: icon || 'menu_book',
        badgeColor: 'primary',
        glowClass: 'glow-blue',
        completion: 0,
        pendingAssignments: 2,
        description: subtitle || 'New enrolled study module.',
        topics: ['Introduction', 'Core Theory', 'Final Review'],
        materials: [],
      });
    } else if (type === 'habit') {
      onAddHabit({
        id: 'h_' + Date.now(),
        name: title.trim(),
        detail: subtitle || 'Daily target',
        completed: false,
        icon: icon || 'auto_awesome',
        color: 'primary',
      });
    } else if (type === 'timeline') {
      onAddTimeline(title.trim(), subtitle || '30 mins study', timeOrDue || '14:00');
    }

    // Reset and close
    setTitle('');
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-card bg-white/95 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-headline font-bold text-lg text-[#191c1e]">
            {type === 'task' && 'Add Task to Schedule'}
            {type === 'course' && 'Enroll New Course'}
            {type === 'habit' && 'Create Custom Habit'}
            {type === 'timeline' && 'Schedule Timeline Event'}
          </h3>
          <button onClick={onClose} className="text-[#767586] hover:text-[#191c1e] cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'course'
                  ? 'e.g. Linear Algebra'
                  : type === 'habit'
                  ? 'e.g. Meditation'
                  : 'e.g. Write Literature Essay'
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#191c1e] focus:ring-2 focus:ring-[#4648d4]/30"
            />
          </div>

          {type === 'course' && (
            <div>
              <label className="block text-xs font-bold uppercase text-[#767586] mb-1">Course Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MATH 201"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#191c1e]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-[#767586] mb-1">
              {type === 'habit' ? 'Goal / Subtext' : type === 'course' ? 'Course Description' : 'Time / Due Date'}
            </label>
            <input
              type="text"
              value={type === 'task' || type === 'timeline' ? timeOrDue : subtitle}
              onChange={(e) => {
                if (type === 'task' || type === 'timeline') setTimeOrDue(e.target.value);
                else setSubtitle(e.target.value);
              }}
              placeholder={type === 'habit' ? 'e.g. 10 minutes daily' : 'e.g. 3:00 PM'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#191c1e]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
