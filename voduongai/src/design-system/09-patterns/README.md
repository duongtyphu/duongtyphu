# 09 — Patterns

Các pattern tái sử dụng ở cấp độ hành vi/nội dung, không phải component hay layout đơn lẻ — cách Portal xử lý những tình huống lặp lại.

## Empty State

- Không bao giờ hiển thị màn hình trắng hoặc thông báo lỗi khô khan khi chưa có dữ liệu.
- Giọng văn mời gọi, không phán xét: xem `LivingGardenCard.tsx` (`garden.isEmpty`) — "Khu vườn của bạn đang chờ hạt giống đầu tiên" thay vì "Không có dữ liệu".
- Luôn kèm CTA cụ thể để bắt đầu (ví dụ "Viết Reflection đầu tiên", "Bắt đầu hành trình").

## Loading State

- Dùng skeleton nhẹ (`animate-pulse rounded-2xl bg-gray-50`) thay vì spinner toàn màn hình.
- Không chặn tương tác toàn trang khi chỉ một phần nội dung đang tải.

## CTA Pattern

- CTA chính: nút đặc `bg-blue-600 text-white` hoặc gradient `from-blue-600 to-violet-600`.
- CTA phụ: viền `border-gray-200`, hover `hover:border-blue-300 hover:text-blue-600`.
- Trang biểu tượng đặc biệt (Companion Sanctuary, Khu vườn của bạn) **không có CTA bán hàng** — Companion Sanctuary không có CTA nào ở phần thân, chỉ có link điều hướng nhẹ.
- Không bao giờ đặt CTA Premium vào Companion Sanctuary hoặc Khu vườn của bạn — hai trang này không phải nơi bán hàng.

## Progressive Disclosure (tiết lộ dần)

- Trang tổng quan (hub) hiển thị tóm tắt + CTA "Xem thêm/Xem chi tiết" — không nhồi toàn bộ nội dung con vào trang cha (ví dụ: `GardenWidget` ở trang chủ chỉ tóm tắt, không render toàn bộ `GardenTreeVisual` với lá hành động).
- Widget preview luôn dẫn về đúng route chi tiết tương ứng.

## Anti-Gamification Pattern

- Không bao giờ dùng: XP, Point, Coin, Gem (như đơn vị điểm), Diamond, Reward, Badge, Level Up, Achievement, Score.
- Thay bằng ngôn ngữ cảm xúc cụ thể theo ngữ cảnh: "Một chiếc lá mới đã nở", "Cây của bạn vừa lớn thêm", "Bạn vừa chăm sóc khu vườn" — xem đầy đủ trong `10-reference/GARDEN_DESIGN_SPEC.md`.
- Progress luôn được trình bày như một hành trình tự nhiên (vòng tiến độ mềm, timeline, giai đoạn có tên riêng), không phải thanh XP/level number.

## Disclaimer Pattern

- Nội dung có tính rủi ro (ví dụ khu vực "Nhà đầu tư" trong Không gian AI) luôn có khối disclaimer màu amber (`bg-amber-50 border-amber-100`) đặt ngay dưới Companion Guide, trước khi vào nội dung chính.

## Premium Gating Pattern

- Nội dung Premium không bao giờ hiển thị chi tiết ở khu vực miễn phí — chỉ hiện CTA dạng khóa: "Tham gia Premium để mở khóa lộ trình học chuyên sâu", dẫn về `/portal/premium` hoặc `/portal/checkout`.
- Không lộ tên chương trình cụ thể (V-Solo, V-Scale, Masterclass...) ở khu vực miễn phí ngoài trang Premium.
