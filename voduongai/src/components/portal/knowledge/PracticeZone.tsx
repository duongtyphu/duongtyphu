import Link from "next/link";
import { Target } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { PracticeItem } from "@/data/portal/knowledge-hub";

/**
 * Answers: "Tôi có thể thực hành ngay điều gì để biến kiến thức thành năng lực thật?"
 */
export function PracticeZone({ items }: { items: PracticeItem[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Khu thực hành</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link key={p.id} href={p.href} className="block">
            <GemCard className="flex h-full items-start gap-3 transition hover:-translate-y-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBBF24]/15 text-[#FBBF24]">
                <Target className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">{p.title}</h3>
                <p className="mt-1 text-xs text-white/55">{p.description}</p>
              </div>
            </GemCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
