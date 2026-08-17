import { Card, CardHead } from "@/components/v2/ui/Card";
import { PageHead } from "@/components/v2/ui/PageHead";

export const metadata = { title: "Trang Pháp lý — Admin" };

const LEGAL_PAGES = [
  { label: "Điều khoản sử dụng", href: "/terms" },
  { label: "Chính sách bảo mật", href: "/privacy" },
  { label: "Chính sách hoàn phí", href: "/refund-policy" },
];

/**
 * `/v2/admin/trang-phap-ly` — không có trang Portal 2.0 tương ứng. Bản
 * mock cũ hiển thị nội dung điều khoản/chính sách bảo mật/hoàn phí HOÀN
 * TOÀN BỊA (tự soạn văn bản pháp lý giả, kèm ngày cập nhật giả) — rủi ro
 * pháp lý thật nếu ai đó tưởng đây là nội dung đang áp dụng. 3 trang
 * pháp lý thật (`/terms`/`/privacy`/`/refund-policy`) là component React
 * nội dung dài, KHÔNG có bảng CMS nào quản (đã xác nhận ở Admin 1.0
 * Sprint 2 "Website" — cùng kết luận, sửa qua UI generic có rủi ro pháp
 * lý nếu làm sai) — Admin chỉ có thể xem, không sửa qua đây.
 */
export default function AdminTrangPhapLyPage() {
  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Landing Page › Trang Pháp lý"
        title="Trang Pháp lý (chỉ đọc)"
        description="3 trang pháp lý là nội dung code, chưa có CMS nào quản — sửa nội dung cần deploy code (và nên có rà soát pháp lý trước khi đổi)."
      />
      <Card padding="admin">
        <CardHead title="Trang hiện có" />
        <div className="flex flex-col">
          {LEGAL_PAGES.map((page) => (
            <a
              key={page.href}
              href={page.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-[var(--v2-line)] py-3 text-[13px] font-bold text-[var(--v2-text)] last:border-b-0 hover:text-[var(--v2-violet)]"
            >
              {page.label}
              <span className="text-[12px] font-normal text-[var(--v2-muted)]">{page.href} ↗</span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
