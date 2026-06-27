import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { BuildModule } from "@/data/portal/build-os";

/**
 * Answers: "Trong nhóm trụ cột này, cụ thể tôi có thể bắt tay làm gì?"
 */
export function BuildModuleGrid({
  title,
  subtitle,
  modules,
}: {
  title?: string;
  subtitle?: string;
  modules: BuildModule[];
}) {
  return (
    <div>
      {title && <h3 className="text-base font-bold text-white">{title}</h3>}
      {subtitle && <p className="mt-1 text-sm text-white/55">{subtitle}</p>}
      <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${title || subtitle ? "mt-4" : ""}`}>
        {modules.map((m) =>
          m.href ? (
            <Link key={m.id} href={m.href} className="block">
              <GemCard className="h-full transition hover:-translate-y-1">
                <h4 className="text-sm font-bold text-white">{m.label}</h4>
                <p className="mt-1 text-xs text-white/55">{m.description}</p>
              </GemCard>
            </Link>
          ) : (
            <GemCard key={m.id} className="h-full">
              <h4 className="text-sm font-bold text-white">{m.label}</h4>
              <p className="mt-1 text-xs text-white/55">{m.description}</p>
            </GemCard>
          )
        )}
      </div>
    </div>
  );
}
