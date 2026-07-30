import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { listExecutions } from "@/ai/providers/provider-execution-log";
import { ScrollText } from "lucide-react";

export const metadata = { title: "Nhật ký hệ thống · Admin" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "medium" });
}

/**
 * ADM-V2-05 — "Nhật ký hệ thống" (Hệ thống). ĐÍNH CHÍNH phạm vi: ý tưởng
 * gốc là log lỗi/sự kiện server chung — vẫn CHƯA có (chỉ xem qua Vercel
 * Dashboard, ngoài phạm vi ứng dụng). Nhưng audit phát hiện 1 log THẬT hẹp
 * hơn đã tồn tại: `provider-execution-log.ts` (AI Service Registry, Phase
 * 4 Epic 01) ghi lại mỗi lần gọi AI Provider (provider/capability/success/
 * latency/lỗi) — KHÔNG log nội dung prompt/raw (tránh lưu dữ liệu nhạy
 * cảm, đã ghi rõ trong chính file nguồn). Hiển thị đúng log này, KHÔNG bịa
 * log lỗi server chung không tồn tại.
 *
 * LƯU Ý TRUNG THỰC: log này lưu trong bộ nhớ tiến trình (process-local),
 * KHÔNG phải database — có thể rỗng/không đầy đủ giữa các lần deploy hoặc
 * trên môi trường serverless nhiều instance (đã ghi rõ trong comment gốc
 * của file). Không phải nhật ký hệ thống đầy đủ.
 */
export default async function NhatKyHeThongPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const entries = listExecutions().slice(-100).reverse();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Hệ thống", href: "/admin/he-thong/moi-truong" }, { label: "Nhật ký hệ thống" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Nhật ký hệ thống</h1>
        <p className="mt-1 text-sm text-gray-500">
          Nhật ký lời gọi AI Provider (AI Service Registry) — phạm vi hẹp hơn &quot;log lỗi server chung&quot; (chưa
          có, chỉ xem qua Vercel Dashboard). Lưu trong bộ nhớ tiến trình — có thể rỗng/không đầy đủ giữa
          các lần deploy hoặc trên serverless nhiều instance.
        </p>
      </div>

      {entries.length === 0 ? (
        <AdminEmptyState
          icon={ScrollText}
          title="Chưa có lời gọi AI Provider nào được ghi nhận trong phiên này"
          description="Log này chỉ tồn tại trong bộ nhớ tiến trình hiện tại — sẽ trống lại sau mỗi lần deploy/khởi động lại server."
        />
      ) : (
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {entries.map((e, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-mono text-xs font-semibold text-gray-900">{e.providerId}</span>
                <span className="text-xs text-gray-500">{e.capability} · {e.taskType}</span>
                {e.isMock && (
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-500">
                    Mock
                  </span>
                )}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    e.success ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {e.success ? "OK" : "Lỗi"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-gray-400">
                <span>{e.latencyMs}ms</span>
                <span>{formatDate(e.at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
