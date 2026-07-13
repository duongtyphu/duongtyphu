# JOURNEY-SPR-901 — Journey & Community Workspace Management

**Epic:** EPIC-02 · **Phase:** Phase 9 — Journey & Community · **Brief:** IMP-JOURNEY-901
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package, không tạo tài liệu Product mới. Portal hiện tại là Reference Source duy nhất.

---

## 1. Journey & Community Review

Trước sprint này: "Journey" (`/admin/journey`) là Landing Foundation rỗng (`comingSoon: true`), "Community" (`/admin/community`) là CRUD thật nhưng **Consumer = 0** cho nội dung chính, "Sứ mệnh Companion" thuộc Companion Studio (COMPANION-SPR-801). Đã xây **1 Workspace hợp nhất "Journey & Community"** đúng Task 6 brief:

- Gộp nav.ts 2 mục rời rạc thành 1 nhóm "Journey & Community" (2 route: Dashboard `/admin/journey`, Kênh cộng đồng `/admin/community`) — không tạo route mới.
- Dashboard thật tại `/admin/journey` thay `WorkspaceSectionFoundation` placeholder — Portal Mapping + Journey/Community/Mission Management + Ownership + Future Flexibility.
- **Đính chính ownership quan trọng nhất (Task 6):** `/portal/su-menh-companion` chuyển từ Companion Studio sang Journey & Community — quyết định dựa trên brief này liệt kê rõ "Sứ mệnh Companion" là 1 trong 3 Portal Area của Workspace, và tách bạch 2 khái niệm khác nhau: **Mentor Runtime** (Persona/Agent Registry/Orchestration Rules — vẫn ở Companion Studio) vs **Mission Presentation** (trang kể chuyện/triết lý — nay ở Journey & Community). Đã cập nhật đồng bộ `workspaceOwnership.ts`, `areaRegistry.ts`, `pageRegistry.ts`.

---

## 2. Portal Mapping (Task 1)

| Area | Trước sprint | Sau sprint |
|---|---|---|
| Hành trình của tôi | 3 section (sectionRegistry) | **7 section** thật (Cổng vào Hub, Companion Memory Line, Current Chapter Card, Năm cánh cửa, Growth Activity, Câu hỏi hôm nay, CTA) |
| Sứ mệnh Companion | 3 nhóm nội dung, Owner = Companion Studio | Giữ 3 nhóm (trang không có `<section>` rõ ràng để tách nhỏ hơn), Owner = Journey & Community |
| Cộng đồng | 3 section | **10 section** thật ("COMMUNITY CAMPUS RECONSTRUCTION": Hero, Stories, Learning Spaces, Showcase, Workshops & Events, News, Companion Corner, Guides, Map, Final CTA) |

5 cửa Journey Hub (route con) đối chiếu trực tiếp: **toàn bộ đọc dữ liệu THẬT từ Supabase** (`reflections`/`memory_capsules`/growth-milestones) qua Server Component + localStorage growth-view — không có mảng nội dung hardcode nào cần Registry.

---

## 3. Workspace Ownership Validation (Task 6)

Merge `workspaceOwnership.ts`: 2 entry cũ ("journey" — chưa xây, "community" — scope chưa xác nhận) → 1 entry `journey-community`, ghi rõ 3 phạm vi thật (Journey Experience/Community Experience/Mission Presentation) + loại trừ rõ Mentor Runtime (vẫn Companion Studio), Knowledge/Learning/Commercial/Media/Brand/Website. Xác nhận sạch — 0 chồng chéo còn lại ngoài phần Mission đã tái phân bổ có chủ đích.

**Phát hiện quan trọng — Task 3 (Journey Management):** Reflection/Milestone/Story/Timeline **KHÔNG PHẢI đối tượng CMS** — đây là dữ liệu runtime thật của từng học viên (bảng `reflections`/`memory_capsules`, tính toán từ hoạt động thật). Xây CRUD cho các mục này sẽ là tạo dữ liệu giả, vi phạm trực tiếp Founder Directive "không tạo dữ liệu giả" — đã không xây, ghi rõ lý do trong Dashboard thay vì âm thầm bỏ qua.

