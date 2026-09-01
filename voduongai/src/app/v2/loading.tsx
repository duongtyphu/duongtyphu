/**
 * Suspense fallback dùng chung cho TOÀN BỘ cây `/v2/*` (Next.js cascade —
 * 1 file này phủ mọi route con, không cần thêm `loading.tsx` riêng từng
 * trang). Trước đây `/v2/*` không có `loading.tsx` nào — chỉ kế thừa
 * `src/app/loading.tsx` gốc, vốn style CHO NỀN TỐI (`text-white/50`,
 * `border-white/20` — đúng cho Landing Page/Portal 1.0). Trên nền SÁNG của
 * 2.0 (`--v2-bg: #f7f6fc`), chữ/viền trắng gần như VÔ HÌNH — nghĩa là suốt
 * bao lâu nay MỖI LẦN chuyển trang `/v2/*`, Next.js vẫn hiển thị đúng
 * trạng thái loading (không phải bug logic), nhưng người dùng hoàn toàn
 * KHÔNG THẤY GÌ — cảm giác app bị đứng/treo thay vì "đang tải", đúng lý do
 * Founder báo "chuyển mục thì tải rất chậm... chờ rất khó chịu".
 *
 * File này render BÊN TRONG `v2/layout.tsx` (đã bọc `data-ui="v2"`), nên
 * dùng an toàn token màu `--v2-*` từ `v2-tokens.css` — tự động đúng màu dù
 * trang đích là hand-CSS hay Tailwind thật.
 *
 * ĐÃ SỬA THÊM (Founder: "giữ cố định thanh Menu... hiện tại đang nhảy
 * lỗi") — root cause đo được bằng Playwright thật (`next dev`, throttle
 * mạng): mỗi trang `/v2/*` (trừ `/v2/admin/*`, đã có `layout.tsx` +
 * `AdminSidebar` NGOÀI Suspense boundary) tự render `<aside
 * className="sidebar">` BÊN TRONG chính `page.tsx` của nó (không có
 * layout dùng chung cho Portal — kiến trúc "Bước F", mỗi trang tự chép
 * sidebar). Vì KHÔNG có layout ngoài giữ sidebar cố định, Suspense
 * boundary của `loading.tsx` này bọc quanh CẢ TRANG (sidebar lẫn nội
 * dung) — mỗi lần chuyển trang, `<aside className="sidebar">` của trang
 * CŨ biến mất hoàn toàn, thay bằng fallback này, rồi mới hiện `<aside>`
 * của trang MỚI. Đo trực tiếp: `aside.sidebar` biến mất khỏi DOM trong
 * suốt quá trình tải — đúng cảm giác "nhảy lỗi"/Menu không cố định
 * Founder mô tả.
 *
 * Refactor toàn bộ ~26 trang Portal sang 1 layout dùng chung (để sidebar
 * là DOM node thật sự không unmount) là thay đổi kiến trúc lớn, rủi ro
 * cao (mỗi trang truyền prop riêng cho `PortalV2Shell` — `activeHtmlFile`/
 * `searchPlaceholder`/`promoText`..., không có cách nào layout nhận được
 * props này từ page con trong Next.js App Router) — ngoài phạm vi audit
 * lỗi này. Thay vào đó, sửa đúng NGUYÊN NHÂN gây cảm giác "nhảy": fallback
 * giờ tự vẽ 1 khung sidebar CÙNG kích thước/màu/logo với sidebar thật
 * (`--v2-sidebar-w`/`--v2-sidebar`, đúng token `v2-tokens.css`) — khi
 * chuyển trang, sidebar không còn "biến mất" mà LUÔN có 1 khối hình dạng
 * sidebar hiện diện liên tục (sidebar trang cũ → khung sidebar tạm →
 * sidebar trang mới), không còn khoảnh khắc trắng/trống nào — loại bỏ
 * đúng hiệu ứng "nhảy" Founder báo, không cần đổi kiến trúc routing.
 */
export default function V2Loading() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        aria-hidden
        style={{
          width: "var(--v2-sidebar-w, 224px)",
          flexShrink: 0,
          minHeight: "100vh",
          background: "var(--v2-sidebar, #150f2e)",
          padding: "20px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#3B82F6" />
            <circle cx="27" cy="7.5" r="3" fill="#F97316" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-.01em" }}>
            VO DUONG <span style={{ color: "#A78BFA" }}>AI</span>
          </span>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 38,
              borderRadius: 10,
              marginBottom: 6,
              background: "rgba(255,255,255,.05)",
            }}
          />
        ))}
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 68, borderBottom: "1px solid rgba(0,0,0,.06)", background: "var(--v2-bg, #f7f6fc)" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            background: "var(--v2-bg, #f7f6fc)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid var(--v2-violet-light, #efe9ff)",
              borderTopColor: "var(--v2-violet, #6d4aff)",
              animation: "v2LoadingSpin 0.8s linear infinite",
            }}
          />
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "var(--v2-muted, #6b6685)" }}>
            Đang tải...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes v2LoadingSpin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes v2LoadingSpin { to { transform: none; } }
        }
      `}</style>
    </div>
  );
}
