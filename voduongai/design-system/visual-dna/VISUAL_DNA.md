# VISUAL DNA SYSTEM™

> VO DUONG AI không còn là một Website. Đây là một Product Design Language — được xây theo cách Apple xây HIG (Human Interface Guidelines): một bộ quy tắc thị giác sống, dùng chung, và tồn tại lâu dài hơn bất kỳ sprint đơn lẻ nào.

## Nguyên tắc tối thượng

**Visual DNA là nguồn sự thật duy nhất về thiết kế.**

- **Founder duyệt = Official.** Một khi Founder nói "DUYỆT" cho một ảnh/thiết kế, ảnh đó ngay lập tức trở thành Official Visual Reference — không còn là gợi ý, không còn là "cảm hứng", mà là sự thật thị giác bắt buộc.
- **Claude Code không được redesign.** Không được sáng tạo lại bố cục, không được "cải thiện" theo gu riêng, không được tưởng tượng thêm chi tiết không có trong reference.
- **Claude Code chỉ được:** code lại (chuyển reference thành component thật), responsive, animation (theo `MOTION_SYSTEM.md`), performance, accessibility.

## RECREATE MODE, không phải CREATIVE MODE

Khi có một Official Visual Reference, mọi thao tác code phải ở **RECREATE MODE**:

| RECREATE MODE (bắt buộc) | CREATIVE MODE (cấm khi đã có reference) |
|---|---|
| Clone giao diện từ ảnh | Tự nghĩ ra bố cục mới |
| Giữ nguyên tỷ lệ, vị trí, màu sắc | Đổi tỷ lệ "cho đẹp hơn" |
| Chỉ thêm phần kỹ thuật không đổi phần nhìn (responsive/a11y/perf/animation) | Thêm chi tiết trang trí không có trong ảnh |
| Khi không chắc một chi tiết trong ảnh, hỏi lại Founder | Đoán và tự quyết định |

## Design Lock

Một khi Reference đã được duyệt → **LOCK**.

- Không được đổi, trừ khi Founder yêu cầu rõ ràng một bản cập nhật mới (sẽ trở thành version tiếp theo, ví dụ `garden-reference-v2`).
- Version cũ không bị xóa — giữ lại làm lịch sử quyết định thiết kế.

## Ngưỡng chất lượng thị giác

Mục tiêu: **95–99% giống Reference.**

- Nếu khoảng cách giữa UI đã code và Reference vượt quá 5%, tiếp tục chỉnh sửa cho tới khi đạt ngưỡng.
- "Giống" nghĩa là: đúng bố cục, đúng tỷ lệ, đúng vị trí các khối chính, đúng tông màu, đúng cảm xúc — không phải giống pixel-by-pixel tuyệt đối (vì UI thật cần responsive, reference thường chỉ là một kích thước màn hình).

## Image Import Workflow

Khi Founder gửi ảnh và nói **"DUYỆT"**, thực hiện đúng 5 bước theo thứ tự — không bỏ bước, không tự ý đổi thứ tự:

1. **Lưu ảnh** vào `design-system/visual-dna/references/<khu-vực>/` (xem cấu trúc thư mục bên dưới).
2. **Đặt tên version** theo chuẩn `<khu-vực>-reference-v<số>` (ví dụ `garden-reference-v1`, `garden-reference-v2` nếu có bản cập nhật sau).
3. **Tạo README** cho version đó, mô tả đầy đủ theo mục "Nội dung bắt buộc của mỗi Reference README" bên dưới — không đoán, chỉ mô tả những gì thấy được trong ảnh và những gì Founder xác nhận bằng lời.
4. **Link Reference** — cập nhật `src/design-system/10-reference/README.md` (bảng Design Spec) và Design Spec liên quan để trỏ về version reference mới nhất.
5. **Build UI theo ảnh** — ở RECREATE MODE, không tự thay đổi.

## Nội dung bắt buộc của mỗi Reference README

