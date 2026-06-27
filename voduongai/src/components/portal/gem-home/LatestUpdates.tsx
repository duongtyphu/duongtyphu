import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { GemUpdate } from "@/data/portal/gem-home";

/**
 * Answers: "Người dùng có cảm nhận hệ sinh thái đang sống và phát triển cùng họ không?"
 */
export function LatestUpdates({ updates }: { updates: GemUpdate[] }) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-white">Tin mới</h2>
        <Link href="/portal/connect" className="text-sm font-semibold text-[#22D3EE] hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <GemCard className="mt-4">
        <ul className="space-y-3">
          {updates.map((u) => (
            <li key={u.id} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-white/75">{u.title}</span>
              <span className="shrink-0 text-xs font-semibold text-white/40">{u.date}</span>
            </li>
          ))}
        </ul>
      </GemCard>
    </section>
  );
}
