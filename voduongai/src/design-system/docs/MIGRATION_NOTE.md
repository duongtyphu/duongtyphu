# Migration Note — từ `voduongai/design-system/` sang `src/design-system/`

## Bối cảnh

Sprint trước đã tạo `voduongai/design-system/` (thư mục gốc dự án) với cấu trúc:

```
voduongai/design-system/
├── design-references/   (README + chỗ chờ import ảnh)
├── docs/
│   ├── DESIGN_DOCTRINE.md
│   ├── DESIGN_REFERENCE_GUIDE.md
│   ├── GARDEN_DESIGN_SPEC.md
│   ├── COLOR_SYSTEM.md
│   └── COMPONENT_RULES.md
├── motion/
│   └── MOTION_SYSTEM.md
└── assets/
```

Sprint này ("VO DUONG AI Design System™ v1.0") yêu cầu cấu trúc chính thức và đầy đủ hơn tại `src/design-system/`, mở rộng thêm Typography, Spacing, Icons, Layout, Patterns — những phần chưa có ở bản đầu.

## Ánh xạ nội dung

| Nội dung cũ | Vị trí mới |
|---|---|
| `DESIGN_DOCTRINE.md` | `01-foundation/README.md` (mở rộng thêm triết lý "OS giáo dục") + `docs/DOCTRINE.md` (bản rút gọn quy trình) |
| `COLOR_SYSTEM.md` | `02-colors/README.md` (giữ nguyên nội dung, bổ sung bảng Primary/Secondary/Success/Warning/Neutral/Surface/Background/Text đầy đủ theo yêu cầu sprint này) |
| `MOTION_SYSTEM.md` | `06-motion/README.md` (giữ nguyên bảng hiệu ứng, bổ sung phần "ý nghĩa cảm xúc" cho từng hiệu ứng) |
| `COMPONENT_RULES.md` | `07-components/README.md` (mở rộng thành bảng đầy đủ Card/Button/Input/Badge/Chip/Knowledge Card/Journey Card/Garden Leaf/Timeline/Section/Companion Quote/Reflection Card) |
| `DESIGN_REFERENCE_GUIDE.md` | `10-reference/README.md` |
| `GARDEN_DESIGN_SPEC.md` | `10-reference/GARDEN_DESIGN_SPEC.md` (copy nguyên văn, là Design Spec đầu tiên trong hệ thống mới) |
| `design-references/` (ảnh gốc) | **Giữ nguyên vị trí** ở `voduongai/design-system/design-references/` — không di chuyển file ảnh binary vào `src/` |

## Trạng thái thư mục cũ

`voduongai/design-system/` **được giữ nguyên, không xóa** — vẫn là nơi lưu trữ ảnh Design Reference gốc (`design-references/`). Các file `.md` trong đó không còn được cập nhật tiếp — mọi cập nhật tài liệu mới từ nay áp dụng vào `src/design-system/`.

## Vì sao đặt ở `src/` thay vì gốc repo

Đặt trong `src/` giúp Design System nằm cùng cây thư mục với code Next.js thực tế (`src/app/`, `src/components/`, `src/data/`, `src/lib/`) — dễ dàng tham chiếu chéo bằng đường dẫn tương đối khi cần, và rõ ràng đây là một phần của source code dự án, không phải tài liệu quản lý dự án chung chung (khác với các file `.md` ở gốc repo như `README.md`, `BRAND_VOICE_GUIDE.md`).
