import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import type { HubModule } from "@/lib/portal/hubs";

export function HubModuleGrid({ modules }: { modules: HubModule[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((m) =>
        m.href ? (
          <Link key={m.label} href={m.href} className="block">
            <GemCard className="h-full">
              <h3 className="text-sm font-bold text-white">{m.label}</h3>
              <p className="mt-1 text-sm text-white/60">{m.description}</p>
            </GemCard>
          </Link>
        ) : (
          <GemCard key={m.label} variant="locked" className="h-full">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white">{m.label}</h3>
              <GemBadge tone="locked">Sắp ra mắt</GemBadge>
            </div>
            <p className="mt-1 text-sm text-white/60">{m.description}</p>
          </GemCard>
        )
      )}
    </div>
  );
}
