import React from 'react';
import { Programme, User } from '../types';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  GraduationCap,
  Trophy,
  CheckCircle,
  Video,
  HelpCircle,
  FolderGit2,
  Users,
  Code2,
  Cpu,
  Layers,
  ChevronRight,
  Star,
  Quote,
} from 'lucide-react';

interface LandingPageProps {
  programmes: Programme[];
  currentUser: User | null;
  onExploreProgrammes: () => void;
  onOpenAuth: (role?: any) => void;
  onGoToDashboard: () => void;
  onViewAIProfile: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  programmes,
  currentUser,
  onExploreProgrammes,
  onOpenAuth,
  onGoToDashboard,
  onViewAIProfile,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Glow mesh backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>TechNeeds IGDTUW • Next-Gen Mentorship & LMS Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] sm:leading-[1.15]">
          Learn. Build. Grow.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Together.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The unified technical mentorship ecosystem connecting administrators, industry mentors,
          and student mentees at IGDTUW. Master distributed architectures, ship capstone projects,
          and forge an AI-certified engineering identity.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          {currentUser ? (
            <button
              onClick={onGoToDashboard}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('mentee')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Mentee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAuth('mentor')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Mentor Login</span>
              </button>
            </>
          )}

          <button
            onClick={onExploreProgrammes}
            className="px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Explore Programmes</span>
          </button>
        </div>

        {/* Illustrative Demo Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">4</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Active Cohorts</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">120+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">IGDTUW Mentees</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">98%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Capstone Delivery Rate</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">4.9/5</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Mentor Satisfaction</div>
          </div>
        </div>
      </section>

      {/* How It Works Section: Admin -> Mentor -> Mentee Journey */}
      <section className="py-16 sm:py-24 border-y border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Complete Mentorship Lifecycle
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
              The Admin → Mentor → Mentee Journey
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Designed specifically to streamline governance, curriculum delivery, and student outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1: Admin */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
                  Stage 1: Governance & Orchestration
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Administrators</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Establish cohorts, curate curriculum tracks, allocate experienced alumnae mentors,
                  issue verified student credentials, and monitor cohort health through real-time metrics.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Role: Programme Governance
              </div>
            </div>

            {/* Step 2: Mentor */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Stage 2: Guidance & Evaluation
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Technical Mentors</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Publish targeted video masterclasses, interactive conceptual quizzes, and production-grade
                  capstone projects. Review student pull requests and award transparent scores with rubric feedback.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Role: Curriculum & Evaluation
              </div>
            </div>

            {/* Step 3: Mentee */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  Stage 3: Mastery & Portfolios
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Student Mentees</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Watch modules, challenge interactive timed quizzes, deliver GitHub capstones, climb cohort
                  leaderboards, and unlock an AI-certified technical profile powered by Gemini.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Role: Continuous Growth & Coding
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Engineered For Excellence
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
            Everything Needed to Build World-Class Engineers
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A battle-tested environment built for the women tech leaders of tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI-Generated Technical Profiles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Google Gemini 3.8. Automatically parses student submissions, quiz accuracy, and code
              discipline into a sci-fi technical avatar, radar badges, and tailored next-step curricula.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Production Capstone Projects</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Move beyond toy exercises. Build resilient rate limiters, distributed pub/sub event meshes,
              and agentic RAG microservices with real GitHub evaluations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Gamified Cohort Leaderboards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, points-driven progression based on actual submission quality, quiz scores, and
              consecutive daily study streaks with celebratory milestone rewards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Curated Video Masterclasses</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn straight from industry veterans. In-depth walkthroughs of asynchronous internals,
              Kubernetes clusters, and Transformer attention mechanisms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Interactive Evaluative Quizzes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated grading with instant feedback, detailed technical explanations for wrong choices,
              and seamless score synchronization to mentee records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">IGDTUW Alumnae Network</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct connection with senior female engineers at Microsoft, Google, Amazon, and leading
              startups providing personalized code reviews and career mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Programmes Showcase */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Active Cohorts
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Explore TechNeeds Mentorship Tracks
              </h2>
            </div>
            <button
              onClick={onExploreProgrammes}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Programmes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.slice(0, 3).map((prog) => (
              <div
                key={prog.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                      {prog.code}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {prog.cohort}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{prog.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {prog.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prog.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    <strong className="text-white font-mono">{prog.modulesCount}</strong> learning modules
                  </span>
                  <button
                    onClick={() => {
                      if (currentUser) {
                        onGoToDashboard();
                      } else {
                        onOpenAuth('mentee');
                      }
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Enroll Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Community Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Loved by Students & Industry Leaders
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real feedback from IGDTUW mentors and enrolled mentees (Sample demo content)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <Quote className="w-6 h-6 text-indigo-500/30 mb-3" />
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "TechNeeds bridges the gap between college theory and enterprise-level microservices.
              The AI profile accurately highlighted my distributed systems strengths during summer internship interviews!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Ananya Verma"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/40"
              />
              <div>
                <div className="text-xs font-bold text-white">Ananya Verma</div>
                <div className="text-[10px] text-slate-400">3rd Year B.Tech CSE, IGDTUW</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <Quote className="w-6 h-6 text-amber-500/30 mb-3" />
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "As an alumna, giving back through TechNeeds is seamless. I can author complex system
              design quizzes, review student PRs on GitHub, and watch mentees level up week over week."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80"
                alt="Er. Priya Sharma"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-500/40"
              />
              <div>
                <div className="text-xs font-bold text-white">Er. Priya Sharma</div>
                <div className="text-[10px] text-slate-400">Senior Software Engineer @ Microsoft</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <Quote className="w-6 h-6 text-purple-500/30 mb-3" />
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "The administrator governance tools allow us to monitor cohort momentum and ensure zero
              students are left behind. The integration with Gemini for technical identity is revolutionary."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Dr. Radhika Sen"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-rose-500/40"
              />
              <div>
                <div className="text-xs font-bold text-white">Dr. Radhika Sen</div>
                <div className="text-[10px] text-slate-400">Head of Academic Affairs, IGDTUW</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-slate-950 text-sm">
                TN
              </div>
              <div>
                <div className="text-sm font-bold text-white">TechNeeds IGDTUW</div>
                <div className="text-[11px] text-slate-500">
                  Indira Gandhi Delhi Technical University for Women
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <button
                onClick={onExploreProgrammes}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Programmes
              </button>
              <button
                onClick={() => onOpenAuth('mentee')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Mentee Portal
              </button>
              <button
                onClick={() => onOpenAuth('mentor')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Mentor Workspace
              </button>
              <button
                onClick={() => onOpenAuth('admin')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Admin Governance
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Reimagathon Prototype • 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