---

## 4. Community Management (Task 4) — vá Consumer = 0

Phát hiện: `/portal/congdongai` hardcode 3 link Facebook Group/Zalo Group/YouTube trong `siteConfig.community`/`siteConfig.links` (site.ts), trong khi CRUD thật đã tồn tại (`/admin/community`, collection Supabase `community`, seed data trùng khớp 1:1) nhưng **Consumer = 0** — Founder sửa link ở Admin không có tác dụng gì trên Portal.

**Đã vá (an toàn, tái dùng pattern đã có):** viết `CommunityExternalLinks.tsx` (client component, dùng `useCollection("community", ...)` — đúng cơ chế `AdminPromptsSection.tsx` đã dùng để nối `/portal/prompts` với Admin), thay khối 3 link hardcode trong `/portal/congdongai/page.tsx`. Không tạo object/bảng mới — chỉ nối dây cái đã tồn tại.

---

## 5. Mission Management (Task 5)

Hero/Core Message/Story Sections/CTA của `/portal/su-menh-companion` — 100% hardcode (GENOME 12 gene, PHILOSOPHY_PAIRS, CONSTITUTION, MISSION_ITEMS, EVOLUTION, TIMELINE), chưa có CRUD. **Publish** quản lý được qua Page Registry (đã có từ PORTAL-SPR-301). Xác nhận **không có Runtime AI nào** ở trang này — Persona/Agent Registry thật vẫn ở Companion Studio, đúng Founder Directive "không tạo Runtime AI".

---

## 6. Future Flexibility Review (Task 7)

| Khả năng | Kết quả |
|---|---|
| Thêm Journey Page mới | ❌ Cần sửa code (route Next.js thật) |
| Thêm Reflection | ➖ Không áp dụng — dữ liệu người dùng tạo, không phải Founder |
| Thêm Milestone | ➖ Không áp dụng — kết quả tính toán, không phải bản ghi tay |
| Thêm Community Page mới | ❌ Cần sửa code |
| Thêm Story | ➖ Không áp dụng — My Story là cuốn sách cá nhân hoá |
| Thêm CTA | ❌ Cần sửa code — chưa có CTA Registry cho 3 khu vực này (khác Website Workspace) |

---

## 7. Founder Directive — xác nhận không tạo

Không tìm thấy, không tạo: Social Network/Forum/Comment System/Notification System/AI Runtime cho 3 Portal Area này — đúng hiện trạng Portal (Community hiện CTA "Tham gia cộng đồng" disabled có chủ đích, Companion Presence tự bạch "chưa có AI chat thật").

---

## 8. Build/test

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công, xác nhận `/admin/journey` + `/admin/community` build đúng
- [x] `npm run test` — 139/139 pass

---

## 9. Files changed

**Mới:**
- `src/lib/admin/journeyCommunity/navigation.ts`
- `src/components/portal/community/CommunityExternalLinks.tsx`
- `docs/admin/JOURNEY_COMMUNITY_MANAGEMENT_JOURNEY-SPR-901.md`

**Sửa — Admin:**
- `src/app/admin/(dashboard)/journey/page.tsx` — thay placeholder bằng Dashboard thật (Task 1,3,4,5,6,7).
- `src/app/admin/(dashboard)/community/page.tsx` — bọc `AdminWorkspaceShell`.
- `src/lib/admin/nav.ts` — gộp nhóm "Journey & Community".
- `src/lib/admin/workspaceOwnership.ts` — merge entry `journey-community`, cập nhật `companion-studio`.

**Sửa — Portal:**
- `src/app/portal/congdongai/page.tsx` — nối `CommunityExternalLinks` thay hardcode `siteConfig`.

**Sửa — Registry:**
- `src/lib/admin/portal/sectionRegistry.ts`, `contentBlockRegistry.ts` — đính chính section thật (Journey 3→7, Community 3→10) + đổi workspaceOwner.
- `src/lib/admin/portal/pageRegistry.ts`, `areaRegistry.ts` — đổi ownerWorkspace/workspaceOwner cho 3 Area.

Không merge. Không deploy Production. Chờ PMO review.
