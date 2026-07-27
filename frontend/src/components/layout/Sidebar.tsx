"use client";

import {
  LayoutDashboard, GraduationCap, Rocket, MessageSquare,
  Map, BarChart3, Trophy, Settings, Zap, X, ChevronRight,
} from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import type { ActiveView } from "@/types";

const NAV_ITEMS: { icon: React.ElementType; label: string; view: ActiveView; badge?: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard",       view: "dashboard" },
  { icon: GraduationCap,  label: "Career Mode",      view: "career" },
  { icon: Rocket,          label: "Startup Mode",     view: "startup" },
  { icon: MessageSquare,   label: "AI Chat",          view: "chat",    badge: "AI" },
  { icon: Map,             label: "Roadmap",          view: "roadmap" },
  { icon: BarChart3,       label: "Analytics",        view: "analytics" },
  { icon: Trophy,          label: "Achievements",     view: "achievements" },
  { icon: Settings,        label: "Settings",         view: "settings" },
];

export function Sidebar() {
  const { activeView, setActiveView, sidebarOpen, toggleSidebar } = useStore();

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-60 z-40 flex flex-col",
          "bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-zinc-800",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand-glow">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Aether</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" aria-label="Main navigation">
          {NAV_ITEMS.map(({ icon: Icon, label, view, badge }) => {
            const active = activeView === view;
            return (
              <button
                key={view}
                onClick={() => handleNav(view)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <Icon size={17} className={cn(active ? "text-brand-500" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span className="text-[10px] font-bold bg-brand-500 text-white px-1.5 py-0.5 rounded-md">
                    {badge}
                  </span>
                )}
                {active && <ChevronRight size={14} className="text-brand-400" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <p className="text-[10px] text-gray-400 text-center">Aether v1.0 · Powered by Claude AI</p>
        </div>
      </aside>
    </>
  );
}
