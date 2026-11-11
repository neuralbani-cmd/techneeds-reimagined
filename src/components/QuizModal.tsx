import React, { useState } from 'react';
import { LearningResource, Submission } from '../types';
import { submitQuiz } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: LearningResource | null;
  menteeId: string;
  onSubmitted: (submission: Submission) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  resource,
  menteeId,
  onSubmitted,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);

  if (!isOpen || !resource || !resource.questions) return null;

  const questions = resource.questions;

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (isSubmitted) return;
    const updated = [...selectedAnswers];
    updated[qIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswers.length < questions.length || selectedAnswers.includes(undefined as any)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const res = submitQuiz(menteeId, resource.id, selectedAnswers);
      setResult({ score: res.score, maxScore: res.maxScore });
      setIsSubmitted(true);
      onSubmitted(res.submission);

      // Trigger celebratory confetti if score > 70%
      if (res.score / res.maxScore >= 0.7) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#6366f1', '#a855f7'],
        });
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    }
  };

  const handleRetake = () => {
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-6 pr-8">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Quiz Evaluation
              </span>
              <span className="text-xs text-slate-400">
                Max Marks: <strong className="text-white">{resource.maxMarks} pts</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{resource.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{resource.description}</p>
          </div>
        </div>

        {/* Score Banner if completed */}
        {isSubmitted && result && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-cyan-900/30 border border-cyan-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Evaluation Completed</div>
                <div className="text-xl font-extrabold text-white">
                  Score: <span className="text-cyan-400">{result.score}</span> / {result.maxScore} pts
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    ({Math.round((result.score / result.maxScore) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRetake}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {questions.map((q, qIndex) => {
            const hasAnswered = selectedAnswers[qIndex] !== undefined;
            const isCorrect = isSubmitted && selectedAnswers[qIndex] === q.correctAnswerIndex;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm font-semibold text-slate-200">
                    <span className="text-purple-400 font-mono mr-1.5">Q{qIndex + 1}.</span>
                    {q.question}
                  </h3>
                  {isSubmitted && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 text-xs font-medium">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selectedAnswers[qIndex] === optIndex;
                    let optionStyle =
                      'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700';

                    if (isSubmitted) {
                      if (optIndex === q.correctAnswerIndex) {
                        optionStyle =
                          'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-medium';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                      } else {
                        optionStyle = 'bg-slate-900/50 border-slate-800/50 text-slate-500';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'bg-purple-600/20 border-purple-500/60 text-purple-200 font-medium shadow-sm';
                    }

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleSelectOption(qIndex, optIndex)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition-all cursor-pointer ${optionStyle}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                            isSelected
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {isSubmitted && q.explanation && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-cyan-400 font-semibold block mb-0.5">
                      Technical Explanation:
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {!isSubmitted ? (
              <span>
                Answered {selectedAnswers.filter((a) => a !== undefined).length} of{' '}
                {questions.length} questions
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Points recorded to your profile
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
            >
              {isSubmitted ? 'Close' : 'Cancel'}
            </button>

            {!isSubmitted && (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
