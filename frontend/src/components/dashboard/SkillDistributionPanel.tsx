"use client";

/**
 * SkillDistributionPanel
 * Replaces the radar chart with three clear panels:
 *  1. Stat tiles  — overview numbers
 *  2. Horizontal bar chart + priority gaps side by side
 *  3. Job coverage matrix (skill × role)
 */

import { useStore } from "@/store";
import { Card, CardContent } from "@/components/ui/Card";
import { Briefcase, Target, BarChart3, TrendingUp, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobMatch, RadarData, SkillGap } from "@/types";

// ── Colour helpers ────────────────────────────────────────────

function barColor(score: number) {
  if (score >= 65) return "#2a78d6";   // strong  – blue
  if (score >= 45) return "#eda100";   // fair    – amber
  if (score >= 30) return "#ec835a";   // weak    – coral
  return "#d03b3b";                    // gap     – red
}

function priorityStyle(priority: string): {
  wrapper: string;
  label: string;
  bar: string;
} {
  if (priority === "BLOCKER")
    return {
      wrapper: "bg-red-50 dark:bg-red-900/20",
      label:   "text-rose-700 dark:text-rose-400",
      bar:     "#d03b3b",
    };
  if (priority === "HIGH IMPACT")
    return {
      wrapper: "bg-amber-50 dark:bg-amber-900/20",
      label:   "text-amber-700 dark:text-amber-400",
      bar:     "#ec835a",
    };
  return {
    wrapper: "bg-blue-50 dark:bg-blue-900/20",
    label:   "text-blue-700 dark:text-blue-400",
    bar:     "#2a78d6",
  };
}

// ── Sub-components ────────────────────────────────────────────

function StatTile({
  label, value, sub, valueColor,
}: {
  label: string; value: string | number; sub: string; valueColor?: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-3 sm:p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-medium leading-none" style={valueColor ? { color: valueColor } : {}}>
        {value}
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">{sub}</p>
    </div>
  );
}

// Build skill rows from radar data + skill gaps
function buildSkillRows(radar: RadarData | null, skillGaps: SkillGap[]) {
  if (!radar) return [];
  return radar.labels.map((label, i) => {
    const score = radar.values[i];
    const gap   = skillGaps.find((g) =>
      g.skill.toLowerCase().includes(label.toLowerCase()) ||
      label.toLowerCase().includes(g.skill.toLowerCase().split(" ")[0])
    );
    return { label, score, gap };
  });
}

// Determine job match threshold coverage
type CoverageCell = "met" | "blocked" | "na";
function buildCoverageMatrix(
  jobs: JobMatch[],
  radar: RadarData | null
): { skills: string[]; jobs: JobMatch[]; matrix: CoverageCell[][] } {
  if (!radar || jobs.length === 0)
    return { skills: [], jobs: [], matrix: [] };

  const topJobs = jobs.slice(0, 3);
  const skills  = radar.labels;

  const matrix: CoverageCell[][] = skills.map((skill) =>
    topJobs.map((job) => {
      const isMissing = job.missing.some((m) =>
        m.toLowerCase().includes(skill.toLowerCase().split(" ")[0]) ||
        skill.toLowerCase().includes(m.toLowerCase().split(" ")[0])
      );
      const score = radar.values[skills.indexOf(skill)];
      if (isMissing || score < 45) {
        // only flag as blocked if the job actually needs it
        const jobNeedsIt = job.missing.some((m) =>
          m.toLowerCase().includes(skill.toLowerCase().split(" ")[0]) ||
          skill.toLowerCase().includes(m.toLowerCase().split(" ")[0])
        );
        return jobNeedsIt ? "blocked" : score >= 60 ? "met" : "na";
      }
      return score >= 60 ? "met" : "na";
    })
  );

  return { skills, jobs: topJobs, matrix };
}

// ── Main component ────────────────────────────────────────────

