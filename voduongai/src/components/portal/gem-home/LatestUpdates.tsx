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
        <h2 className="text-lg font-bold text-gray-900">Tin mới</h2>
        <Link href="/portal/connect" className="text-sm font-semibold text-blue-600 hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <GemCard className="mt-4">
        <ul className="space-y-3">
          {updates.map((u) => (
            <li key={u.id} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-gray-600">{u.title}</span>
              <span className="shrink-0 text-xs font-semibold text-gray-400">{u.date}</span>
            </li>
          ))}
        </ul>
      </GemCard>
    </section>
  );
}
