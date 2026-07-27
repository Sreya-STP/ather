"use client";

import { useCallback, useRef } from "react";
import { useStore } from "@/store";
import { streamStartupEval } from "@/lib/api";
import { fireConfetti } from "@/lib/utils";
import type { StartupFormData } from "@/types";

export function useStartupStream() {
  const abortRef = useRef<(() => void) | null>(null);
  const {
    setStartupResult, resetStartup, addXP,
    unlockAchievement, incrementAnalyses, setActiveView,
  } = useStore();

  const run = useCallback(async (data: StartupFormData) => {
    abortRef.current?.();
    resetStartup();
    setStartupResult({ isStreaming: true });
    setActiveView("dashboard");

    let narrative = "";

    abortRef.current = await streamStartupEval(data, {
      onText: (chunk) => {
        narrative += chunk;
        setStartupResult({ narrative });
      },
      onEvent: (name, payload) => {
        switch (name) {
          case "bizscores":
            setStartupResult({ scores: payload as never });
            addXP(20);
            if ((payload as { viability: number }).viability >= 75) {
              fireConfetti();
            }
            break;
          case "competitors":
            setStartupResult({ competitors: payload as never });
            break;
          case "milestones":
            setStartupResult({ milestones: payload as never });
            break;
          case "funding":
            setStartupResult({ funding: payload as never });
            break;
          case "revenuemodel":
            setStartupResult({ revenueModel: payload as never });
            break;
          default:
            break;
        }
      },
      onDone: () => {
        setStartupResult({ isStreaming: false });
        addXP(50);
        unlockAchievement("first_analysis");
        unlockAchievement("startup_complete");
        incrementAnalyses();
      },
      onError: (msg) => {
        setStartupResult({ isStreaming: false, error: msg });
      },
    });
  }, [setStartupResult, resetStartup, addXP, unlockAchievement, incrementAnalyses, setActiveView]);

  const abort = useCallback(() => {
    abortRef.current?.();
    setStartupResult({ isStreaming: false });
  }, [setStartupResult]);

  return { run, abort };
}
