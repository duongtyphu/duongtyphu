import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PREMIUM_WORKSPACE_SECTIONS } from "@/lib/admin/premium/navigation";
import { listProgramRegistry } from "./actions";

const STATUS_LABEL: Record<string, string> = { open: "✅ Đang mở bán", coming: "⏳ Sắp mở đăng ký" };

/**
 * FOUNDER DIRECTIVE "PORTAL EXACT MIRROR ADMIN" (mục 5) — trang Premium
 * xoay quanh ĐÚNG 6 chương trình thật trên /portal/premium (AI Cơ bản/
 * AI Nâng cao/OpenClaw/V-Solo/V-Scale/Tư vấn 1:1). Bảng `products` cũ
 * (0 consumer checkout trên Portal, chỉ còn join lịch sử ở my-products)
 * đã ẨN khỏi Founder theo đúng chỉ thị "giữ phía sau, không hiển thị" —
 * dữ liệu và server action giữ nguyên, chỉ gỡ form khỏi màn hình.
 */
export default async function PremiumAdminPage() {
  const { programs, configured: coursesConfigured } = await listProgramRegistry();

  return (
    <AdminWorkspaceShell
      title="Premium"
      description="6 chương trình thật đang hiển thị trên Portal — thông tin lớp, giá & mở bán, nội dung học (chương/bài học/video/tài liệu), đơn hàng và quyền truy cập."
      rootHref="/admin/premium"
      sections={PREMIUM_WORKSPACE_SECTIONS}
    >
      <div className="space-y-8">
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">6 chương trình Premium — đúng theo Portal thật</h2>
          <p className="mt-1 text-xs text-white/50">
            Đối chiếu trực tiếp <code className="text-brand-orange">/portal/premium</code> — 5 chương trình khớp bảng{" "}
            <code className="text-brand-orange">courses</code> (giá/trạng thái thật, sửa ở tab{" "}
            <Link href="/admin/course-pricing" className="text-brand-blue hover:underline">Giá &amp; mở bán</Link>; chương/bài
            học/video/tài liệu sửa ở tab{" "}
            <Link href="/admin/academy/courses" className="text-brand-blue hover:underline">Nội dung học</Link>) + Tư vấn 1:1
            (khối liên hệ trực tiếp, không có giá/checkout). Phần mô tả giới thiệu (chủ đề, đối tượng, kết quả đầu ra) hiện
            còn nằm trong code — chưa sửa được bằng Admin, xem báo cáo.
          </p>
          {!coursesConfigured ? (
            <p className="mt-4 text-sm text-white/40">Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40">
                    <th className="py-2 pr-4 font-semibold">Chương trình</th>
                    <th className="py-2 pr-4 font-semibold">Trạng thái mở bán</th>
                    <th className="py-2 pr-4 font-semibold">Giá thật</th>
                    <th className="py-2 pr-4 font-semibold">Quản lý</th>
                    <th className="py-2 font-semibold">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((p) => (
                    <tr key={p.key} className="border-b border-white/5 align-top">
                      <td className="py-2 pr-4 font-semibold text-white/80 whitespace-nowrap">{p.name}</td>
                      <td className="py-2 pr-4 whitespace-nowrap text-white/70">
                        {p.matched ? (STATUS_LABEL[p.status ?? ""] ?? p.status) : "⚠️ Chưa có dòng `courses` khớp"}
                      </td>
                      <td className="py-2 pr-4 text-white/70">
                        {p.matched ? `${(p.price ?? 0).toLocaleString("vi-VN")}đ` : `${p.listPrice.toLocaleString("vi-VN")}đ (giá niêm yết dự phòng)`}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap text-xs">
                        <Link href="/admin/course-pricing" className="text-brand-blue hover:underline">Giá &amp; mở bán</Link>
                        {" · "}
                        <Link href="/admin/academy/courses" className="text-brand-blue hover:underline">Nội dung học</Link>
                      </td>
                      <td className="py-2 text-xs text-white/50">course_id: {p.courseId ?? "—"}</td>
                    </tr>
                  ))}
                  <tr className="align-top">
                    <td className="py-2 pr-4 font-semibold text-white/80 whitespace-nowrap">Tư vấn 1:1</td>
                    <td className="py-2 pr-4 whitespace-nowrap text-white/70">— (không có checkout)</td>
                    <td className="py-2 pr-4 text-white/70">— (liên hệ trực tiếp: SĐT/Zalo)</td>
                    <td className="py-2 pr-4 text-xs text-white/50">—</td>
                    <td className="py-2 text-xs text-white/50">Khối liên hệ trong code (PremiumConsult.tsx) — chưa sửa được bằng Admin.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/academy/courses" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]">
            <p className="text-sm font-bold text-white">Nội dung học</p>
            <p className="mt-1 text-xs text-white/50">Chương, bài học, video, PDF, tài liệu, file tải xuống, bài tập, bonus — theo từng khóa.</p>
          </Link>
          <Link href="/admin/course-pricing" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]">
            <p className="text-sm font-bold text-white">Giá &amp; mở bán</p>
            <p className="mt-1 text-xs text-white/50">Giá, giá khuyến mãi và trạng thái mở đăng ký của từng chương trình.</p>
          </Link>
          <Link href="/admin/orders" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]">
            <p className="text-sm font-bold text-white">Đơn hàng &amp; quyền truy cập</p>
            <p className="mt-1 text-xs text-white/50">Xác nhận thanh toán — xác nhận xong, học viên tự động mở khóa trang học của lớp đã mua.</p>
          </Link>
          <Link href="/admin/coupons" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]">
            <p className="text-sm font-bold text-white">Mã giảm giá</p>
            <p className="mt-1 text-xs text-white/50">Tạo và quản lý mã giảm giá cho các chương trình.</p>
          </Link>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
