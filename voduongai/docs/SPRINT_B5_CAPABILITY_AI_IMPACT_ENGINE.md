# Sprint B5 — Capability & AI Impact Engine

Hệ thống chứng minh năng lực thực tế của người học — không Quiz, không
điểm, không chứng chỉ, không "video đã xem." Capability chỉ hình thành từ
Evidence thật (Output đã Review + đã Reflection). Không thay đổi Academy/
Workspace/Companion/Portfolio/Learning Loop, **không thay UI** (đúng
brief — chỉ chuẩn bị Engine + dữ liệu, không xây giao diện hiển thị).

---

## 1. Capability Engine

`src/lib/portal/foundation/capability-engine.ts` (mới) —
`CapabilityProfileRecord` gồm đúng field brief yêu cầu: `capabilityId`,
`name`, `description`, `evidenceCount`, `missionsCompleted`,
`portfolioLinked`, `currentLevel`, `updatedAt`. (`aiImpactSummary`/
`businessImpactSummary`/`humanImpactSummary` tách riêng ở `impact-engine.ts`
— xem mục 4-6, vì đây là 2 phép đo khác nhau: Capability đo NĂNG LỰC,
Impact đo GIÁ TRỊ, nhất quán với ranh giới đã khóa ở
`ROLE_RESPONSIBILITY_MATRIX.md` mục 7-8.)

`computeCapabilityProfiles()` đọc `WorkspaceSession`/`PortfolioItem` thật
(không tạo bảng dữ liệu song song), nhóm theo `capabilityId` suy ra từ
`context.module` (xem ghi chú gap ở mục 9), tính `evidenceCount`/
`missionsCompleted`/`portfolioLinked` thật.

---

## 2. Capability Levels

6 mức (Level 0-5), không dùng điểm số:

```
0 Chưa thực hành → 1 Hiểu → 2 Làm được → 3 Làm độc lập
   → 4 Làm hiệu quả → 5 Có thể hướng dẫn người khác
```

Đây là **thang triển khai chính thức** của EPIC 03 từ Sprint B5 — chi
tiết hóa áp dụng thực tế của 2 thang đã mô tả ở tài liệu thiết kế trước
(4 mức Introduced/Practiced/Applied/Mastered — Mission Library Standard
mục 9; 7 mức ở Assessment & Capability Standard mục 9) — cùng một khái
niệm, không phải 3 hệ song song, chỉ khác độ chi tiết. `levelFromEvidenceCount()`
ánh xạ số Evidence → Level theo bậc thang cố định (0/1/2/3-4/5-7/8+).

---

## 3. Evidence Engine

`isValidEvidence(output)`: 1 Output là Evidence hợp lệ khi
`reviewStatus === "reviewed" && reflectionStatus === "submitted"` — **cùng
điều kiện** dùng để promote Portfolio ở Sprint B4 (Portfolio Engine), theo
đúng nguyên tắc "một điều kiện Evidence dùng chung nhiều hệ quả" (Capability
Evidence Framework mục 1) thay vì định nghĩa lại Evidence riêng cho từng
Engine. Output thiếu Review hoặc thiếu Reflection **không được tính**, dù
đã có Version/History/Growth Event — đúng Validation Rule (mục 9-10).

---

## 4. AI Impact

`src/lib/portal/foundation/impact-engine.ts` (mới) —
`computeAiImpactSummary()`: `reuseCount` (số Output có >1 version — bằng
chứng tái sử dụng/cải tiến thật), `outputsCreated`. `timeSaved`/
`qualityImproved`/`automation`/`confidence` **để trống** — chưa có UI thu
thập Before/After thật ở sprint này (đúng brief "không tính điểm", và
đúng nguyên tắc AI Impact & ROI Standard mục 2: không bịa số liệu khi
chưa có baseline thật).

---

## 5. Business Impact

`computeBusinessImpactSummary()`: chỉ đếm `outputsReadyToUse` (Output đã
Review — đủ chuẩn "dùng được trong công việc thật"). **Framework only**,
đúng brief ("không cần tính tiền, chỉ thiết kế Framework") — không có UI
nào để người dùng nhập "khách hàng chấp nhận"/doanh thu ở sprint này,
`businessValueNotes[]` để trống thay vì suy diễn.

---

## 6. Human Impact

Tầng quan trọng nhất theo Product Principle, cũng khó đo nhất bằng dữ
liệu thô. `computeHumanImpactSummary()`: `reflectionsSubmitted` (bằng
chứng thật duy nhất đo được — người học đã tự nhận biết điều gì đó qua
Reflection), `missionsCompletedIndependently` (Session hoàn thành với ít
bước Companion Coaching lặp lại — xấp xỉ qua độ dài `history`, không phải
đo trực tiếp mức độ "chủ động"). **Không có AI phân tích nội dung
Reflection** (không AI Agent trong sprint này) — không suy diễn "tự tin
hơn bao nhiêu %", chỉ đếm số Reflection thật đã gửi.

