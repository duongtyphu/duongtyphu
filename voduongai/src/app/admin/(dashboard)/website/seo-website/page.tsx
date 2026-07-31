import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as termsMetadata } from "@/app/terms/page";
import { metadata as disclaimerMetadata } from "@/app/disclaimer/page";
import { metadata as refundPolicyMetadata } from "@/app/refund-policy/page";

export const metadata = { title: "SEO Website · Admin" };

const STATIC_PAGES: Array<{ href: string; metadata: { title?: unknown; description?: unknown } }> = [
  { href: "/about", metadata: aboutMetadata },
  { href: "/contact", metadata: contactMetadata },
  { href: "/privacy", metadata: privacyMetadata },
  { href: "/terms", metadata: termsMetadata },
  { href: "/disclaimer", metadata: disclaimerMetadata },
  { href: "/refund-policy", metadata: refundPolicyMetadata },
];

function asText(v: unknown): string {
  if (typeof v === "string") return v;
  return v ? JSON.stringify(v) : "—";
}

/**
 * ADM-V2-02 — "SEO Website". CHỈ ĐỌC theo đúng nguyên tắc bắt buộc: Sitemap/
 * Robots/structured data là SEO kỹ thuật, KHÔNG được sửa tự do qua UI generic
 * (rủi ro cấu hình sai làm mất index toàn site) — vẫn giữ trong code
 * (`src/app/sitemap.ts`, `robots.ts`, metadata từng trang). Trang này gọi
 * TRỰC TIẾP đúng các hàm/export đó (không copy lại nội dung) để hiển thị
 * đúng cấu hình ĐANG CHẠY THẬT — sửa `sitemap.ts`/`robots.ts`/metadata
 * trong code sẽ tự động phản ánh ở đây, không lệch tay.
 */
export default async function SeoWebsitePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const sitemapEntries = sitemap();
  const robotsConfig = robots();
  const rule = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;

  return (
    <div className="max-w-4xl space-y-6">
      <AdminBreadcrumb trail={[{ label: "Website", href: "/admin/landing" }, { label: "SEO Website" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">SEO Website</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xem cấu hình SEO kỹ thuật ĐANG CHẠY THẬT, đọc trực tiếp từ code (không phải bản sao). CHỈ ĐỌC —
          Sitemap/Robots/structured data không được sửa qua UI, chỉ sửa an toàn trong code.
        </p>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Sitemap.xml ({sitemapEntries.length} URL)
        </h2>
        <div className="mt-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Cập nhật lần cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sitemapEntries.map((entry) => (
                <tr key={entry.url}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{entry.url}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {entry.lastModified ? new Date(entry.lastModified).toLocaleString("vi-VN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Robots.txt</h2>
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-gray-400">User-agent</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{rule?.userAgent ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-400">Allow</dt>
              <dd className="mt-0.5 text-sm text-gray-900">
                {Array.isArray(rule?.allow) ? rule.allow.join(", ") : (rule?.allow ?? "—")}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-gray-400">Disallow</dt>
              <dd className="mt-0.5 text-sm text-gray-900">
                {Array.isArray(rule?.disallow) ? rule.disallow.join(", ") : (rule?.disallow ?? "—")}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-gray-400">Sitemap</dt>
              <dd className="mt-0.5 font-mono text-xs text-gray-900">{String(robotsConfig.sitemap ?? "—")}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Meta title/description — trang tĩnh
        </h2>
        <div className="mt-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Trang</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STATIC_PAGES.map((p) => (
                <tr key={p.href}>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">{p.href}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{asText(p.metadata.title)}</td>
                  <td className="px-4 py-3 text-gray-600">{asText(p.metadata.description)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
