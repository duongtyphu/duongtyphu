import Link from "next/link";
import { prompts } from "@/data/prompts";

export const metadata = { title: "Thư viện Prompt" };

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thư viện Prompt</h1>
        <p className="mt-2 text-white/60">
          Prompt thực chiến theo từng danh mục — copy và dùng ngay.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {prompts.map((p) => (
          <Link
            key={p.id}
            href={`/portal/prompts/${p.id}`}
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
          >
            <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
              {p.category}
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm text-white/60">{p.preview}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
