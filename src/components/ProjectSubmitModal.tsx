import React, { useState } from 'react';
import { LearningResource, Submission } from '../types';
import { submitProject } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  FolderGit2,
  ExternalLink,
  Send,
  AlertCircle,
  FileCode,
  Github,
} from 'lucide-react';

interface ProjectSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: LearningResource | null;
  menteeId: string;
  existingSubmission?: Submission;
  onSubmitted: (submission: Submission) => void;
}

export const ProjectSubmitModal: React.FC<ProjectSubmitModalProps> = ({
  isOpen,
  onClose,
  resource,
  menteeId,
  existingSubmission,
  onSubmitted,
}) => {
  const [projectLink, setProjectLink] = useState(existingSubmission?.projectLink || '');
  const [projectNotes, setProjectNotes] = useState(existingSubmission?.projectNotes || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!projectLink.trim()) {
      setError('Please provide your GitHub repository or project link.');
      return;
    }

    try {
      const sub = submitProject(menteeId, resource.id, projectLink.trim(), projectNotes.trim());
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
      onSubmitted(sub);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit project');
    }
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
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Capstone Project Submission
              </span>
              <span className="text-xs text-slate-400">
                Max Marks: <strong className="text-white">{resource.maxMarks} pts</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{resource.title}</h2>
          </div>
        </div>

        {/* Project Problem & Guidelines */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
          <div>
            <span className="font-semibold text-slate-300 block mb-1">
              Problem Statement & Requirements:
            </span>
            <p className="text-slate-400 whitespace-pre-line leading-relaxed">
              {resource.problemStatement || resource.description}
            </p>
          </div>

          {resource.submissionGuidelines && (
            <div className="pt-2 border-t border-slate-800/80">
              <span className="font-semibold text-slate-300 block mb-1">
                Submission Guidelines & Rubric:
              </span>
              <p className="text-slate-400 leading-relaxed">{resource.submissionGuidelines}</p>
            </div>
          )}

          {resource.starterRepo && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                Starter Template & Architecture Spec:
              </span>
              <a
                href={resource.starterRepo}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 hover:underline"
              >
                <span>View Starter Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {existingSubmission && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs">
            <span className="text-indigo-300 font-semibold">Previous Submission Detected:</span>
            <span className="text-slate-400 ml-2">
              Status: <strong className="text-white uppercase">{existingSubmission.status}</strong>
              {existingSubmission.score !== undefined && (
                <span className="text-amber-300 ml-2">
                  (Score: {existingSubmission.score}/{existingSubmission.maxScore} pts)
                </span>
              )}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub Repository or Public Deployed URL *</span>
            </label>
            <input
              type="url"
              required
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              placeholder="https://github.com/your-username/techneeds-capstone"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Implementation Notes, Architecture Highlights & Loom Demo (Optional)
            </label>
            <textarea
              rows={4}
              value={projectNotes}
              onChange={(e) => setProjectNotes(e.target.value)}
              placeholder="Describe your design choices, key algorithmic optimizations, Docker containerization steps, or known limitations..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              On-time submissions earn +20 point bonus instantly.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{existingSubmission ? 'Update Submission' : 'Submit for Mentor Review'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