export function SkillDistributionPanel() {
  const { careerResult } = useStore();
  const { scores, radar, skillGaps, jobs } = careerResult;

  if (!radar && skillGaps.length === 0) return null;

  const skillRows    = buildSkillRows(radar, skillGaps);
  const { skills, jobs: topJobs, matrix } = buildCoverageMatrix(jobs, radar);

  // Salary unlock total
  const totalUnlock = skillGaps
    .reduce((sum, g) => {
      const n = parseInt(g.salaryImpact.replace(/[^0-9]/g, ""), 10);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

  const strongest = skillRows.length
    ? skillRows.reduce((a, b) => (a.score > b.score ? a : b))
    : null;
  const biggest   = skillRows.length
    ? skillRows.reduce((a, b) => (a.score < b.score ? a : b))
    : null;

  const JOB_COLORS = ["#2a78d6", "#1baf7a", "#eb6834"];

  return (
    <div className="space-y-4">
      {/* ── Stat tiles ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile
          label="Overall score"
          value={scores?.overall ?? "—"}
          sub={`${scores?.label ?? ""} · top ${100 - (scores?.percentile ?? 50)}%`}
          valueColor="#2a78d6"
        />
        <StatTile
          label="Strongest skill"
          value={strongest?.label ?? "—"}
          sub={`${strongest?.score ?? "—"} / 100`}
        />
        <StatTile
          label="Biggest gap"
          value={biggest?.label ?? "—"}
          sub={`${biggest?.score ?? "—"} / 100 — blocker`}
          valueColor="#d03b3b"
        />
        <StatTile
          label="Salary unlock"
          value={totalUnlock ? `+$${totalUnlock}k avg` : "—"}
          sub="if all gaps closed"
          valueColor="#1baf7a"
        />
      </div>

      {/* ── Bar chart + Priority gaps ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Horizontal bar chart */}
        {skillRows.length > 0 && (
          <Card>
            <CardContent>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                <BarChart3 size={13} className="text-brand-500" />
                Current proficiency
              </h3>

              <div className="space-y-3">
                {skillRows.map(({ label, score }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-[108px] flex-shrink-0 truncate">
                      {label}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, background: barColor(score) }}
                      />
                    </div>
                    <span
                      className="text-xs font-medium w-6 text-right flex-shrink-0"
                      style={{ color: barColor(score) }}
                    >
                      {score}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800">
                {[
                  { label: "Strong (65+)", color: "#2a78d6" },
                  { label: "Fair (45–64)", color: "#eda100" },
                  { label: "Weak (30–44)", color: "#ec835a" },
                  { label: "Gap (<30)",    color: "#d03b3b" },
                ].map(({ label, color }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    {label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Priority gaps with inline mini-bars */}
        {skillGaps.length > 0 && (
          <Card>
            <CardContent>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                <Target size={13} className="text-rose-500" />
                Priority gaps &amp; salary impact
              </h3>

              <div className="space-y-3">
                {skillGaps.map((gap, i) => {
                  const style = priorityStyle(gap.priority);
                  const score = skillRows.find((r) =>
                    r.label.toLowerCase().includes(gap.skill.toLowerCase().split(" ")[0])
                  )?.score ?? 0;

                  return (
                    <div key={i} className={cn("p-3 rounded-xl", style.wrapper)}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className={cn("text-[10px] font-semibold uppercase tracking-wide", style.label)}>
                            {gap.priority}
                          </span>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                            {gap.skill}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                          {gap.salaryImpact}
                        </span>
                      </div>
                      {/* Mini bar */}
                      <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${score}%`, background: style.bar }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {gap.jobsRequiring} of postings require this · {gap.timeToLearn} to learn
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Job coverage matrix ── */}
      {skills.length > 0 && topJobs.length > 0 && (
        <Card>
          <CardContent>
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
              <Briefcase size={13} className="text-brand-500" />
              Skill coverage vs. your top job matches
            </h3>

            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-xs border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800">
                    <th className="text-left py-2 pr-3 text-gray-500 dark:text-gray-400 font-medium w-28">
                      Skill
                    </th>
                    <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium w-14">
                      Score
                    </th>
                    {topJobs.map((job, ji) => (
                      <th
                        key={ji}
                        className="text-center py-2 px-3 font-medium whitespace-nowrap"
                        style={{ color: JOB_COLORS[ji] }}
                      >
                        {job.title.replace("Engineer", "Eng.")} · {job.match}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill, si) => {
                    const score = radar!.values[si];
                    return (
                      <tr key={si} className="border-b border-gray-50 dark:border-zinc-800/60 last:border-0">
                        <td className="py-2 pr-3 text-gray-700 dark:text-gray-300 truncate max-w-[112px]">
                          {skill}
                        </td>
                        <td
                          className="text-center py-2 px-3 font-medium"
                          style={{ color: barColor(score) }}
                        >
                          {score}
                        </td>
                        {matrix[si].map((cell, ji) => (
                          <td key={ji} className="text-center py-2 px-3">
                            {cell === "met" && (
                              <Check size={13} className="mx-auto text-emerald-500" aria-label="meets requirement" />
                            )}
                            {cell === "blocked" && (
                              <X size={13} className="mx-auto text-rose-500" aria-label="below threshold" />
                            )}
                            {cell === "na" && (
                              <span className="text-gray-300 dark:text-zinc-700 text-sm" aria-label="not required">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <Check size={11} className="text-emerald-500" aria-hidden="true" />
                Meets requirement
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <X size={11} className="text-rose-500" aria-hidden="true" />
                Below threshold
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="text-gray-300 dark:text-zinc-600 text-sm leading-none" aria-hidden="true">—</span>
                Not required for role
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
