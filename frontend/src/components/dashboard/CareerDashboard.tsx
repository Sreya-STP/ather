"use client";

import { useStore } from "@/store";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card, CardContent } from "@/components/ui/Card";
import { StreamingText } from "@/components/ui/StreamingText";
import { SkeletonDashboard } from "@/components/ui/SkeletonCard";
import { SkillDistributionPanel } from "@/components/dashboard/SkillDistributionPanel";
import {
  Briefcase, TrendingUp, AlertTriangle, ChevronRight,
  CheckCircle2, Clock, Award, Target,
} from "lucide-react";
import { scoreLabel, scoreColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<string, { pill: string; dot: string }> = {
  "BLOCKER":      { pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",     dot: "bg-rose-500" },
  "HIGH IMPACT":  { pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  "HIGH":         { pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  "MODERATE":     { pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",     dot: "bg-blue-500" },
  "NICE TO HAVE": { pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",     dot: "bg-blue-500" },
};

export function CareerDashboard() {
  const { careerResult } = useStore();
  const { scores, jobs, radar, roadmap, skillGaps, narrative, isStreaming, error } = careerResult;

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3 text-rose-600 dark:text-rose-400">
          <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Analysis Error</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isStreaming && !scores && !narrative) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-brand-600 dark:text-brand-400 flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
          Generating your personalised career intelligence report…
        </div>
        <SkeletonDashboard />
      </div>
    );
  }

  if (!scores && !narrative) return null;

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── Score Overview ── */}
      {scores && (
        <>
          {/* Stat strip */}
          <div className="flex flex-wrap gap-2">
            {scores.percentile && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-full">
                <Award size={12} /> Top {100 - scores.percentile}% of candidates in your field
              </span>
            )}
            {scores.marketDemand && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full">
                <TrendingUp size={12} /> Market demand: {scores.marketDemand}
              </span>
            )}
            {scores.timeToOffer && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full">
                <Clock size={12} /> Est. time to first offer: {scores.timeToOffer}
              </span>
            )}
          </div>

          {/* 5 score rings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { key: "overall",       label: "Overall Readiness", value: scores.overall },
              { key: "technical",     label: "Core Skills",       value: scores.technical },
              { key: "communication", label: "Communication",     value: scores.communication },
              { key: "projects",      label: "Portfolio/Work",    value: scores.projects },
              { key: "interview",     label: "Interview Ready",   value: scores.interview },
            ].map(({ key, label, value }) => (
              <Card key={key} className={cn(
                "text-center p-4",
                key === "overall" && "col-span-2 sm:col-span-1 border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-900/10"
              )}>
                <ProgressRing score={value} size={key === "overall" ? 88 : 72} label={label} />
                {key === "overall" && (
                  <div className="mt-2 text-xs font-semibold" style={{ color: scoreColor(value) }}>
                    {scores.label}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Full AI Narrative ── */}
      {narrative && (
        <Card>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Full Career Intelligence Report
              {isStreaming && (
                <span className="text-xs text-brand-400 animate-pulse ml-1">• Generating…</span>
              )}
            </h3>
            <StreamingText content={narrative} isStreaming={isStreaming} />
          </CardContent>
        </Card>
      )}

      {/* ── Skill Distribution Panel (replaces radar chart) ── */}
      {(radar || skillGaps.length > 0) && <SkillDistributionPanel />}


      {/* ── 12-Week Roadmap ── */}
      {roadmap.length > 0 && (
        <Card>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-brand-500" />
              12-Week Personalised Development Roadmap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roadmap.slice(0, 12).map((week, i) => (
                <div key={i} className="p-3 rounded-xl border border-brand-100 dark:border-brand-900/40 bg-brand-50/50 dark:bg-brand-900/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">Week {week.week}</p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{week.title}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {week.tasks.map((task, j) => (
                      <li key={j} className="text-xs text-gray-500 dark:text-gray-400 flex gap-1.5">
                        <span className="text-brand-400 mt-0.5 flex-shrink-0">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center print:hidden">
        <button onClick={() => window.print()} className="text-sm text-gray-400 hover:text-brand-500 transition-colors">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