Mỗi Reference (mỗi version) phải có README mô tả rõ 6 mục sau — không được để trống, không được đoán khi chưa rõ:

- **Ý tưởng** — reference này đại diện cho khái niệm/khu vực nào, thông điệp cốt lõi là gì.
- **Màu** — bảng màu chính xuất hiện trong ảnh (mã hex nếu xác định được, hoặc mô tả tông màu).
- **Layout** — bố cục chia vùng như thế nào (số cột, tỷ lệ, vị trí khối chính).
- **Typography** — kiểu chữ, cỡ chữ tương đối, cách nhấn (bold/italic/gradient) xuất hiện trong ảnh.
- **Animation** — nếu ảnh tĩnh, ghi rõ animation nào được Founder mô tả bằng lời đi kèm ảnh (không tự suy đoán animation từ ảnh tĩnh).
- **Feeling** — cảm xúc tổng thể ảnh truyền tải (ấm áp / bình yên / sang trọng / năng động...).

## Cấu trúc thư mục Visual DNA

```
design-system/visual-dna/
├── VISUAL_DNA.md          (file này — manifesto)
├── references/            Reference đã duyệt, tổ chức theo khu vực + version
│   └── <khu-vực>/<khu-vực>-reference-v<số>/  (ảnh + README.md)
├── assets/                Asset thị giác dùng chung, không thuộc riêng một khu vực
├── illustrations/         Minh họa dùng lại được (không phải ảnh chụp/AI-gen thật)
├── backgrounds/           Mesh gradient, texture nền, pattern nền
├── trees/                 Asset liên quan tới hình ảnh cây (Khu vườn của bạn)
├── lights/                Asset ánh sáng — sunray, glow, halo, sparkle
├── leaves/                Asset lá — leaf chip, leaf icon, falling leaf
├── garden/                Reference + asset riêng cho Khu vườn của bạn
├── companion/             Reference + asset riêng cho Companion Sanctuary
├── journey/               Reference + asset riêng cho Hành trình của tôi
├── premium/               Reference + asset riêng cho Premium
└── library/               Reference + asset riêng cho Thư viện tri thức
```

## Asset Library — quy tắc đặt tên

Mỗi asset có một tên chuẩn duy nhất, không tạo trùng:

| Loại asset | Tên chuẩn | Ví dụ |
|---|---|---|
| Cây | `tree-<giai-đoạn>` | `tree-seed`, `tree-mature`, `tree-blooming` |
| Lá | `leaf-<loại-hành-động>` | `leaf-read`, `leaf-practice`, `leaf-share` |
| Ánh sáng | `light-<loại>` | `light-sunray`, `light-glow`, `light-halo`, `light-sparkle` |
| Nền | `background-<khu-vực>-<biến-thể>` | `background-garden-morning`, `background-companion-mesh` |
| Halo | `halo-<ngữ-cảnh>` | `halo-companion-logo` |
| Constellation | `constellation-<ngữ-cảnh>` | `constellation-genome` |
| Gradient | `gradient-<tên-dải-màu>` | `gradient-blue-violet-orange` |
| Glass | `glass-<độ-đậm>` | `glass-light`, `glass-heavy` |
| Blur | `blur-<mức-độ>` | `blur-soft`, `blur-strong` |
| Noise | `noise-<mật-độ>` | `noise-subtle` |
| Shadow | `shadow-<ngữ-cảnh>` | `shadow-card-hover`, `shadow-tree-canopy` |

Trước khi tạo asset mới, tìm trong bảng trên và trong thư mục tương ứng — nếu đã có tên gần giống, dùng lại hoặc mở rộng, không tạo bản sao với tên khác.

## Phạm vi áp dụng lâu dài

Companion, Garden (Khu vườn của bạn), Library (Thư viện tri thức), Premium, Journey (Hành trình của tôi), AI Space (Không gian AI) — tất cả sẽ dùng chung Visual DNA System này khi có Reference chính thức. Đây là nền móng cho 10 năm tiếp theo của VO DUONG AI, không phải giải pháp cho một sprint.
