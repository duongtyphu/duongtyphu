import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PREMIUM_WORKSPACE_SECTIONS } from "@/lib/admin/premium/navigation";
import { listProducts, listProgramRegistry } from "./actions";
import { NewProductForm, ProductCard } from "./ProductForm";

const STATUS_LABEL: Record<string, string> = { open: "✅ Đang mở bán", coming: "⏳ Sắp mở đăng ký" };

export default async function PremiumAdminPage() {
  const [{ products, configured }, { programs, configured: coursesConfigured }] = await Promise.all([
    listProducts(),
    listProgramRegistry(),
  ]);

  return (
    <AdminWorkspaceShell title="Premium" description="" rootHref="/admin/premium" sections={PREMIUM_WORKSPACE_SECTIONS}>
    <div className="space-y-8">
      <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
        <h2 className="text-sm font-bold text-white">Premium Program Registry — đúng 6 chương trình Portal thật (Task 2, PREMIUM-SPR-701)</h2>
        <p className="mt-1 text-xs text-white/50">
          Đối chiếu trực tiếp <code className="text-brand-orange">/portal/premium</code> — 5 chương trình khớp bảng{" "}
          <code className="text-brand-orange">courses</code> (giá/trạng thái thật, sửa tại{" "}
          <Link href="/admin/course-pricing" className="text-brand-blue hover:underline">Học phí V-SOLO / V-SCALE</Link>
          ) + Tư vấn 1:1 (không có giá/checkout). Nội dung/curriculum (chủ đề, mô tả, badge, đối tượng, số bài học) 100%
          hardcode trong <code className="text-brand-orange">premium-programs.ts</code> — chưa có CRUD, xem báo cáo.
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
                  <th className="py-2 pr-4 font-semibold">Số bài học (hardcode)</th>
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
                    <td className="py-2 pr-4 text-white/70">{p.lessonCount}</td>
                    <td className="py-2 text-xs text-white/50">course_id: {p.courseId ?? "—"}</td>
                  </tr>
                ))}
                <tr className="align-top">
                  <td className="py-2 pr-4 font-semibold text-white/80 whitespace-nowrap">Tư vấn 1:1</td>
                  <td className="py-2 pr-4 whitespace-nowrap text-white/70">— (không có checkout)</td>
                  <td className="py-2 pr-4 text-white/70">— (liên hệ trực tiếp: SĐT/Zalo)</td>
                  <td className="py-2 pr-4 text-white/70">—</td>
                  <td className="py-2 text-xs text-white/50">Hardcode trong PremiumConsult.tsx — chưa có CRUD.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-bold text-white">Sản phẩm số</h2>
        <p className="mt-1 text-xs text-white/50">
          ⚠️ Bảng <code className="text-brand-orange">products</code> — KHÔNG phải 1 trong 6 chương trình ở trên.
          0 route Portal nào tạo checkout cho bảng này (Consumer = 0, PREMIUM-SPR-701) — vẫn giữ CRUD, không tự xoá.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role để quản lý sản phẩm.
        </div>
      )}

      {configured && (
        <>
          <NewProductForm />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {products.length === 0 && <p className="text-sm text-white/40">Chưa có sản phẩm nào.</p>}
          </div>
        </>
      )}
    </div>
    </AdminWorkspaceShell>
  );
}
