import React, { useState, useEffect } from 'react';
import { User, AIProfile, Submission, Programme } from '../types';
import {
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Terminal,
  Shield,
  Briefcase,
  GraduationCap,
  Share2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { fetchAIProfile, regenerateAIProfile } from '../services/api';
import confetti from 'canvas-confetti';

interface AIProfilePageProps {
  user: User;
  allUsers: User[];
  programmes: Programme[];
  submissions: Submission[];
  onSelectUser: (user: User) => void;
}

export const AIProfilePage: React.FC<AIProfilePageProps> = ({
  user,
  allUsers,
  programmes,
  submissions,
  onSelectUser,
}) => {
  const [profile, setProfile] = useState<AIProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchAIProfile(user).then((p) => {
      if (isMounted) {
        setProfile(p);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const updated = await regenerateAIProfile(user);
      setProfile(updated);
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#ec4899'],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const userSubs = submissions.filter((s) => s.menteeId === user.id);
  const completedCount = userSubs.filter((s) => s.status === 'graded').length;
  const userProg = programmes.find((p) => user.programmes.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Controls & Persona Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">
            Inspect AI Technical Profile for:
          </span>
          <select
            value={user.id}
            onChange={(e) => {
              const selected = allUsers.find((u) => u.id === e.target.value);
              if (selected) onSelectUser(selected);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role.toUpperCase()}{u.enrollmentNumber ? ` • ${u.enrollmentNumber}` : ''})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Copied Link!' : 'Share Profile'}</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
            <span>{regenerating ? 'Analyzing with Gemini...' : 'Regenerate via Gemini AI'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-3 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Synthesizing Technical Dossier</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Analyzing student pull requests, quiz accuracy, and streak velocity using Gemini...
          </p>
        </div>
      ) : profile ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Main Hero Card: Technical Identity & Avatar */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-purple-950/60 border border-slate-800 p-6 sm:p-10 shadow-2xl">
            {/* Glowing background circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Sci-Fi Generative Avatar Core */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-indigo-500 shadow-2xl shadow-indigo-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] overflow-hidden relative flex items-center justify-center">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Generative overlay circuit lines */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        IGDTUW
                      </span>
                      <span className="text-purple-300 font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {profile.avatarTitle}
                  </span>
                </div>
              </div>

              {/* Identity Narrative */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {user.role} Dossier
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {user.enrollmentNumber || user.email}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-300">{user.department}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>

                {/* Technical Identity Quote */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans relative">
                  <span className="text-cyan-400 font-bold block text-[11px] uppercase tracking-wider mb-1 font-mono">
                    Technical Identity Narrative:
                  </span>
                  "{profile.technicalIdentity}"
                </div>

                {/* Live Stats Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Gamified Points</div>
                    <div className="text-xl font-black text-amber-300 font-mono">
                      {user.points || 500} pts
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Daily Streak</div>
                    <div className="text-xl font-black text-orange-400 font-mono flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 fill-orange-400" />
                      {user.streak || 7}d
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Graded Modules</div>
                    <div className="text-xl font-black text-cyan-300 font-mono">
                      {completedCount}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Track</div>
                    <div className="text-xs font-bold text-purple-300 truncate mt-1">
                      {userProg?.code || 'Full-Stack'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Performance Evaluation & Strengths */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">AI Performance Summary</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono ml-auto">
                  Grounded on Real Submissions
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                {profile.performanceSummary}
              </p>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Demonstrated Competencies & Technologies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(user.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80"
                    >
                      {skill}
                    </span>
                  ))}
                  {(user.interestTags || []).map((tag, idx) => (
                    <span
                      key={`t_${idx}`}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 text-xs font-medium border border-indigo-800/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Streak & Velocity Analysis */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white">Cadence & Momentum</h3>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  {profile.learningStreakAnalysis}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <div className="text-[10px] text-slate-500">Last AI Synthesis Timestamp</div>
                <div className="text-xs text-cyan-400 font-mono mt-0.5">
                  {new Date(profile.lastGeneratedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* AI Skill Badges Matrix */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Certified Skill Badges</h3>
                <p className="text-xs text-slate-400">
                  Awarded by AI evaluation based on verified quiz accuracy and project pull requests
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {profile.skillBadges.length} Badges Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {profile.skillBadges.map((badge, idx) => {
                const isGold = badge.tier === 'Gold';
                const isPlat = badge.tier === 'Platinum';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isPlat
                        ? 'bg-purple-950/20 border-purple-500/40'
                        : isGold
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-cyan-950/20 border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isPlat
                            ? 'bg-purple-500/20 text-purple-300'
                            : isGold
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {badge.tier} Tier
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{badge.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">{badge.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{badge.reason}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personalised Next-Step Recommendations */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Personalized Next-Step Recommendations
                </h3>
                <p className="text-xs text-slate-400">
                  Curated curricula tailored to close skill gaps and prepare for elite engineering roles
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                AI Roadmap
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.personalizedRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800">
                        {rec.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Target #{idx + 1}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5">{rec.topic}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{rec.reason}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[11px]">
                    <span className="text-cyan-400 font-semibold block mb-0.5">
                      Suggested Capstone / Resource:
                    </span>
                    <span className="text-slate-300 leading-tight">{rec.suggestedResource}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
