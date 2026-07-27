"use client";

import { useStore } from "@/store";
import { Card, CardContent } from "@/components/ui/Card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function AchievementsPanel() {
  const { stats } = useStore();
  const unlocked = stats.achievements.filter((a) => a.unlocked).length;
  const total = stats.achievements.length;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
          <Trophy size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Achievements</h2>
          <p className="text-sm text-gray-400">{unlocked} of {total} unlocked · {stats.xp} total XP earned</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.achievements.map((a) => (
          <Card key={a.id} className={cn(!a.unlocked && "opacity-50 grayscale")}>
            <CardContent className="flex items-start gap-3 py-4">
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</p>
                  <span className="text-xs font-bold text-amber-500">+{a.xp} XP</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{a.description}</p>
                {a.unlocked && (
                  <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                    ✓ Unlocked
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
