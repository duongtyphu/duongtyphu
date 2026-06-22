import Link from "next/link";

const modules = [
  "Dashboard",
  "AI Academy",
  "VDAI Academy",
  "Affiliate Hub",
  "Tool Library",
  "Prompt Library",
  "Free Resources",
  "Premium Resources",
];

export function PortalPreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
          Một Portal, toàn bộ hệ sinh thái
        </h2>
        <p className="mt-3 text-brand-gray-500">
          Không phải LMS. Đây là không gian học tập, công cụ và cộng đồng kiểu
          Netflix + Notion + Creator Hub.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-brand-gray-200 bg-white p-3 shadow-2xl shadow-brand-navy/10 md:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {modules.map((m) => (
            <div
              key={m}
              className="rounded-xl border border-brand-gray-100 bg-brand-gray-50 p-4"
            >
              <div className="h-7 w-7 rounded-lg gradient-surface" />
              <p className="mt-3 text-sm font-semibold text-brand-navy">{m}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/portal"
          className="inline-flex rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition hover:opacity-90"
        >
          Truy cập Portal
        </Link>
      </div>
    </section>
  );
}
