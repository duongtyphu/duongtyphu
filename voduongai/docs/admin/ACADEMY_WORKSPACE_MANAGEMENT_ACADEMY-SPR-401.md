# ACADEMY-SPR-401 — Academy Workspace Management

**Epic:** EPIC-02 · **Phase:** Phase 4 — CKOS & Academy · **Brief:** IMP-ACADEMY-401
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package, không tạo tài liệu Product mới. Portal hiện tại là Reference Source duy nhất.

**Bối cảnh quan trọng:** Khác với CKOS (đã có Registry + CRUD hoàn chỉnh từ trước), Academy **chưa từng có Workspace Shell/Dashboard riêng** — chỉ có 3 route rời rạc (`/admin/roadmap`, `/admin/daily-missions`, `/admin/projects`) nằm trong nhóm nav "Academy" nhưng không có trang tổng, không có Registry hiển thị toàn bộ Learning Object. Đối chiếu trực tiếp với Portal thật (không suy diễn từ brief), phát hiện **7/10 Learning Object trong brief không tồn tại đúng tên trong Portal** — một phần do bị loại bỏ có chủ đích ("Academy Reset — Product Decision", comment gốc trong `/portal/ai-academy/page.tsx`), phần còn lại chưa từng được xây. Sprint này xây Workspace Shell + Dashboard + Registry đối chiếu trung thực cho phần THẬT đang tồn tại, không bịa CRUD cho object không có.

---

## Deliverable 1 — Academy Workspace Review (đối chiếu 10 Learning Object với Portal thật)

| # | Learning Object (brief) | Trạng thái | Ghi chú (nguồn xác minh) |
|---|---|---|---|
| 1 | Learning Path | ⚠️ Tồn tại dưới tên khác | = "Learning Journey" — `getAllLearningJourneys()` (`src/features/academy/services/journey.service.ts`) chiếu **1:1** từ CKOS Collection (`src/features/knowledge/data/knowledge-collections.ts`, mảng static hardcode). Academy không sở hữu dữ liệu này — xem Task 4. |
| 2 | Course | ❌ Đã loại bỏ (Product Decision) | Comment gốc trong `/portal/ai-academy/page.tsx`: *"Academy Reset — Product Decision: gỡ bỏ toàn bộ Course/Lesson/Video Course UI và demo data cũ."* "Course" còn tồn tại nhưng thuộc **Premium Workspace** (bảng `courses`, `/admin/course-pricing`) — không phải Academy. |
| 3 | Module | ❌ Chưa từng tồn tại | 0 route, 0 component, 0 bảng dữ liệu trong toàn bộ Portal. |
| 4 | Lesson | ❌ Chưa từng tồn tại (dạng Registry) | Chỉ xuất hiện dạng nhãn text tự do (`RoadmapStep.relatedLesson`, Daily Mission `taskType: "Hoàn thành bài học"`) — không phải object có cấu trúc, không CRUD được. |
| 5 | Quiz | ❌ Chưa từng tồn tại | 0 tham chiếu trong toàn bộ Portal. |
| 6 | Assignment | ⚠️ Tồn tại dưới tên khác | = "Dự án thực chiến" (Project Submissions, `/admin/projects`) — nhưng là hộp thư chấm bài học viên **tự nộp tự do**, không phải Registry Assignment do Founder định nghĩa trước rồi học viên làm theo. |
| 7 | Exercise | ⚠️ Tồn tại dưới tên khác, thuộc CKOS | Tồn tại dạng field `exercise` trên Knowledge Seed (`src/features/knowledge`) — CKOS sở hữu, không phải Academy. |
| 8 | Certificate | ❌ Chưa từng tồn tại | 0 tham chiếu trong toàn bộ Portal. |
| 9 | Instructor | ❌ Chưa từng tồn tại | 0 tham chiếu trong toàn bộ Portal. |
| 10 | Learning Schedule | ⚠️ Tồn tại dưới tên khác | = "Nhiệm vụ hôm nay" (Daily Missions, có field `repeatsDaily`) — gần đúng nhất với khái niệm lịch học lặp lại. |

