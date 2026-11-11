import React, { useState } from 'react';
import { Programme, User, Submission } from '../types';
import {
  Layers,
  Users,
  ShieldCheck,
  TrendingUp,
  Plus,
  Search,
  Filter,
  UserPlus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react';
import {
  deleteProgramme,
  assignMentorToProgramme,
  removeMentorFromProgramme,
} from '../services/api';
import { CreateProgrammeModal } from '../components/CreateProgrammeModal';
import { AddUserModal } from '../components/AddUserModal';

interface AdminDashboardProps {
  currentUser: User;
  programmes: Programme[];
  users: User[];
  submissions: Submission[];
  onProgrammesUpdated: () => void;
  onUsersUpdated: () => void;
  onViewAIProfile: (user: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  programmes,
  users,
  submissions,
  onProgrammesUpdated,
  onUsersUpdated,
  onViewAIProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'programmes' | 'mentors' | 'mentees'>('programmes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateProgOpen, setIsCreateProgOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedProgrammeDetails, setSelectedProgrammeDetails] = useState<Programme | null>(null);

  const mentors = users.filter((u) => u.role === 'mentor');
  const mentees = users.filter((u) => u.role === 'mentee');
  const activeCohorts = programmes.filter((p) => p.status === 'active').length;
  const gradedSubs = submissions.filter((s) => s.status === 'graded');
  const avgScore = gradedSubs.length
    ? Math.round(
        (gradedSubs.reduce((acc, s) => acc + ((s.score || 0) / s.maxScore) * 100, 0) /
          gradedSubs.length)
      )
    : 88;

  // Filter programmes
  const filteredProgrammes = programmes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter mentors
  const filteredMentors = mentors.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter mentees
  const filteredMentees = mentees.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.enrollmentNumber && m.enrollmentNumber.includes(searchQuery))
  );

  const handleDeleteProgramme = (id: string) => {
    if (confirm('Are you sure you want to delete this programme?')) {
      deleteProgramme(id);
      onProgrammesUpdated();
    }
  };

  const handleToggleMentorAssignment = (mentorId: string, programmeId: string) => {
    const prog = programmes.find((p) => p.id === programmeId);
    if (!prog) return;

    if (prog.mentorIds.includes(mentorId)) {
      removeMentorFromProgramme(mentorId, programmeId);
    } else {
      assignMentorToProgramme(mentorId, programmeId);
    }
    onProgrammesUpdated();
    onUsersUpdated();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Institutional Admin
            </span>
            <span className="text-xs text-slate-400">IGDTUW Academic Affairs</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Administrator Governance Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back, {currentUser.name}. Orchestrating cohorts, mentors, and learning pathways.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Onboard Mentor</span>
          </button>

          <button
            onClick={() => setIsCreateProgOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Programme</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Programmes</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{programmes.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 departments</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Mentors</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{mentors.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Senior alumnae & faculty</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Enrolled Mentees</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{mentees.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">IGDTUW students</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Cohorts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{activeCohorts}</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% On-track execution</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cohort Avg Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 font-mono">{avgScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all submissions</div>
        </div>
      </div>

      {/* Main Tab Controls & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('programmes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'programmes'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Programmes Management ({programmes.length})
            </button>

            <button
              onClick={() => setActiveTab('mentors')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mentors'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mentor Allocation ({mentors.length})
            </button>

            <button
              onClick={() => setActiveTab('mentees')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mentees'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mentee Directory ({mentees.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44 sm:w-60"
              />
            </div>

            {activeTab === 'programmes' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: PROGRAMMES MANAGEMENT TABLE & CARDS */}
        {activeTab === 'programmes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProgrammes.map((prog) => {
              const assignedMentors = mentors.filter((m) => prog.mentorIds.includes(m.id));
              const enrolledCount = prog.menteeIds.length;

              return (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                          {prog.code}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            prog.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {prog.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedProgrammeDetails(prog)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <BarChart3 className="w-3 h-3 text-cyan-400" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProgramme(prog.id)}
                          className="p-1 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Programme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5">{prog.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {prog.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
                      <div>
                        <div className="text-slate-500 text-[10px]">Cohort</div>
                        <div className="font-semibold text-slate-200 truncate">{prog.cohort}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Mentors</div>
                        <div className="font-semibold text-amber-400 font-mono">
                          {assignedMentors.length}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Mentees</div>
                        <div className="font-semibold text-cyan-400 font-mono">{enrolledCount}</div>
                      </div>
                    </div>

                    {/* Assigned Mentors List */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Assigned Industry Mentors:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {assignedMentors.length > 0 ? (
                          assignedMentors.map((m) => (
                            <span
                              key={m.id}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-1"
                            >
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-3.5 h-3.5 rounded-full object-cover"
                              />
                              <span>{m.name}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            No mentor assigned yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {prog.startDate} to {prog.endDate}
                    </span>
                    <span className="text-purple-300 font-medium">{prog.level}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MENTOR ALLOCATION */}
        {activeTab === 'mentors' && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Mentor Allocation & Oversight</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assign lead mentors to specific tracks or update their supervision status
                  </p>
                </div>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Mentor</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800/80">
                {filteredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-500/40 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{mentor.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {mentor.year}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{mentor.email}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {mentor.department} • Focus:{' '}
                          <span className="text-slate-300">{(mentor.skills || []).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Programme Assignment Dropdown checkboxes */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Assigned To:</span>
                      {programmes.map((prog) => {
                        const isAssigned = prog.mentorIds.includes(mentor.id);
                        return (
                          <button
                            key={prog.id}
                            onClick={() => handleToggleMentorAssignment(mentor.id, prog.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              isAssigned
                                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                            }`}
                          >
                            {isAssigned ? '✓ ' : '+ '}
                            {prog.code}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => onViewAIProfile(mentor)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ml-2"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>AI Dossier</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MENTEE DIRECTORY */}
        {activeTab === 'mentees' && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Enrolled IGDTUW Mentees</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Directory of active students, enrollment identifiers, points, and streak status
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Mentee</th>
                    <th className="px-4 py-3">Enrollment No</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Programmes</th>
                    <th className="px-4 py-3 text-center">Points</th>
                    <th className="px-4 py-3 text-center">Streak</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMentees.map((mentee) => (
                    <tr key={mentee.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={mentee.avatar}
                            alt={mentee.name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
                          />
                          <div>
                            <div className="font-semibold text-white">{mentee.name}</div>
                            <div className="text-[11px] text-slate-400">{mentee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-cyan-300">
                        {mentee.enrollmentNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div>{mentee.department}</div>
                        <div className="text-[10px] text-slate-500">{mentee.year}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {mentee.programmes.map((pid) => {
                            const p = programmes.find((pr) => pr.id === pid);
                            return (
                              <span
                                key={pid}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300"
                              >
                                {p ? p.code : pid}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-amber-300">
                        {mentee.points || 0}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-emerald-400 font-semibold">
                        🔥 {mentee.streak || 1}d
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onViewAIProfile(mentee)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium text-[11px] flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>AI Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Programme Detail Modal */}
      {selectedProgrammeDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative my-8">
            <button
              onClick={() => setSelectedProgrammeDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {selectedProgrammeDetails.code}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                {selectedProgrammeDetails.cohort}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              {selectedProgrammeDetails.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {selectedProgrammeDetails.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">Modules</div>
                <div className="text-lg font-bold text-white font-mono">
                  {selectedProgrammeDetails.modulesCount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">Mentors</div>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  {selectedProgrammeDetails.mentorIds.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">Enrolled Students</div>
                <div className="text-lg font-bold text-cyan-400 font-mono">
                  {selectedProgrammeDetails.menteeIds.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">Difficulty</div>
                <div className="text-sm font-semibold text-purple-300 mt-1">
                  {selectedProgrammeDetails.level}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedProgrammeDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creation Modals */}
      <CreateProgrammeModal
        isOpen={isCreateProgOpen}
        onClose={() => setIsCreateProgOpen(false)}
        onCreated={() => {
          onProgrammesUpdated();
        }}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        targetRole="mentor"
        programmes={programmes}
        onCreated={() => {
          onUsersUpdated();
        }}
      />
    </div>
  );
};
