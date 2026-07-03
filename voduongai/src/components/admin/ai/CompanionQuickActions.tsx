"use client";

import { useState } from "react";
import { useAdminToast } from "@/lib/admin/toast";
import { runQuickAction } from "@/ai/services/companion-ai.client";
import type { CompanionAgentKind, CompanionQuickAction } from "@/ai/types/ai.types";

const ACTIONS: { action: CompanionQuickAction; label: string }[] = [
  { action: "rewrite", label: "🔄 Viết lại" },
  { action: "shorten", label: "✨ Làm ngắn hơn" },
  { action: "more_professional", label: "✨ Chuyên nghiệp hơn" },
  { action: "add_example", label: "✨ Thêm ví dụ" },
  { action: "add_checklist", label: "✨ Thêm Checklist" },
  { action: "add_prompt", label: "✨ Thêm Prompt" },
  { action: "add_reflection", label: "✨ Thêm Reflection" },
  { action: "generate_seo", label: "✨ Tạo SEO" },
  { action: "generate_slug", label: "✨ Tạo Slug" },
];

type Props = {
  kind: CompanionAgentKind;
  getContent: () => string;
  onApply: (result: { content: string; slug?: string; seoTitle?: string; seoDescription?: string }) => void;
};

/** Quick actions sau khi Companion đã sinh nội dung — dùng chung 1 service. */
export function CompanionQuickActions({ kind, getContent, onApply }: Props) {
  const { push } = useAdminToast();
  const [runningAction, setRunningAction] = useState<CompanionQuickAction | null>(null);

  async function handle(action: CompanionQuickAction) {
    const content = getContent();
    if (!content.trim()) {
      push("Chưa có nội dung để áp dụng thao tác này.", "error");
      return;
    }
    setRunningAction(action);
    const result = await runQuickAction(kind, action, content);
    setRunningAction(null);

    if (!result.ok) {
      push(result.error, "error");
      return;
    }
    if (result.mocked) {
      push("Companion Studio chưa được kết nối AI API — đang hiển thị bản nháp mẫu.", "info");
    }
    onApply(result.data);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map(({ action, label }) => (
        <button
          key={action}
          type="button"
          onClick={() => handle(action)}
          disabled={runningAction !== null}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-40"
        >
          {runningAction === action ? "Đang xử lý..." : label}
        </button>
      ))}
    </div>
  );
}
