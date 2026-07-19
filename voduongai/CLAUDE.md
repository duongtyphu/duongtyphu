@AGENTS.md

## Nguyên tắc giao diện Admin

Admin mới (`src/app/admin/**`, `src/components/admin/**`) phải dùng **NỀN
SÁNG, giống hệt `/portal`** — không dùng nền tối navy (đó là thiết kế Admin
cũ, đã bỏ). Màu nhấn CTA chính vẫn là `brand-blue`.

- **Nền chính (background của toàn shell):** tái sử dụng thẳng component
  `<GemBackground />` (`src/components/portal/ui/GemBackground.tsx`) — render
  y hệt cách `PortalShell.tsx` đang làm. Component này chỉ là `<div
  className="gemos-bg" />`; class `.gemos-bg` (`globals.css` dòng ~243) là
  layer `position: fixed; inset: 0; z-index: -1;` với `background-color:
  #F6F7F9` + gradient `#F6F7F9 → #F1F5F9`. **Lưu ý:** `#F6F7F9`/`#F1F5F9`
  KHÔNG trùng token `@theme` nào (gần nhưng khác `--color-background`
  `#F8FAFC`) — vì vậy phải dùng qua component/class có sẵn này, KHÔNG tự viết
  `bg-[#F6F7F9]` rời rạc trong từng file Admin.
- **Sidebar/card/popup:** `bg-white` + `border-gray-200` (đúng như
  `PortalShell.tsx`/`PortalHeader.tsx` đang dùng).
- **Header (topbar):** class `.gemos-topbar` = `rgba(255,255,255,0.9)` +
  `backdrop-filter: blur(18px)` + `border-bottom: #E2E8F0` (đúng như
  `TopbarGlass.tsx`).
- **Màu CTA/nhấn chính:** `--color-brand-blue` (`#2563EB`) — dùng qua
  `bg-brand-blue` / `text-brand-blue` / `border-brand-blue`. Không đổi so
  với quyết định trước (căn cứ grep 2026-07-19: ~35 chỗ trong `/admin/`,
  ~70 chỗ trong `/portal/` dùng đúng token này cho CTA).
- **`gemos-bg` (qua `<GemBackground />`) LÀ nền sáng chủ đạo của toàn bộ
  `/portal`** — không phải một phần của "tiểu hệ thống styling card", mà là
  cơ chế tạo nền thật (phủ lên `.mesh-navy` tối ở layout gốc) cho mọi route
  dùng `PortalShell`. Admin dùng đúng component này để luôn đồng bộ tự động
  với Portal qua 1 nguồn chung — KHÔNG tạo token màu mới, KHÔNG copy hex ra
  từng file.
- **Không dùng các class `gemos-*` khác ngoài `gemos-bg`** (`gemos-navy`,
  `gemos-ai-blue`, `gemos-card-title`, `gemos-gem-card`, `gemos-glass-card`,
  `gemos-btn-primary/secondary`...) cho Admin — nhóm này đúng là tiểu hệ
  thống styling riêng cho 5 loại thẻ ở vài trang `/portal/*` cụ thể (CKOS,
  Học viện AI, Workspace, Dự án & Cơ hội, Cộng đồng), không liên quan đến
  nền và không phải hệ CTA chung.

**Lịch sử quyết định (đã bị thay thế — giữ lại để biết vì sao đổi):**
Bản đầu (dựa trên grep, chưa đối chiếu ảnh chụp thực tế) từng chốt nền Admin
= `brand-navy`/`brand-navy-soft` (tối). Sau khi đối chiếu ảnh chụp `/portal`
thực tế cho thấy nền sáng, đọc lại code xác nhận `PortalShell.tsx` render
`<GemBackground />` (`z-index:-1`, sáng) phủ đè lên `.mesh-navy` gốc
(`z-index:-10`, tối) ở mọi route dùng `PortalShell` — nên nền THẬT của toàn
sản phẩm (trừ Landing/marketing) là sáng, không phải navy. Quyết định
`brand-navy` bị huỷ, thay bằng mục này.

Nếu Admin cần thêm 1 sắc thái chưa có token/class (ví dụ nền phụ nhạt hơn),
phải hỏi trước — không tự bịa hex mới.
