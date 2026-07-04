import { Suspense } from "react";
import { WorkspaceMvp } from "@/components/portal/ai-space/WorkspaceMvp";

export const metadata = { title: "Workspace — VO DUONG AI" };

/**
 * EPIC 02 — Sprint 01: `/portal/workspace` MVP. Nhận context từ mọi hành
 * động "Thực hành cùng Companion" ở /portal/khong-gian-ai qua
 * `startCompanionWorkspace()`. Chưa gọi AI thật — chỉ hiển thị lại context
 * + kế hoạch bước đầu tĩnh, mục tiêu sprint là kiến trúc luồng.
 */
export default function WorkspacePage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceMvp />
    </Suspense>
  );
}
