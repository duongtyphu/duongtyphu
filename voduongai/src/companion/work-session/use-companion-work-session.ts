"use client";

/**
 * EPIC 02 — Sprint 04: hook điều khiển nhịp của một Companion Work
 * Session. Không có Work Session nếu `trigger` là null — Companion quay về
 * Silent/Observing presence bình thường (xem `CompanionPresence.tsx`).
 */

import { useEffect, useRef, useState } from "react";
import type { OrchestratorInput } from "@/companion/agents/companion-orchestrator";
import {
  advanceWorkSession,
  celebrateWorkSession,
  createWorkSession,
  isWorkSessionSettled,
} from "./work-session-engine";
import type { CompanionWorkSession } from "./work-session.types";

const TICK_MS = 1300;

export function useCompanionWorkSession(trigger: OrchestratorInput | null) {
  const [session, setSession] = useState<CompanionWorkSession | null>(null);
  const triggerKey = trigger ? `${trigger.currentModule}:${trigger.userGoal}:${trigger.currentContext}` : null;
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!trigger || triggerKey === lastKeyRef.current) return;
    lastKeyRef.current = triggerKey;
    setSession(createWorkSession(trigger));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  useEffect(() => {
    if (!session || isWorkSessionSettled(session)) return;
    const timer = setTimeout(() => {
      setSession((current) => {
        if (!current || isWorkSessionSettled(current)) return current;
        return advanceWorkSession(current);
      });
    }, TICK_MS);
    return () => clearTimeout(timer);
  }, [session]);

  function celebrate() {
    setSession((current) => (current ? celebrateWorkSession(current) : current));
  }

  function reset() {
    lastKeyRef.current = null;
    setSession(null);
  }

  return { session, celebrate, reset };
}
