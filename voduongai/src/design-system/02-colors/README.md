# 02 — Colors

Toàn bộ token màu hiện hành đã được định nghĩa trong `src/app/globals.css` (`@theme` block + các custom property `.gemos-*`/`.garden-*`/`.sanctuary-*`). Tài liệu này là **bản đồ tham chiếu** ánh xạ mỗi nhóm màu theo ngữ nghĩa sản phẩm — không hardcode giá trị hex lẻ ở bất kỳ trang nào, luôn trỏ về token dưới đây.

## Nguyên tắc

**Không hardcode màu.** Mọi màu dùng trong component/trang phải là một trong các token dưới đây (qua Tailwind class hoặc CSS variable), hoặc — nếu là màu cảm xúc đặc thù cho một trang biểu tượng (Companion/Garden) — phải được khai báo trong Design Spec tương ứng ở `10-reference/`.

## Token theo nhóm ngữ nghĩa

| Nhóm | Token / giá trị | Dùng khi |
|---|---|---|
| **Primary** | `--color-brand-blue: #2563EB` | Hành động chính, link, CTA chính, tiêu đề card khi hover (`.gemos-card-title`) |
| **Secondary** | `--color-brand-violet: #5B8CFF`, `--color-gemos-vision-purple: #7C3AED` | Nhấn phụ, badge, icon phụ, một nửa gradient cảm xúc |
| **Success** | `--color-gemos-success: #10B981` | Trạng thái hoàn thành, xác nhận tích cực (không dùng cho "điểm số") |
| **Garden** | xanh lá tự nhiên (`green-300` → `green-600`), vàng nắng (`rgba(253,224,71,*)`), hồng hoa (`pink-300`), cam-đỏ quả (`red-400`→`orange-500`) | Chỉ dùng trong Khu vườn của bạn — xem chi tiết đầy đủ ở `10-reference/GARDEN_DESIGN_SPEC.md` |
| **Companion** | pearl white (`#FEFEFE`), soft blue (`rgba(37,99,235,.09)`), lavender (`rgba(124,58,237,.08)`), warm sunrise orange (`rgba(255,122,0,.05-.07)`), deep black (`#111827`, chỉ dùng cho gradient text, không dùng làm nền) | Chỉ dùng trong Companion Sanctuary |
| **Premium** | `--color-gemos-gold: #FBBF24` (điểm nhấn), nền `bg-gradient-to-r from-blue-600 to-violet-600` cho CTA Premium | Khu vực `/portal/premium` |
| **Warning** | `--color-gemos-warning: #F59E0B` | Disclaimer, cảnh báo nhẹ (ví dụ disclaimer "Nhà đầu tư" ở Không gian AI) |
| **Neutral** | `--color-brand-gray-50` → `--color-brand-gray-700` | Text phụ, border, background trung tính |
| **Surface** | `#FFFFFF` (card), `border: 1px solid #E2E8F0` | Nền mọi card (`.gemos-gem-card`/`.gemos-glass-card`) |
| **Background** | `--background: #F8FAFC` (mặc định), `.gemos-bg` (#F6F7F9 + grid caro chìm `rgba(17,24,39,0.07)`) | Nền Portal Shell chung |
| **Text** | `--foreground: #111827` (chính), `--color-gemos-text-secondary: #CBD5E1`, `--color-gemos-text-muted: #94A3B8` | Phân cấp chữ chính/phụ/mờ |
| **Danger** | `--color-gemos-danger: #F43F5E` | Xoá, huỷ, lỗi nghiêm trọng |

## Gradient cảm xúc chuẩn (dùng chung, không tự pha trộn khác)

- **Xanh → Tím → Cam**: `#2563EB → #7C3AED → #F97316` — dùng cho mọi dòng chữ "truyền cảm hứng" (subtitle Khu vườn của bạn, các Big Question ở hub hero).
- **Đen → Xanh → Tím → Cam**: `#111827 → #2563EB → #7C3AED → #F97316` — riêng cho tiêu đề "Companion" trong Companion Sanctuary.

## Cấm

- Không dùng neon/màu bão hòa cao (`#00FFxx`, `#FFxx00` thuần).
- Không dùng dark mode nền cho bất kỳ khu vực Portal thông thường nào.
- Không tạo gradient cảm xúc mới ngoài dải xanh–tím–cam trừ khi có Design Reference mới được duyệt.
