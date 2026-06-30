# THE PORTAL ARCHITECTURE FREEZE™

> "Người dùng học một lần. Sử dụng được toàn bộ Portal."

---

## I. Tuyên bố Freeze

Kể từ Sprint này, mọi Project trong Portal phải tuân theo một cấu trúc duy nhất.

**Không có ngoại lệ.**

Mọi Project có thể thay đổi:
- Dữ liệu (nội dung, danh sách, bài viết)
- Màu chủ đạo accent (nếu có)
- Banner hero section
- Logo / icon đại diện cho project
- Nội dung trang (text, media)

Mọi Project **không được** thay đổi:
- Cấu trúc layout (shell, header, sidebar, main content area)
- Vị trí sidebar
- Vị trí header
- Design System components (PortalShell, PortalHeader, PortalSidebar, PortalSearch)
- Navigation pattern
- Grid system và spacing tokens

---

## II. Canonical Portal Structure

### Sơ đồ cấu trúc

```
PortalLayout (src/app/portal/layout.tsx)
└── PortalShell (src/components/portal/PortalShell.tsx)
    ├── GemBackground             — nền toàn trang, không được ghi đè
    ├── PortalHeader              — header cố định top, full-width
    │   ├── Toggle sidebar button
    │   ├── Logo + "Portal" label
    │   ├── PortalSearch          — thanh tìm kiếm, luôn hiện
    │   ├── Bell icon (Notifications → /portal/updates)
    │   ├── Bookmark icon (Saved)
    │   └── PortalUserMenu        — avatar / email user
    ├── <aside>                   — sidebar desktop (md+), collapsible
    │   └── PortalSidebar         — danh sách 6 Hub nav items
    ├── Mobile Drawer             — drawer trái (< md), trigger từ header toggle
    │   └── PortalSidebar variant="mobile"
    ├── <main>                    — content area, flex-1
    │   └── <div.max-w-5xl>      — container tối đa 5xl
    │       └── {children}        — NƠI DUY NHẤT PROJECT ĐƯỢC THAY ĐỔI
    ├── NotificationTicker        — ticker nổi, không được xóa
    ├── FirstFootprintCeremony    — ceremony first login, không được xóa
    ├── OnboardingJourney         — onboarding flow, không được xóa
    └── CompanionPresence         — Companion nổi, không được xóa
```

### Component map

| Layer | File | Được sửa? |
|---|---|---|
| Layout shell | `src/app/portal/layout.tsx` | **Không** |
| Shell wrapper | `src/components/portal/PortalShell.tsx` | **Không** |
| Header | `src/components/portal/PortalHeader.tsx` | **Không** |
| Sidebar (nav) | `src/components/portal/PortalSidebar.tsx` | **Không** |
| Search | `src/components/portal/PortalSearch.tsx` | **Không** |
| Hub nav data | `src/lib/portal/hubs.ts` | Chỉ khi thêm Hub mới |
| Page content | `src/app/portal/{project}/page.tsx` | **Có** — đây là nơi Project được sống |
| Sub-layout | `src/app/portal/{project}/layout.tsx` | **Không được tạo** |

---

## III. Quy tắc bất biến

### Layout Rules

**1. Một layout duy nhất.**
Không tạo `layout.tsx` riêng cho bất kỳ Project nào trong Portal.
Mọi Project là `page.tsx` trong `src/app/portal/{project}/`.

**2. Không override shell components.**
`PortalShell`, `PortalHeader`, `PortalSidebar` không được thay thế, bọc thêm, hoặc tắt đi từ bất kỳ trang con nào.

**3. Không tạo custom header.**
Nếu một Project cần thông tin đặc biệt trong header (ví dụ: tên project), nó phải được thể hiện trong `{children}` — không phải trong header shell.

**4. Sidebar không thể thêm item mới từ project.**
Chỉ 6 Gem Hub items trong `src/lib/portal/hubs.ts` xuất hiện trong sidebar.
Sub-navigation của từng project phải nằm trong content area, không phải sidebar.

**5. CompanionPresence không được tắt.**
Không có Project nào được thêm logic ẩn hoặc vô hiệu hóa `CompanionPresence`.

---

## IV. Quy tắc Admin

**Admin. 100%. Thống nhất.**