---

## 7. Relationship

```
Output → Portfolio → Evidence → Capability → AI Impact → Business Impact → Human Impact → Growth
```

Một chiều, không vòng lặp — `capability-engine.ts`/`impact-engine.ts` chỉ
ĐỌC `WorkspaceSession`/`PortfolioItem`/`GrowthEvent`, không ghi ngược lại
bất kỳ bảng nào ở tầng trước. Duy nhất `computeCapabilityProfiles()` phát
`CAPABILITY_UPDATED` (Growth Event) khi Level thay đổi — đúng Event-Driven
Architecture, không gọi hàm module khác trực tiếp.

---

## 8. Timeline

`getCapabilityTimeline(capabilityId)` đọc `vdai_capability_timeline`
(localStorage, append-only) — mỗi lần Level đổi (so với entry cuối cùng
đã lưu) mới thêm 1 `CapabilityTimelineEntry` mới, **không ghi đè** entry
cũ. Ví dụ: Level 1 → Level 2 → Level 3 đều còn nguyên trong Timeline, có
thể truy vết lại đúng thời điểm mỗi lần thăng cấp.

---

## 9. Validation Rules

`computeCapabilityProfiles()` áp dụng đúng luật: nếu `evidenceCount <= 0`
cho 1 `capabilityId` — **không tạo/không cập nhật** hồ sơ Capability đó
(bỏ qua `continue`, không thêm vào danh sách trả về). Timeline chỉ thêm
entry mới khi Level thực sự đổi so với lần tính trước — không tự tăng
theo thời gian trôi qua, không giảm ngẫu nhiên, chỉ phản ứng với Evidence
thật mới xuất hiện.

**Gap ghi nhận trung thực**: `capabilityId` hiện suy ra từ `context.module`
(vd `capability_academy`, `capability_khong-gian-ai`) vì Portal **chưa có
catalog Mission/Competency thật** (Technical Debt đã ghi từ Sprint B1
Foundation Report #1 và #4, chưa xử lý) — đây là xấp xỉ hợp lý nhất có
thể với dữ liệu hiện có, không phải Capability theo đúng Competency thật
(vd "AI Writing", "AI Data" như Mission Library Standard mô tả). Khi
Mission Engine thật tồn tại (Sprint B7+), chỉ cần thay `deriveCapabilityId()`
đọc `mission.competencyIds` thật — phần còn lại của Engine không đổi.

---

## 10. Future Analytics (Impact Dashboard Data)

`getImpactDashboardData(capabilityGrowth)` (`impact-engine.ts`) chuẩn bị
đủ số liệu cho Dashboard tương lai — **không xây UI** (đúng brief):
`missionsCompleted`, `workspaceHours` (tính thật từ `startedAt`→
`finishedAt`), `outputsCreated`, `portfolioSize`, `capabilityGrowth`
(số Capability đạt Level ≥ 1), `humanGrowth` (số Reflection đã gửi).
`timeSaved`/`businessValue` để `undefined` — chưa đo được thật ở sprint
này, sẵn sàng điền khi có UI Before/After (EPIC 04+).

---

## Ghi chú xác thực (Build Safety)

- `npx tsc --noEmit`: sạch.
- `npm run build`: thành công, route list không đổi.
- `npm run lint`: 1 lỗi thật phát hiện và sửa trong lúc code
  (`no-assign-module-variable` — biến cục bộ tên `module` trùng tên biến
  toàn cục Next.js/CommonJS, đã đổi thành `portalModule`), sau khi sửa chỉ
  còn 5 warning `<img>` đã biết từ trước.
- `npx vitest run`: 56/56 pass.
- File thay đổi: 2 file mới (`capability-engine.ts`, `impact-engine.ts`),
  1 dòng gọi `computeCapabilityProfiles()` thêm vào
  `WorkspaceMvp.tsx` (sau `promoteEligibleOutputs`, không render UI mới —
  đúng "không thay UI"). Academy/Workspace UI/Companion/Portfolio/Learning
  Loop: không đổi.
- Cùng giới hạn như B2-B4: chưa QA qua trình duyệt thật (môi trường không
  có session Supabase Auth).

---

VO DUONG AI không chứng minh người học đã học xong — chứng minh người học
đã trưởng thành. Mỗi Output là một bằng chứng, mỗi bằng chứng tạo nên
Capability, mỗi Capability phản ánh giá trị AI mang lại. Sprint B5 chỉ đo
được phần đo được thật (Evidence Count, Reuse, Reflection thật) — không
bịa số liệu cho phần chưa có dữ liệu (Time Saved, Business Value, mức độ
tự tin) để trông "đầy đủ hơn."
