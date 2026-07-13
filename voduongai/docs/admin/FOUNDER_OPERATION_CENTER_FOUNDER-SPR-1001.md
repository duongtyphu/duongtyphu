# FOUNDER-SPR-1001 — Founder Operation Center

**Epic:** EPIC-02 · **Phase:** Phase 10 — Founder Operation Center · **Brief:** IMP-FOUNDER-1001
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package, không tạo tài liệu Product mới. Portal hiện tại là Reference Source.

Không tạo Workspace mới. Không thay đổi Ownership — chỉ đọc `WORKSPACE_OWNERS`, không sửa field `owns` của bất kỳ entry nào.

---

## 1. Đã làm gì

Trước sprint này, `/admin/founder` chỉ có: Governance Overview (WCS status) + Open PMO Questions tích lũy — 2/4 route con còn là Placeholder (Global Search, Review Queue). Đã nâng cấp thành **1 Dashboard duy nhất** gộp toàn bộ 9 Task, không tạo route mới (vẫn đúng 4 mục nav Founder cũ: Founder Workspace, Workspace Owner Panel, Global Search, Review Queue — Global Search giữ nguyên Placeholder, ngoài phạm vi 9 Task).

**Hạ tầng dữ liệu thật dùng chung** (`src/lib/admin/founder/publishPipelineStats.ts`) — phát hiện quan trọng: chỉ **15/34+ collection thật trong Admin** có khái niệm pipeline Draft→Review→Published→Archived (13 collection CKOS dùng 6-state `KNOWLEDGE_STATUSES`, Website Pages + Shared Sections dùng 5-state `PAGE_LIFECYCLE_STATUSES`/`SECTION_STATUSES`). Toàn bộ collection còn lại (Brand Studio, Media Center, Academy, Premium, Projects, Community, Companion...) chỉ dùng nhị phân Active/Inactive — không có bước Review. Không ép các collection này vào 4 giai đoạn brief yêu cầu.

---

## 2. Workspace Health (Task 1)

Bảng 11 dòng: 10 Workspace thật (`workspaceOwnership.ts`) + 1 dòng "Portal Management" (lớp cấu trúc chéo Area→Page→Section→Content, không phải 1 Workspace nội dung — brief liệt kê "Portal" riêng biệt với 10 Workspace). Mỗi dòng: chỉ báo Health (🟢/🟡/🔴 suy từ Maturity), Maturity badge, WCS status, link mở Workspace.

## 3. Publish Center (Task 2)

4 cột Draft/Review/Published/Archived tính từ dữ liệu thật (15 collection ở trên) qua `usePublishPipelineStats()`. "Review" gộp cả Review/In Review/Approved/Changes Requested (mọi trạng thái giữa Draft và Published) để khớp đúng 4 giai đoạn brief yêu cầu, đồng thời không giấu chi tiết 6-state thật của CKOS.

## 4. Review Queue (Task 3)

Nâng cấp `/admin/founder/review-queue` từ Placeholder (ADM-SPR-200) sang danh sách thật, 4 khối: Pending Review (Review/In Review), Approved, Needs Change (Changes Requested), **Rejected — 0, không tồn tại trạng thái này** ở bất kỳ collection nào trong Admin hiện tại (gần nhất là Archived, nhưng đó là hậu-Published/gỡ khỏi Portal, không phải từ chối duyệt) — không tự thêm trạng thái mới.

## 5. Activity Timeline (Task 4)

**Không tồn tại — xác nhận bằng grep trực tiếp** (`activity_log`/`audit_log`/`ActivityLog`/`AuditLog`, 0 kết quả trong toàn bộ codebase). Không có bảng nào ghi "ai sửa gì lúc nào"; mỗi Registry chỉ có `updatedDate` (ngày sửa cuối, không phải log đầy đủ). Đã ghi rõ trong Dashboard thay vì tự dựng Activity Log giả — đúng "không tạo dữ liệu giả".

## 6. Audit Center (Task 5)

