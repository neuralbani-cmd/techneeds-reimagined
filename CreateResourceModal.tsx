import React, { useState } from 'react';
import { LearningResource, ResourceType, QuizQuestion } from '../types';
import { createResource } from '../services/api';
import {
  X,
  Video,
  HelpCircle,
  FolderGit2,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  programmeId: string;
  mentorId: string;
  onCreated: (resource: LearningResource) => void;
}

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  isOpen,
  onClose,
  programmeId,
  mentorId,
  onCreated,
}) => {
  const [type, setType] = useState<ResourceType>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('Core Architecture');
  const [maxMarks, setMaxMarks] = useState<number>(50);
  const [deadline, setDeadline] = useState('2025-04-30');

  // Video specific
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=8aGhZQkoFbQ');
  const [durationMinutes, setDurationMinutes] = useState<number>(35);

  // Project specific
  const [problemStatement, setProblemStatement] = useState('');
  const [submissionGuidelines, setSubmissionGuidelines] = useState('');
  const [starterRepo, setStarterRepo] = useState('');

  // Quiz specific
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'Which concurrency model does Node.js employ for asynchronous non-blocking I/O?',
      options: [
        'Single-threaded event loop with Libuv worker thread pool for blocking tasks',
        'Pure multi-threaded actor model with preemptive CPU scheduling',
        'Synchronous blocking process forking per incoming TCP socket',
        'Shared memory concurrent mutex lock queue'
      ],
      correctAnswerIndex: 0,
      explanation: 'Node.js runs user JavaScript code on a single event loop thread, delegating filesystem and cryptographic I/O to the C++ Libuv thread pool.'
    }
  ]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q_${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
      },
    ]);
  };

  const handleUpdateQuestion = (qIndex: number, field: keyof QuizQuestion, val: any) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], [field]: val };
    setQuestions(updated);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, val: string) => {
    const updated = [...questions];
    const opts = [...updated[qIndex].options];
    opts[optIndex] = val;
    updated[qIndex].options = opts;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<LearningResource, 'id' | 'createdAt'> = {
      programmeId,
      creatorMentorId: mentorId,
      type,
      title,
      description,
      topic,
      maxMarks: Number(maxMarks),
      deadline: type !== 'video' ? `${deadline}T23:59:59Z` : undefined,
    };

    if (type === 'video') {
      payload.videoUrl = videoUrl;
      payload.durationMinutes = Number(durationMinutes);
    } else if (type === 'quiz') {
      payload.questions = questions;
    } else if (type === 'project') {
      payload.problemStatement = problemStatement;
      payload.submissionGuidelines = submissionGuidelines;
      payload.starterRepo = starterRepo || undefined;
    }

    const created = createResource(payload);
    onCreated(created);
    onClose();
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

        <div className="flex items-start gap-3 mb-6 pr-8">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              Mentor Authoring Studio
            </span>
            <h2 className="text-lg font-bold text-white mt-1">Publish Learning Resource</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create video modules, interactive quizzes, or capstone projects
            </p>
          </div>
        </div>

        {/* Resource Type Switcher */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setType('video');
              setMaxMarks(50);
            }}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'video'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Module</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setType('quiz');
              setMaxMarks(100);
            }}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'quiz'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setType('project');
              setMaxMarks(200);
            }}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'project'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Capstone Project</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Resource Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Asynchronous Microservices & Redis Caching"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Related Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Systems"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description / Overview *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of what mentees will learn, concepts covered, and prerequisites..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Maximum Points/Marks</label>
              <input
                type="number"
                min={10}
                max={500}
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {type !== 'video' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Submission Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* TYPE A: VIDEO FIELDS */}
          {type === 'video' && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Video Stream Settings
              </span>
              <div>
                <label className="block text-slate-400 mb-1">Video Embed or YouTube URL *</label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-32 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TYPE B: QUIZ FIELDS */}
          {type === 'quiz' && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Quiz Questions Builder ({questions.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-300 font-mono">Q{qIdx + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter question prompt..."
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                    />

                    {/* 4 Options */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 block">
                        Options (select radio for correct answer):
                      </span>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${q.id}`}
                            checked={q.correctAnswerIndex === optIdx}
                            onChange={() => handleUpdateQuestion(qIdx, 'correctAnswerIndex', optIdx)}
                            className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <input
                            type="text"
                            required
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Explanation for correct answer (shown after grading)..."
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                        className="w-full px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TYPE C: PROJECT FIELDS */}
          {type === 'project' && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" /> Capstone Specifications
              </span>
              <div>
                <label className="block text-slate-400 mb-1">
                  Detailed Problem Statement & Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Detail the technical requirements, API contracts, edge case test suites, and expected deliverables..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Submission Instructions & Evaluation Rubric *
                </label>
                <textarea
                  rows={2}
                  required
                  value={submissionGuidelines}
                  onChange={(e) => setSubmissionGuidelines(e.target.value)}
                  placeholder="e.g. Provide GitHub repository, live deployed URL, and README detailing Docker setup..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Starter Template / GitHub URL (Optional)</label>
                <input
                  type="url"
                  value={starterRepo}
                  onChange={(e) => setStarterRepo(e.target.value)}
                  placeholder="https://github.com/techneeds-igdtuw/starter-repo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

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
              <Plus className="w-3.5 h-3.5" />
              <span>Publish {type.toUpperCase()} Resource</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