**3 Learning Object THẬT Academy đang sở hữu và quản lý được** (không nằm trong 10 tên gọi ở trên nhưng là chính xác nội dung Learning Experience của Portal):

| Object thật | Route Admin | Consumer Portal (đã xác nhận) |
|---|---|---|
| Lộ trình thành công (Roadmap Step) | `/admin/roadmap` | `/portal/roadmap` — Consumer thật, đã xác nhận trước Sprint này |
| Nhiệm vụ hôm nay (Daily Mission) | `/admin/daily-missions` | ⚠️ **Đính chính phát hiện mới**: mô tả cũ ghi "hiển thị trên Portal Dashboard" — xác nhận lại trực tiếp, **0 route/component Portal nào đọc collection `daily-missions`**. Vẫn quản lý đầy đủ trong Admin, nhưng thay đổi CHƯA hiển thị ra Portal thật. |
| Dự án thực chiến (Project Submission) | `/admin/projects` | `/portal/*` (form nộp bài của học viên) → Supabase → chấm tại Admin. Consumer thật, luồng 2 chiều. |

**Không tự bổ sung** Certificate/Instructor/Quiz/Module/Lesson — đúng "Nếu chưa: Ghi rõ. Không sửa ngoài phạm vi" (Task 5 + Founder Directive của brief), tránh bịa Registry cho object không tồn tại trong Portal thật.

---

## Deliverable 2 — Learning Registry

Xây mới **Academy Dashboard** (`/admin/academy`) — trang tổng chưa từng có trước Sprint này:

- 4 Stat Card: Bước Lộ trình, Nhiệm vụ hôm nay (kèm cảnh báo 0 Portal consumer), Learning Journeys (kèm ghi chú "chiếu từ CKOS, không phải Academy sở hữu"), Dự án thực chiến.
- Bảng đối chiếu đầy đủ 10 Learning Object (đúng Deliverable 1) — hiển thị TOÀN BỘ, kể cả các object không tồn tại, đúng yêu cầu Task 1 "Learning Registry hiển thị TOÀN BỘ Learning Object".
- Quick Actions tới 4 mục còn lại của Workspace.

Xây mới **Learning Journeys view** (`/admin/academy/journeys`) — **chỉ đọc** (không Add/Edit/Delete), liệt kê từng Journey kèm CKOS Collection slug nguồn, giai đoạn hiện tại, tiến độ nội bộ. Lý do read-only: xem Task 4.

Cả 5 route Academy (`/admin/academy`, `/admin/roadmap`, `/admin/daily-missions`, `/admin/projects`, `/admin/academy/journeys`) nay dùng chung `AdminWorkspaceShell` (component có sẵn từ ADM-SPR-200) — trước Sprint này 3 route Academy không có Shell/điều hướng chéo nào.

---

## Deliverable 3 — Workspace Ownership Validation (Task 4)

Quét `workspaceOwnership.ts` (entry `academy`) và toàn bộ `src/app/admin/(dashboard)/{roadmap,daily-missions,projects,academy}` cho từ khóa "knowledge"/"commercial"/"mentor"/"website"/"media"/"brand" — **0 kết quả** ngoài tham chiếu đọc `getAllLearningJourneys()` (CKOS, có chủ đích, xem dưới).

**Kết luận Task 4: Academy chỉ sở hữu Learning Experience thật (Lộ trình thành công, Nhiệm vụ hôm nay, Dự án thực chiến) — không sở hữu Knowledge/Commercial/Mentor/Website/Media/Brand.**

