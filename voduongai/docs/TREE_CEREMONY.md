# Tree Ceremony (trong khung Living Ceremonies)

Sprint 17.0 — The Living Ceremonies. Tài liệu này định vị Tree
Ceremony (đã định nghĩa triết lý ở Sprint 16.1) trong khung
`docs/CEREMONY_FRAMEWORK.md`. Nội dung gốc vẫn ở
`docs/TREE_GROWTH_RULES.md` (mục "Tree Ceremony") — tài liệu này không
lặp lại, chỉ ánh xạ.

## Khoảnh khắc

Khi một người dùng chọn gỡ một ký ức gắn với chiếc lá của mình tại The
Tree of Beginnings (Sprint 16.1), khoảnh khắc đó không nên được xử lý
như một hành động "xóa dữ liệu" thông thường (xác nhận → biến mất).

## Bốn nhịp (thiết kế, chưa code)

- **Opening**: không hỏi "Bạn có chắc muốn xóa?" theo giọng hệ thống —
  thay vào đó một câu giữ được sự trân trọng, ví dụ: "Bạn muốn để
  chiếc lá này trở về với thân cây?"
- **Reflection**: hiển thị lại ngắn gọn chiếc lá đó đại diện cho điều
  gì, để người dùng chắc chắn đây là điều họ muốn.
- **Companion**: không can thiệp quyết định (đúng nguyên tắc Memory
  Ownership, Sprint 13.5) — chỉ hiện diện.
- **Closing**: hiệu ứng chiếc lá bay lên, tan thành ánh sáng, trở về
  thân cây — không phải một thông báo "Đã xóa thành công."

## Boundary

Người dùng luôn có quyền hủy ở Opening. Không có cảnh báo kiểu "hành
động này không thể hoàn tác" bằng giọng đe doạ — chỉ cần rõ ràng, nhẹ
nhàng.

## Trạng thái

Chỉ ở mức thiết kế trong Sprint 17.0 — chưa code (Tree of Beginnings
bản thân cũng chưa có UI, theo `docs/THE_TREE_OF_BEGINNINGS.md`).
