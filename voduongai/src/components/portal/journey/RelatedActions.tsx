import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RelatedAction } from "@/data/portal/journey-hub";

/**
 * Answers: "Tôi nên làm gì ngay bây giờ để tiếp tục hành trình?"
 */
export function RelatedActions({ actions }: { actions: RelatedAction[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">Hành động tiếp theo</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.id}
            href={a.href}
            className="gemos-gem-card flex items-center justify-between gap-2 rounded-2xl p-4 text-sm font-semibold"
          >
            <span className="gemos-card-title text-gray-900">{a.label}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-blue-600" />
          </Link>
        ))}
      </div>
    </section>
  );
}
