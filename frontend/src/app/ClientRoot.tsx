"use client";

import { useEffect } from "react";
import { useStore } from "@/store";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { CareerForm } from "@/components/career/CareerForm";
import { CareerDashboard } from "@/components/dashboard/CareerDashboard";
import { StartupForm } from "@/components/startup/StartupForm";
import { StartupDashboard } from "@/components/dashboard/StartupDashboard";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { AchievementsPanel } from "@/components/dashboard/AchievementsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { Card, CardContent } from "@/components/ui/Card";
import { Map, BarChart3, GraduationCap, Rocket } from "lucide-react";

function DashboardHome() {
  const { mode, careerResult, startupResult, setActiveView } = useStore();
  const hasCareer = careerResult.scores !== null || careerResult.narrative !== "";
  const hasStartup = startupResult.scores !== null || startupResult.narrative !== "";

  return (
    <div className="space-y-6">
      <HeroBanner />

      {/* Show results if available */}
      {mode === "career" && hasCareer && <CareerDashboard />}
      {mode === "startup" && hasStartup && <StartupDashboard />}

      {/* Quick action cards when no results yet */}
      {!hasCareer && !hasStartup && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            hover
            className="cursor-pointer group"
            onClick={() => setActiveView("career")}
          >
            <CardContent className="flex items-start gap-4 py-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors flex-shrink-0">
                <GraduationCap size={22} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Career Intelligence</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get your readiness score, skill gap analysis, job matches, and a 12-week roadmap.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card
            hover
            className="cursor-pointer group"
            onClick={() => setActiveView("startup")}
          >
            <CardContent className="flex items-start gap-4 py-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors flex-shrink-0">
                <Rocket size={22} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Startup Mentor</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Validate your idea with viability scores, competitor analysis, and funding strategy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function RoadmapView() {
  const { careerResult, startupResult, mode } = useStore();
  const roadmap = careerResult.roadmap;
  const milestones = startupResult.milestones;

  if (mode === "career" && roadmap.length > 0) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
            <Map size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your 12-Week Roadmap</h2>
        </div>
        {roadmap.map((week, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs text-brand-500 font-medium">Week {week.week}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{week.title}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {week.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-brand-400 mt-0.5">›</span>
                    {task}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (mode === "startup" && milestones) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
            <Map size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Launch Milestones</h2>
        </div>
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">📅 30-Day Goals</p>
            <ul className="space-y-2">
              {milestones.thirty.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-amber-400 mt-0.5">›</span>
                  {t.task}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">🚀 90-Day Goals</p>
            <ul className="space-y-2">
              {milestones.ninety.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-emerald-400 mt-0.5">›</span>
                  {t.task}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Map size={40} className="text-gray-300 dark:text-zinc-700 mb-4" />
      <h3 className="text-base font-semibold text-gray-500 dark:text-gray-400">No roadmap yet</h3>
      <p className="text-sm text-gray-400 mt-1">Run a Career or Startup analysis to generate your roadmap.</p>
    </div>
  );
}

function AnalyticsView() {
  const { careerResult, startupResult, stats } = useStore();
  const scores = careerResult.scores;
  const biz = startupResult.scores;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
          <BarChart3 size={20} className="text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Progress Analytics</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total XP",      value: stats.xp,           color: "text-brand-600 dark:text-brand-400" },
          { label: "Level",         value: stats.level,         color: "text-amber-600 dark:text-amber-400" },
          { label: "Day Streak",    value: stats.streak,        color: "text-rose-600 dark:text-rose-400" },
          { label: "Analyses Run",  value: stats.analysesRun,   color: "text-emerald-600 dark:text-emerald-400" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="text-center p-4">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </Card>
        ))}
      </div>
      {scores && (
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Career Scores</p>
            <div className="space-y-2">
              {[
                { label: "Overall",       val: scores.overall },
                { label: "Technical",     val: scores.technical },
                { label: "Communication", val: scores.communication },
                { label: "Projects",      val: scores.projects },
                { label: "Interview",     val: scores.interview },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-brand rounded-full transition-all duration-700"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">{val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {biz && (
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Startup Scores</p>
            <div className="space-y-2">
              {[
                { label: "Viability",  val: biz.viability },
                { label: "Market",     val: biz.market },
                { label: "Execution",  val: biz.execution },
                { label: "Funding",    val: biz.funding },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">{val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {!scores && !biz && (
        <Card>
          <CardContent className="text-center py-10 text-gray-400">
            <BarChart3 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Run an analysis to see your progress charts.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Main Client Root ──────────────────────────────────────────

export function ClientRoot() {
  const { darkMode, activeView } = useStore();

  // Sync dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":    return <DashboardHome />;
      case "career":       return <CareerForm />;
      case "startup":      return <StartupForm />;
      case "chat":         return <ChatPanel />;
      case "roadmap":      return <RoadmapView />;
      case "analytics":    return <AnalyticsView />;
      case "achievements": return <AchievementsPanel />;
      case "settings":     return <SettingsPanel />;
      case "interview":    return (
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-4xl mb-4">🎤</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Interview Coach</h2>
          <p className="text-gray-400 text-sm mb-4">
            Use the AI Chat to practice interview questions. Try: &quot;Give me 5 system design interview questions for a senior engineer role.&quot;
          </p>
        </div>
      );
      default:             return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6"
          role="main"
        >
          <div className="max-w-5xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