Mọi trang Admin sử dụng:
- Layout Admin riêng (tách hoàn toàn khỏi Portal layout)
- Không bao giờ dùng `PortalShell` trong admin
- Mọi Admin feature page dùng cùng một AdminShell pattern

---

## V. Quy tắc Article

**Article. 100%. Thống nhất.**

Mọi bài viết / article trong Portal (Digital Assets articles, Knowledge articles, Case Study, Blog...) sử dụng:
- Cùng article container max-width
- Cùng typography scale
- Cùng article footer pattern (nội dung liên quan, CTA)
- Không custom font, không custom background per-article

---

## VI. Lý do của Freeze

### Tại sao phải Freeze?

**Nhất quán tạo ra tin tưởng.**
Khi người dùng biết sidebar luôn ở đó, search luôn ở đó, Companion luôn ở đó — họ dành toàn bộ năng lượng cho nội dung, không phải cho việc tìm hiểu interface.

**Freeze không phải giới hạn — đó là tự do có giới hạn.**
Project được tự do trong content area. Nhưng shell là thứ không thương lượng.

**Chi phí học của người dùng = 0 khi chuyển Project.**
Nếu AI Academy và Digital Assets đều dùng cùng layout, người dùng sang project mới ngay lập tức biết mình đang ở đâu, mình làm gì.

### Hậu quả nếu vi phạm

Mỗi lần một Project tạo layout riêng:
- Người dùng phải học lại cách dùng
- Companion mất kết nối (không có `CompanionPresence`)
- Search mất khả năng index nhất quán
- Maintenance tăng — mỗi layout thay đổi phải cập nhật N nơi

---

## VII. Kiểm tra tuân thủ

Trước khi commit bất kỳ Portal page mới:

```
□ Không có layout.tsx mới trong thư mục này
□ PortalShell không bị thay thế hoặc bỏ qua
□ Sidebar không bị thêm item mới từ page này
□ CompanionPresence không bị tắt
□ Content nằm hoàn toàn trong {children} của PortalShell
□ Admin pages dùng AdminShell riêng, không dùng PortalShell
□ Article pages follow article container pattern
```

---

## VIII. Trạng thái hiện tại (2026-06-30)

**Audit kết quả:**

| Rule | Trạng thái |
|---|---|
| Single layout | ✅ Pass — chỉ 1 file `layout.tsx` tại `/portal/` |
| No sub-layouts | ✅ Pass — không có sub-layout nào tồn tại |
| PortalShell in use | ✅ Pass — tất cả routes dùng PortalShell |
| Sidebar consistent | ✅ Pass — portalNavGroups từ hubs.ts |
| CompanionPresence present | ✅ Pass — có trong PortalShell |
| NotificationTicker present | ✅ Pass |
| FirstFootprintCeremony present | ✅ Pass |
| OnboardingJourney present | ✅ Pass |

**Verdict: PASS. Architecture đang ở trạng thái Frozen.**

---

## IX. Genome Review (Sprint Architecture Freeze)

### 1. Purpose Alignment
**Câu hỏi:** Freeze này phục vụ người dùng hay chỉ phục vụ developer?
**Verdict:** Phục vụ người dùng. Người dùng học một lần, dùng toàn bộ Portal.

### 2. Immutable Principle Check
- Không làm thay ✅ (Portal không làm thay user, user vẫn navigate chủ động)
- Safety là nền ✅ (Shell luôn có search, nav, Companion — không bao giờ bị mất)

### 3. Overbuild Check
**Câu hỏi:** Freeze này có thêm complexity không?
**Verdict:** Không. Freeze là constraint, không phải feature. Nó giảm complexity.

### 4. 10-Year Question
**Câu hỏi:** Nếu 10 năm sau mở Portal lên — người dùng có tìm thấy sidebar ở đúng chỗ không?
**Verdict:** Có. Đó là mục tiêu của Freeze.

### 5. Human Question
**Câu hỏi:** Freeze này coi người dùng như người trưởng thành không?
**Verdict:** Có. Người trưởng thành không cần học lại interface mỗi khi đổi project.

---

**Genome Verdict: PASS**
**Genome Debt: NONE**
**Genome Recommendation:** Freeze document này được dùng làm checklist bắt buộc cho mọi PR tạo Portal page mới.

---

*Established: 2026-06-30*
*Authority: Portal Architecture Freeze Directive*
*Status: ACTIVE — No override permitted without explicit user directive*
