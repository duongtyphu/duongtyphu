// @archived — Community Campus Reconstruction (Product Owner approved).
// Route này giờ REDIRECT vĩnh viễn về /portal/congdongai#tin-tuc (xem
// next.config.ts) — component dưới đây không còn được render nữa.
//
// Nội dung KHÔNG bị bỏ (đây là dữ liệu thật về sản phẩm, không phải dữ
// liệu bịa) — đã MOVE nguyên vẹn vào khối "Community News" tại
// /portal/congdongai (mảng `NEWS`). Icon chuông ở PortalHeader cũng đã
// trỏ thẳng sang đích mới.
//
// Giữ nguyên file (không xoá) chỉ để tham chiếu lịch sử.

export const metadata = { title: "Tin tức & Cập nhật", description: "Cập nhật mới nhất về Prompt, công cụ và nội dung trong Học viện VO DUONG AI." };

const UPDATES = [
  { date: "2026-06-20", title: "Thêm 3 Prompt mới cho Content & Affiliate", type: "Prompt" },
  { date: "2026-06-15", title: "Cập nhật công cụ: thêm HeyGen vào Thư viện công cụ", type: "Công cụ" },
  { date: "2026-06-10", title: "Ra mắt module Affiliate Hub mới với lộ trình từng bước", type: "Hệ sinh thái" },
  { date: "2026-06-01", title: "Thêm bài học mới trong Học viện AI: Prompt Engineering cơ bản", type: "Khóa học" },
  { date: "2026-05-25", title: "Cập nhật Template kế hoạch content 30 ngày", type: "Tài nguyên" },
];

export default function UpdatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Tin tức & Cập nhật</h1>
        <p className="mt-2 text-gray-900">Cập nhật mới nhất về tài nguyên, prompt, công cụ và khóa học trong hệ sinh thái VO DUONG AI.</p>
      </div>

      <div className="space-y-3">
        {UPDATES.map((u) => (
          <div key={u.title} className="card-shine flex items-start gap-4 rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <span className="shrink-0 rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
              {u.type}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{u.title}</p>
              <p className="mt-1 text-xs text-gray-400">{new Date(u.date).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
