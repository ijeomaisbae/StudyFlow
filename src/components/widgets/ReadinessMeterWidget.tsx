import React, { useState } from 'react';
import { Course } from '../../types';

interface ReadinessMeterWidgetProps {
  courses: Course[];
  onOpenAiTutor: (topic: string) => void;
  onUpdateCourseReadiness?: (courseId: string, newScore: number) => void;
}

export const ReadinessMeterWidget: React.FC<ReadinessMeterWidgetProps> = ({
  courses,
  onOpenAiTutor,
  onUpdateCourseReadiness,
}) => {
  const [activeCourseId, setActiveCourseId] = useState<string>(courses[0]?.id || '');
  const [simulatingQuiz, setSimulatingQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const selectedCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  const handleSimulateQuiz = () => {
    setSimulatingQuiz(true);
    setTimeout(() => {
      const scoreGain = Math.floor(Math.random() * 8) + 4; // 4 to 11% boost
      const newScore = Math.min(100, (selectedCourse?.readinessScore || 70) + scoreGain);
      if (onUpdateCourseReadiness && selectedCourse) {
        onUpdateCourseReadiness(selectedCourse.id, newScore);
      }
      setQuizScore(newScore);
      setSimulatingQuiz(false);
    }, 1200);
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-800' };
    if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', badge: 'bg-amber-50 text-amber-800' };
    return { text: 'text-rose-600', bg: 'bg-rose-500', badge: 'bg-rose-50 text-rose-800' };
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/80 shadow-sm relative overflow-hidden">
      {/* Widget Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49]">speed</span>
            <span className="font-headline font-bold text-xs uppercase text-[#006c49] tracking-wider">
              Exam & Test Readiness Meter
            </span>
          </div>
          <h3 className="font-headline font-bold text-xl text-[#191c1e] mt-1">
            Predictive Test Preparedness
          </h3>
        </div>

        <button
          onClick={() => onOpenAiTutor(`Predictive mock exam practice for ${selectedCourse?.title}`)}
          className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#005236] text-xs font-bold border border-emerald-200/60 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-sm">quiz</span>
          <span>Generate Mock Quiz</span>
        </button>
      </div>

      {/* Course Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {courses.map((c) => {
          const isSelected = c.id === activeCourseId;
          const colors = getReadinessColor(c.readinessScore);
          return (
            <button
              key={c.id}
              onClick={() => {
                setActiveCourseId(c.id);
                setQuizScore(null);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#191c1e] text-white shadow-md scale-105'
                  : 'bg-slate-100/80 text-[#464554] hover:bg-slate-200'
              }`}
            >
              <span>{c.code}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${colors.badge}`}>
                {c.readinessScore}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Readiness Breakdown for Selected Course */}
      {selectedCourse && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white/80 rounded-2xl border border-slate-100">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase text-[#767586]">{selectedCourse.code}</span>
              <h4 className="font-headline font-bold text-xl text-[#191c1e]">{selectedCourse.title}</h4>
              <p className="text-xs text-[#464554]">
                {selectedCourse.examNotice ? selectedCourse.examNotice : 'Regular Syllabus Tracking'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 min-w-[130px]">
              <span className="text-[10px] font-bold text-[#4648d4] uppercase">Readiness Meter</span>
              <span className={`font-headline font-extrabold text-3xl ${getReadinessColor(selectedCourse.readinessScore).text}`}>
                {selectedCourse.readinessScore}%
              </span>
              <span className="text-[10px] text-[#006c49] font-semibold">
                {selectedCourse.readinessScore >= 80 ? 'Exam Ready' : selectedCourse.readinessScore >= 60 ? 'Moderate Prep' : 'Needs Review'}
              </span>
            </div>
          </div>

          {/* Sub-factors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white/60 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-[#767586] uppercase">Syllabus Mastery</span>
              <p className="font-bold text-base text-[#191c1e]">
                {selectedCourse.readinessBreakdown?.syllabusMastery || 75}%
              </p>
            </div>

            <div className="p-3 bg-white/60 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-[#767586] uppercase">Practice Accuracy</span>
              <p className="font-bold text-base text-[#191c1e]">
                {selectedCourse.readinessBreakdown?.practiceAccuracy || 70}%
              </p>
            </div>

            <div className="p-3 bg-white/60 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-[#767586] uppercase">Mock Test Score</span>
              <p className="font-bold text-base text-[#191c1e]">
                {selectedCourse.readinessBreakdown?.mockTestScore || 80}%
              </p>
            </div>

            <div className="p-3 bg-white/60 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-[#767586] uppercase">Active Recall</span>
              <p className="font-bold text-base text-[#191c1e]">
                {selectedCourse.readinessBreakdown?.activeRecallConfidence || 72}%
              </p>
            </div>
          </div>

          {/* Interactive Readiness Booster */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="font-bold text-xs text-[#005236] flex items-center justify-center sm:justify-start gap-1">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Active Readiness Simulator</span>
              </span>
              <p className="text-xs text-[#464554]">
                Complete a 2-minute active recall exercise to update your readiness prediction score!
              </p>
            </div>

            <button
              onClick={handleSimulateQuiz}
              disabled={simulatingQuiz}
              className="px-4 py-2 bg-[#006c49] hover:bg-[#005236] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {simulatingQuiz ? (
                <span>Evaluating...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>Run Readiness Boost</span>
                </>
              )}
            </button>
          </div>

          {quizScore && (
            <p className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl text-center animate-in fade-in">
              🎉 Readiness score updated to {quizScore}%! Great retention on {selectedCourse.title}!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
