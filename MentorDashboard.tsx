import React, { useState } from 'react';
import { User, Programme, LearningResource, Submission } from '../types';
import {
  Briefcase,
  Users,
  Clock,
  Sparkles,
  Plus,
  Video,
  HelpCircle,
  FolderGit2,
  Trash2,
  Edit,
  ExternalLink,
  Award,
  CheckCircle,
  Search,
  Filter,
  UserPlus,
  FileCheck,
} from 'lucide-react';
import { deleteResource } from '../services/api';
import { CreateResourceModal } from '../components/CreateResourceModal';
import { AddUserModal } from '../components/AddUserModal';
import { GradeSubmissionModal } from '../components/GradeSubmissionModal';

interface MentorDashboardProps {
  currentUser: User;
  programmes: Programme[];
  resources: LearningResource[];
  submissions: Submission[];
  users: User[];
  onResourcesUpdated: () => void;
  onSubmissionsUpdated: () => void;
  onUsersUpdated: () => void;
  onViewAIProfile: (user: User) => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  currentUser,
  programmes,
  resources,
  submissions,
  users,
  onResourcesUpdated,
  onSubmissionsUpdated,
  onUsersUpdated,
  onViewAIProfile,
}) => {
  const assignedProgrammes = programmes.filter((p) => currentUser.programmes.includes(p.id));
  const [selectedProgId, setSelectedProgId] = useState<string>(
    assignedProgrammes[0]?.id || programmes[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'resources' | 'mentees' | 'submissions'>('resources');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [isAddMenteeOpen, setIsAddMenteeOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

  // Mentees enrolled in mentor's assigned programmes
  const mentorMentees = users.filter(
    (u) => u.role === 'mentee' && u.programmes.some((pid) => currentUser.programmes.includes(pid))
  );

  // Submissions for mentor's programmes
  const mentorSubmissions = submissions.filter((s) =>
    currentUser.programmes.includes(s.programmeId)
  );
  const pendingSubmissions = mentorSubmissions.filter((s) => s.status === 'submitted');

  // Filter resources
  const currentProgResources = resources.filter((r) => r.programmeId === selectedProgId);
  const filteredResources = currentProgResources.filter((r) => {
    const matchesType = resourceTypeFilter === 'all' || r.type === resourceTypeFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Filter mentees
  const filteredMentees = mentorMentees.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.enrollmentNumber && m.enrollmentNumber.includes(searchQuery)) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteResource = (id: string) => {
    if (confirm('Delete this published learning resource?')) {
      deleteResource(id);
      onResourcesUpdated();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> Technical Mentor Workspace
            </span>
            <span className="text-xs text-slate-400">IGDTUW Industry Mentorship</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser.year} • Supervising {mentorMentees.length} future tech leaders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddMenteeOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enroll Mentee</span>
          </button>

          <button
            onClick={() => setIsCreateResourceOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Publish Resource</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Assigned Programmes</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {assignedProgrammes.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tracks supervised</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Mentees</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">
            {mentorMentees.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Under active mentorship</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Submissions</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting evaluation</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Published Modules</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 font-mono">
            {resources.filter((r) => currentUser.programmes.includes(r.programmeId)).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Videos, quizzes, projects</div>
        </div>
      </div>

      {/* Programme Switcher Bar */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Active Programme:</span>
          <div className="flex flex-wrap gap-1.5">
            {assignedProgrammes.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProgId(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedProgId === p.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p.title} ({p.code})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'resources'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Learning Resources ({currentProgResources.length})
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === 'submissions'
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Submissions Review ({mentorSubmissions.length})
              {pendingSubmissions.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('mentees')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mentees'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mentee Cohort ({mentorMentees.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-44 sm:w-56"
              />
            </div>

            {activeTab === 'resources' && (
              <select
                value={resourceTypeFilter}
                onChange={(e) => setResourceTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Types</option>
                <option value="video">Videos</option>
                <option value="quiz">Quizzes</option>
                <option value="project">Projects</option>
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: LEARNING RESOURCES MANAGEMENT */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Displaying modules for selected programme ({filteredResources.length})
              </span>
              <button
                onClick={() => setIsCreateResourceOpen(true)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Module</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((res) => {
                const isVideo = res.type === 'video';
                const isQuiz = res.type === 'quiz';
                const isProject = res.type === 'project';

                return (
                  <div
                    key={res.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase flex items-center gap-1 ${
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

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteResource(res.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 cursor-pointer transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1.5 leading-snug line-clamp-2">
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {res.description}
                      </p>

                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Topic:</span>
                          <span className="text-slate-200 font-medium">{res.topic}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Max Marks:</span>
                          <span className="text-cyan-400 font-mono font-semibold">
                            {res.maxMarks} pts
                          </span>
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
                            <span>Duration:</span>
                            <span className="text-slate-300 font-mono">
                              {res.durationMinutes} mins
                            </span>
                          </div>
                        )}
                        {isQuiz && res.questions && (
                          <div className="flex items-center justify-between">
                            <span>Questions:</span>
                            <span className="text-purple-300 font-mono font-semibold">
                              {res.questions.length} questions
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500">
                        Published {new Date(res.createdAt).toLocaleDateString()}
                      </span>
                      {isVideo && res.videoUrl && (
                        <a
                          href={res.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline text-[11px]"
                        >
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SUBMISSIONS MANAGEMENT & GRADING */}
        {activeTab === 'submissions' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Student Submissions & Grading</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluate submitted projects and quizzes, assign scores, and provide feedback
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-800/70">
              {mentorSubmissions.length > 0 ? (
                mentorSubmissions.map((sub) => {
                  const student = users.find((u) => u.id === sub.menteeId);
                  const resource = resources.find((r) => r.id === sub.resourceId);

                  return (
                    <div
                      key={sub.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={student?.avatar}
                          alt={student?.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-500/40 shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">
                              {student?.name || 'Student'}
                            </span>
                            <span className="text-[11px] font-mono text-cyan-400">
                              {student?.enrollmentNumber}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                                sub.status === 'graded'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 mt-0.5 font-medium">
                            {resource?.title || 'Assignment'}
                          </div>

                          {sub.projectLink && (
                            <a
                              href={sub.projectLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 mt-1 hover:underline break-all"
                            >
                              <span>{sub.projectLink}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {sub.mentorFeedback && (
                            <div className="text-[11px] text-slate-400 mt-1 italic bg-slate-950/60 p-2 rounded border border-slate-800">
                              Feedback: "{sub.mentorFeedback}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Score Awarded</div>
                          <div className="text-sm font-bold text-amber-300 font-mono">
                            {sub.score !== undefined ? `${sub.score} / ${sub.maxScore}` : `Pending / ${sub.maxScore}`}
                          </div>
                        </div>

                        <button
                          onClick={() => setGradingSubmission(sub)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{sub.status === 'graded' ? 'Update Grade' : 'Grade & Review'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No submissions recorded yet for your programmes.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MENTEE COHORT DIRECTORY */}
        {activeTab === 'mentees' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Supervised Students (Mentees)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View individual student engineering journeys and AI profiles
                </p>
              </div>
              <button
                onClick={() => setIsAddMenteeOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Mentee</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {filteredMentees.map((mentee) => (
                <div
                  key={mentee.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={mentee.avatar}
                      alt={mentee.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{mentee.name}</span>
                        <span className="text-xs font-mono text-cyan-300">
                          {mentee.enrollmentNumber}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {mentee.year}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {mentee.department} • Streak:{' '}
                        <span className="text-emerald-400 font-mono">🔥 {mentee.streak || 1}d</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Skills: <span className="text-slate-300">{(mentee.skills || []).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">Gamified Points</div>
                      <div className="text-sm font-bold text-amber-300 font-mono">
                        {mentee.points || 0} pts
                      </div>
                    </div>

                    <button
                      onClick={() => onViewAIProfile(mentee)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-cyan-500/40 text-cyan-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Inspect AI Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Creation & Grading Modals */}
      <CreateResourceModal
        isOpen={isCreateResourceOpen}
        onClose={() => setIsCreateResourceOpen(false)}
        programmeId={selectedProgId}
        mentorId={currentUser.id}
        onCreated={() => {
          onResourcesUpdated();
        }}
      />

      <AddUserModal
        isOpen={isAddMenteeOpen}
        onClose={() => setIsAddMenteeOpen(false)}
        targetRole="mentee"
        programmes={assignedProgrammes}
        defaultProgrammeId={selectedProgId}
        onCreated={() => {
          onUsersUpdated();
        }}
      />

      {gradingSubmission && (
        <GradeSubmissionModal
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          submission={gradingSubmission}
          student={users.find((u) => u.id === gradingSubmission.menteeId)}
          resource={resources.find((r) => r.id === gradingSubmission.resourceId)}
          mentorId={currentUser.id}
          onGraded={() => {
            onSubmissionsUpdated();
            onUsersUpdated();
          }}
        />
      )}
    </div>
  );
};
