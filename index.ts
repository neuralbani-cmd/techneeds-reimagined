export type UserRole = 'admin' | 'mentor' | 'mentee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentNumber?: string; // Essential for mentees at IGDTUW
  password?: string;
  avatar: string;
  department: string;
  year: string;
  programmes: string[]; // Programme IDs
  skills: string[];
  interestTags: string[];
  bio?: string;
  points?: number; // Total gamified points
  streak?: number; // Consecutive active days
  phone?: string;
}

export type ProgrammeStatus = 'active' | 'upcoming' | 'completed';

export interface Programme {
  id: string;
  title: string;
  code: string;
  description: string;
  cohort: string;
  status: ProgrammeStatus;
  mentorIds: string[];
  menteeIds: string[];
  tags: string[];
  startDate: string;
  endDate: string;
  modulesCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export type ResourceType = 'video' | 'quiz' | 'project';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LearningResource {
  id: string;
  programmeId: string;
  creatorMentorId: string;
  type: ResourceType;
  title: string;
  description: string;
  topic: string;
  deadline?: string;
  maxMarks: number;
  createdAt: string;
  // Specific to Video
  videoUrl?: string;
  durationMinutes?: number;
  // Specific to Quiz
  questions?: QuizQuestion[];
  // Specific to Project
  problemStatement?: string;
  submissionGuidelines?: string;
  starterRepo?: string;
}

export type SubmissionStatus = 'submitted' | 'graded';

export interface Submission {
  id: string;
  resourceId: string;
  menteeId: string;
  programmeId: string;
  type: ResourceType;
  status: SubmissionStatus;
  submittedAt: string;
  projectLink?: string;
  projectNotes?: string;
  quizAnswers?: number[];
  score?: number;
  maxScore: number;
  mentorFeedback?: string;
  gradedAt?: string;
  gradedBy?: string; // Mentor ID
}

export interface SkillBadge {
  name: string;
  category: string;
  tier: 'Gold' | 'Silver' | 'Platinum' | 'Bronze';
  reason: string;
}

export interface PersonalizedRecommendation {
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Specialist';
  reason: string;
  suggestedResource: string;
}

export interface AIProfile {
  avatarTitle: string;
  avatarStyle: {
    primaryColor: string;
    secondaryColor: string;
    theme: 'neural' | 'cyber' | 'quantum' | 'matrix' | 'cosmos';
  };
  technicalIdentity: string;
  performanceSummary: string;
  skillBadges: SkillBadge[];
  personalizedRecommendations: PersonalizedRecommendation[];
  learningStreakAnalysis: string;
  lastGeneratedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  totalPoints: number;
  completedQuizzes: number;
  completedProjects: number;
  streak: number;
  programmeName: string;
}
