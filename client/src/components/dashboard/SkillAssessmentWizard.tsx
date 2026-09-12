import React, { useState } from 'react';
import { 
  ASSESSMENT_QUESTIONS, 
  AssessmentQuestionItem,
  FRONTEND_FOCUSED_ANSWERS,
  DATA_FOCUSED_ANSWERS
} from '@skillbridge/shared';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle, 
  Sparkles, 
  AlertCircle,
  Star,
  CheckCircle2,
  Code2,
  Users,
  Database,
  FlaskConical,
  RotateCcw
} from 'lucide-react';

interface SkillAssessmentWizardProps {
  initialAnswers?: Record<number, number>;
  onSubmit: (answers: Record<number, number>) => Promise<void>;
  onCancel?: () => void;
  submitting: boolean;
}

export const SkillAssessmentWizard: React.FC<SkillAssessmentWizardProps> = ({
  initialAnswers = {},
  onSubmit,
  onCancel,
  submitting,
}) => {
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalQuestions = ASSESSMENT_QUESTIONS.length; // 10
  const currentQuestion: AssessmentQuestionItem = ASSESSMENT_QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion.id];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectRating = (rating: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: rating,
    }));
    setValidationError(null);
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      setValidationError('Please select your confidence rating (1–5) before proceeding.');
      return;
    }
    setValidationError(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const missing: number[] = [];
    for (const q of ASSESSMENT_QUESTIONS) {
      if (!answers[q.id]) {
        missing.push(q.id);
      }
    }

    if (missing.length > 0) {
      setValidationError(
        `Please complete all 10 questions before submitting. Missing: Question ${missing.join(', ')}.`
      );
      const firstMissingIndex = ASSESSMENT_QUESTIONS.findIndex((q) => q.id === missing[0]);
      if (firstMissingIndex !== -1) {
        setCurrentIndex(firstMissingIndex);
      }
      return;
    }

    await onSubmit(answers);
  };

  const handleLoadFrontendScenario = () => {
    setAnswers({ ...FRONTEND_FOCUSED_ANSWERS });
    setValidationError(null);
  };

  const handleLoadDataScenario = () => {
    setAnswers({ ...DATA_FOCUSED_ANSWERS });
    setValidationError(null);
  };

  const handleResetAnswers = () => {
    setAnswers({});
    setValidationError(null);
  };

  const ratingLabels: Record<number, { label: string; color: string }> = {
    1: { label: 'Novice', color: 'border-red-500/40 text-red-300 bg-red-500/10' },
    2: { label: 'Beginner', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10' },
    3: { label: 'Competent', color: 'border-blue-500/40 text-blue-300 bg-blue-500/10' },
    4: { label: 'Proficient', color: 'border-indigo-500/40 text-indigo-300 bg-indigo-500/10' },
    5: { label: 'Expert', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header & Progress Indicator */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-glow-blue">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Student Skill &amp; Role Readiness Assessment</h2>
              <p className="text-xs text-slate-400">
                10-Skill Confidence Matrix • Evaluated against Industry Role Benchmarks
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Quick Test Scenarios Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <FlaskConical className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold">Quick Test Scenarios:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadFrontendScenario}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Auto-fill benchmark answers for Frontend Developer (React, JS, HTML/CSS, Git: 5/5)"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Frontend Focus (100%)</span>
            </button>
            <button
              type="button"
              onClick={handleLoadDataScenario}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Auto-fill benchmark answers for Data Analyst (SQL, Python, Problem Solving: 5/5)"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Analyst Focus (100%)</span>
            </button>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={handleResetAnswers}
                className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 glass-panel border border-white/10 transition-all flex items-center space-x-1"
                title="Clear answers"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Overall Progress</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}% Answered ({answeredCount}/{totalQuestions})</span>
          </div>
          <div className="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Single Question Card */}
      <div className="glass-card p-6 sm:p-9 rounded-2xl border border-white/15 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider flex items-center space-x-1.5 ${
              currentQuestion.category === 'technical'
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                : 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
            }`}>
              {currentQuestion.category === 'technical' ? (
                <Code2 className="w-3.5 h-3.5" />
              ) : (
                <Users className="w-3.5 h-3.5" />
              )}
              <span>{currentQuestion.category === 'technical' ? 'Technical Skill' : 'Soft Skill'}</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">#{currentQuestion.id} of 10</span>
          </div>

          <span className="text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">
            Skill: {currentQuestion.skillName}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white leading-snug">
            {currentQuestion.question}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentQuestion.description}
          </p>
        </div>

        {/* Confidence Rating Selection (1 to 5) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Select Your Confidence Level:</span>
            <span className="text-slate-500">1 = Novice, 5 = Expert</span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((rating) => {
              const isSelected = currentAnswer === rating;
              const meta = ratingLabels[rating];
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleSelectRating(rating)}
                  className={`py-3.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 group ${
                    isSelected
                      ? `${meta.color} border-2 shadow-glow-blue scale-[1.03]`
                      : 'border-white/10 bg-navy-950/60 text-slate-300 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          isSelected ? 'fill-current text-amber-400' : 'text-slate-500 group-hover:text-amber-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-black">{rating}</span>
                  <span className="text-[10px] font-medium hidden sm:inline">{meta.label}</span>
                </button>
              );
            })}
          </div>

          {currentAnswer ? (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-200 flex items-start space-x-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Level {currentAnswer} Description: </span>
                <span>{currentQuestion.levelDescriptors[currentAnswer]}</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>Please tap a rating from 1 (Novice) to 5 (Expert) to rate your mastery.</span>
            </div>
          )}
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Navigation & Submission Controls */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-500'
                : 'glass-panel text-slate-300 hover:text-white hover:border-white/30'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Quick jump dot indicators */}
          <div className="hidden sm:flex items-center space-x-1.5">
            {ASSESSMENT_QUESTIONS.map((q, idx) => {
              const isDone = Boolean(answers[q.id]);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    if (isDone || isCurrent || answers[currentQuestion.id]) {
                      setValidationError(null);
                      setCurrentIndex(idx);
                    } else {
                      setValidationError('Please rate current question before jumping.');
                    }
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isCurrent
                      ? 'w-6 bg-blue-500 shadow-glow-blue'
                      : isDone
                      ? 'bg-emerald-400'
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Question ${idx + 1}: ${q.skillName}`}
                />
              );
            })}
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue flex items-center space-x-2 transition-all group"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all"
            >
              {submitting ? (
                <span>Calculating Readiness...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};