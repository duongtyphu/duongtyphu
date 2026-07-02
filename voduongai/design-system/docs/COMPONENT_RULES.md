# Component Rules — VO DUONG AI Portal

## Card

- Mọi card trong Portal phải dùng chung hệ class `.gemos-gem-card` / `.gemos-glass-card` (định nghĩa trong `src/app/globals.css`) — không tự viết lại `border`/`shadow`/`hover` riêng lẻ cho từng trang.
- Tiêu đề bên trong card muốn đổi màu khi hover phải dùng class `.gemos-card-title`.
- Không dùng lại các class tàn dư theme tối cũ (`bg-white/[0.0x]`, `border-white/[0.0x]`, `card-shine` kết hợp `hover:shadow-black/30`) trong bất kỳ trang Portal nào — nếu gặp trong code cũ, coi là nợ kỹ thuật cần dọn khi đụng tới file đó.

## Button

- Dùng component `Button` dùng chung (`src/components/portal/ui/Button.tsx`) với variant `primary`/`secondary` — không tự tạo button style rời rạc trừ khi có Design Spec yêu cầu riêng (ví dụ CTA đặc biệt trong Companion Sanctuary).

## Sidebar

- **Không tự ý đổi** cấu trúc, thứ tự nhóm, hoặc style của Sidebar (`PortalSidebar.tsx`, `src/lib/portal/hubs.ts`) trừ khi được yêu cầu rõ ràng thêm/sửa một mục menu cụ thể.
- Khi thêm mục menu mới, chỉ thêm đúng vị trí được chỉ định — không sắp xếp lại các mục khác.

## Header

- **Không tự ý đổi** `PortalHeader.tsx` khi làm việc trên nội dung trang. Header là hạ tầng dùng chung.

## Trang đặc biệt (Sanctuary-style)

Các trang được xếp vào nhóm "trang biểu tượng" (Companion, Khu vườn của bạn, và các trang tương lai cùng loại):

- Chỉ được đổi **Main Content** và **Footer riêng của trang đó** — Sidebar/Header/Portal Shell giữ nguyên.
- Reference đặc biệt (Design Reference đã duyệt) **có quyền override** style chung của Portal — nhưng chỉ trong phạm vi Main Content/Footer được chỉ định trong Design Spec tương ứng, không được lan ra ảnh hưởng các trang khác.
- Mọi override phải được ghi lại thành một Design Spec riêng trong `/design-system/docs/` (ví dụ `GARDEN_DESIGN_SPEC.md`) để lần sau không cần suy đoán lại.

## Khi tạo component mới

1. Kiểm tra xem đã có component tương tự trong `src/components/portal/` chưa trước khi tạo mới.
2. Nếu component chỉ phục vụ một trang đặc biệt (ví dụ `GardenTreeVisual`), đặt trong thư mục con riêng (`src/components/portal/garden/`) — không trộn lẫn với component dùng chung.
3. Nếu component có khả năng dùng lại ở nhiều nơi, đặt trong `src/components/portal/ui/`.
