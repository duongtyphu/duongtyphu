import Link from "next/link";
import { freeResources } from "@/data/resources";

export const metadata = { title: "Checklist" };

export default function ChecklistsPage() {
  const checklists = freeResources.filter((r) => r.type === "Danh sách kiểm tra");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Checklist</h1>
        <p className="mt-2 text-white">
          Danh sách kiểm tra ngắn gọn giúp bạn không bỏ sót bước quan trọng nào.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {checklists.map((r) => (
          <Link
            key={r.id}
            href={`/portal/resources/${r.id}`}
            className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
          >
            <span className="inline-flex rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
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
