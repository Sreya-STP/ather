"use client";

import { motion } from "framer-motion";
import { Zap, GraduationCap, Rocket, ArrowRight } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const { userName, stats, setActiveView, mode, setMode } = useStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-purple p-6 md:p-8 text-white mb-6">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white/5"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-200 text-sm font-medium mb-1"
          >
            {greeting}, {userName}! 👋
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold leading-tight mb-3"
          >
            Your AI-Powered Career<br className="hidden md:block" /> & Startup Mentor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-100 text-sm max-w-md"
          >
            Get personalized skill assessments, job match analysis, and startup viability scores powered by Claude AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-5"
          >
            <button
              onClick={() => { setMode("career"); setActiveView("career"); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                mode === "career"
                  ? "bg-white text-brand-600 shadow-lg"
                  : "bg-white/20 hover:bg-white/30 text-white"
              )}
            >
              <GraduationCap size={16} />
              Career Mode
              {mode === "career" && <ArrowRight size={14} />}
            </button>
            <button
              onClick={() => { setMode("startup"); setActiveView("startup"); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                mode === "startup"
                  ? "bg-white text-violet-600 shadow-lg"
                  : "bg-white/20 hover:bg-white/30 text-white"
              )}
            >
              <Rocket size={16} />
              Startup Mode
              {mode === "startup" && <ArrowRight size={14} />}
            </button>
          </motion.div>
        </div>

        {/* Floating stats cards */}
        <div className="flex flex-row md:flex-col gap-3 flex-shrink-0">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
          >
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-300" />
              <div>
                <p className="text-xs text-brand-200">Level {stats.level}</p>
                <p className="text-sm font-bold">{stats.xp} XP</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-xs text-brand-200">Streak</p>
                <p className="text-sm font-bold">{stats.streak} days</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
