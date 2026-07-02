# 10 — Design References

**Design Reference là Visual Truth.** (Xem thêm bản mở rộng: **VISUAL DNA SYSTEM™** tại `voduongai/design-system/visual-dna/VISUAL_DNA.md` — manifesto chính thức, RECREATE MODE, Design Lock, ngưỡng chất lượng 95–99%.)

Khi Founder đã duyệt một ảnh/mockup cho một khu vực cụ thể ("DUYỆT"), ảnh đó là sự thật thị giác cuối cùng cho khu vực đó — không được tự ý redesign, không được thay đổi bố cục/màu/tỷ lệ/vị trí visual chính chỉ vì "thấy hợp lý hơn".

## Vị trí lưu ảnh gốc (canonical — từ Visual DNA System)

Ảnh reference (file `.png`/`.jpg`) được lưu ở: `voduongai/design-system/visual-dna/references/<khu-vực>/<khu-vực>-reference-v<số>/` (không lưu ảnh binary trong `src/`). Thư mục cũ `voduongai/design-system/design-references/` được giữ nguyên làm lưu trữ ban đầu — mọi reference mới từ nay dùng cấu trúc `visual-dna/references/` theo Image Import Workflow. Thư mục này (`src/design-system/10-reference/`) chứa **Design Spec bằng văn bản** mô tả từng reference — mỗi ảnh có một Design Spec tương ứng.

## Danh sách Design Spec hiện có

| Khu vực | Ảnh reference | Design Spec |
|---|---|---|
| Khu vườn của bạn | *(chưa import — chờ Founder gửi kèm "DUYỆT")* | [`GARDEN_DESIGN_SPEC.md`](./GARDEN_DESIGN_SPEC.md) |
| Companion Sanctuary | *(chưa import)* | *(chưa có Design Spec riêng — hiện áp dụng trực tiếp theo brief gốc, cần bổ sung spec khi có ảnh)* |
| Không gian AI | *(chưa import)* | *(chưa có)* |
| Thư viện tri thức | *(chưa import)* | *(chưa có)* |
| Premium | *(chưa import)* | *(chưa có)* |

## Quy trình khi có ảnh reference mới (Image Import Workflow)

Khi Founder gửi ảnh và nói **"DUYỆT"**:

1. Lưu ảnh vào `voduongai/design-system/visual-dna/references/<khu-vực>/<khu-vực>-reference-v<số>/`.
2. Đặt tên version theo chuẩn `<khu-vực>-reference-v<số>`.
3. Tạo README cho version đó (Ý tưởng / Màu / Layout / Typography / Animation / Feeling — không đoán).
4. Link Reference — cập nhật bảng trên và Design Spec tương ứng trong thư mục này.
5. Build UI theo ảnh ở **RECREATE MODE** (clone giao diện, không redesign) — xem chi tiết trong `VISUAL_DNA.md`.

## Được phép cải thiện dù đã có reference

Responsive, accessibility, performance, animation nhẹ (theo `06-motion/`), component reuse (theo `07-components/`) — miễn kết quả hiển thị giữ đúng tinh thần reference.

## Không được phép

Tự sáng tạo lại bố cục / đổi cảm xúc thiết kế / đổi tỷ lệ chính / đổi hướng màu / đổi vị trí visual chính / dùng lại style cũ khi đã có reference mới thay thế.
