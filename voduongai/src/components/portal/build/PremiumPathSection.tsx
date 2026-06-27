import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import type { BuildModule } from "@/data/portal/build-os";

/**
 * Answers: "Nếu tôi muốn đi nhanh hơn và sâu hơn, tôi nên tìm đến đâu?"
 */
export function PremiumPathSection({ modules }: { modules: BuildModule[] }) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-white">Premium Path</h2>
        <GemBadge tone="premium" />
      </div>
      <p className="mt-1 text-sm text-white/55">Dành cho người muốn rút ngắn thời gian thử-sai.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) =>
          m.href ? (
            <Link key={m.id} href={m.href} className="block">
              <GemCard className="h-full transition hover:-translate-y-1">
                <h3 className="text-sm font-bold text-white">{m.label}</h3>
                <p className="mt-1 text-xs text-white/55">{m.description}</p>
              </GemCard>
            </Link>
          ) : (
            <GemCard key={m.id} className="h-full">
              <h3 className="text-sm font-bold text-white">{m.label}</h3>
              <p className="mt-1 text-xs text-white/55">{m.description}</p>
            </GemCard>
          )
        )}
      </div>
    </section>
  );
}
