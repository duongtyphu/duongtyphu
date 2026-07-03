"use client";

import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { useSeedReflection } from "../utils/use-seed-reflection";

/**
 * Khu vực Reflection sau mỗi Seed — người học ghi lại điều học được.
 * Dữ liệu lưu client-side, kiến trúc sẵn sàng cho Nhật ký học tập sau này.
 */
export function ReflectionBox({ seedId, question }: { seedId: string; question: string }) {
  const { answer, save } = useSeedReflection(seedId, question);
  const [draft, setDraft] = useState(answer);
  const [savedFlash, setSavedFlash] = useState(false);

  function handleSave() {
    save(draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
        <NotebookPen className="h-3.5 w-3.5" />
        Reflection
      </p>
      <p className="text-sm font-semibold text-gray-800">{question}</p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        placeholder="Ghi lại điều bạn vừa học được..."
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-300"
      />
      <button
        type="button"
        onClick={handleSave}
        className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {savedFlash ? "Đã lưu ✓" : "Lưu Reflection"}
      </button>
    </div>
  );
}
