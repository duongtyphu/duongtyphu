"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useAdminToast } from "@/lib/admin/toast";
import { generateKnowledgeSeed, generateContent } from "@/ai/services/companion-ai.client";
import type { CompanionAgentKind, GeneratedGenericContent, GeneratedKnowledgeSeed } from "@/ai/types/ai.types";

type Props = {
  kind: CompanionAgentKind;
  getTitle: () => string;
  getBrief?: () => string | undefined;
  onGenerated: (data: GeneratedGenericContent | GeneratedKnowledgeSeed) => void;
};

/**
 * Nút chính của Companion Studio™. Founder chỉ cần nhập tiêu đề, bấm nút
 * này — Companion sinh nội dung, Founder review trong form trước khi Lưu.
 * Không publish tự động — kết quả chỉ điền vào form, chưa lưu.
 */
export function CompanionWriteButton({ kind, getTitle, getBrief, onGenerated }: Props) {
  const { push } = useAdminToast();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const title = getTitle().trim();
    if (!title) {
      push('Vui lòng nhập "Tiêu đề" trước khi bấm Companion viết giúp.', "error");
      return;
    }
    setLoading(true);
    const result =
      kind === "knowledge"
        ? await generateKnowledgeSeed(title, getBrief?.())
        : await generateContent(kind, title, getBrief?.());
    setLoading(false);

    if (!result.ok) {
      push(result.error, "error");
      return;
    }
    if (result.mocked) {
      push(
        "Companion Studio chưa được kết nối AI API. Vui lòng cấu hình API key để sử dụng tính năng Companion viết giúp. (Đang hiển thị bản nháp mẫu.)",
        "info"
      );
    } else {
      push("Companion đã viết xong bản nháp — hãy xem lại trước khi lưu.", "success");
    }
    onGenerated(result.data);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/20 px-3 py-2 text-sm font-bold text-violet-200 transition hover:bg-violet-500/30 disabled:opacity-50"
    >
      <Sparkles className="h-4 w-4" />
      {loading ? "Companion đang viết..." : "Companion viết giúp"}
    </button>
  );
}
