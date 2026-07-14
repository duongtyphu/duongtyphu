import Link from "next/link";
import { Users, ShieldCheck, Plug } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

/**
 * PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 9, PMO APPROVAL) —
 * "Cài đặt" chỉ giữ 3 mục: Tài khoản & quyền, Bảo mật, Tích hợp. Bản CRUD
 * cũ (Tên website/Slogan/Logo/Favicon/Màu/SEO/Footer/Social) không có nơi
 * đọc thật (0 consumer, xem ADMIN_CMS_SIDEBAR_SIMPLIFICATION.md #4) — đã
 * loại bỏ khỏi Sidebar theo đúng chỉ thị. Các cấu hình đó thật ra thuộc
 * đúng khu vực sở hữu riêng, đã có sẵn: Thương hiệu (Logo/Favicon/Màu/
 * Khẩu hiệu) và Website (SEO/Footer/Social) — không tạo lại ở đây.
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Cài đặt</h1>
        <p className="mt-1 text-sm text-white/50">
          Cấu hình chung của toàn Admin. Cấu hình theo từng khu vực (thương hiệu, trình bày website, thương mại
          Premium, cấu hình Companion) nằm ngay trong khu vực đó — xem tab &quot;Cài đặt&quot; của Website, Thương
          hiệu, Premium, Companion.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Tài khoản & quyền</h2>
            <p className="text-xs text-white/50">Quản lý người dùng, khoá/mở tài khoản.</p>
          </div>
        </div>
        <Link
          href="/admin/users"
          className="mt-4 inline-block rounded-lg bg-brand-blue px-4 py-2 text-xs font-bold text-white hover:opacity-90"
        >
          Mở trang Người dùng →
        </Link>
      </section>

      <ComingSoon
        icon={ShieldCheck}
        title="Bảo mật"
        description="Chưa triển khai — chưa có cấu hình bảo mật riêng (đăng nhập 2 lớp, nhật ký truy cập, chính sách mật khẩu) ngoài phạm vi Supabase Auth mặc định."
      />
      <ComingSoon
        icon={Plug}
        title="Tích hợp"
        description="Chưa triển khai — chưa có tích hợp bên thứ ba nào (thanh toán/email/CRM) cần cấu hình riêng ngoài phạm vi đã nối dây trong từng khu vực."
      />
    </div>
  );
}
