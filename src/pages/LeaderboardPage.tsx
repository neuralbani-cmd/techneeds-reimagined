import React, { useState } from 'react';
import { LeaderboardEntry, Programme, User } from '../types';
import {
  Trophy,
  Medal,
  Flame,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  Award,
} from 'lucide-react';

interface LeaderboardPageProps {
  leaderboard: LeaderboardEntry[];
  programmes: Programme[];
  currentUser: User | null;
  onViewAIProfile: (user: User) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  leaderboard,
  programmes,
  currentUser,
  onViewAIProfile,
}) => {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = leaderboard.filter((entry) => {
    const matchesProgramme =
      selectedProgrammeId === 'all' ||
      entry.user.programmes.includes(selectedProgrammeId);
    const matchesSearch =
      entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.user.enrollmentNumber && entry.user.enrollmentNumber.includes(searchQuery));
    return matchesProgramme && matchesSearch;
  });

  const top3 = filteredEntries.slice(0, 3);
  const remaining = filteredEntries.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>TechNeeds IGDTUW Gamification Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cohort Leaderboard & Rankings
        </h1>
        <p className="text-xs text-slate-400">
          Rankings are dynamically calculated from verified quiz accuracy, production capstone deliveries,
          and daily learning streaks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Filter by Track:</span>
          <select
            value={selectedProgrammeId}
            onChange={(e) => setSelectedProgrammeId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Programmes (Overall)</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.code})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or roll no..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Podium for Top 3 */}
      {top3.length >= 3 && selectedProgrammeId === 'all' && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* 2nd Place */}
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 flex flex-col items-center text-center relative group">
            <div className="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-black text-lg flex items-center justify-center mb-3 ring-4 ring-slate-400/30">
              2
            </div>
            <img
              src={top3[1].user.avatar}
              alt={top3[1].user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-400 mb-3"
            />
            <h3 className="text-base font-bold text-white">{top3[1].user.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Roll: {top3[1].user.enrollmentNumber}
            </p>
            <div className="text-2xl font-black text-slate-200 font-mono mt-3">
              {top3[1].totalPoints} pts
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
              {top3[1].streak}d Streak • {top3[1].completedProjects} Projects
            </div>
            <button
              onClick={() => onViewAIProfile(top3[1].user)}
              className="mt-4 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI Profile</span>
            </button>
          </div>

          {/* 1st Place (Crown Champion) */}
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-400/80 flex flex-col items-center text-center relative shadow-2xl shadow-amber-500/10 -translate-y-2">
            <span className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Trophy className="w-3 h-3" /> Cohort Champion
            </span>
            <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center mb-3 ring-4 ring-amber-400/40 shadow-lg">
              1
            </div>
            <img
              src={top3[0].user.avatar}
              alt={top3[0].user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-400 mb-3 shadow-lg"
            />
            <h3 className="text-lg font-extrabold text-white">{top3[0].user.name}</h3>
            <p className="text-xs text-amber-300 font-mono mt-0.5">
              Roll: {top3[0].user.enrollmentNumber}
            </p>
            <div className="text-3xl font-black text-amber-300 font-mono mt-3">
              {top3[0].totalPoints} pts
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-1 font-mono">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              {top3[0].streak}d Streak • {top3[0].completedProjects} Projects Delivered
            </div>
            <button
              onClick={() => onViewAIProfile(top3[0].user)}
              className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspect Champion AI Profile</span>
            </button>
          </div>

          {/* 3rd Place */}
          <div className="order-3 p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 flex flex-col items-center text-center relative group">
            <div className="w-12 h-12 rounded-full bg-amber-800 text-white font-black text-lg flex items-center justify-center mb-3 ring-4 ring-amber-700/30">
              3
            </div>
            <img
              src={top3[2].user.avatar}
              alt={top3[2].user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-700 mb-3"
            />
            <h3 className="text-base font-bold text-white">{top3[2].user.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Roll: {top3[2].user.enrollmentNumber}
            </p>
            <div className="text-2xl font-black text-amber-500 font-mono mt-3">
              {top3[2].totalPoints} pts
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
              {top3[2].streak}d Streak • {top3[2].completedProjects} Projects
            </div>
            <button
              onClick={() => onViewAIProfile(top3[2].user)}
              className="mt-4 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Full Cohort Roster ({filteredEntries.length})</h2>
          <span className="text-xs text-slate-400 font-mono">Updated Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 text-center">Rank</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Enrollment No</th>
                <th className="px-5 py-3.5">Programme Track</th>
                <th className="px-5 py-3.5 text-center">Completed Work</th>
                <th className="px-5 py-3.5 text-center">Streak</th>
                <th className="px-5 py-3.5 text-right">Total Points</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.map((entry) => {
                const isMe = currentUser && entry.user.id === currentUser.id;

                return (
                  <tr
                    key={entry.user.id}
                    className={`transition-colors ${
                      isMe
                        ? 'bg-indigo-950/40 border-l-4 border-l-cyan-400 font-medium'
                        : 'hover:bg-slate-850/50'
                    }`}
                  >
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold font-mono text-xs ${
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
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.user.avatar}
                          alt={entry.user.name}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{entry.user.name}</span>
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{entry.user.department}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-cyan-300 font-semibold">
                      {entry.user.enrollmentNumber || 'N/A'}
                    </td>

                    <td className="px-5 py-3.5 text-slate-300">
                      <span className="text-xs">{entry.programmeName}</span>
                    </td>

                    <td className="px-5 py-3.5 text-center font-mono text-slate-300">
                      <span className="text-purple-300">{entry.completedQuizzes}Q</span> /{' '}
                      <span className="text-amber-300">{entry.completedProjects}P</span>
                    </td>

                    <td className="px-5 py-3.5 text-center font-mono text-orange-400 font-bold">
                      🔥 {entry.streak}d
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono font-black text-amber-300 text-sm">
                      {entry.totalPoints} pts
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onViewAIProfile(entry.user)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>AI Profile</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
