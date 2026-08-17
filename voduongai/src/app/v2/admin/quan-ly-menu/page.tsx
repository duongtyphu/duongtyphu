import { Card, CardHead } from "@/components/v2/ui/Card";
import { PageHead } from "@/components/v2/ui/PageHead";
import { PORTAL_NAV } from "@/components/v2/nav/nav-config";

export const metadata = { title: "Quản lý Menu — Admin" };

/**
 * `/v2/admin/quan-ly-menu` — không có trang Portal 2.0 tương ứng. Menu
 * Portal 2.0 là CODE (`src/components/v2/nav/nav-config.ts`), KHÔNG có
 * bảng Supabase nào backing — bản mock cũ (`ListEditorPanel` với nút
 * "Thêm mục menu"/"Lưu") tạo cảm giác sửa được nhưng không có gì thật sự
 * lưu lại. Đổi sang hiển thị CHỈ ĐỌC đúng cây menu THẬT (import trực tiếp
 * `PORTAL_NAV`, tự động cập nhật nếu code đổi sau này) — trung thực hơn
 * là 1 form giả.
 */
export default function AdminQuanLyMenuPage() {
  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tổng quan › Quản lý Menu"
        title="Menu Portal (chỉ đọc)"
        description="Menu Portal 2.0 hiện là code (nav-config.ts), chưa có bảng CMS nào — đổi cấu trúc menu cần deploy code, không sửa được qua Admin. Danh sách dưới đây đọc trực tiếp cấu hình đang chạy thật."
      />

      {PORTAL_NAV.map((section, i) => (
        <Card key={section.label ?? `section-${i}`} padding="admin">
          <CardHead title={section.label ?? "Menu chính"} />
          <div className="flex flex-col">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-3 border-b border-[var(--v2-line)] py-3 last:border-b-0"
                >
                  <span className="v2-ico flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--v2-violet-light)] text-[var(--v2-violet)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-[13px] font-bold">{item.label}</div>
                    <div className="text-[11.5px] text-[var(--v2-muted)]">{item.href}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
