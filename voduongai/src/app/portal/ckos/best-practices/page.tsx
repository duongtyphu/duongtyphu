import { Sparkles } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";

export const metadata = {
  title: "Best Practice — Hệ tri thức AI (CKOS)",
  description: "Kinh nghiệm chắt lọc, đã kiểm chứng — cách người khác đã làm đúng với AI.",
};

type BestPractice = {
  id: string;
  title: string;
  description: string;
  principle: string;
};

// Trang danh sách TỐI GIẢN (Giai đoạn 1 Bước C) — chỉ liệt kê, chưa có
// filter/search riêng trong trang (Quick Search ở /portal/ckos đã phủ tìm
// theo từ khoá). Có thể mở rộng thêm sau nếu cần.
async function getBestPractices(): Promise<BestPractice[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("best_practices")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      title: String(d.title ?? ""),
      description: String(d.description ?? ""),
      principle: String(d.principle ?? ""),
    };
  });
}

export default async function CkosBestPracticesPage() {
  const bestPractices = await getBestPractices();

  return (
    <div className="space-y-6">
      <PortalBackLink href="/portal/ckos" label="Hệ tri thức AI (CKOS)" tone="light" />

      <PageHeader
        icon={Sparkles}
        tone="blue"
        title="Best Practice"
        subtitle="Kinh nghiệm chắt lọc, đã kiểm chứng — cách người khác đã làm đúng với AI, không phải suy đoán."
      />

      {bestPractices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-10 text-center text-sm text-gray-400">
          Chưa có Best Practice nào được đăng.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {bestPractices.map((bp) => (
            <GemCard key={bp.id}>
              <p className="gemos-card-title text-sm font-bold text-gray-900">{bp.title}</p>
              {bp.description && <p className="mt-2 text-sm text-gray-600">{bp.description}</p>}
              {bp.principle && (
                <p className="mt-3 rounded-xl bg-blue-50/60 p-3 text-sm leading-relaxed text-gray-700">{bp.principle}</p>
              )}
            </GemCard>
          ))}
        </div>
      )}
    </div>
  );
}
