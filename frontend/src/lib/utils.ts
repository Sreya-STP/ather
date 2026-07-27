import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function xpForNextLevel(level: number) {
  return level * 200;
}

export function levelProgress(xp: number, level: number) {
  const base = (level - 1) * 200;
  const next = level * 200;
  return Math.round(((xp - base) / (next - base)) * 100);
}

export function formatXP(xp: number) {
  return xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : String(xp);
}

export function scoreLabel(score: number) {
  if (score >= 85) return { text: "Excellent", color: "text-emerald-500" };
  if (score >= 70) return { text: "Good", color: "text-brand-500" };
  if (score >= 50) return { text: "Fair", color: "text-amber-500" };
  return { text: "Needs Work", color: "text-rose-500" };
}

export function scoreColor(score: number) {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#6366f1";
  if (score >= 50) return "#f59e0b";
  return "#f43f5e";
}

export function riskColor(risk: number) {
  if (risk <= 30) return "#10b981";
  if (risk <= 55) return "#f59e0b";
  return "#f43f5e";
}

export function threatBadge(threat: string) {
  const t = threat.toLowerCase();
  if (t === "high") return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
  if (t === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
}

/** Parse raw SSE stream text into narrative + named events */
export function parseSSEChunk(raw: string): {
  text?: string;
  eventName?: string;
  eventData?: string;
} {
  const lines = raw.split("\n");
  let eventName: string | undefined;
  let dataLine: string | undefined;

  for (const line of lines) {
    if (line.startsWith("event: ")) {
      eventName = line.slice(7).trim();
    } else if (line.startsWith("data: ")) {
      dataLine = line.slice(6);
    }
  }

  if (eventName && dataLine) {
    return { eventName, eventData: dataLine };
  }
  if (dataLine) {
    return { text: dataLine };
  }
  return {};
}

export function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Fire canvas confetti — imported lazily to avoid SSR issues */
export async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"],
  });
}
