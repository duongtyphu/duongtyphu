"use client";

import { useEffect, useState } from "react";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { getRecentActivity } from "@/lib/portal/foundation/growth-view";

/**
 * Portal 4.0 Phase 3 — Companion Memory & Context.
 *
 * Không có bảng "memory" thật nào ở backend — component này chỉ đọc lại
 * GrowthEvent thật đã có trong localStorage (growth-view.ts, cùng nguồn
 * NHẤT với Nhật ký học tập/Hành trình/Khu vườn). Nếu chưa có hoạt động
 * nào, hiển thị đúng sự thật đó thay vì bịa một câu "nhớ" giả.
 */
export function CompanionMemoryLine({
  emptyMessage,
  contextTemplate,
  action,
}: {
  emptyMessage: string;
  contextTemplate: string;
  action?: { label: string; href: string };
}) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const [latest] = getRecentActivity(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only localStorage, no SSR equivalent
    setMessage(latest ? contextTemplate.replace("{activity}", latest.label.toLowerCase()) : emptyMessage);
  }, [emptyMessage, contextTemplate]);

  if (!message) return null;
  return <CompanionGuide message={message} action={action} />;
}
