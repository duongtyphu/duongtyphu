import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { BuildModule } from "@/data/portal/build-os";

/**
 * Answers: "Tôi có thể bắt đầu kiếm thu nhập từ tri thức của mình bằng cách nào?"
 */
export function IncomeEngineSection({ modules }: { modules: BuildModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Income Engine</h2>
      <p className="mt-1 text-sm text-white/55">Các nguồn thu nhập bạn có thể bắt đầu xây dựng ngay hôm nay.</p>
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
