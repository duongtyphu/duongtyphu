import Link from "next/link";
import { Users, UserCheck, CalendarDays, Award, Handshake, Share2 } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { ConnectPillar } from "@/data/portal/connect-os";

const ICON_MAP = {
  users: Users,
  "user-check": UserCheck,
  calendar: CalendarDays,
  award: Award,
  handshake: Handshake,
  share: Share2,
};

/**
 * Answers: "Có những trụ cột nào để tôi kết nối với người, tri thức, cơ hội và hệ sinh thái?"
 */
export function ConnectPillars({ pillars }: { pillars: ConnectPillar[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">6 trụ cột kết nối</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => {
          const Icon = ICON_MAP[p.icon];
          return (
            <GemCard key={p.id} className="flex h-full flex-col gap-3 transition hover:-translate-y-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]/15 text-[#22D3EE]">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">{p.title}</h3>
                <p className="mt-1 text-xs text-white/55">{p.description}</p>
              </div>
              <Link href={p.href} className="mt-auto text-xs font-semibold text-[#22D3EE] hover:underline">
                Khám phá →
              </Link>
            </GemCard>
          );
        })}
      </div>
    </section>
  );
}