**Điểm cần nêu rõ:** "Learning Journey" (= Learning Path trong brief) **0% do Academy sở hữu, 100% chiếu từ CKOS** — `getAllLearningJourneys()` = `getAllKnowledgeCollections().map(toJourney)`, không có dữ liệu Academy nào đứng sau khái niệm này. Đây là lý do `/admin/academy/journeys` được xây **read-only** thay vì CRUD: xây CRUD ở đây sẽ tạo ra 2 nguồn ghi cho cùng 1 dữ liệu (vi phạm trực tiếp mục tiêu brief *"Learning Experience chỉ tồn tại một nơi duy nhất"*). Sửa nội dung Journey phải thực hiện ở CKOS (Knowledge Seed/Collection), đã ghi chú ngay trong UI.

`workspaceOwnership.ts` đã được cập nhật để phản ánh đúng ranh giới này (xem Files Changed).

---

## Deliverable 4 — Future Flexibility Review (Task 5 + Founder Directive)

Founder Directive yêu cầu xác minh: thêm **course/module/bài học/quiz/bài tập/chứng chỉ mới** có cần sửa TypeScript/Route/Component không.

**Khác biệt căn bản so với mọi Founder Directive check trước đó trong EPIC-02** (Brand/Media/CKOS đều tìm thấy "đã linh hoạt sẵn"): ở đây **object không tồn tại để mà linh hoạt** — không thể đánh giá "thêm Course mới có cần sửa code không" khi Course đã bị loại bỏ khỏi Academy theo Product Decision.

| Hành động (Founder Directive) | Kết quả kiểm tra |
|---|---|
| Thêm Course mới | ❌ **Không áp dụng được** — Course không tồn tại trong Academy (đã loại bỏ, Product Decision). Course thuộc Premium Workspace (`/admin/course-pricing`), ngoài phạm vi Academy. |
| Thêm Module mới | ❌ **Không áp dụng được** — Module chưa từng tồn tại. |
| Thêm Bài học (Lesson) mới | ❌ **Không áp dụng được** — Lesson chưa từng tồn tại dạng object có cấu trúc. |
| Thêm Quiz mới | ❌ **Không áp dụng được** — Quiz chưa từng tồn tại. |
| Thêm Bài tập (Assignment) mới | ⚠️ **Không đúng mô hình** — "Dự án thực chiến" hiện tại là hộp thư nhận bài tự nộp của học viên (`/admin/projects`, Server Component đọc Supabase), không có khái niệm Founder "định nghĩa trước 1 Assignment mới" để học viên làm theo. |
| Thêm Chứng chỉ (Certificate) mới | ❌ **Không áp dụng được** — Certificate chưa từng tồn tại. |

**Với 3 object THẬT đang có** (Lộ trình thành công / Nhiệm vụ hôm nay / Dự án thực chiến — không nằm trong 6 hành động brief liệt kê, nhưng đối chiếu tương đương "thêm 1 mục mới"):

- Roadmap Step mới: ✅ `CrudPage` → `add()`, thuần dữ liệu, 0 code.
- Daily Mission mới: ✅ `CrudPage` → `add()`, thuần dữ liệu, 0 code (nhưng ⚠️ chưa hiển thị ra Portal — xem Deliverable 1).
- Dự án thực chiến: không áp dụng "thêm mới" — luồng là học viên nộp, Founder chỉ chấm.

**Kết luận Deliverable 4: 0/6 hành động trong Founder Directive hiện khả thi, vì 5/6 object không tồn tại trong Academy và 1/6 (Assignment) không đúng mô hình dữ liệu hiện có.** Đây không phải "hạn chế code cần sửa" (như mọi phát hiện trước ở Brand/Media/CKOS) mà là **hạn chế mô hình sản phẩm** — không tự xây Registry/CRUD giả cho các object này, đúng "Nếu chưa: Ghi rõ. Không sửa ngoài phạm vi" (nêu 2 lần trong brief: Task 5 và Founder Directive).

---

## Files Changed

