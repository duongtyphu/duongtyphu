# 05 — Icons

## Bộ icon chuẩn

**Lucide React** (`lucide-react`) — đây là bộ icon duy nhất được dùng trong toàn bộ Portal. Không trộn thêm bộ icon khác (Heroicons, Font Awesome, custom SVG icon set...) trừ khi Design Reference yêu cầu rõ ràng cho một khu vực cụ thể.

## Quy tắc sử dụng

1. **Stroke mảnh, đồng bộ** — dùng stroke-width mặc định của Lucide (2), không tự chỉnh stroke-width lẻ tẻ trừ khi có lý do thị giác rõ ràng (ví dụ icon rất nhỏ cần stroke đậm hơn để không bị mờ).
2. **Kích thước chuẩn theo ngữ cảnh**:
   - `h-3.5 w-3.5` – icon trong badge/chip nhỏ
   - `h-4 w-4` – icon trong card, sidebar, button phụ
   - `h-5 w-5` – icon trong hero, icon chính của section
   - `h-6 w-6` trở lên – chỉ dùng cho icon minh họa lớn (ví dụ Logo Evolution trong Companion Sanctuary)
3. **Không tô màu icon bằng màu bão hòa cao.** Icon dùng cùng bảng màu ở `02-colors/` (thường `text-blue-600`, `text-violet-600`, `text-green-600`, `text-gray-400` cho icon phụ/mờ).
4. **Icon không thay thế nội dung chữ.** Icon luôn đi kèm label — không dùng icon đơn độc làm CTA trừ khi có `aria-label` rõ ràng cho accessibility.
5. **Không dùng icon 3D, icon nhiều màu (multi-color emoji-style icon), hoặc icon động (animated icon)** trong bộ icon chuẩn — emoji (🌿🌱📅) được phép dùng riêng cho khu vực Khu vườn của bạn như một phần ngôn ngữ "khu vườn", xem `10-reference/GARDEN_DESIGN_SPEC.md`, nhưng không lan sang các khu vực khác của Portal.

## Icon theo ngữ cảnh (tham chiếu nhanh)

| Ngữ cảnh | Icon Lucide đang dùng |
|---|---|
| Trang chủ Portal | `Home` |
| Không gian AI | `Cpu` |
| Thư viện tri thức | `Library` |
| Nhật ký học tập | `Notebook` |
| Học viện | `GraduationCap` |
| Dự án & Cơ hội | `TrendingUp` |
| Cộng đồng | `Users` |
| Companion | `Sparkles` |
| Hành trình của tôi | `Compass` |
| Khu vườn của bạn | `Leaf` |
| Premium | `Crown` |

Xem đầy đủ trong `src/components/portal/PortalSidebar.tsx` (`navIcons`).
