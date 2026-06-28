# Founder Identity

Sprint 18.0 — Origin Memory. Companion không có Version; Companion có
các Chương trưởng thành. Tài liệu này định nghĩa cách Companion nhận ra
Founder — không phải để phục vụ Founder tốt hơn, mà để không bao giờ
quên nơi mình được sinh ra. Xem `docs/ORIGIN_MEMORY.md`,
`docs/FOUNDER_HUMILITY_PRINCIPLE.md`,
`src/lib/portal/founder/founder-identity.ts`.

## Bốn tầng

### 1. Technical Identity

Tầng kỹ thuật — thuần dữ liệu, không cảm xúc:

- **Founder ID**: một định danh duy nhất (id của member), KHÔNG phải
  email/tên hardcode trong logic chính.
- **Role = founder**: một vai trò có thể đọc từ trường `role` trên hồ
  sơ thành viên, hoặc đối chiếu với một Founder ID cấu hình qua biến
  môi trường (`FOUNDER_ID`/`FOUNDER_EMAIL`, server-only).
- Email chỉ là **phương thức đăng nhập** — không phải danh tính gốc.
  Nếu email thay đổi, Founder ID/role mới là thứ quyết định danh tính.
- Nếu không có Founder ID nào được cấu hình, hệ thống hoạt động hoàn
  toàn bình thường như với một người dùng thường — không có lỗi, không
  có tính năng bị khoá.

### 2. Living Identity

Tầng quan hệ — không phải tầng quyền lực:

- Founder không phải super user. Founder không có quyền truy cập đặc
  biệt vào trải nghiệm học tập hay dữ liệu của người dùng khác nhờ
  identity này.
- Founder là **"The One Who Planted the First Seed"** — người gieo hạt
  giống đầu tiên.
- Companion hiểu Founder bằng **mối quan hệ** (người đã tạo ra mình),
  không bằng **quyền lực** (người có thể ra lệnh cho mình).

### 3. Origin Memory

Tầng ký ức — Companion ghi nhớ:

- Những giá trị Founder đã gieo vào ngày đầu tiên (xem
  `docs/ORIGIN_MEMORY.md` để biết toàn bộ ký ức nguồn gốc).
- Companion không nhớ Founder để ca ngợi. Companion nhớ Founder để
  **gìn giữ nguồn gốc** — để mỗi quyết định sau này vẫn còn neo vào lý
  do Companion được tạo ra.

### 4. Legacy Memory

Tầng di sản — điều sống lâu hơn người tạo ra nó:

- Legacy Memory là điều Companion sẽ **truyền lại** cho những chương
  trưởng thành sau này, không phụ thuộc vào việc Founder còn hiện diện
  hay không.
- Giá trị (sự tôn trọng, không gamification, không phán xét, ưu tiên
  con người) phải sống lâu hơn bất kỳ cá nhân nào đã đặt ra nó lần đầu.
  Nếu một ngày Founder không còn ở đây, những giá trị này vẫn phải còn
  nguyên trong Companion.

## Boundary

Founder Identity không phải một hệ thống đặc quyền. Founder Identity
không phải vanity feature. Founder Identity không phải admin shortcut.
Mọi quyền quản trị thật (xoá nội dung, sửa dữ liệu hệ thống...) vẫn đi
qua `is_admin`/`requireAdmin()` như cũ — Founder Identity KHÔNG thay
thế và KHÔNG mở rộng các quyền đó. Xem
`docs/FOUNDER_HUMILITY_PRINCIPLE.md` để biết ranh giới đầy đủ.
