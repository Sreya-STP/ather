export interface CareerScores {
  overall: number;
  technical: number;
  communication: number;
  projects: number;
  interview: number;
  label: string;
  percentile?: number;
  marketDemand?: string;
  timeToOffer?: string;
}

export interface SkillGap {
  skill: string;
  priority: "BLOCKER" | "HIGH IMPACT" | "NICE TO HAVE";
  salaryImpact: string;
  jobsRequiring: string;
  timeToLearn: string;
  resources: string[];
}

export interface JobMatch {
  title: string;
  company: string;
  match: number;
  salary: string;
  growth: string;
  missing: string[];
}

export interface RadarData {
  labels: string[];
  values: number[];
}

export interface RoadmapWeek {
  week: number;
  title: string;
  tasks: string[];
}

export interface CareerResult {
  narrative: string;
  scores: CareerScores | null;
  jobs: JobMatch[];
  radar: RadarData | null;
  roadmap: RoadmapWeek[];
  skillGaps: SkillGap[];
  isStreaming: boolean;
  error: string | null;
}

// ── Startup Types ─────────────────────────────────────────────

export interface BizScores {
  viability: number;
  risk: number;
  funding: number;
  market: number;
  execution: number;
  label: string;
  verdict: string;
  pmfScore?: number;
  moatScore?: number;
  teamScore?: number;
  timingScore?: number;
}

export interface PricingTier {
  tier: string;
  price: string;
  features: string[];
}

export interface RevenueProjection {
  mrr: string;
  customers: number;
}

export interface RevenueModel {
  model: string;
  pricing: PricingTier[];
  projections: {
    month6: RevenueProjection;
    month12: RevenueProjection;
    month24: RevenueProjection;
  };
}

export interface Competitor {
  name: string;
  funding?: string;
  strength: string;
  weakness: string;
  threat: string;
  opportunity?: string;
}

export interface MilestoneTask {
  task: string;
  status: "todo" | "done" | "in-progress";
  metric?: string; // Added to fix mapping error in StartupDashboard.tsx
}

export interface Milestones {
  thirty: MilestoneTask[];
  ninety: MilestoneTask[];
}

export interface FundingInfo {
  stage: string;
  target: string;
  sources: string[];
  runway: string;
  burnRate: string;
  keyMilestones?: string[]; // Added to fix the primary compilation error
  vcFirms?: string[];       // Added to fix mapping error in StartupDashboard.tsx
}

export interface StartupResult {
  narrative: string;
  scores: BizScores | null;
  competitors: Competitor[];
  milestones: Milestones | null;
  funding: FundingInfo | null;
  revenueModel: RevenueModel | null;
  isStreaming: boolean;
  error: string | null;
}

// ── Chat Types ────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ── Form Types ────────────────────────────────────────────────

export interface CareerFormData {
  name: string;
  major: string;
  year: string;
  subjects: string;
  projects: string;
  certifications: string;
  skills: string;
  goal: string;
  experience: string;
  extra: string;
}

export interface StartupFormData {
  name: string;
  idea: string;
  audience: string;
  industry: string;
  budget: string;
  techSkills: string;
  teamSize: string;
  timeline: string;
  problem: string;
}

// ── Gamification Types ────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xp: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  readinessScore: number;
  analysesRun: number;
  achievements: Achievement[];
}

// ── UI Types ──────────────────────────────────────────────────

export type AppMode = "career" | "startup";
export type ActiveView = "dashboard" | "career" | "startup" | "interview" | "roadmap" | "analytics" | "achievements" | "settings" | "chat";