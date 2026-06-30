"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import { useMemoryCapsules, type MemoryCapsuleKind } from "@/lib/portal/memoryCapsules";

const KIND_OPTIONS: { value: MemoryCapsuleKind; label: string }[] = [
  { value: "milestone", label: "Cột mốc" },
  { value: "lesson", label: "Bài học" },
  { value: "decision", label: "Quyết định" },
  { value: "breakthrough", label: "Vượt qua khó khăn" },
  { value: "achievement", label: "Thành tựu" },
];

/**
 * Answers: "Tôi có thể tự cất giữ một khoảnh khắc đáng nhớ vào hành trình của mình không?"
 */
export function AddMemoryCapsuleForm() {
  const { addCapsule, signedIn, ready, tableReady } = useMemoryCapsules();
  const [kind, setKind] = useState<MemoryCapsuleKind>("milestone");
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(false);

  if (!ready || !signedIn) return null;

  if (!tableReady) {
    return (
      <GemCard>
        <div className="flex items-center gap-2">
          <Gem className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900">Lưu lại một khoảnh khắc đáng nhớ</h2>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Khu vực lưu ký ức đang được chuẩn bị. Bạn vẫn có thể xem hành trình của mình.
        </p>
      </GemCard>
    );
  }

  return (
    <GemCard>
      <div className="flex items-center gap-2">
        <Gem className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-bold text-gray-900">Lưu lại một khoảnh khắc đáng nhớ</h2>
      </div>
      <p className="mt-1 text-sm text-gray-500">Không cần lưu tất cả — chỉ điều bạn muốn nhớ mãi.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {KIND_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setKind(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              kind === opt.value ? "gemos-btn-primary text-white" : "gemos-btn-secondary text-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Điều gì đáng nhớ với bạn hôm nay?"
        className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
      />
      <Button
        variant="secondary"
        className="mt-3"
        disabled={!title.trim()}
        onClick={async () => {
          await addCapsule({ kind, title });
          setTitle("");
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
      >
        {saved ? "Đã cất giữ" : "Cất giữ vào My Story"}
      </Button>
      {saved && (
        <p className="mt-2 text-xs text-gray-500">Khoảnh khắc này đã được giữ lại cho hành trình của bạn.</p>
      )}
    </GemCard>
  );
}
