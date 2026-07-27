import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppMode, ActiveView, CareerResult, StartupResult,
  ChatMessage, UserStats, Achievement,
} from "@/types";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "first_analysis", title: "First Steps", description: "Run your first AI analysis", icon: "🚀", unlocked: false, xp: 50 },
  { id: "career_complete", title: "Career Explorer", description: "Complete a full career evaluation", icon: "🎯", unlocked: false, xp: 100 },
  { id: "startup_complete", title: "Founder Mindset", description: "Complete a startup evaluation", icon: "💡", unlocked: false, xp: 100 },
  { id: "streak_3", title: "On Fire", description: "Maintain a 3-day streak", icon: "🔥", unlocked: false, xp: 75 },
  { id: "chat_10", title: "Deep Diver", description: "Send 10 chat messages", icon: "💬", unlocked: false, xp: 50 },
  { id: "score_80", title: "High Achiever", description: "Score 80+ on career readiness", icon: "⭐", unlocked: false, xp: 150 },
];

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 1,
  readinessScore: 0,
  analysesRun: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
};

const EMPTY_CAREER: CareerResult = {
  narrative: "", scores: null, jobs: [], radar: null, roadmap: [],
  skillGaps: [], isStreaming: false, error: null,
};

const EMPTY_STARTUP: StartupResult = {
  narrative: "", scores: null, competitors: [], milestones: null,
  funding: null, revenueModel: null, isStreaming: false, error: null,
};

interface AtheState {
  // UI
  mode: AppMode;
  activeView: ActiveView;
  darkMode: boolean;
  sidebarOpen: boolean;

  // Results
  careerResult: CareerResult;
  startupResult: StartupResult;

  // Chat
  chatMessages: ChatMessage[];
  chatStreaming: boolean;

  // User
  stats: UserStats;
  userName: string;

  // Actions
  setMode: (m: AppMode) => void;
  setActiveView: (v: ActiveView) => void;
  toggleDark: () => void;
  toggleSidebar: () => void;
  setCareerResult: (r: Partial<CareerResult>) => void;
  setStartupResult: (r: Partial<StartupResult>) => void;
  resetCareer: () => void;
  resetStartup: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateLastAssistant: (content: string) => void;
  setChatStreaming: (v: boolean) => void;
  clearChat: () => void;
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  setUserName: (name: string) => void;
  incrementAnalyses: () => void;
}

export const useStore = create<AtheState>()(
  persist(
    (set, get) => ({
      mode: "career",
      activeView: "dashboard",
      darkMode: true,
      sidebarOpen: true,

      careerResult: EMPTY_CAREER,
      startupResult: EMPTY_STARTUP,

      chatMessages: [],
      chatStreaming: false,

      stats: DEFAULT_STATS,
      userName: "Explorer",

      setMode: (mode) => set({ mode }),
      setActiveView: (activeView) => set({ activeView }),
      toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setCareerResult: (r) =>
        set((s) => ({ careerResult: { ...s.careerResult, ...r } })),
      setStartupResult: (r) =>
        set((s) => ({ startupResult: { ...s.startupResult, ...r } })),
      resetCareer: () => set({ careerResult: EMPTY_CAREER }),
      resetStartup: () => set({ startupResult: EMPTY_STARTUP }),

      addChatMessage: (msg) =>
        set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
      updateLastAssistant: (content) =>
        set((s) => {
          const msgs = [...s.chatMessages];
          const last = msgs[msgs.length - 1];
          if (last?.role === "assistant") msgs[msgs.length - 1] = { ...last, content };
          return { chatMessages: msgs };
        }),
      setChatStreaming: (chatStreaming) => set({ chatStreaming }),
      clearChat: () => set({ chatMessages: [] }),

      addXP: (amount) =>
        set((s) => {
          const newXP = s.stats.xp + amount;
          const newLevel = Math.floor(newXP / 200) + 1;
          return { stats: { ...s.stats, xp: newXP, level: newLevel } };
        }),

      unlockAchievement: (id) =>
        set((s) => {
          const achievements = s.stats.achievements.map((a) =>
            a.id === id && !a.unlocked ? { ...a, unlocked: true } : a
          );
          const gained = s.stats.achievements.find((a) => a.id === id);
          const xpGain = gained && !gained.unlocked ? gained.xp : 0;
          return {
            stats: {
              ...s.stats,
              achievements,
              xp: s.stats.xp + xpGain,
            },
          };
        }),

      setUserName: (userName) => set({ userName }),
      incrementAnalyses: () =>
        set((s) => ({ stats: { ...s.stats, analysesRun: s.stats.analysesRun + 1 } })),
    }),
    {
      name: "Aether-store",
      partialize: (s) => ({
        darkMode: s.darkMode,
        stats: s.stats,
        userName: s.userName,
        chatMessages: s.chatMessages,
      }),
    }
  )
);
