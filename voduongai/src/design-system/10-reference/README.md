# 10 — Design References

**Design Reference là Visual Truth.**

Khi Founder đã duyệt một ảnh/mockup cho một khu vực cụ thể, ảnh đó là sự thật thị giác cuối cùng cho khu vực đó — không được tự ý redesign, không được thay đổi bố cục/màu/tỷ lệ/vị trí visual chính chỉ vì "thấy hợp lý hơn".

## Vị trí lưu ảnh gốc

Ảnh reference (file `.png`/`.jpg`) được lưu ở thư mục gốc dự án: `voduongai/design-system/design-references/` (không lưu ảnh binary trong `src/`). Thư mục này (`src/design-system/10-reference/`) chứa **Design Spec bằng văn bản** mô tả từng reference — mỗi ảnh có một Design Spec tương ứng.

## Danh sách Design Spec hiện có

| Khu vực | Ảnh reference (chưa import) | Design Spec |
|---|---|---|
| Khu vườn của bạn | `garden-reference-v1.png` | [`GARDEN_DESIGN_SPEC.md`](./GARDEN_DESIGN_SPEC.md) |
| Companion Sanctuary | `companion-reference-v1.png` | *(chưa có Design Spec riêng — hiện áp dụng trực tiếp theo brief gốc, cần bổ sung spec khi có ảnh)* |
| Không gian AI | `ai-space-reference-v1.png` | *(chưa có)* |
| Thư viện tri thức | `library-reference-v1.png` | *(chưa có)* |
| Premium | `premium-reference-v1.png` | *(chưa có)* |

## Quy trình khi có ảnh reference mới

1. Founder gửi ảnh đã duyệt.
2. Lưu vào `voduongai/design-system/design-references/` theo tên chuẩn `<khu-vực>-reference-v<số>.png`.
3. Viết (hoặc cập nhật) Design Spec tương ứng trong thư mục này (`src/design-system/10-reference/`) — mô tả bằng văn bản: bố cục, tỷ lệ, vị trí visual chính, màu sắc, cảm xúc bắt buộc, và những gì cấm.
4. Từ đó, mọi thay đổi UI cho khu vực này phải đối chiếu với cả ảnh gốc và Design Spec — không suy diễn lại từ đầu.

## Được phép cải thiện dù đã có reference

Responsive, accessibility, performance, animation nhẹ (theo `06-motion/`), component reuse (theo `07-components/`) — miễn kết quả hiển thị giữ đúng tinh thần reference.

## Không được phép

Tự sáng tạo lại bố cục / đổi cảm xúc thiết kế / đổi tỷ lệ chính / đổi hướng màu / đổi vị trí visual chính / dùng lại style cũ khi đã có reference mới thay thế.
