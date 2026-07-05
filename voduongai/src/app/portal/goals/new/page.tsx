import { Suspense } from "react";
import { GoalCreateForm } from "@/components/portal/goals/GoalCreateForm";

export const metadata = { title: "Tạo Goal mới — VO DUONG AI" };

/**
 * P0 GOAL CREATION — `/portal/goals/new`. User tự tạo Goal của riêng họ
 * (không phải Goal mẫu) qua `createGoalDraft()`.
 */
export default function NewGoalPage() {
  return (
    <Suspense fallback={null}>
      <GoalCreateForm />
    </Suspense>
  );
}
