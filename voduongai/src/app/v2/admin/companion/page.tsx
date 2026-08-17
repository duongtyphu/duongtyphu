import { getLiveBlogPosts } from "@/lib/portal/live-blog";

import "../../inter-gf.css";
import "../../companion/companion.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Companion AI — Admin" };

/**
 * `/v2/admin/companion` — theo đúng nguyên tắc "Admin phải khớp hình ảnh
 * trực quan với Portal tương ứng". Portal thật (`/v2/companion`) hiển thị
 * cuộc trò chuyện GẦN NHẤT của chính người dùng đang đăng nhập
 * (`listConversations()`/`getConversationMessages()`, 1.0 Companion Chat
 * MVP) + 2 bài viết Blog AI mới nhất làm gợi ý — đây là dữ liệu HỘI THOẠI
 * CÁ NHÂN từng user, không phải nội dung CMS để Admin "quản lý" theo nghĩa
 * sửa/xoá hàng loạt. Cấu hình personality/giới hạn/quyền truy cập Companion
 * đã có sẵn ở `/admin/companion` (1.0, "nhiều tab nội bộ riêng") — không
 * xây trùng ở đây.
 *
 * Trang này chỉ hiển thị đúng phần thật sự là "nội dung" (bài viết gợi ý —
 * bảng `blog`) + trỏ sang nơi cấu hình đầy đủ, thay cho bộ KPI bịa cũ
 * ("142.850 cuộc trò chuyện", "94,6% hài lòng"...).
 */
export default async function AdminCompanionPage() {
  const blogPosts = await getLiveBlogPosts();

  return (
    <AdminPortalMirror
      prefix="comp"
      title="Quản lý Companion AI"
      description="Companion AI 2.0 dùng nguyên hạ tầng hội thoại thật của Companion Chat (1.0) — mỗi cuộc trò chuyện thuộc về đúng 1 người dùng, không phải nội dung CMS chỉnh sửa hàng loạt."
      stats={[{ label: "Bài viết gợi ý (Blog AI)", value: String(blogPosts.length) }]}
      note="2 bài viết mới nhất từ bảng `blog` được gợi ý bên cạnh khung chat — quản lý nội dung bài viết qua Admin 1.0. Cấu hình personality/lời chào/giới hạn sử dụng/quyền truy cập Companion nằm trọn ở /admin/companion (1.0)."
      links={[{ label: "Cấu hình Companion đầy đủ (Admin 1.0) →", href: "/admin/companion" }]}
    />
  );
}
