import React, { useState } from 'react';
import {
  User,
  Programme,
  LearningResource,
  Submission,
  LeaderboardEntry,
} from '../types';
import {
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Video,
  HelpCircle,
  FolderGit2,
  Calendar,
  ArrowRight,
  ExternalLink,
  BookOpen,
  FileCheck,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  Star,
  Zap,
} from 'lucide-react';
import { QuizModal } from '../components/QuizModal';
import { VideoModal } from '../components/VideoModal';
import { ProjectSubmitModal } from '../components/ProjectSubmitModal';

interface MenteeDashboardProps {
  currentUser: User;
  programmes: Programme[];
  resources: LearningResource[];
  submissions: Submission[];
  leaderboard: LeaderboardEntry[];
  onResourcesUpdated: () => void;
  onSubmissionsUpdated: () => void;
  onViewAIProfile: (user: User) => void;
  onNavigateToLeaderboard: () => void;
}

export const MenteeDashboard: React.FC<MenteeDashboardProps> = ({
  currentUser,
  programmes,
  resources,
  submissions,
  leaderboard,
  onResourcesUpdated,
  onSubmissionsUpdated,
  onViewAIProfile,
  onNavigateToLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'learning' | 'assignments' | 'progress' | 'leaderboard'>('learning');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'video' | 'quiz' | 'project'>('all');

  // Modals
  const [selectedQuiz, setSelectedQuiz] = useState<LearningResource | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<LearningResource | null>(null);
  const [selectedProject, setSelectedProject] = useState<LearningResource | null>(null);

  // User's assigned programmes
  const userProgrammes = programmes.filter((p) => currentUser.programmes.includes(p.id));
  const primaryProgramme = userProgrammes[0] || programmes[0];

  // User's programme resources
  const userResources = resources.filter((r) =>
    currentUser.programmes.includes(r.programmeId)
  );

  // User submissions
  const mySubmissions = submissions.filter((s) => s.menteeId === currentUser.id);

  // Metrics
  const completedSubmissions = mySubmissions.filter((s) => s.status === 'graded');
  const myLeaderboardEntry = leaderboard.find((l) => l.user.id === currentUser.id);
  const myRank = myLeaderboardEntry ? myLeaderboardEntry.rank : 1;
  const totalPoints = currentUser.points || 840;
  const streak = currentUser.streak || 14;

  const filteredResources = userResources.filter((r) => {
    if (resourceFilter === 'all') return true;
    return r.type === resourceFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Greeting Header */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                {streak}d
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                  Mentee Scholar
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Roll: {currentUser.enrollmentNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {currentUser.name}! 👋
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                {currentUser.department} • Enrolled in{' '}
                <strong className="text-cyan-300">{primaryProgramme?.title}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onViewAIProfile(currentUser)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Inspect AI Profile</span>
            </button>

            <button
              onClick={onNavigateToLeaderboard}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Rank #{myRank} on Leaderboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Points Earned</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">{totalPoints}</div>
          <div className="text-[10px] text-slate-500 mt-1">Gamified score</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cohort Rank</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">#{myRank}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Top 5% Cohort</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400 font-mono">{streak} days</div>
          <div className="text-[10px] text-slate-500 mt-1">Unbroken momentum</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {completedSubmissions.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Graded modules</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>In Review</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono">
            {mySubmissions.filter((s) => s.status === 'submitted').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Pending mentor</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Track</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-slate-200 truncate mt-1">
            {primaryProgramme?.code}
          </div>
          <div className="text-[10px] text-indigo-300 mt-1">{primaryProgramme?.cohort}</div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'learning'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>My Learning Curriculum</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'assignments'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>My Assignments ({mySubmissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'progress'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>My Progress & Badges</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Cohort Leaderboard</span>
            </button>
          </div>

          {activeTab === 'learning' && (
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setResourceFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  resourceFilter === 'all'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setResourceFilter('video')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  resourceFilter === 'video'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setResourceFilter('quiz')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  resourceFilter === 'quiz'
                    ? 'bg-purple-500/20 text-purple-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quizzes
              </button>
              <button
                onClick={() => setResourceFilter('project')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  resourceFilter === 'project'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Projects
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: MY LEARNING */}
        {activeTab === 'learning' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => {
              const isVideo = res.type === 'video';
              const isQuiz = res.type === 'quiz';
              const isProject = res.type === 'project';
              const userSub = mySubmissions.find((s) => s.resourceId === res.id);
              const isCompleted = userSub?.status === 'graded';
              const isPending = userSub?.status === 'submitted';

              return (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase flex items-center gap-1 ${
                          isVideo
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : isQuiz
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {isVideo && <Video className="w-3 h-3" />}
                        {isQuiz && <HelpCircle className="w-3 h-3" />}
                        {isProject && <FolderGit2 className="w-3 h-3" />}
                        {res.type}
                      </span>

                      {isCompleted ? (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Graded ({userSub?.score}/{res.maxMarks})
                        </span>
                      ) : isPending ? (
                        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Submitted
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Max: {res.maxMarks} pts
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {res.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400 mb-4">
                      <div className="flex items-center justify-between">
                        <span>Topic:</span>
                        <span className="text-slate-200 font-medium">{res.topic}</span>
                      </div>
                      {res.deadline && (
                        <div className="flex items-center justify-between">
                          <span>Deadline:</span>
                          <span className="text-rose-300 font-mono">
                            {new Date(res.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {isVideo && res.durationMinutes && (
                        <div className="flex items-center justify-between">
                          <span>Watch Duration:</span>
                          <span className="text-slate-300 font-mono">{res.durationMinutes} mins</span>
                        </div>
                      )}
                      {isQuiz && res.questions && (
                        <div className="flex items-center justify-between">
                          <span>Questions:</span>
                          <span className="text-purple-300 font-mono">
                            {res.questions.length} questions
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-3 border-t border-slate-800">
                    {isVideo && (
                      <button
                        onClick={() => setSelectedVideo(res)}
                        className="w-full py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Watch Masterclass</span>
                      </button>
                    )}

                    {isQuiz && (
                      <button
                        onClick={() => setSelectedQuiz(res)}
                        className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Review / Retake Quiz' : 'Attempt Quiz Assessment'}</span>
                      </button>
                    )}

                    {isProject && (
                      <button
                        onClick={() => setSelectedProject(res)}
                        className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>{userSub ? 'View / Update Submission' : 'Submit Capstone Code'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MY ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Submitted Assignments & Grades</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track status, review mentor comments, and monitor awarded marks
              </p>
            </div>

            <div className="divide-y divide-slate-800/70">
              {mySubmissions.length > 0 ? (
                mySubmissions.map((sub) => {
                  const res = resources.find((r) => r.id === sub.resourceId);

                  return (
                    <div
                      key={sub.id}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              sub.type === 'quiz'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {sub.type}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              sub.status === 'graded'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {sub.status === 'graded' ? 'Graded & Evaluated' : 'Pending Mentor Review'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white">{res?.title || 'Assignment'}</h4>

                        {sub.projectLink && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">Delivered URL:</span>
                            <a
                              href={sub.projectLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 hover:underline"
                            >
                              <span>{sub.projectLink}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {sub.mentorFeedback && (
                          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mt-2">
                            <strong className="text-amber-400 block mb-0.5">
                              Mentor Feedback ({sub.gradedBy || 'Mentor'}):
                            </strong>
                            "{sub.mentorFeedback}"
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-400">Awarded Marks</div>
                        <div className="text-2xl font-black text-amber-300 font-mono">
                          {sub.score !== undefined ? `${sub.score}` : '--'}
                          <span className="text-sm font-normal text-slate-500">
                            {' '}
                            / {sub.maxScore} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  You haven't submitted any assignments yet. Explore the curriculum to get started!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MY PROGRESS & BADGES */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Streak & Velocity Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Cadence Velocity</span>
                <div className="text-3xl font-extrabold text-orange-400 font-mono mt-1 flex items-center gap-2">
                  <Flame className="w-7 h-7 fill-orange-400" />
                  {streak} Days
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Daily code submissions & active module completion. 3 days until next tier badge!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Curriculum Completion</span>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">
                  {Math.round((completedSubmissions.length / Math.max(userResources.length, 1)) * 100)}%
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (completedSubmissions.length / Math.max(userResources.length, 1)) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Quiz Accuracy</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">94%</div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Average theoretical comprehension across distributed systems & RAG evaluations.
                </p>
              </div>
            </div>

            {/* Achievement Badges Showcase */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Technical Badges & Milestones</h3>
                  <p className="text-xs text-slate-400">
                    Earned through rigorous code submissions and leaderboard excellence
                  </p>
                </div>
                <button
                  onClick={() => onViewAIProfile(currentUser)}
                  className="text-xs text-cyan-400 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>View in AI Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                    🥇
                  </div>
                  <div className="text-xs font-bold text-white">Algorithmic Thinker</div>
                  <div className="text-[10px] text-amber-400 font-semibold mt-0.5">Gold Tier</div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    Scored 100% on core distributed caching evaluation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/40 text-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                    💎
                  </div>
                  <div className="text-xs font-bold text-white">Project Builder</div>
                  <div className="text-[10px] text-purple-300 font-semibold mt-0.5">Platinum Tier</div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    Delivered Token Bucket rate limiter microservice.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                    ⚡
                  </div>
                  <div className="text-xs font-bold text-white">Velocity Dynamo</div>
                  <div className="text-[10px] text-cyan-300 font-semibold mt-0.5">Gold Tier</div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    Maintained 14-day continuous learning streak.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center opacity-70">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                    🔒
                  </div>
                  <div className="text-xs font-bold text-slate-300">Cloud Architect</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">In Progress (60%)</div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    Deploy Kubernetes cluster with self-healing pods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEADERBOARD SNAPSHOT */}
        {activeTab === 'leaderboard' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Cohort Standings</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Points computed from quiz results and evaluated GitHub capstones
                </p>
              </div>
              <button
                onClick={onNavigateToLeaderboard}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Leaderboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {leaderboard.map((entry) => {
                const isMe = entry.user.id === currentUser.id;
                return (
                  <div
                    key={entry.user.id}
                    className={`p-4 flex items-center justify-between transition-colors ${
                      isMe ? 'bg-indigo-950/40 border-l-4 border-l-cyan-400' : 'hover:bg-slate-850/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                          entry.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : entry.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{entry.rank}
                      </div>

                      <img
                        src={entry.user.avatar}
                        alt={entry.user.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">
                            {entry.user.name}
                          </span>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{entry.programmeName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block text-right">
                        <div className="text-[10px] text-slate-500">Streak</div>
                        <div className="text-xs text-orange-400 font-mono font-bold">
                          🔥 {entry.streak}d
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500">Total Points</div>
                        <div className="text-base font-black text-amber-300 font-mono">
                          {entry.totalPoints} pts
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      {selectedQuiz && (
        <QuizModal
          isOpen={!!selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          resource={selectedQuiz}
          menteeId={currentUser.id}
          onSubmitted={() => {
            onSubmissionsUpdated();
            onResourcesUpdated();
          }}
        />
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          resource={selectedVideo}
          onCompleted={() => {
            onSubmissionsUpdated();
          }}
        />
      )}

      {selectedProject && (
        <ProjectSubmitModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          resource={selectedProject}
          menteeId={currentUser.id}
          existingSubmission={mySubmissions.find((s) => s.resourceId === selectedProject.id)}
          onSubmitted={() => {
            onSubmissionsUpdated();
          }}
        />
      )}
    </div>
  );
};
