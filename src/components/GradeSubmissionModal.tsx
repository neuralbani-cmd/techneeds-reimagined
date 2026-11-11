import React, { useState } from 'react';
import { Submission, User, LearningResource } from '../types';
import { gradeSubmission } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Award,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  student: User | undefined;
  resource: LearningResource | undefined;
  mentorId: string;
  onGraded: (updated: Submission) => void;
}

export const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission,
  student,
  resource,
  mentorId,
  onGraded,
}) => {
  const [score, setScore] = useState<number>(submission?.score ?? resource?.maxMarks ?? 100);
  const [feedback, setFeedback] = useState<string>(
    submission?.mentorFeedback || 'Well structured solution. Code readability and test coverage are commendable.'
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !submission || !resource) return null;

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (score < 0 || score > resource.maxMarks) {
      setError(`Score must be between 0 and ${resource.maxMarks}`);
      return;
    }

    try {
      const updated = gradeSubmission(submission.id, Number(score), feedback.trim(), mentorId);
      if (updated) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1'],
        });
        onGraded(updated);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Grading failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-6 pr-8">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              Mentor Evaluation Portal
            </span>
            <h2 className="text-lg font-bold text-white mt-1">Review & Grade Submission</h2>
            <p className="text-xs text-slate-400 mt-0.5">{resource.title}</p>
          </div>
        </div>

        {/* Student & Submission Details */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 mb-6 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <img
                src={student?.avatar}
                alt={student?.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
              />
              <div>
                <span className="font-semibold text-slate-200">{student?.name || 'Student'}</span>
                <span className="text-slate-500 ml-2 font-mono">
                  {student?.enrollmentNumber || student?.email}
                </span>
              </div>
            </div>
            <span className="text-slate-400 font-mono">
              {new Date(submission.submittedAt).toLocaleDateString()}
            </span>
          </div>

          {submission.projectLink && (
            <div>
              <span className="text-slate-400 block mb-1">Delivered Artifact:</span>
              <a
                href={submission.projectLink}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-1.5 break-all hover:underline"
              >
                <span>{submission.projectLink}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}

          {submission.projectNotes && (
            <div>
              <span className="text-slate-400 block mb-1">Student Engineering Notes:</span>
              <p className="text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                {submission.projectNotes}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleGrade} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Awarded Score (Max: {resource.maxMarks} points)
              </label>
              <span className="text-xs text-amber-300 font-mono font-semibold">
                {Math.round((score / resource.maxMarks) * 100)}%
              </span>
            </div>
            <input
              type="number"
              required
              min={0}
              max={resource.maxMarks}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Mentor Feedback & Guidance</span>
            </label>
            <textarea
              rows={3}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback, praise code architecture, suggest edge-case optimizations..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Publish Grade & Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
