# 07 — Components

Chuẩn hóa mọi khối UI dùng lại được trong Portal. Trước khi viết một component mới, kiểm tra bảng dưới đây — nếu đã có, tái sử dụng; nếu cần biến thể, mở rộng component có sẵn thay vì viết song song.

| Component | File hiện có | Quy tắc |
|---|---|---|
| **Card** | `ui/GemCard.tsx`, `ui/GlassCard.tsx` | Luôn dùng `.gemos-gem-card`/`.gemos-glass-card`. Không tự viết border/shadow/hover riêng. |
| **Button** | `ui/Button.tsx` | Variant `primary`/`secondary` — không tạo style button rời rạc trừ khi Design Spec yêu cầu riêng (CTA đặc biệt Companion Sanctuary). |
| **Input** | Input trong `story/MyStoryBook.tsx` (`WriteNook`), `account/LifeProfileCard.tsx` | `rounded-xl border border-gray-200 bg-gray-50`, focus ring `focus:ring-1 focus:ring-blue-400/50`. Chưa có component Input dùng chung — **cần trích xuất thành `ui/Input.tsx`** (đề xuất bước tiếp theo). |
| **Badge** | `ui/GemBadge.tsx` | Tone: `free`/`premium`/`locked` — không tạo badge màu tùy tiện ngoài các tone đã định nghĩa. |
| **Chip** | Pricing/category chip trong `ToolCard.tsx`, `PricingBadge` trong Không gian AI | `rounded-full px-2.5 py-0.5 text-[10px]/text-xs font-semibold`, nền nhạt màu (`bg-blue-50 text-blue-600` v.v.) |
| **Knowledge Card** | `ResourceCard.tsx`, `ArticleCard` (Không gian AI, News) | Icon/emoji + category tag + title (`.gemos-card-title`) + excerpt — không hiển thị số liệu giả (view count, like count) nếu không có data thật. |
| **Journey Card** | `journey/CurrentJourneyCard.tsx`, `journey/MilestoneCard.tsx`, `journey/Mission30DayCard.tsx` | Luôn có: nhãn giai đoạn, mô tả cảm xúc (không chỉ số liệu), CTA rõ ràng nếu có bước tiếp theo. |
| **Garden Leaf** | Leaf chip trong `garden/GardenTreeVisual.tsx` (`.garden-leaf-chip`) | Icon Lucide + label hành động, `garden-leaf-sway` animation, glass nhẹ (`bg-white/85 backdrop-blur-sm`). Không dùng ảnh lá thật — luôn là UI chip. |
| **Timeline** | `journey/GrowthPathTimeline.tsx`, Companion Timeline (`companion/page.tsx`), Growth History (`khu-vuon-cua-ban/page.tsx`) | Dot + line dọc bên trái (`border-l`), mỗi mốc có nhãn + mô tả. Màu dot theo trạng thái (xanh = đã qua/hiện tại, xám = chưa tới). |
| **Section** | Mọi `<section>` trong Portal | Heading (`Sub Heading`/`Title` scale) + nội dung — không lồng section quá 2 cấp. |
| **Companion Quote** | Companion Constitution pairs, "Letter from Companion" | `italic`, giọng văn ấm (xem `03-typography/README.md` mục Companion Voice), không CTA đi kèm trực tiếp trong khối quote. |
| **Reflection Card** | `story/MyStoryBook.tsx` (`WriteNook`), Reflection section (`hanh-trinh-cua-toi/page.tsx`) | Câu hỏi mở + khoảng trống để trả lời/textarea, giọng văn mời gọi không ép buộc. |
| **Progress Ring** | `garden/GardenProgressRing.tsx` | SVG stroke-dasharray, gradient xanh lá→vàng, không dùng số % kiểu game (luôn kèm emoji/label giai đoạn). |
| **Companion Guide** | `CompanionGuide.tsx` | Box tím nhạt + icon + message + action link — dùng ở đầu mọi hub Portal thường. |

## Quy tắc chung

1. Component chỉ phục vụ một trang đặc biệt (Garden, Sanctuary) đặt trong thư mục con riêng (`components/portal/garden/`, `components/portal/sanctuary/`) — không trộn với component dùng chung trong `components/portal/ui/`.
2. Mọi card mới phải có cả hai hiệu ứng chuẩn: hover nổi (`.gemos-gem-card`) và đổi màu tiêu đề khi hover (`.gemos-card-title`) — trừ khi Design Spec của trang đặc biệt override rõ ràng.
3. Không tạo biến thể màu "một lần dùng" cho component dùng chung — nếu cần màu mới, thêm vào `02-colors/` trước.
