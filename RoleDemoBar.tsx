import React from 'react';
import { User, UserRole } from '../types';
import { Shield, Sparkles, GraduationCap, Briefcase, RefreshCw } from 'lucide-react';
import { INITIAL_USERS } from '../services/mockData';
import { setCurrentUser, resetToDemoData } from '../services/api';

interface RoleDemoBarProps {
  currentUser: User | null;
  onUserChange: (user: User) => void;
  onOpenAuth: (role?: UserRole) => void;
}

export const RoleDemoBar: React.FC<RoleDemoBarProps> = ({
  currentUser,
  onUserChange,
  onOpenAuth,
}) => {
  const adminUser = INITIAL_USERS[0];
  const mentorUser = INITIAL_USERS[1];
  const menteeUser = INITIAL_USERS[3];

  const handleSwitch = (user: User) => {
    setCurrentUser(user);
    onUserChange(user);
  };

  const handleReset = () => {
    if (confirm('Reset all demo data back to clean initial state?')) {
      resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="bg-slate-900/90 border-b border-indigo-900/40 text-xs px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          TechNeeds IGDTUW Multi-Role Prototype
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline text-slate-400">Quick Persona Switch:</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* Admin Quick Switch */}
        <button
          onClick={() => handleSwitch(adminUser)}
          className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
            currentUser?.role === 'admin'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
          }`}
          title="Login as Admin (Dr. Radhika Sen)"
        >
          <Shield className="w-3 h-3 text-rose-400" />
          <span>Admin</span>
        </button>

        {/* Mentor Quick Switch */}
        <button
          onClick={() => handleSwitch(mentorUser)}
          className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
            currentUser?.role === 'mentor'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
          }`}
          title="Login as Lead Mentor (Er. Priya Sharma)"
        >
          <Briefcase className="w-3 h-3 text-amber-400" />
          <span>Mentor</span>
        </button>

        {/* Mentee Quick Switch */}
        <button
          onClick={() => handleSwitch(menteeUser)}
          className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
            currentUser?.role === 'mentee'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
          }`}
          title="Login as Mentee (Ananya Verma - 04210103223)"
        >
          <GraduationCap className="w-3 h-3 text-cyan-400" />
          <span>Mentee</span>
        </button>

        <span className="text-slate-600">|</span>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
          title="Reset sample data"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Data</span>
        </button>
      </div>
    </div>
  );
};