Bảng Workspace → Content → Owner → Last Update → Publish, gộp từ 64 Content Block thật (Portal Management, `contentBlockRegistry.ts`) theo Owner. Nội dung nghiệp vụ nằm ngoài Portal Management (Premium/Academy/CKOS...) không nằm trong bảng này — cần vào từng Workspace riêng, ghi rõ giới hạn này.

## 7. System Health (Task 6)

3 nhóm stat card tính real-time từ dữ liệu thật:
- **Portal Coverage:** Area(10)/Page(23)/Section(64)/Content(64), % có Owner.
- **Workspace Coverage:** phân bố Maturity — Canonical(3: Website/Brand/Media), Consistent-Legacy(1: CKOS), Mixed-Legacy(4: Academy/Premium/Projects/Journey & Community), Not Started(2: Companion Studio/AI Workspace).
- **Content Coverage:** WCS Approved(3)/Draft(0)/Chưa có(7), tỷ lệ collection có Publish pipeline (15/34+).

## 8. Founder Decision (Task 7)

4 khối tổng hợp từ mọi báo cáo sprint EPIC-02 trước đó (không tạo phát hiện mới, chỉ gộp lại):
- **Open Blocker (P0):** 3 mục — Premium course content model thiếu, `case_study` vs `case_studies`, Digital Assets CRUD quản lý route đã khai tử.
- **Technical Debt:** 6 mục — Companion Memory 6 hệ song song, social link nhiều nguồn, 3 nguồn Prompt trùng tên, Brand Orange 2 mã màu, 22 file brand mồ côi, 15/34+ collection có Publish pipeline.
- **PMO Decision:** 11 câu hỏi mở (giữ nguyên danh sách cũ từ `founder/page.tsx`, chưa câu nào được xử lý dứt điểm).
- **Founder Decision (đã quyết, đã thực thi):** 4 mục — 6 chương trình Premium cố định, 5 nhóm Projects cố định, Mission Presentation chuyển sang Journey & Community, Journey+Community hợp nhất 1 Workspace.

## 9. Workspace Ownership Matrix (Task 8)

`WorkspaceOwnerPanel` (đã có từ ADM-SPR-200) chính là "Single Ownership Matrix" brief yêu cầu — không sửa, chỉ gắn thêm liên kết từ Dashboard chính. **Không thay đổi Ownership** — không sửa field `owns` của entry nào trong sprint này.

## 10. Future Flexibility Review (Task 9)

| Khả năng | Đánh giá |
|---|---|
| Quản lý toàn bộ Portal | ⚠️ Một phần — cấu trúc/metadata quản lý được, nội dung nghiệp vụ (AI Workspace/Projects Ecosystem/Mission) vẫn 100% hardcode |
| Theo dõi toàn bộ Workspace | ✅ Đạt — Founder Operation Center hiển thị đủ 10 Workspace + Portal Management tại 1 nơi |
| Publish | ⚠️ Một phần — chỉ 15/34+ collection có pipeline thật |
| Review | ⚠️ Một phần — cùng giới hạn 15/34+ |
| Audit | ✅ Đạt cho Portal Management; ⚠️ hạn chế cho nội dung nghiệp vụ ngoài Portal Management |

---

## 11. Build/test

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công, xác nhận `/admin/founder` + 3 route con build đúng
- [x] `npm run test` — 139/139 pass

---

## 12. Files changed

**Mới:**
- `src/lib/admin/founder/publishPipelineStats.ts` — `usePublishPipelineStats()`, gộp 15 collection thật có Publish pipeline.
- `docs/admin/FOUNDER_OPERATION_CENTER_FOUNDER-SPR-1001.md` (file này).

**Sửa:**
- `src/app/admin/(dashboard)/founder/page.tsx` — thay Governance Overview đơn giản bằng Founder Operation Center đầy đủ 9 Task.
- `src/app/admin/(dashboard)/founder/review-queue/page.tsx` — thay Placeholder bằng danh sách thật.

Không merge. Không deploy Production. Chờ PMO review.
