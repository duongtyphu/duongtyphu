import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { checkAllProvidersHealth } from "@/ai/providers/provider-health-check";

export const metadata = { title: "API & Tích hợp · Admin" };

const INTEGRATION_CHECKS: Array<{ label: string; envVar: string; configured: boolean }> = [
  {
    label: "SePay Webhook (xác nhận thanh toán)",
    envVar: "SEPAY_WEBHOOK_API_KEY",
    configured: Boolean(process.env.SEPAY_WEBHOOK_API_KEY),
  },
  {
    label: "Google Analytics",
    envVar: "NEXT_PUBLIC_GA_ID",
    configured: Boolean(process.env.NEXT_PUBLIC_GA_ID),
  },
];

/**
 * ADM-V2-05 — "API & Tích hợp" (Hệ thống). REAL — nhưng theo đúng nguyên
 * tắc bắt buộc: KHÔNG hiển thị giá trị secret/API key nào, chỉ boolean
 * đã cấu hình/chưa. Dùng lại ĐÚNG `checkAllProvidersHealth()` (AI Service
 * Registry, `src/ai/providers/provider-health-check.ts`) — mỗi Adapter tự
 * xác nhận ENV qua `isAvailable()`, KHÔNG gọi mạng thật, `reason` chỉ ghi
 * TÊN biến môi trường thiếu (vd "Thiếu ANTHROPIC_API_KEY."), không bao
 * giờ chứa giá trị. 12 Provider thật đăng ký trong `providerRegistry`
 * (OpenAI/Anthropic/Gemini/DeepSeek/Grok/Mistral/Ollama/Perplexity/
 * Cohere/Groq/Cerebras/OpenRouter) + Mock.
 *
 * FIX INF-02: đây là trang DUY NHẤT hiển thị chi tiết per-Provider (yêu
 * cầu đăng nhập Admin qua `requireAdmin()`) — `/api/ai/provider-health`
 * (endpoint public) đã được thu hẹp chỉ còn trả trạng thái tổng quát
 * "ready"/"degraded"/"unavailable", không còn liệt kê từng Provider nữa.
 */
export default async function ApiTichHopPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const providerHealth = await checkAllProvidersHealth();

  return (
    <div className="max-w-3xl space-y-6">
      <AdminBreadcrumb trail={[{ label: "Hệ thống", href: "/admin/he-thong/moi-truong" }, { label: "API & Tích hợp" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">API & Tích hợp</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trạng thái tích hợp dịch vụ bên ngoài. CHỈ hiển thị đã cấu hình/chưa (boolean) — KHÔNG bao giờ
          hiển thị giá trị API key/secret.
        </p>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">
          AI Service Registry ({providerHealth.filter((p) => p.available).length}/{providerHealth.length} sẵn sàng)
        </h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {providerHealth.map((p) => (
            <div key={p.providerId} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm font-semibold capitalize text-gray-900">{p.providerId}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  p.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {p.available ? "Đã cấu hình" : (p.reason ?? "Chưa cấu hình")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Dịch vụ khác</h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {INTEGRATION_CHECKS.map((c) => (
            <div key={c.envVar} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm font-semibold text-gray-900">{c.label}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  c.configured ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {c.configured ? "Đã cấu hình" : `Thiếu ${c.envVar}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
