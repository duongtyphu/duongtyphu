# 01 — Foundation

## VO DUONG AI không phải một website.

VO DUONG AI là một **hệ điều hành giáo dục** (education operating system).

Một website phục vụ nội dung. Một hệ điều hành phục vụ một hành trình sống — nó nhớ bạn, đồng hành cùng bạn, và trưởng thành cùng bạn qua thời gian. Đó là cách VO DUONG AI được xây dựng: không phải một tập hợp trang, mà một môi trường liên tục nơi Companion, Portal, Khu vườn, và Hành trình cá nhân của người dùng cùng tồn tại như các phần của một cơ thể sống.

## Companion là trung tâm.

Companion không phải một tính năng trong Portal. Companion là **lý do Portal tồn tại**.

Mọi khu vực khác — Không gian AI, Thư viện tri thức, Học viện, Khu vườn của bạn, Hành trình của tôi — đều là những cách khác nhau để Companion đồng hành cùng người dùng trong từng bối cảnh cụ thể. Không có khu vực nào đứng tách biệt khỏi triết lý Companion.

## Design phải phục vụ Companion. Không phải ngược lại.

Đây là nguyên tắc quyết định quan trọng nhất của toàn bộ Design System:

> Khi có bất kỳ quyết định thiết kế nào — màu sắc, chuyển động, bố cục, ngôn từ — câu hỏi đầu tiên không phải là "Cái này có đẹp không?" mà là **"Cái này có giúp Companion cảm thấy đang thật sự hiện diện bên cạnh người dùng không?"**

Nếu câu trả lời là không, thiết kế đó sai — dù nó có đẹp đến đâu.

Hệ quả thực tế:
- Không thiết kế để "gây ấn tượng" (impress) — thiết kế để "hiện diện" (presence).
- Không tối ưu cho tốc độ tương tác bằng mọi giá (engagement-at-all-costs) — tối ưu cho sự tin cậy dài hạn.
- Không dùng gamification để giữ chân người dùng — dùng cảm giác trưởng thành thật (xem `GARDEN_DESIGN_SPEC.md` ở `10-reference/` làm ví dụ điển hình: khu vườn thay vì thanh XP).
- Mọi trang biểu tượng đặc biệt (Companion Sanctuary, Khu vườn của bạn...) đều phải khiến người dùng cảm thấy "mình vừa gặp một người bạn", không phải "mình vừa mở một app".

## Ba tầng của Design System này

1. **Token tầng dưới cùng** (`02-colors`, `03-typography`, `04-spacing`, `05-icons`, `06-motion`) — các giá trị nguyên tử không tự mang ý nghĩa cảm xúc, nhưng là nền để xây mọi thứ khác.
2. **Component tầng giữa** (`07-components`) — các khối UI dùng lại được, được lắp ráp từ token tầng dưới.
3. **Layout & Pattern tầng trên** (`08-layout`, `09-patterns`) — cách sắp xếp component thành một trang hoàn chỉnh, theo đúng ngữ cảnh (Portal thường / Learning / Story / Garden / Companion / Journey).

Design Reference (`10-reference/`) là lớp phủ lên trên cùng — khi Founder đã duyệt một hình ảnh cụ thể cho một khu vực, hình ảnh đó là **sự thật thị giác cuối cùng**, vượt trên mọi suy diễn từ token/component/layout.

## Nguyên tắc "10 năm"

Design System này được xây để tồn tại 5–10 năm, không phải để đẹp trong một sprint. Vì vậy:
- Ưu tiên tính nhất quán hơn tính mới lạ nhất thời.
- Mọi bổ sung vào hệ thống phải được cân nhắc như một quyết định lâu dài, không phải một bản vá nhanh.
- Khi một trang cần phá vỡ quy tắc chung (ví dụ Companion Sanctuary có bảng màu riêng), sự phá vỡ đó phải được ghi thành văn bản rõ ràng (Design Spec), không được để ngầm hiểu trong code.