**Mới:**
- `src/lib/admin/academy/navigation.ts` — 5-mục `ACADEMY_WORKSPACE_SECTIONS` (IA thật của Academy, không thêm mục cho object không tồn tại).
- `src/app/admin/(dashboard)/academy/page.tsx` — Academy Dashboard (Learning Registry, Deliverable 1+2).
- `src/app/admin/(dashboard)/academy/journeys/page.tsx` — Learning Journeys, read-only (Deliverable 3).

**Sửa:**
- `src/app/admin/(dashboard)/roadmap/page.tsx` — bọc trong `AdminWorkspaceShell`, cập nhật mô tả xác nhận Consumer thật.
- `src/app/admin/(dashboard)/daily-missions/page.tsx` — bọc trong `AdminWorkspaceShell`, thêm đính chính "0 Portal consumer" vào mô tả (sửa tuyên bố sai từ sprint trước).
- `src/app/admin/(dashboard)/projects/page.tsx` — bọc trong `AdminWorkspaceShell` (Server Component, giữ nguyên toàn bộ logic `listSubmissions()`).
- `src/lib/admin/nav.ts` — nhóm "Academy": thêm "Academy Dashboard" (đầu danh sách) và "Learning Journeys (đọc)" (cuối danh sách).
- `src/components/admin/AdminSidebar.tsx` — thêm icon cho `/admin/academy` (`LayoutDashboard`) và `/admin/academy/journeys` (`Route`, import mới từ `lucide-react`).
- `src/lib/admin/workspaceOwnership.ts` — entry `academy`: cập nhật `href` → `/admin/academy`, `owns` ghi rõ ranh giới Journey (chiếu từ CKOS, không sở hữu) và các object không tồn tại.
- `docs/admin/ACADEMY_WORKSPACE_MANAGEMENT_ACADEMY-SPR-401.md` (file này, mới).

## Verification

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công, xác nhận cả 5 route Academy build đúng (`/admin/academy`, `/admin/academy/journeys`, `/admin/roadmap`, `/admin/daily-missions`, `/admin/projects`)
- [x] `npm run test` — 139/139 pass

## Acceptance Self-check (trung thực)

| Tiêu chí | Trạng thái |
|---|---|
| ✓ Academy quản lý toàn bộ Learning Experience thật | ✅ **Đạt cho 3 object thật** (Roadmap/Daily Missions/Projects) — ⚠️ 7/10 object brief liệt kê không tồn tại trong Portal, ghi rõ ở Deliverable 1, không bịa |
| ✓ Learning Experience chỉ tồn tại một nơi duy nhất | ✅ **Đạt** — Learning Journey đọc trực tiếp từ CKOS (không tạo bản sao ghi ở Academy), đúng nguyên tắc "single source" |
| ✓ Relationship chain rõ ràng | ⚠️ **Không áp dụng được đầy đủ** — chain brief liệt kê (Path→Course→Module→Lesson→Quiz→Assignment→Exercise→Certificate) đứt gãy ngay từ bước 2 vì Course không tồn tại trong Academy; chain thật hiện có chỉ có 1 cạnh gián tiếp (Roadmap Step có field text tự do `relatedLesson`/`relatedMission`, không phải liên kết object thật) |
| ✓ Workspace Ownership sạch | ✅ **Đạt** — xác nhận 0 chồng chéo Knowledge/Commercial/Mentor/Website/Media/Brand |
| ✓ Founder mở rộng bằng dữ liệu, không sửa code | ⚠️ **Không áp dụng được cho 5/6 hành động** brief liệt kê (object không tồn tại) — 2 object thật hiện có (Roadmap/Daily Missions) đã 0-code, ghi rõ ở Deliverable 4 |
| ✓ Không còn hardcode ngăn mở rộng Course/Module/Lesson | ⚠️ **Không áp dụng được** — không phải "hardcode chặn", mà là các object này chưa từng được xây trong Academy; không có code nào để gỡ |
| ✓ Build/test pass | ✅ **Đạt** |

Không merge. Không deploy Production. Chờ PMO review.
