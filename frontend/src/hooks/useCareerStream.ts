"use client";

import { useCallback, useRef } from "react";
import { useStore } from "@/store";
import { streamCareerEval } from "@/lib/api";
import { fireConfetti } from "@/lib/utils";
import type { CareerFormData } from "@/types";

export function useCareerStream() {
  const abortRef = useRef<(() => void) | null>(null);
  const {
    setCareerResult, resetCareer, addXP,
    unlockAchievement, incrementAnalyses, setActiveView,
  } = useStore();

  const run = useCallback(async (data: CareerFormData) => {
    abortRef.current?.();
    resetCareer();
    setCareerResult({ isStreaming: true });
    setActiveView("dashboard");

    let narrative = "";

    abortRef.current = await streamCareerEval(data, {
      onText: (chunk) => {
        narrative += chunk;
        setCareerResult({ narrative });
      },
      onEvent: (name, payload) => {
        switch (name) {
          case "scores":
            setCareerResult({ scores: payload as never });
            addXP(20);
            if ((payload as { overall: number }).overall >= 80) {
              unlockAchievement("score_80");
              fireConfetti();
            }
            break;
          case "jobs":
            setCareerResult({ jobs: payload as never });
            break;
          case "radar":
            setCareerResult({ radar: payload as never });
            break;
          case "roadmap":
            setCareerResult({ roadmap: payload as never });
            break;
          case "skillgaps":
            setCareerResult({ skillGaps: payload as never });
            break;
          default:
            break;
        }
      },
      onDone: () => {
        setCareerResult({ isStreaming: false });
        addXP(50);
        unlockAchievement("first_analysis");
        unlockAchievement("career_complete");
        incrementAnalyses();
      },
      onError: (msg) => {
        setCareerResult({ isStreaming: false, error: msg });
      },
    });
  }, [setCareerResult, resetCareer, addXP, unlockAchievement, incrementAnalyses, setActiveView]);

  const abort = useCallback(() => {
    abortRef.current?.();
    setCareerResult({ isStreaming: false });
  }, [setCareerResult]);

  return { run, abort };
}
