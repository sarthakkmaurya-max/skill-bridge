import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { BrainCircuit, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Award } from 'lucide-react';

export default function AssessmentTab({ onCompleted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.getAssessmentQuestions();
      if (res.success) {
        setQuestions(res.questions);
        setAnswers({});
        setCurrentIdx(0);
        setResult(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([qId, opt]) => ({
        questionId: Number(qId),
        selectedOption: opt,
      }));
      const res = await api.submitAssessment(payload);
      if (res.success) {
        setResult(res);
        if (onCompleted) onCompleted();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (questions.length === 0 && !result) {
    return (
      <div className="max-w-2xl mx-auto bg-[#0e1e38]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/10">
          <BrainCircuit className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            10-Question Skill & Role Readiness Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Evaluate your technical proficiency (React, JS, Node, Express, Databases, SQL, Python, Git) and soft skills (team conflict resolution, production incident response) to calculate your readiness for industry roles.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={fetchQuestions}
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all inline-flex items-center gap-2 group disabled:opacity-60"
          >
            {loading ? (
              <>Loading Questions...</>
            ) : (
              <>
                Start Assessment{' '}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto bg-[#0e1e38]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 text-center space-y-7 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Assessment Complete!</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs mt-2">
            <Sparkles className="w-3.5 h-3.5" />
            Overall Score: {result.overallScore}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left">
          {Object.entries(result.roleReadiness || {}).map(([key, item]) => (
            <div key={key} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2 font-bold text-xs">
                  <span className="capitalize text-slate-300">{key}</span>
                  <span className="text-emerald-400 font-extrabold">{item.percentage}%</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">{item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={fetchQuestions}
          className="px-6 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs transition-all"
        >
          Retake Assessment
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const qId = currentQ?.id;
  const isAnswered = answers[qId] !== undefined;
  const progressPct = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto bg-[#0e1e38]/85 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-9 space-y-7 shadow-2xl relative overflow-hidden">
      {/* Top Meta Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 uppercase tracking-wider text-[11px]">
            {currentQ.category} • {currentQ.competency}
          </span>
          <span className="font-semibold text-slate-400">
            Question <strong className="text-white font-bold">{currentIdx + 1}</strong> of {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 border border-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-blue-500/50"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
        {currentQ.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {currentQ.options.map((opt, i) => {
          const active = answers[qId] === opt;
          return (
            <button
              key={i}
              onClick={() => setAnswers({ ...answers, [qId]: opt })}
              className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-start gap-3.5 group outline-none ${
                active
                  ? 'bg-gradient-to-r from-blue-600/20 to-violet-600/20 border-blue-500/80 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border shrink-0 flex items-center justify-center text-xs font-bold transition-all ${
                  active
                    ? 'bg-blue-500 border-blue-400 text-white shadow-sm shadow-blue-500/50'
                    : 'border-white/20 text-slate-400 group-hover:border-white/40'
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="pt-0.5 leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-5 border-t border-white/10">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-25 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            disabled={!isAnswered}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            Next Question <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < questions.length}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-40"
          >
            {submitting ? 'Evaluating Readiness...' : 'Submit Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}