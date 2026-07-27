"use client";

import { useState } from "react";
import { Settings, User, Palette, Bell, Shield } from "lucide-react";
import { useStore } from "@/store";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function SettingsPanel() {
  const { userName, setUserName, darkMode, toggleDark, stats } = useStore();
  const [nameInput, setNameInput] = useState(userName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUserName(nameInput.trim() || "Explorer");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
          <Settings size={20} className="text-gray-600 dark:text-gray-300" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
            <User size={15} className="text-brand-500" />
            Profile
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Display Name</label>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button size="sm" onClick={handleSave}>
                {saved ? "Saved!" : "Save"}
              </Button>
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>Level: <strong className="text-brand-600 dark:text-brand-400">{stats.level}</strong></p>
            <p>Total XP: <strong className="text-brand-600 dark:text-brand-400">{stats.xp}</strong></p>
            <p>Analyses run: <strong className="text-brand-600 dark:text-brand-400">{stats.analysesRun}</strong></p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
            <Palette size={15} className="text-brand-500" />
            Appearance
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</p>
              <p className="text-xs text-gray-400">Toggle light/dark theme</p>
            </div>
            <button
              onClick={toggleDark}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? "bg-brand-600" : "bg-gray-300"}`}
              role="switch"
              aria-checked={darkMode}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800 mb-3">
            <Shield size={15} className="text-brand-500" />
            About
          </div>
          <div className="space-y-1 text-xs text-gray-400">
            <p>Aether v1.0.0 · AI Career Coach & Startup Mentor</p>
            <p>Powered by Claude claude-3-5-sonnet-20241022</p>
            <p>Built with Next.js 14, FastAPI, and Tailwind CSS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
