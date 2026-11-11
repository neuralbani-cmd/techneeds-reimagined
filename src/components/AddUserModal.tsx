import React, { useState } from 'react';
import { User, Programme } from '../types';
import { createMentor, createMentee } from '../services/api';
import { X, UserPlus, KeyRound, Sparkles, Check } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: 'mentor' | 'mentee';
  programmes: Programme[];
  defaultProgrammeId?: string;
  onCreated: (user: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  programmes,
  defaultProgrammeId,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState(targetRole === 'mentor' ? 'Technical Mentor' : '3rd Year B.Tech');
  const [skillsInput, setSkillsInput] = useState(
    targetRole === 'mentor'
      ? 'System Design, Microservices, React, Docker'
      : 'Python, JavaScript, Data Structures, Web Dev'
  );
  const [programmeId, setProgrammeId] = useState(defaultProgrammeId || programmes[0]?.id || '');
  const [createdCredentials, setCreatedCredentials] = useState<{
    identifier: string;
    pass: string;
    name: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (targetRole === 'mentor') {
      const mentor = createMentor({
        name,
        email,
        department,
        year,
        skills,
        interestTags: skills.slice(0, 3),
        programmeId,
      });
      setCreatedCredentials({
        identifier: mentor.email,
        pass: mentor.password || 'mentor123',
        name: mentor.name,
      });
      onCreated(mentor);
    } else {
      const mentee = createMentee({
        name,
        email,
        department,
        year,
        skills,
        programmeId,
      });
      setCreatedCredentials({
        identifier: mentee.enrollmentNumber || mentee.email,
        pass: mentee.password || 'student123',
        name: mentee.name,
      });
      onCreated(mentee);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-6 pr-8">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              targetRole === 'mentor'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}
          >
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                targetRole === 'mentor'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-cyan-500/20 text-cyan-300'
              }`}
            >
              {targetRole === 'mentor' ? 'Industry Mentor Onboarding' : 'Mentee Enrollment'}
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Add New {targetRole === 'mentor' ? 'Technical Mentor' : 'Mentee (Student)'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {targetRole === 'mentor'
                ? 'Allocate mentor to track and issue credentials'
                : 'Auto-generates unique IGDTUW Enrollment Number and initial password'}
            </p>
          </div>
        </div>

        {createdCredentials ? (
          <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Check className="w-4 h-4" />
              <span>User Successfully Registered & Provisioned!</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400">
                Full Name: <strong className="text-white">{createdCredentials.name}</strong>
              </div>
              <div className="text-slate-400">
                {targetRole === 'mentee' ? 'Enrollment Number (Login ID)' : 'Login Email'}:{' '}
                <strong className="text-cyan-400 font-mono">
                  {createdCredentials.identifier}
                </strong>
              </div>
              <div className="text-slate-400">
                Initial Password:{' '}
                <strong className="text-amber-300 font-mono">{createdCredentials.pass}</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              The user can now log into their dedicated {targetRole} dashboard using these credentials.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Done & Return to Directory
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samaira Khan"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  targetRole === 'mentor'
                    ? 'mentor.name@techneeds.igdtuw.ac.in'
                    : 'student@igdtuw.ac.in'
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Mechanical & Automation">MAE</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {targetRole === 'mentor' ? 'Mentor Title' : 'Academic Year'}
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder={targetRole === 'mentor' ? 'e.g. Staff Engineer @ Meta' : 'e.g. 3rd Year B.Tech'}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Assign to Mentorship Programme *</label>
              <select
                required
                value={programmeId}
                onChange={(e) => setProgrammeId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.cohort})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Skills / Focus Areas</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="comma-separated tags..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

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
                className={`px-5 py-2 rounded-xl text-white font-semibold text-xs shadow-md flex items-center gap-1.5 cursor-pointer ${
                  targetRole === 'mentor'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                    : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Provision {targetRole === 'mentor' ? 'Mentor' : 'Mentee'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
