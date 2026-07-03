import { Heart } from "lucide-react";

/** Feature 12 — Companion Note: lời nhắn cuối Seed, ngắn, ấm áp, không giảng đạo, không sáo rỗng. */
export function CompanionNoteBlock({ note }: { note: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
      <Heart className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
      <p className="text-sm italic leading-relaxed text-gray-700">{note}</p>
    </div>
  );
}
