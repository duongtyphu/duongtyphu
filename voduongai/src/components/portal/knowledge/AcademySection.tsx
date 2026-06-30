import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { AcademyItem } from "@/data/portal/knowledge-hub";

/**
 * Answers: "Học viện nào phù hợp với mục tiêu của tôi ngay bây giờ?"
 */
export function AcademySection({ items }: { items: AcademyItem[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">Học viện</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <Link key={a.id} href={a.href} className="block">
            <GemCard className="flex h-full items-start gap-3 transition hover:-translate-y-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-[#A78BFA]">
                <GraduationCap className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{a.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{a.description}</p>
              </div>
            </GemCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
