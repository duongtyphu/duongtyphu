import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { BuildModule } from "@/data/portal/build-os";

/**
 * Answers: "Có những dự án/cơ hội nào tôi nên tìm hiểu thêm, không phải để cam kết lợi nhuận mà để mở rộng hiểu biết?"
 */
export function ProjectOpportunitySection({ modules }: { modules: BuildModule[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">Project &amp; Opportunity</h2>
      <p className="mt-1 text-sm text-white/55">
        Thông tin chia sẻ và phân tích cơ hội để bạn tự tìm hiểu — không phải lời cam kết lợi nhuận hay khuyến nghị đầu tư.
      </p>
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
