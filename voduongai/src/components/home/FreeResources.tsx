import Link from "next/link";
import { freeResources } from "@/data/resources";

export function FreeResources() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
            Thư viện tài nguyên miễn phí
          </h2>
          <p className="mt-2 max-w-lg text-brand-gray-500">
            Ebook, prompt, checklist, template — tải miễn phí và dùng ngay.
          </p>
        </div>
        <Link
          href="/portal/resources"
          className="text-sm font-semibold text-brand-blue hover:underline"
        >
          Mở trong Portal →
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {freeResources.slice(0, 6).map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-brand-gray-200 bg-white p-5 transition hover:shadow-lg hover:shadow-brand-blue/10"
          >
            <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
              {r.type}
            </span>
            <h3 className="mt-3 text-base font-bold text-brand-navy">
              {r.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-gray-500">
              {r.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/portal/resources"
          className="inline-flex rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition hover:opacity-90"
        >
          Mở trong Portal
        </Link>
      </div>
    </section>
  );
}
