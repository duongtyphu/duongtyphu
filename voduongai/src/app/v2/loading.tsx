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
 */
export default function V2Loading() {
  return (
    <div
      style={{
        minHeight: "60vh",
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
