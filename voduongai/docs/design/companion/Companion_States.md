# Companion States — Master Design V1.0

Master Design thể hiện 5 trạng thái thị giác chính thức của Companion.
Đây là nguồn chuẩn cho `src/lib/portal/companion/companion-identity.ts`
và mọi implementation UI sau này — không tự thêm/đổi trạng thái mà
không có quyết định Product Team.

| Trạng thái | Tên hiển thị | Câu nói | Sắc thái thị giác |
|---|---|---|---|
| `idle` | Lặng yên | "Mình đang ở đây." | Glow dịu, breathing chậm, không có chuyển động hướng nào nổi bật |
| `listening` | Lắng nghe | "Mình đang lắng nghe." | Halo hơi sáng hơn, glow hướng vào trong, tĩnh hơn idle |
| `thinking` | Suy nghĩ | "Mình đang suy nghĩ." | Glow nhẹ chuyển động xoay/nhấp nháy chậm quanh thân ngọc |
| `encouraging` | Truyền cảm hứng | "Mình có một điều muốn chia sẻ." | V đỉnh sáng rõ hơn, glow vàng kim ấm hơn |
| `celebrating` | Chúc mừng | "Mình rất vui vì bạn đã tiến thêm một bước." | Glow bừng sáng nhẹ toàn thân ngọc, halo rung nhẹ rồi lắng lại |

## Nguyên tắc chuyển trạng thái

- Mỗi trạng thái chỉ thay đổi **glow, halo, nhịp breathing** — không
  bao giờ đổi hình dạng, màu thân ngọc, hoặc vị trí hai chữ "V".
- Chuyển động giữa các trạng thái phải mượt, không giật, không gây chú
  ý quá mức (đối chiếu `Companion_Motion.md`).
- Không trạng thái nào dùng màu đỏ, biểu tượng cảnh báo, hoặc badge số
  — Companion không phải hệ thống thông báo.
