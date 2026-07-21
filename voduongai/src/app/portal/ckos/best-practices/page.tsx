import Link from "next/link";
import { getLiveBestPractices } from "@/lib/portal/live-best-practices";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

export const metadata = {
  title: "Best Practice",
  description: "Kinh nghiệm chắt lọc, đã kiểm chứng — cách người khác đã làm đúng với AI.",
};

// Cùng bố cục với /portal/sop (page CKOS khác đã xây trước) — h1+mô tả
// đơn giản, card-shine, không dựng layout mới. Chỉ liệt kê title/
// description; principle đầy đủ xem ở trang chi tiết /best-practices/[id].
export default async function CkosBestPracticesPage() {
  const bestPractices = await getLiveBestPractices();

  return (
    <div className="space-y-6">
      <PortalBackLink href="/portal/ckos" label="Hệ tri thức AI (CKOS)" tone="light" />
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Best Practice</h1>
        <p className="mt-2 text-gray-900">
          Kinh nghiệm chắt lọc, đã kiểm chứng — cách người khác đã làm đúng với AI, không phải suy đoán.
        </p>
      </div>
      {bestPractices.length === 0 && (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          Chưa có Best Practice nào được đăng.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {bestPractices.map((bp) => (
          <div key={bp.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-gray-900">{bp.title}</h3>
            <p className="mt-2 text-sm text-gray-900">{bp.description}</p>
            <Link
              href={`/portal/ckos/best-practices/${bp.id}`}
              className="mt-3 block text-xs font-semibold text-brand-blue hover:underline"
            >
              Xem đầy đủ →
            </Link>
          </div>
        ))}
      </div>

      <CompanionGuide
        message="Best Practice là cách người khác đã làm ĐÚNG, không phải lý thuyết — đọc xong, hãy thử áp dụng ngay vào một việc thật thay vì chỉ ghi nhớ."
        action={{ label: "Hỏi Companion", href: "/portal/companion" }}
      />

      <KnowledgeJourneyStrip
        title="Đọc xong Best Practice, tiếp theo là gì?"
        steps={[
          { label: "Xem Case Study", description: "Xem kết quả thực tế khi áp dụng cách làm này.", href: "/portal/case-studies" },
          { label: "Thực hành ở Workspace", description: "Áp dụng cách làm tương tự vào việc của bạn.", href: "/portal/workspace" },
          { label: "Quay lại Hệ tri thức AI (CKOS)", description: "Xem toàn bộ 7 loại tri thức khác.", href: "/portal/ckos" },
        ]}
      />
    </div>
  );
}
