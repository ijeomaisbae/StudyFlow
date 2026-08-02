import React, { useState } from 'react';
import { Course } from '../../types';

interface CoursesViewProps {
  courses: Course[];
  onStartCourseSession: (courseTitle: string) => void;
  onAddCourseClick: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onStartCourseSession,
  onAddCourseClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [aiFlashcards, setAiFlashcards] = useState<{ question: string; answer: string }[] | null>(null);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleGenerateFlashcards = async (course: Course) => {
    setIsGeneratingFlashcards(true);
    setAiFlashcards(null);
    setActiveFlashcardIndex(0);
    setShowAnswer(false);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate 3 study flashcards for course '${course.title} (${course.code})'. Topics: ${course.topics.join(', ')}`,
          type: 'flashcards',
          courseTitle: course.title,
        }),
      });
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        setAiFlashcards(data.data);
      } else {
        setAiFlashcards([
          { question: `What is the core theme of ${course.title}?`, answer: course.description || 'Focus on active problem solving and foundational principles.' },
          { question: `Key concept #1 in ${course.code}`, answer: course.topics[0] || 'Core principles and definitions.' },
          { question: `Key concept #2 in ${course.code}`, answer: course.topics[1] || 'Practical applications and exam questions.' },
        ]);
      }
    } catch {
      setAiFlashcards([
        { question: `What is the core focus of ${course.title}?`, answer: course.description || 'Focus on active recall and key principles.' },
        { question: `Important topic in ${course.code}`, answer: course.topics[0] || 'Core mechanics.' },
      ]);
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Search Bar Section */}
      <section className="mb-2">
        <div className="relative max-w-2xl mx-auto md:mx-0">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#767586]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, PDFs, or lectures..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-white/70 focus:bg-white focus:ring-2 focus:ring-[#4648d4]/30 glass-card transition-all text-[#191c1e] placeholder:text-[#767586] text-sm shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#767586] hover:text-[#191c1e]"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Page Title & Stats Overview */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-[#4648d4]">
            Your Courses
          </h2>
          <p className="text-[#464554] text-sm mt-1">
            You have 12 pending assignments this week.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <div className="px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] flex items-center gap-1.5 text-xs font-semibold">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>3 Completed</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#8127cf]/10 text-[#8127cf] flex items-center gap-1.5 text-xs font-semibold">
            <span className="material-symbols-outlined text-base">pending_actions</span>
            <span>8 In Progress</span>
          </div>
          <button
            onClick={onAddCourseClick}
            className="px-3 py-1 rounded-full bg-[#4648d4] text-white flex items-center gap-1 text-xs font-semibold hover:bg-[#6063ee] transition-colors cursor-pointer ml-1"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Course</span>
          </button>
        </div>
      </section>

      {/* Course Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          let badgeBg = 'bg-[#006c49]/10 text-[#006c49]';
          let progressBg = 'bg-[#006c49]';
          if (course.badgeColor === 'primary') {
            badgeBg = 'bg-[#4648d4]/10 text-[#4648d4]';
            progressBg = 'bg-[#4648d4]';
          } else if (course.badgeColor === 'secondary') {
            badgeBg = 'bg-[#8127cf]/10 text-[#8127cf]';
            progressBg = 'bg-[#8127cf]';
          } else if (course.badgeColor === 'neutral') {
            badgeBg = 'bg-slate-200 text-[#767586]';
            progressBg = 'bg-[#767586]';
          }

          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden cursor-pointer group flex flex-col justify-between ${course.glowClass}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl ${badgeBg}`}>
                    <span className="material-symbols-outlined text-2xl">{course.icon}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-semibold text-xs ${badgeBg}`}>
                    {course.code}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-xl text-[#191c1e] mb-2 group-hover:text-[#4648d4] transition-colors">
                  {course.title}
                </h3>

                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-xs text-[#464554]">
                    <span>Completion</span>
                    <span className="font-bold">{course.completion}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${progressBg}`}
                      style={{ width: `${course.completion}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[#464554] text-xs">
                  <span className="material-symbols-outlined text-base">assignment</span>
                  <span>{course.pendingAssignments} Pending</span>
                </div>

                {course.examNotice && (
                  <div className="flex items-center gap-1 text-[#006c49] text-xs font-semibold">
                    <span className="material-symbols-outlined text-base">event</span>
                    <span>{course.examNotice}</span>
                  </div>
                )}
                {course.overdueNotice && (
                  <div className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                    <span className="material-symbols-outlined text-base">warning</span>
                    <span>{course.overdueNotice}</span>
                  </div>
                )}
                {course.grade && (
                  <div className="flex items-center gap-1 text-[#006c49] text-xs font-semibold">
                    <span className="material-symbols-outlined text-base">star</span>
                    <span>{course.grade}</span>
                  </div>
                )}
                {course.nextLecture && (
                  <div className="text-[11px] text-[#767586] italic">
                    {course.nextLecture}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Study Assistant Recommendation Banner */}
      <section className="mt-8">
        <div className="glass-card rounded-2xl p-6 md:p-8 border-[#4648d4]/20 bg-gradient-to-br from-[#4648d4]/5 via-white/50 to-[#8127cf]/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#4648d4] text-white">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <h2 className="font-headline font-bold text-xl md:text-2xl text-[#4648d4]">
                AI Study Assistant
              </h2>
            </div>
            <p className="text-[#464554] text-sm md:text-base leading-relaxed">
              Based on your upcoming exams, I recommend focusing 45 minutes on Calculus integration today. You usually perform best at 2:00 PM.
            </p>
            <button
              onClick={() => onStartCourseSession('Calculus II - Advanced Integration')}
              className="ai-gradient text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>Start Focused Session</span>
            </button>
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-card bg-white/95 rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-white">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#4648d4]/10 text-[#4648d4] rounded-2xl">
                  <span className="material-symbols-outlined text-3xl">{selectedCourse.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#4648d4] bg-[#4648d4]/10 px-2.5 py-0.5 rounded-full">
                    {selectedCourse.code}
                  </span>
                  <h2 className="font-headline font-bold text-2xl text-[#191c1e] mt-1">
                    {selectedCourse.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-[#767586] hover:text-[#191c1e] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Description & Topics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#767586] mb-2">Overview</h4>
              <p className="text-sm text-[#464554] leading-relaxed">{selectedCourse.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#767586] mb-2">Key Syllabus Topics</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.topics.map((topic, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-[#4648d4] rounded-full text-xs font-semibold">
                    • {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#767586] mb-2">Study Materials & Notes</h4>
              <div className="space-y-2">
                {selectedCourse.materials.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4648d4]">
                        {m.type === 'pdf' ? 'picture_as_pdf' : m.type === 'slide' ? 'slideshow' : 'description'}
                      </span>
                      <span className="font-semibold text-[#191c1e]">{m.name}</span>
                    </div>
                    <span className="text-[#767586]">{m.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Flashcards Generator */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4648d4]">psychology</span>
                  <h4 className="font-headline font-bold text-sm text-[#4648d4]">AI Smart Flashcards</h4>
                </div>
                <button
                  onClick={() => handleGenerateFlashcards(selectedCourse)}
                  disabled={isGeneratingFlashcards}
                  className="px-3 py-1.5 rounded-full bg-[#4648d4] text-white text-xs font-semibold hover:bg-[#6063ee] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>{isGeneratingFlashcards ? 'Generating...' : 'Generate Cards'}</span>
                </button>
              </div>

              {aiFlashcards && aiFlashcards.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div 
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="p-5 bg-white rounded-xl border border-indigo-200 shadow-sm min-h-[100px] flex flex-col justify-center items-center text-center cursor-pointer hover:border-indigo-400 transition-all"
                  >
                    <span className="text-[10px] uppercase font-bold text-indigo-400 mb-1">
                      Card {activeFlashcardIndex + 1} of {aiFlashcards.length} • Click to Flip
                    </span>
                    <p className="font-semibold text-sm text-[#191c1e]">
                      {showAnswer ? aiFlashcards[activeFlashcardIndex].answer : aiFlashcards[activeFlashcardIndex].question}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs text-[#767586]">
                    <button
                      onClick={() => {
                        setActiveFlashcardIndex((prev) => Math.max(0, prev - 1));
                        setShowAnswer(false);
                      }}
                      disabled={activeFlashcardIndex === 0}
                      className="px-3 py-1 rounded bg-white disabled:opacity-40"
                    >
                      &larr; Previous
                    </button>
                    <span>{showAnswer ? 'Showing Answer' : 'Showing Question'}</span>
                    <button
                      onClick={() => {
                        setActiveFlashcardIndex((prev) => Math.min(aiFlashcards.length - 1, prev + 1));
                        setShowAnswer(false);
                      }}
                      disabled={activeFlashcardIndex === aiFlashcards.length - 1}
                      className="px-3 py-1 rounded bg-white disabled:opacity-40"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  const title = `${selectedCourse.code} - ${selectedCourse.title}`;
                  setSelectedCourse(null);
                  onStartCourseSession(title);
                }}
                className="flex-1 py-3 rounded-full bg-[#4648d4] text-white font-semibold text-sm hover:bg-[#6063ee] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                <span>Start Focus Timer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
