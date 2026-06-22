import Link from "next/link";
import { freeResources } from "@/data/resources";

export const metadata = { title: "Free Resources" };

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">Free Resources</h1>
        <p className="mt-2 text-brand-gray-500">
          Ebook, prompt, checklist, template — tải miễn phí và dùng ngay.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {freeResources.map((r) => (
          <Link
            key={r.id}
            href={`/portal/resources/${r.id}`}
            className="rounded-2xl border border-brand-gray-200 bg-white p-5 transition hover:shadow-lg hover:shadow-brand-blue/10"
          >
            <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
              {r.type}
            </span>
            <h3 className="mt-3 text-sm font-bold text-brand-navy">{r.title}</h3>
            <p className="mt-2 text-sm text-brand-gray-500">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
