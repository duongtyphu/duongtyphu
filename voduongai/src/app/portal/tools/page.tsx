import Link from "next/link";
import { tools } from "@/data/tools";
import { logoUrl } from "@/lib/logo";
import { AdminToolsSection } from "@/components/portal/AdminToolsSection";

export const metadata = { title: "Thư viện công cụ" };

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thư viện công cụ</h1>
        <p className="mt-2 text-white">
          Công cụ AI tôi đã thử nghiệm và sử dụng thực tế, theo từng nhóm.
        </p>
      </div>
      <AdminToolsSection />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.id}
            href={`/portal/tools/${t.id}`}
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 p-1.5">
                <img
                  src={logoUrl(t.id)}
                  alt={`${t.name} logo`}
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                {t.pricing}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">{t.name}</h3>
            <p className="mt-1 text-xs text-white">{t.category}</p>
            <p className="mt-2 text-sm text-white">{t.description}</p>
            <p className="mt-2 text-xs font-medium text-white">
              {t.useCase}
            </p>
            {t.iUseThis && (
              <span className="mt-3 inline-flex rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-violet">
                Tôi đang dùng
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
