import React from 'react';
import { User, UserRole } from '../types';
import {
  Sparkles,
  Trophy,
  LayoutDashboard,
  Layers,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (role?: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" /> Admin
          </span>
        );
      case 'mentor':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Briefcase className="w-2.5 h-2.5" /> Mentor
          </span>
        );
      case 'mentee':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
            <GraduationCap className="w-2.5 h-2.5" /> Mentee
          </span>
        );
    }
  };

  const getDashboardViewName = () => {
    if (!currentUser) return 'landing';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    if (currentUser.role === 'mentor') return 'mentor-dashboard';
    return 'mentee-dashboard';
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-[37px] z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 text-lg">
                TN
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  TechNeeds
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 font-mono font-medium">
                  IGDTUW
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Reimagining Technical Mentorship
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'landing'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>

            {currentUser && (
              <button
                onClick={() => onNavigate(getDashboardViewName())}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView.includes('dashboard')
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>
                  {currentUser.role === 'admin'
                    ? 'Admin Portal'
                    : currentUser.role === 'mentor'
                    ? 'Mentor Workspace'
                    : 'Mentee Dashboard'}
                </span>
              </button>
            )}

            <button
              onClick={() => onNavigate('programmes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'programmes'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Programmes</span>
            </button>

            <button
              onClick={() => onNavigate('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'leaderboard'
                  ? 'bg-slate-800 text-amber-300 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            {currentUser && (
              <button
                onClick={() => onNavigate('ai-profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 relative group ${
                  currentView === 'ai-profile'
                    ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-200 hover:text-cyan-200 hover:bg-slate-800/70'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span className="font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  AI Profile
                </span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Gemini
                </span>
              </button>
            )}
          </nav>

          {/* User Section / Login */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <div className="text-xs font-semibold text-slate-200 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {getRoleBadge(currentUser.role)}
                      {currentUser.role === 'mentee' && currentUser.points !== undefined && (
                        <span className="text-[10px] text-amber-300 font-mono font-medium">
                          {currentUser.points} pts
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <div className="font-medium text-slate-200 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      {currentUser.enrollmentNumber && (
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                          Roll: {currentUser.enrollmentNumber}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigate(getDashboardViewName())}
                      className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Workspace Dashboard</span>
                    </button>

                    <button
                      onClick={() => onNavigate('ai-profile')}
                      className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Technical Profile</span>
                    </button>

                    <button
                      onClick={() => onNavigate('leaderboard')}
                      className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cohort Leaderboard</span>
                    </button>

                    <div className="my-1 border-t border-slate-800" />

                    <button
                      onClick={() => onOpenAuth()}
                      className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs tracking-wide shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer flex items-center gap-2"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
