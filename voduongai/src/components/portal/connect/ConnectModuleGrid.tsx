import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { ConnectModule } from "@/data/portal/connect-os";

/**
 * Answers: "Trong nhóm kết nối này, cụ thể tôi có thể bắt tay làm gì?"
 */
export function ConnectModuleGrid({ modules }: { modules: ConnectModule[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((m) =>
        m.href ? (
          <Link key={m.id} href={m.href} className="block">
            <GemCard className="h-full transition hover:-translate-y-1">
              <h3 className="text-sm font-bold text-gray-900">{m.label}</h3>
              <p className="mt-1 text-xs text-gray-500">{m.description}</p>
            </GemCard>
          </Link>
        ) : (
          <GemCard key={m.id} className="h-full">
            <h3 className="text-sm font-bold text-gray-900">{m.label}</h3>
            <p className="mt-1 text-xs text-gray-500">{m.description}</p>
          </GemCard>
        )
      )}
    </div>
  );
}
