"use client";

import { Moon, Sun, Menu, Flame, Zap, Bell } from "lucide-react";
import { useStore } from "@/store";
import { levelProgress, xpForNextLevel, formatXP } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Header() {
  const { darkMode, toggleDark, toggleSidebar, stats, userName } = useStore();
  const progress = levelProgress(stats.xp, stats.level);

  return (
    <header className="h-14 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md flex items-center px-4 gap-3 sticky top-0 z-40">
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-auto lg:hidden">
        <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
          <Zap size={14} className="text-white" fill="white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-sm">Aether</span>
      </div>

      {/* XP + Level — desktop */}
      <div className="hidden sm:flex items-center gap-3 mr-auto lg:mr-0">
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
          <Flame size={14} className="text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {stats.streak} day streak
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-brand-50 dark:bg-brand-900/20 px-2.5 py-1 rounded-lg">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Lv.{stats.level}
            </span>
          </div>
          <div className="hidden md:flex flex-col gap-0.5 w-24">
            <div className="flex justify-between">
              <span className="text-[10px] text-gray-400">XP</span>
              <span className="text-[10px] text-gray-400">
                {formatXP(stats.xp)} / {formatXP(xpForNextLevel(stats.level))}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-brand rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>

        <button
          onClick={toggleDark}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center cursor-pointer">
          <span className="text-white text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}
