import { CheckCircle2, XCircle } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { PageHead } from "@/components/v2/ui/PageHead";

export const metadata = { title: "Cấu hình hệ thống — Admin" };

const ENV_CHECKS = [
  { label: "SUPABASE_URL", ok: Boolean(process.env.SUPABASE_URL) },
  { label: "SUPABASE_SERVICE_ROLE_KEY", ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
  { label: "NEXT_PUBLIC_SUPABASE_URL", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
  { label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
];

/**
 * `/v2/admin/cau-hinh` — không có trang Portal 2.0 tương ứng, workspace
 * "Hệ thống" nhạy cảm nhất (cùng ràng buộc đã áp dụng xuyên suốt Admin
 * 1.0 Sprint 5: KHÔNG BAO GIỜ hiện giá trị biến môi trường/secret, chỉ
 * boolean đã cấu hình/chưa). Bản mock cũ hoàn toàn bịa: ma trận phân
 * quyền 4 vai trò (hệ thống thật chỉ có `members.is_admin` nhị phân,
 * không có role nào khác) + nhật ký thao tác kèm TÊN NGƯỜI/ĐỊA CHỈ IP
 * giả — rủi ro nghiêm trọng nếu ai đó tưởng đây là log thật. Đổi sang
 * đúng những gì có thật: checklist boolean cấu hình môi trường (mirror
 * `/admin/he-thong/moi-truong` ở 1.0) + trạng thái phân quyền nhị phân
 * thật.
 */
export default function AdminCauHinhPage() {
  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Cấu hình hệ thống"
        title="Cấu hình hệ thống"
        description="Chỉ hiện trạng thái đã cấu hình hay chưa (boolean) — không bao giờ hiện giá trị biến môi trường/secret thật."
      />

      <Card padding="admin">
        <CardHead title="Biến môi trường lõi" />
        <div className="flex flex-col">
          {ENV_CHECKS.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between border-b border-[var(--v2-line)] py-3 last:border-b-0"
            >
              <code className="text-[12.5px] font-bold">{check.label}</code>
              {check.ok ? (
                <span className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--v2-green)]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Đã cấu hình
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--v2-muted)]">
                  <XCircle className="h-4 w-4" aria-hidden="true" /> Chưa cấu hình
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card padding="admin">
        <CardHead title="Phân quyền" />
        <p className="text-[13px] leading-relaxed text-[var(--v2-muted)]">
          Hệ thống hiện dùng mô hình nhị phân — cột <code>members.is_admin</code> (Quản trị viên / Người
          dùng thường). Không có bảng vai trò/quyền chi tiết hơn nào tồn tại (Editor/Moderator...). Xem danh
          sách Admin thật tại &quot;Người dùng&quot;.
        </p>
      </Card>

      <Card padding="admin">
        <CardHead title="Nhật ký thao tác" />
        <p className="text-[13px] leading-relaxed text-[var(--v2-muted)]">
          Chưa có bảng audit log nào ghi lại thao tác Admin (ai sửa gì, khi nào) — chưa có gì để hiển thị ở
          đây.
        </p>
      </Card>
    </div>
  );
}
