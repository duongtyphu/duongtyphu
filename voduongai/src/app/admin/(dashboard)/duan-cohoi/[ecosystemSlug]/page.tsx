import { redirect } from "next/navigation";
import EcosystemMiniSitePage from "@/app/portal/duan-cohoi/[ecosystemSlug]/page";
import { EditModeProvider } from "@/components/portal/opportunities/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Trang chi tiết hệ sinh thái (Live-edit) · Admin" };

/**
 * Nhóm 3, Phần D (mở rộng) — Live-edit (Cách A) cho 5 trang chi tiết hệ
 * sinh thái (/portal/duan-cohoi/[ecosystemSlug]). MỘT route dynamic duy
 * nhất phục vụ cả 5 trang (digiu/solargroup/blockchain-crypto/lam-affilate/
 * sangiaodich) — cùng kỹ thuật route `[courseId]` đã dùng ở Course Builder.
 *
 * Render lại ĐÚNG component gốc `/portal/duan-cohoi/[ecosystemSlug]/page.tsx`
 * (`EcosystemMiniSitePage`, import thẳng), bọc `<EditModeProvider>` — cùng
 * pattern 5 Cửa Hành trình.
 *
 * (Comment cũ ở đây từng ghi "CHỈ 2 field an toàn sửa được" — không còn
 * đúng, đã mở rộng qua nhiều việc riêng sau đó. Tính tới "Lấy format DigiU
 * làm chuẩn áp dụng cho các dự án khác" — TẤT CẢ nội dung "session đầu
 * tiên" (tên/mô tả/giới thiệu/statusBadge/highlights/whoFor/whoNotReady/
 * expectedOutcome), "Đường link liên kết dự án" (mọi loại structureType —
 * sub-projects/two-field/affiliate-list/exchange-list), "Video dự án",
 * "Link tải tài liệu", "Cập nhật thông tin mới" (bài viết), dự án con (chỉ
 * loại sub-projects), và Đánh giá tiềm năng đều sửa được qua Admin, đồng
 * bộ TÍNH NĂNG như nhau cho cả 5 hệ sinh thái — mỗi loại vẫn giữ đúng bố
 * cục riêng theo `structureType` (không đổi cấu trúc trang, xem
 * `page.tsx`). `icon`/`fields[].name`/`fields[].description` vẫn tĩnh
 * (ngoài phạm vi, không phải nội dung "đường link").
 */
export default async function EcosystemLiveEditPage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <EcosystemMiniSitePage params={params} />
    </EditModeProvider>
  );
}
