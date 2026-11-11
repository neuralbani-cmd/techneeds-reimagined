import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { loginUser } from '../services/api';
import {
  X,
  Shield,
  Briefcase,
  GraduationCap,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'mentee',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    // Autofill demo for quick testing
    if (role === 'admin') {
      setIdentifier('admin@techneeds.igdtuw.ac.in');
      setPassword('admin123');
    } else if (role === 'mentor') {
      setIdentifier('priya.sharma@techneeds.igdtuw.ac.in');
      setPassword('mentor123');
    } else {
      setIdentifier('04210103223');
      setPassword('student123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = loginUser(identifier, password, selectedRole);
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoFill = (id: string, pass: string, role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(id);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px] mb-3">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
              <KeyRound className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Portal Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your TechNeeds IGDTUW mentorship ecosystem
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleChange('mentee')}
            className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'mentee'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Mentee</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('mentor')}
            className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'mentor'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Mentor</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {selectedRole === 'mentee' ? 'Enrollment Number or Email' : 'Institutional Email'}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                selectedRole === 'mentee'
                  ? 'e.g. 04210103223 or student email'
                  : 'name@techneeds.igdtuw.ac.in'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <span className="text-[11px] text-slate-500">Default: student123 / mentor123</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Sign In to {selectedRole.toUpperCase()} Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Quick Click */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Credentials:
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('04210103223', 'student123', 'mentee')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left flex items-center justify-between group transition-colors cursor-pointer"
            >
              <div>
                <span className="text-cyan-300 font-semibold font-mono">04210103223</span>
                <span className="text-slate-400 ml-2 text-[11px]">Ananya Verma (Mentee)</span>
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono">
                student123
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleDemoFill('priya.sharma@techneeds.igdtuw.ac.in', 'mentor123', 'mentor')
              }
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left flex items-center justify-between group transition-colors cursor-pointer"
            >
              <div>
                <span className="text-amber-300 font-semibold truncate">priya.sharma@...</span>
                <span className="text-slate-400 ml-2 text-[11px]">Er. Priya Sharma (Mentor)</span>
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-amber-400 font-mono">
                mentor123
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleDemoFill('admin@techneeds.igdtuw.ac.in', 'admin123', 'admin')
              }
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left flex items-center justify-between group transition-colors cursor-pointer"
            >
              <div>
                <span className="text-rose-300 font-semibold truncate">admin@...</span>
                <span className="text-slate-400 ml-2 text-[11px]">Dr. Radhika Sen (Admin)</span>
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-rose-400 font-mono">
                admin123
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
