import Link from "next/link";
import { prompts } from "@/data/prompts";

export const metadata = { title: "Prompt Library" };

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">Prompt Library</h1>
        <p className="mt-2 text-brand-gray-500">
          Prompt thực chiến theo từng danh mục — copy và dùng ngay.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {prompts.map((p) => (
          <Link
            key={p.id}
            href={`/portal/prompts/${p.id}`}
            className="rounded-2xl border border-brand-gray-200 bg-white p-5 transition hover:shadow-lg hover:shadow-brand-blue/10"
          >
            <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
              {p.category}
            </span>
            <h3 className="mt-3 text-sm font-bold text-brand-navy">{p.title}</h3>
            <p className="mt-2 text-sm text-brand-gray-500">{p.preview}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
