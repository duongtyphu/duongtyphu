import Link from "next/link";
import { freeResources } from "@/data/resources";

export const metadata = { title: "Template" };

export default function TemplatesPage() {
  const templates = freeResources.filter((r) => r.type === "Mẫu" || r.type === "Mẫu tham khảo");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Template</h1>
        <p className="mt-2 text-white">
          Mẫu dùng ngay cho content, landing page và vận hành — tải về và tuỳ biến theo nhu cầu.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {templates.map((r) => (
          <Link
            key={r.id}
            href={`/portal/resources/${r.id}`}
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
          >
            <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
              {r.type}
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{r.title}</h3>
            <p className="mt-2 text-sm text-white">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
