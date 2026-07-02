# Trees

Asset hình ảnh cây theo từng Garden Growth Stage (Hạt giống → Mầm non → Cây non → Cây trưởng thành → Cây nở hoa → Cây kết trái → Khu vườn lan tỏa) — xem `src/design-system/10-reference/GARDEN_DESIGN_SPEC.md`.

Đặt tên: `tree-<giai-đoạn>` (ví dụ `tree-seed`, `tree-sprout`, `tree-mature`, `tree-blooming`, `tree-fruiting`, `tree-spreading`).

Hiện tại cây đang được dựng bằng gradient blob CSS trong `GardenTreeVisual.tsx` (không dùng ảnh) — nếu Founder duyệt một reference hình cây thật (theo Master Prompt ảnh chân thực), lưu vào đây và cập nhật component theo RECREATE MODE.
