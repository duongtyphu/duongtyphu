# Design Doctrine — VO DUONG AI

> "Design Reference is the source of visual truth."

## Nguyên tắc cốt lõi

1. **VO DUONG AI không thiết kế theo từng trang rời rạc.** Mỗi giao diện là một phần của một hệ thống thị giác chung — không phải một trang độc lập được "vẽ lại từ đầu" mỗi lần có yêu cầu mới.

2. **Mỗi thiết kế phải tuân theo Design System chung** đã được ghi lại trong `/design-system/docs/`. Không có ngoại lệ ngầm — nếu một trang cần khác biệt, sự khác biệt đó phải được ghi vào một Design Spec riêng (xem `GARDEN_DESIGN_SPEC.md` làm ví dụ) chứ không phải được ứng biến trong lúc code.

3. **Nếu Founder đã duyệt một Design Reference (ảnh, mockup, concept), Claude Code phải tái hiện gần nhất có thể** — đúng bố cục, đúng tỷ lệ, đúng cảm xúc, đúng nhịp điệu thị giác. Đây không phải là "lấy cảm hứng từ" — đây là tái hiện trung thực.

4. **Không redesign nếu không được yêu cầu.** Một yêu cầu bổ sung nội dung hay sửa lỗi không phải là giấy phép để đổi bố cục, đổi tông màu, hay "cải thiện" thẩm mỹ theo ý riêng.

5. **Không được thay đổi:**
   - Bố cục tổng thể (layout, tỷ lệ cột, vị trí khối chính)
   - Cảm xúc thiết kế (ấm áp / tối giản / sang trọng / bình yên...)
   - Màu sắc chính và hướng gradient
   - Nhịp điệu thị giác (khoảng trắng, mật độ nội dung, thứ tự đọc)

6. **Được phép tối ưu:**
   - Responsive (desktop / tablet / mobile)
   - Accessibility (contrast, focus state, semantic HTML)
   - Performance (animation nhẹ, lazy load, giảm re-render)
   - Chất lượng code (component reuse, tách logic, đặt tên rõ ràng)

## Quy trình khi nhận yêu cầu thiết kế

1. Kiểm tra `/design-system/design-references/` xem đã có ảnh reference đã duyệt cho khu vực này chưa.
2. Nếu có → đọc Design Spec tương ứng trong `/design-system/docs/` (ví dụ `GARDEN_DESIGN_SPEC.md`) và tái hiện đúng theo spec đó.
3. Nếu chưa có → hỏi Founder có reference nào cần tuân theo không, trước khi tự đề xuất bố cục mới.
4. Không bao giờ giả định "chắc Founder muốn đẹp hơn nên mình đổi luôn" — mọi thay đổi thẩm mỹ ngoài phạm vi yêu cầu đều phải được xác nhận trước.

## Phạm vi áp dụng

Doctrine này áp dụng cho **toàn bộ Portal** (`/portal/*`) và mọi trang biểu tượng đặc biệt (Companion Sanctuary, Khu vườn của bạn, Không gian AI, Thư viện tri thức, Premium...). Sidebar, Header và Portal Shell là hạ tầng dùng chung — xem thêm quy tắc riêng trong `COMPONENT_RULES.md`.
