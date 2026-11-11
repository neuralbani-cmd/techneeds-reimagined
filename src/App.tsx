import React, { useState, useEffect } from 'react';
import { User, Programme, LearningResource, Submission, LeaderboardEntry, UserRole } from './types';
import {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  getProgrammes,
  getResources,
  getSubmissions,
  getUsers,
  getLeaderboard,
  initDatabase,
} from './services/api';

import { RoleDemoBar } from './components/RoleDemoBar';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { MentorDashboard } from './pages/MentorDashboard';
import { MenteeDashboard } from './pages/MenteeDashboard';
import { AIProfilePage } from './pages/AIProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProgrammesPage } from './pages/ProgrammesPage';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('mentee');

  // Live Database States
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Initialize DB and load state
  const reloadData = () => {
    initDatabase();
    const user = getCurrentUser();
    setCurrentUserState(user);
    if (!selectedProfileUser && user) {
      setSelectedProfileUser(user);
    }
    setProgrammes(getProgrammes());
    setResources(getResources());
    setSubmissions(getSubmissions());
    setUsers(getUsers());
    setLeaderboard(getLeaderboard());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleUserChange = (newUser: User) => {
    setCurrentUserState(newUser);
    setSelectedProfileUser(newUser);
    reloadData();
    // Route to user's dashboard automatically
    if (newUser.role === 'admin') setCurrentView('admin-dashboard');
    else if (newUser.role === 'mentor') setCurrentView('mentor-dashboard');
    else setCurrentView('mentee-dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setCurrentView('landing');
  };

  const handleOpenAuth = (role?: UserRole) => {
    if (role) setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleViewAIProfile = (targetUser: User) => {
    setSelectedProfileUser(targetUser);
    setCurrentView('ai-profile');
  };

  const handleGoToDashboard = () => {
    if (!currentUser) {
      handleOpenAuth('mentee');
      return;
    }
    if (currentUser.role === 'admin') setCurrentView('admin-dashboard');
    else if (currentUser.role === 'mentor') setCurrentView('mentor-dashboard');
    else setCurrentView('mentee-dashboard');
  };

  // Protect role-based views
  const renderCurrentView = () => {
    if (currentView === 'landing') {
      return (
        <LandingPage
          programmes={programmes}
          currentUser={currentUser}
          onExploreProgrammes={() => setCurrentView('programmes')}
          onOpenAuth={handleOpenAuth}
          onGoToDashboard={handleGoToDashboard}
          onViewAIProfile={() => {
            if (currentUser) handleViewAIProfile(currentUser);
            else handleOpenAuth();
          }}
        />
      );
    }

    if (currentView === 'programmes') {
      return (
        <ProgrammesPage
          programmes={programmes}
          users={users}
          currentUser={currentUser}
          onProgrammesUpdated={reloadData}
          onOpenAuth={handleOpenAuth}
          onGoToDashboard={handleGoToDashboard}
        />
      );
    }

    if (currentView === 'leaderboard') {
      return (
        <LeaderboardPage
          leaderboard={leaderboard}
          programmes={programmes}
          currentUser={currentUser}
          onViewAIProfile={handleViewAIProfile}
        />
      );
    }

    if (currentView === 'ai-profile') {
      const target = selectedProfileUser || currentUser || users[3];
      return (
        <AIProfilePage
          user={target}
          allUsers={users}
          programmes={programmes}
          submissions={submissions}
          onSelectUser={(u) => setSelectedProfileUser(u)}
        />
      );
    }

    if (currentView === 'admin-dashboard') {
      if (!currentUser || currentUser.role !== 'admin') {
        return (
          <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Admin Authentication Required</h2>
            <p className="text-xs text-slate-400">
              You must be logged in as an institutional administrator to access governance tools.
            </p>
            <button
              onClick={() => handleOpenAuth('admin')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>
        );
      }
      return (
        <AdminDashboard
          currentUser={currentUser}
          programmes={programmes}
          users={users}
          submissions={submissions}
          onProgrammesUpdated={reloadData}
          onUsersUpdated={reloadData}
          onViewAIProfile={handleViewAIProfile}
        />
      );
    }

    if (currentView === 'mentor-dashboard') {
      if (!currentUser || currentUser.role !== 'mentor') {
        return (
          <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Mentor Authentication Required</h2>
            <p className="text-xs text-slate-400">
              You must be logged in as a technical mentor to author learning modules and grade assignments.
            </p>
            <button
              onClick={() => handleOpenAuth('mentor')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Sign In as Mentor
            </button>
          </div>
        );
      }
      return (
        <MentorDashboard
          currentUser={currentUser}
          programmes={programmes}
          resources={resources}
          submissions={submissions}
          users={users}
          onResourcesUpdated={reloadData}
          onSubmissionsUpdated={reloadData}
          onUsersUpdated={reloadData}
          onViewAIProfile={handleViewAIProfile}
        />
      );
    }

    if (currentView === 'mentee-dashboard') {
      if (!currentUser || currentUser.role !== 'mentee') {
        return (
          <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Mentee Authentication Required</h2>
            <p className="text-xs text-slate-400">
              Please sign in with your IGDTUW enrollment number and password.
            </p>
            <button
              onClick={() => handleOpenAuth('mentee')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer"
            >
              Sign In with Enrollment No
            </button>
          </div>
        );
      }
      return (
        <MenteeDashboard
          currentUser={currentUser}
          programmes={programmes}
          resources={resources}
          submissions={submissions}
          leaderboard={leaderboard}
          onResourcesUpdated={reloadData}
          onSubmissionsUpdated={reloadData}
          onViewAIProfile={handleViewAIProfile}
          onNavigateToLeaderboard={() => setCurrentView('leaderboard')}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Quick Demo Switcher Bar */}
      <RoleDemoBar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* View Content */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
        onSuccess={handleUserChange}
      />
    </div>
  );
}
