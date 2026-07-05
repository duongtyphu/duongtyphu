import { Suspense } from "react";
import { GoalRuntimeBoard } from "@/components/portal/goals/GoalRuntimeBoard";

export const metadata = { title: "Bảng Mục tiêu — VO DUONG AI" };

/**
 * GOAL 001 — Goal Runtime. `/portal/goals` hiển thị Goal → Epic → Mission
 * đọc từ `goal-runtime.ts`. Bấm vào Mission điều hướng vào `/portal/workspace`
 * đã có qua `startCompanionWorkspace()`.
 */
export default function GoalsPage() {
  return (
    <Suspense fallback={null}>
      <GoalRuntimeBoard />
    </Suspense>
  );
}
