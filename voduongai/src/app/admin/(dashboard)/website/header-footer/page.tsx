import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import type { FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Header & Footer · Admin" };

const SETTINGS_ID = "settings";

type SiteSettingsRow = {
  id: string;
  siteName: string;
  slogan: string;
  seoTitle: string;
  seoDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  faviconUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  zaloUrl: string;
  adminEmailNotify: string;
};

// Chỉ liệt kê ĐÚNG các field thật sự được `getSiteSettings()`
// (src/lib/site-settings.ts) đọc và Header/Footer/layout.tsx render ra
// site công khai — đã audit từng field bằng grep trước khi liệt kê.
// 2 field tồn tại trong bảng `settings` nhưng KHÔNG có nơi nào đọc
// (`logoUrl`, `footerText` — Header/Footer hiện vẽ logo SVG cứng và dòng
// Copyright cứng, không dùng 2 field này) CHỦ ĐỘNG không đưa vào form —
// tránh tạo control "sửa xong không có tác dụng gì" (đúng nguyên tắc
// không tạo CRUD giả).
const fields: FieldConfig[] = [
  { key: "siteName", label: "Tên site", type: "text", required: true },
  { key: "slogan", label: "Khẩu hiệu (Header/Footer)", type: "text" },
  { key: "seoTitle", label: "Tiêu đề SEO mặc định", type: "text", full: true },
  { key: "seoDescription", label: "Mô tả SEO mặc định", type: "textarea", full: true },
  { key: "primaryColor", label: "Màu chính (brand-blue, mã hex)", type: "text", placeholder: "#2563EB" },
  { key: "secondaryColor", label: "Màu phụ (brand-violet, mã hex)", type: "text", placeholder: "#5B8CFF" },
  { key: "accentColor", label: "Màu nhấn (brand-orange, mã hex)", type: "text", placeholder: "#FF7A00" },
  { key: "faviconUrl", label: "Favicon URL", type: "text" },
  { key: "facebookUrl", label: "Link Facebook (Footer)", type: "text" },
  { key: "youtubeUrl", label: "Link YouTube (Footer)", type: "text" },
  { key: "tiktokUrl", label: "Link TikTok (Footer)", type: "text" },
  { key: "zaloUrl", label: "Link Zalo (Footer)", type: "text" },
  { key: "adminEmailNotify", label: "Email liên hệ (Footer)", type: "text" },
];

/**
 * ADM-V2-02 — "Header & Footer" (Website). Bảng `settings` (schema generic
 * id/data/status/order) ĐÃ TỒN TẠI TỪ TRƯỚC, đã đăng ký sẵn trong
 * `SUPABASE_COLLECTIONS` và đã được `getSiteSettings()` đọc thật (KHÔNG
 * cache, mỗi request) để render `<Header/>`/`<Footer/>` (component,
 * `src/lib/site-settings.ts`) + metadata gốc (`src/app/layout.tsx`) — chỉ
 * CHƯA có UI Admin nào ghi vào bảng này (route `/admin/settings` từng bị
 * dọn khỏi `navIcons` như link mồ côi ở đợt audit trước, đúng vì lúc đó
 * chưa có route thật). KHÔNG cần migration — chỉ thiếu đúng 1 trang Admin.
 */
export default async function HeaderFooterPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="max-w-3xl space-y-6">
      <AdminBreadcrumb trail={[{ label: "Website", href: "/admin/landing" }, { label: "Header & Footer" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Header & Footer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Nội dung tĩnh dùng chung cho Header/Footer công khai + màu thương hiệu/SEO mặc định toàn site.
          Đọc/ghi thẳng bảng <code className="text-gray-700">settings</code> đã có sẵn — thay đổi có hiệu
          lực ngay trên Website (Header/Footer đọc mỗi request, không cache).
        </p>
      </div>

      <SingletonEditor<SiteSettingsRow>
        collectionKey="settings"
        id={SETTINGS_ID}
        title="Cài đặt Website"
        description="Menu Header/Footer (danh sách link) quản lý riêng ở mục 'Điều hướng'."
        fields={fields}
      />
    </div>
  );
}
