"use client";

/**
 * Error boundary riêng cho toàn bộ cây `/v2/*` — TRƯỚC ĐÂY KHÔNG TỒN TẠI
 * (0 file `error.tsx` nào dưới `src/app/v2/`, đã grep xác nhận trước khi
 * tạo file này). Hệ quả: BẤT KỲ exception nào xảy ra lúc render ở BẤT KỲ
 * trang `/v2/*` nào (kể cả 1 lỗi nhỏ, cục bộ) đều rơi thẳng ra
 * `src/app/error.tsx` (root, style nền TỐI — `text-white`, cho Landing
 * Page/Portal 1.0) — vỡ hẳn giao diện sáng của Portal 2.0, đúng cảm giác
 * "báo lỗi trang" đột ngột người dùng gặp.
 *
 * Founder báo "chat với Companion 2.0 hay bị co giật màn hình và báo lỗi
 * trang" — đã tìm và sửa 1 nguyên nhân THẬT gây giật (xem comment trong
 * `CompanionClient.tsx`, khối "Lưu vào My Story" trước đây làm đổi kích
 * thước khung chat cố định mỗi lượt chat) + 1 lỗ hổng bắt lỗi thiếu
 * (`handleSaveMemory` không có try/catch quanh `saveMemorySuggestion()`).
 * File này là lớp phòng thủ THỨ HAI, bắt buộc phải có dù đã sửa 2 lỗi trên —
 * nếu về sau có bất kỳ lỗi render nào khác (ở Companion hay bất kỳ trang
 * `/v2/*` nào khác) xảy ra, người dùng sẽ thấy màn hình khôi phục ĐÚNG
 * giao diện 2.0 (nút "Thử lại") thay vì trang lỗi nền tối lạc tông + phải
 * tải lại cả ứng dụng.
 *
 * Được render BÊN TRONG `v2/layout.tsx` (Next.js error boundary giữ
 * nguyên layout bao quanh, chỉ thay `page.tsx`) — an toàn dùng token màu
 * `v2-tokens.css` (`--v2-*`, nếu có) hoặc màu trung tính không phụ thuộc
 * theme tối/sáng cụ thể của từng trang con (mỗi trang `/v2/*` tự định
 * nghĩa `--violet`/`--ink`... riêng trong CSS của chính nó, không có 1 bộ
 * token dùng chung ở tầng `/v2` — nên file này dùng màu trung tính an
 * toàn, không phụ thuộc biến CSS của trang cụ thể nào).
 *
 * "Thử lại" cố ý dùng `window.location.reload()` (tải lại HẲN trang,
 * không phải `reset()` của Next.js — hàm chỉ re-render lại children của
 * error boundary bằng JS bundle ĐANG CÓ SẴN trên trình duyệt). Founder báo
 * lỗi trang khi chat Companion vẫn còn xảy ra sau khi 2 nguyên nhân đầu
 * (memorySuggestion layout-shift + thiếu try/catch) đã được vá và deploy —
 * dấu hiệu mạnh nhất chỉ ra "Version Skew" (xem
 * `node_modules/next/dist/docs/01-app/02-guides/self-hosting.md`, mục
 * "Version Skew"): trong lúc làm việc này có 6+ lần redeploy liên tiếp
 * trong ~30 phút, nếu người dùng đang mở sẵn tab `/v2/companion` xuyên
 * qua 1 lần redeploy, JS chunk/Server Function cũ trên tab đó có thể lệch
 * với server mới — gửi tin nhắn tiếp sẽ ném lỗi client-side. `reset()`
 * KHÔNG sửa được lỗi này vì nó tái sử dụng đúng bundle cũ đang lỗi; chỉ
 * `window.location.reload()` (tải lại document, kéo bundle mới nhất từ
 * server) mới thoát được. Đổi lại là đánh đổi: mất trạng thái form/cuộn
 * trang hiện tại, nhưng đây là màn hình lỗi — không có gì đáng giữ lại.
 */

import { useEffect } from "react";
import Link from "next/link";

export default function V2Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "24px",
        textAlign: "center",
        background: "#f7f6fc",
        color: "#1c1830",
        fontFamily: "var(--font-v2-inter), system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Đã có lỗi xảy ra</h1>
      <p style={{ maxWidth: 420, fontSize: 13.5, color: "#6b6685" }}>
        Rất xin lỗi, trang này gặp sự cố khi hiển thị. Bạn có thể thử lại hoặc quay về trang chủ.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={() => {
            reset();
            window.location.reload();
          }}
          style={{
            background: "linear-gradient(145deg,#8b6bff,#5a37e6)",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13.5,
            cursor: "pointer",
          }}
        >
          Thử lại
        </button>
        <Link
          href="/v2/trang-chu"
          style={{
            border: "1px solid #ece9f7",
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13.5,
            color: "#1c1830",
            textDecoration: "none",
          }}
        >
          Về Trang chủ
        </Link>
      </div>
    </div>
  );
}
