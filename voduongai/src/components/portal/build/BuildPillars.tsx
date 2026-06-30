import Link from "next/link";
import { Wallet, BadgeCheck, Settings, Layers, Building2, Gem } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { BuildPillar } from "@/data/portal/build-os";

const ICON_MAP = {
  wallet: Wallet,
  "badge-check": BadgeCheck,
  settings: Settings,
  layers: Layers,
  building: Building2,
  gem: Gem,
};

/**
 * Answers: "Có những trụ cột nào để tôi kiến tạo giá trị từ tri thức của mình?"
 */
export function BuildPillars({ pillars }: { pillars: BuildPillar[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">6 trụ cột kiến tạo</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => {
          const Icon = ICON_MAP[p.icon];
          return (
            <GemCard key={p.id} className="flex h-full flex-col gap-3 transition hover:-translate-y-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBBF24]/15 text-[#FBBF24]">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{p.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{p.description}</p>
              </div>
              <Link href={p.href} className="mt-auto text-xs font-semibold text-blue-600 hover:underline">
                Khám phá →
              </Link>
            </GemCard>
          );
        })}
      </div>
    </section>
  );
}
