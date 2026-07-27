"use client";

import { useStore } from "@/store";
import { Card, CardContent } from "@/components/ui/Card";
import { StreamingText } from "@/components/ui/StreamingText";
import { SkeletonDashboard } from "@/components/ui/SkeletonCard";
import {
  AlertTriangle, Shield, TrendingUp, DollarSign,
  CheckCircle, Clock, Users, Lightbulb, BarChart3, Zap,
} from "lucide-react";
import { scoreColor, riskColor, threatBadge } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface GaugeProps { value: number; label: string; colorFn: (v: number) => string }
function Gauge({ value, label, colorFn }: GaugeProps) {
  const color = colorFn(value);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor"
            strokeWidth="7" className="text-gray-100 dark:text-zinc-800" />
          <circle cx="32" cy="32" r="26" fill="none" stroke={color}
            strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 163.4} 163.4`}
            style={{ transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-gray-900 dark:text-white leading-none">{value}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{label}</span>
    </div>
  );
}

export function StartupDashboard() {
  const { startupResult } = useStore();
  const { scores, competitors, milestones, funding, revenueModel, narrative, isStreaming, error } = startupResult;

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
        <div className="text-sm text-violet-600 dark:text-violet-400 flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
          Generating your startup viability report — this may take 30–45 seconds…
        </div>
        <SkeletonDashboard />
      </div>
    );
  }

  if (!scores && !narrative) return null;

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── Score gauges ── */}
      {scores && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            <Card className="text-center p-4"><Gauge value={scores.viability} label="Viability" colorFn={scoreColor} /></Card>
            <Card className="text-center p-4"><Gauge value={scores.market} label="Market" colorFn={scoreColor} /></Card>
            <Card className="text-center p-4"><Gauge value={scores.execution} label="Execution" colorFn={scoreColor} /></Card>
            <Card className="text-center p-4"><Gauge value={scores.funding} label="Fundability" colorFn={scoreColor} /></Card>
            <Card className="text-center p-4"><Gauge value={scores.risk} label="Risk" colorFn={riskColor} /></Card>
          </div>

          {/* Extended score row */}
          {(scores.pmfScore || scores.moatScore || scores.teamScore || scores.timingScore) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "PMF Potential",  value: scores.pmfScore,   color: "#6366f1" },
                { label: "Moat Strength",  value: scores.moatScore,  color: "#8b5cf6" },
                { label: "Team Readiness", value: scores.teamScore,  color: "#06b6d4" },
                { label: "Market Timing",  value: scores.timingScore, color: "#10b981" },
              ].filter(s => s.value !== undefined).map(({ label, value, color }) => (
                <Card key={label} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>{value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${value}%`, background: color }} />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Verdict banner */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Zap size={18} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">AI Mentor Verdict</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{scores.verdict}</p>
                </div>
              </div>
              <span className="text-sm font-semibold px-4 py-2 rounded-xl"
                style={{ background: `${scoreColor(scores.viability)}20`, color: scoreColor(scores.viability) }}>
                {scores.label}
              </span>
            </div>
          </Card>
        </>
      )}

      {/* ── Full AI Narrative ── */}
      {narrative && (
        <Card>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Full AI Mentor Analysis
              {isStreaming && <span className="text-xs text-violet-400 animate-pulse ml-1">• Streaming…</span>}
            </h3>
            <StreamingText content={narrative} isStreaming={isStreaming} />
          </CardContent>
        </Card>
      )}

      {/* ── Competitors + Funding ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Competitor table */}
        {competitors.length > 0 && (
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Shield size={15} className="text-violet-500" />
                Competitive Landscape
              </h3>
              <div className="space-y-3">
                {competitors.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                        {c.funding && <p className="text-[11px] text-gray-400 mt-0.5">Funding: {c.funding}</p>}
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", threatBadge(c.threat))}>
                        {c.threat} threat
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-[10px] text-gray-400 mb-0.5">Strength</p>
                        <p className="text-emerald-700 dark:text-emerald-400 font-medium">{c.strength}</p>
                      </div>
                      <div className="p-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                        <p className="text-[10px] text-gray-400 mb-0.5">Weakness</p>
                        <p className="text-rose-700 dark:text-rose-400 font-medium">{c.weakness}</p>
                      </div>
                    </div>
                    {c.opportunity && (
                      <div className="p-1.5 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-xs">
                        <p className="text-[10px] text-gray-400 mb-0.5">Your opportunity</p>
                        <p className="text-brand-600 dark:text-brand-400 font-medium">{c.opportunity}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Funding strategy */}
        {funding && (
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign size={15} className="text-violet-500" />
                Funding Strategy
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20">
                  <div>
                    <p className="text-xs text-gray-400">Stage</p>
                    <p className="text-sm font-bold text-violet-600 dark:text-violet-400">{funding.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Target raise</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{funding.target}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800 text-xs">
                    <p className="text-gray-400">Runway</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{funding.runway}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800 text-xs">
                    <p className="text-gray-400">Burn rate</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{funding.burnRate}</p>
                  </div>
                </div>
                {funding.keyMilestones && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium">Milestones before raising</p>
                    <div className="space-y-1.5">
                      {funding.keyMilestones.map((m) => (
                        <div key={m} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <CheckCircle size={12} className="text-violet-500 flex-shrink-0" />
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">Funding sources</p>
                  <div className="flex flex-wrap gap-1.5">
                    {funding.sources.map((s) => (
                      <span key={s} className="text-xs px-2 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {funding.vcFirms && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5 font-medium">Relevant VC firms</p>
                    <div className="flex flex-wrap gap-1.5">
                      {funding.vcFirms.map((f) => (
                        <span key={f} className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-lg">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Revenue Model ── */}
      {revenueModel && (
        <Card>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <BarChart3 size={15} className="text-violet-500" />
              Revenue Model — {revenueModel.model}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pricing tiers */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Recommended pricing</p>
                <div className="space-y-2">
                  {revenueModel.pricing.map((tier) => (
                    <div key={tier.tier} className="p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{tier.tier}</span>
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{tier.price}</span>
                      </div>
                      <ul className="space-y-1">
                        {tier.features.map((f) => (
                          <li key={f} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue projections */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Revenue projections</p>
                <div className="space-y-2">
                  {[
                    { label: "Month 6",  data: revenueModel.projections.month6,  color: "#6366f1" },
                    { label: "Month 12", data: revenueModel.projections.month12, color: "#8b5cf6" },
                    { label: "Month 24", data: revenueModel.projections.month24, color: "#10b981" },
                  ].map(({ label, data, color }) => (
                    <div key={label} className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold" style={{ color }}>{data.mrr} MRR</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{data.customers} customers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Milestones ── */}
      {milestones && (
        <Card>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-violet-500" />
              Launch Milestones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-amber-500" />
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">30-Day Sprint</span>
                </div>
                <div className="space-y-2">
                  {milestones.thirty.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 space-y-1">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.task}</p>
                      </div>
                      {t.metric && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 pl-5">
                          ✓ Success: {t.metric}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">90-Day Goals</span>
                </div>
                <div className="space-y-2">
                  {milestones.ninety.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 space-y-1">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.task}</p>
                      </div>
                      {t.metric && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 pl-5">
                          ✓ Success: {t.metric}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center print:hidden">
        <button onClick={() => window.print()} className="text-sm text-gray-400 hover:text-violet-500 transition-colors">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
