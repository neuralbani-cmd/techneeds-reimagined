import React, { useState } from 'react';
import { Programme, User } from '../types';
import {
  Layers,
  Search,
  Calendar,
  CheckCircle2,
  Users,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { assignMenteeToProgramme } from '../services/api';
import confetti from 'canvas-confetti';

interface ProgrammesPageProps {
  programmes: Programme[];
  users: User[];
  currentUser: User | null;
  onProgrammesUpdated: () => void;
  onOpenAuth: (role?: any) => void;
  onGoToDashboard: () => void;
}

export const ProgrammesPage: React.FC<ProgrammesPageProps> = ({
  programmes,
  users,
  currentUser,
  onProgrammesUpdated,
  onOpenAuth,
  onGoToDashboard,
}) => {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledSuccessId, setEnrolledSuccessId] = useState<string | null>(null);

  const mentors = users.filter((u) => u.role === 'mentor');

  const filtered = programmes.filter((p) => {
    const matchesLevel = levelFilter === 'all' || p.level === levelFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleEnroll = (progId: string) => {
    if (!currentUser) {
      onOpenAuth('mentee');
      return;
    }

    if (currentUser.role !== 'mentee') {
      alert('Only student mentees can enroll in programmes.');
      return;
    }

    assignMenteeToProgramme(currentUser.id, progId);
    setEnrolledSuccessId(progId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onProgrammesUpdated();
    setTimeout(() => setEnrolledSuccessId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>IGDTUW Industry Mentorship Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Mentorship Programmes
        </h1>
        <p className="text-xs text-slate-400">
          Cohort-based engineering tracks curated by alumnae leaders at top tech companies.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Level:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, skill, code..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Programmes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((prog) => {
          const isEnrolled = currentUser?.programmes.includes(prog.id);
          const assignedMentors = mentors.filter((m) => prog.mentorIds.includes(m.id));

          return (
            <div
              key={prog.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {prog.code}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-semibold uppercase">
                      {prog.level}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {prog.cohort}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{prog.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{prog.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {prog.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Assigned Mentors */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-5">
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Industry Mentors Assigned:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {assignedMentors.length > 0 ? (
                      assignedMentors.map((m) => (
                        <div key={m.id} className="flex items-center gap-1.5 text-xs text-slate-200">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400"
                          />
                          <span>{m.name}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">Faculty Led</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {prog.startDate} to {prog.endDate}
                </span>

                {isEnrolled ? (
                  <button
                    onClick={onGoToDashboard}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enrolled (Open Workspace)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(prog.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>Enroll in Cohort</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
