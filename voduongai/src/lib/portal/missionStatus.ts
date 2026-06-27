"use client";

import { useCallback, useEffect, useState } from "react";
import type { MissionStatus } from "@/data/portal/gem-home";

const STORAGE_KEY = "vdai_portal_today_missions";

type StatusMap = Record<string, MissionStatus>;

function readStatusMap(): StatusMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StatusMap) : {};
  } catch {
    return {};
  }
}

export function useMissionStatus(missionIds: string[]) {
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydration-safe: render starts empty (matches SSR), then this mount
    // effect syncs the real value from localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatusMap(readStatusMap());
    setReady(true);
  }, []);

  const cycleStatus = useCallback((id: string) => {
    setStatusMap((prev) => {
      const current = prev[id] ?? "todo";
      const next: MissionStatus = current === "todo" ? "in-progress" : current === "in-progress" ? "done" : "todo";
      const updated = { ...prev, [id]: next };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getStatus = useCallback((id: string): MissionStatus => statusMap[id] ?? "todo", [statusMap]);

  const doneCount = missionIds.filter((id) => statusMap[id] === "done").length;

  return { ready, getStatus, cycleStatus, doneCount };
}
