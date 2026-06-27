# Companion Assets

Tài sản hình ảnh cho Companion ("Người Đồng Hành"). Nguồn chuẩn là
Master Design tại `docs/design/companion/Companion_Master_V1.png` —
xem `docs/design/companion/Companion_Guidelines.md` trước khi thêm/sửa
bất kỳ asset nào ở đây.

## Trạng thái hiện tại

Chưa có asset chính thức (PNG/SVG đã tách lớp, animation file) được
Product Team xuất riêng từ Master Design. Vì vậy thư mục `placeholder/`
chứa một **CSS/SVG placeholder tạm thời** mô phỏng viên ngọc/tinh thể
sống, giữ đúng DNA + Identity (hai chữ V) + tỷ lệ + màu sắc theo
`Companion_Guidelines.md`, giảm hiệu ứng glow phức tạp để nhẹ và dễ
render.

Khi Product Team xuất được asset chính thức (SVG layer riêng, Lottie,
hoặc ảnh PNG cắt nền), thay nội dung `placeholder/` bằng asset chính
thức — không đổi cấu trúc thư mục để các component import không phải
sửa.

## Cấu trúc

```
src/assets/companion/
  README.md
  placeholder/
    CompanionCrystal.tsx   ← SVG placeholder component (viên ngọc + 2 chữ V)
  states/
    state-visuals.ts       ← mô tả glow/halo theo từng trạng thái, dùng bởi CompanionCrystal
```
