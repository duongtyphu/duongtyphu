"use client";

import { useParams } from "next/navigation";
import { GoalDetail } from "@/components/portal/goals/GoalDetail";

/**
 * GOAL-001 — Goal Creation Runtime. `/portal/goals/[goalId]` — Goal
 * Information, Current Status, Progress, Timeline, Mission, Output,
 * Review, Portfolio.
 */
export default function GoalDetailPage() {
  const { goalId } = useParams<{ goalId: string }>();
  return <GoalDetail goalId={goalId} />;
}
