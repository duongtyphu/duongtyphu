# Sprint B4 — Portfolio & Growth Engine

Mọi Output người học tạo ra (Sprint B2/B3) giờ có thể trở thành tài sản số
thật (Portfolio). Mọi hoạt động học tập sinh Growth Event thật, và 3 trang
Growth (Nhật ký học tập, Hành trình của tôi, Khu vườn của bạn) giờ **đọc**
Event thật thay vì chỉ hiển thị dữ liệu tĩnh — đúng gap đã ghi nhận từ
`SMART_AI_CURRICULUM_AUDIT.md` ("Growth Event được ghi nhưng không ai
đọc"). Không đổi Learning Loop, không đổi Journey/Academy/Workspace/
Companion, không đổi UI hiện có của 3 trang (chỉ thêm 1 section mới vào
mỗi trang).

---

## 1. Portfolio Engine

`src/lib/portal/foundation/portfolio-store.ts` (mới) — `PortfolioItemRecord`
gồm đúng các field brief yêu cầu: `portfolioItemId`, `outputId`, `sessionId`
(tương đương Mission/Journey vì đã có trong `context`), `missionId`,
`journeyId`, `title`, `description`, `outputType`, `version`, `createdAt`,
`updatedAt`, `tags`, `businessValue?`, `capabilityMapping?`,
`aiImpactSummary?`, `status`.

`promoteEligibleOutputs(sessionId)` tự động tạo `PortfolioItemRecord` cho
mọi Output đã đạt chuẩn (`reviewStatus === "reviewed" && reflectionStatus
=== "submitted"`) mà chưa có trong Portfolio — **không tạo trùng**
(kiểm tra `outputId` đã tồn tại trước khi tạo). Gọi từ `WorkspaceMvp.tsx`
ngay sau `handleSubmitReflection` thành công — đúng nguyên tắc "Output đạt
chuẩn tự động vào Portfolio, không cần bước lưu riêng"
(`LEARNING_OPERATING_SYSTEM_BLUEPRINT.md` mục 8). Portfolio **không lưu
dữ liệu trùng** — chỉ tham chiếu `outputId`/`sessionId`, không copy nội
dung Output.

---

## 2. Output Version History

Đã có từ Sprint B2 (`OutputVersionRecord[]`) — Sprint B4 chỉ thêm **hiển
thị** trong `WorkspaceMvp.tsx`: mỗi Output có nhiều Version hiện thêm khối
`<details>` "Lịch sử phiên bản (N)" liệt kê từng version kèm thời gian,
đánh dấu "Final" cho version cuối khi `reviewStatus === "reviewed"`. Cho
phép so sánh/xem lịch sử thật — không thêm bảng dữ liệu mới, dùng đúng
`versions[]` đã lưu.

---

## 3. Growth Event Engine

16 loại Event (từ 14 ở Sprint B3, thêm `REVIEW_COMPLETED` và
`PORTFOLIO_CREATED`). Đối chiếu tên gọi trong brief Sprint B4 với hệ Event
đã có (không tạo trùng ý nghĩa):

| Brief Sprint B4 | Event thật dùng | Ghi chú |
|---|---|---|
| MISSION_STARTED | `MISSION_STARTED` | Đã có (B1) |
| MISSION_COMPLETED | `MISSION_COMPLETED` | Đã có (B1) |
| OUTPUT_CREATED/UPDATED/VERSIONED | như cũ | Đã có (B1/B2) |
| REVIEW_COMPLETED | `REVIEW_COMPLETED` | **Mới** — `markOutputReviewed()` phát |
| REFLECTION_SUBMITTED | `REFLECTION_COMPLETED` | Đã có (B1), cùng ý nghĩa, không thêm trùng |
| PORTFOLIO_CREATED | `PORTFOLIO_CREATED` | **Mới** — `promoteEligibleOutputs()` phát |
| CAPABILITY_UPDATED | `CAPABILITY_UPDATED` | Đã có (B1), chưa có Engine ghi (Sprint B5) |
| IMPACT_RECORDED | `IMPACT_UPDATED` | Đã có (B1), cùng ý nghĩa |
| MISSION_UNLOCKED | `MISSION_UNLOCKED` | Đã có (B1), chưa có Engine (Sprint B6) |

Growth Event tiếp tục là Backbone — `emitGrowthEvent()` (Sprint B1) không
đổi, chỉ thêm 2 `eventType` + `GROWTH_EVENT_CONSUMERS` tương ứng.

---

## 4. Nhật ký học tập

`GrowthActivityPanel variant="journal"` (mới,
`src/components/portal/growth/GrowthActivityPanel.tsx`) thêm vào
`/portal/news` — đọc `getRecentActivity()` (`growth-view.ts`, đọc
`readGrowthEvents()` thật), hiển thị dòng thời gian thật (nhãn sự kiện +
thời gian thật, mới nhất trước). **Không dữ liệu giả** — nếu chưa có hoạt
động nào, hiển thị trạng thái rỗng trung thực thay vì bịa số liệu. Nội
dung Blog/Learning Journal tĩnh cũ (bài viết, category filter) giữ nguyên
hoàn toàn — section mới chỉ chèn thêm phía trên.

---

## 5. Learning Journey View (Hành trình của tôi)

`GrowthActivityPanel variant="journey"` thêm vào `/portal/journey` — đọc
`getJourneyProgress()` (`growth-view.ts`), tổng hợp từ
`WorkspaceSessionRecord` thật: mỗi Mission đã thử → 1 dòng (mục tiêu, số
Output đã tạo, trạng thái Hoàn thành/Đang làm). Đây là **tiến độ thật**,
không phải Progress Bar phần trăm ước lượng như nội dung tĩnh cũ
(`CurrentJourneyCard`/`GrowthPathTimeline` giữ nguyên, không đổi). Journey
→ Collection → Mission → Output → Growth thể hiện qua việc mỗi dòng gắn
`journeyId`/`missionId` thật từ Context đã lưu.

---

## 6. Garden Model (Khu vườn của bạn)

`GrowthActivityPanel variant="garden"` thêm vào `/portal/khu-vuon-cua-ban`
(chèn trước Footer, không đụng `GardenScene`/thiết kế đã được Founder
duyệt — RECREATE MODE giữ nguyên). Đọc `getGardenSummary()`
(`growth-view.ts`): đếm thật từ `WorkspaceSessionRecord` — Mission hoàn
thành → "Cây", Journey đã chạm → "Khu vực", `module` khác nhau đã thực
hành → "Loài cây" (xấp xỉ — **chưa có Capability Engine thật** để map
đúng theo Competency, ghi nhận là gap cho Sprint B5), tổng Output → số
liệu phụ. **Không Gamification, không điểm, không XP** — chỉ đếm số
lượng thật; nếu `totalOutputs === 0`, hiển thị "Khu vườn còn trống" thay
vì vẽ cây giả.

---

## 7. Relationship

```
Workspace ──sinh──> Output ──đủ điều kiện (Review+Reflection)──> Portfolio
   │                                                                 │
   └──sinh──> GrowthEvent ──đọc bởi──> Nhật ký / Hành trình / Khu vườn
```

- **Portfolio Connection**: đọc Output/Review/Reflection/Capability/AI
  Impact — không lưu riêng (chỉ tham chiếu `outputId`).
- **Review Connection**: Review không lưu trong Companion — thuộc
  `Output.reviewStatus` (Workspace sở hữu), Portfolio chỉ đọc lại.
- **Reflection Connection**: Reflection thuộc `Output.reflections[]`,
  không thuộc Journey/Workspace riêng — Portfolio đọc từ đây.
- **Growth Connection**: 1 `GrowthEvent`, nhiều module đọc (Nhật ký/Hành
  trình/Khu vườn — Dashboard/Capability chưa có Engine thật, chờ B5).

Không phát hiện dữ liệu trùng — `growth-view.ts` chỉ đọc (read-only), không
tạo bảng lưu trữ song song với `workspace-session-store.ts`/
`portfolio-store.ts`/`growth-event-bus.ts`.

---

## 8. Future Ready

Chuẩn bị (chưa implement): Portfolio Search, Portfolio Filter, Portfolio
Export, Public Portfolio, Showcase — `PortfolioItemRecord.tags[]` và
`status: "active"|"archived"` đã đủ field nền tảng để Search/Filter sau
này lọc theo tag/trạng thái mà không cần đổi schema; `status` cũng chuẩn
bị sẵn cho Public Portfolio (thêm `"public"` vào union khi cần, không phải
thêm field mới).

---

## Ghi chú xác thực (Build Safety)

- `npx tsc --noEmit`: sạch.
- `npm run build`: thành công, route list không đổi (không route mới).
- `npm run lint`: chỉ 5 warning `<img>` đã biết từ trước (đã dọn 2 warning
  eslint-disable dư thừa phát sinh trong lúc code).
- `npx vitest run`: 56/56 pass.
- File thay đổi: `data-model.ts`/`growth-event-bus.ts` (2 event type
  mới), `workspace-session-store.ts` (`listAllSessions` export +
  `REVIEW_COMPLETED` emission), `WorkspaceMvp.tsx` (gọi
  `promoteEligibleOutputs` sau Reflection + hiển thị Version History).
  3 file mới: `portfolio-store.ts`, `growth-view.ts`,
  `GrowthActivityPanel.tsx`. 3 trang chỉnh sửa tối thiểu (chỉ thêm 1
  import + 1 dòng JSX mỗi trang): `journey/page.tsx`, `news/page.tsx`,
  `khu-vuon-cua-ban/page.tsx`. Academy/Companion/Admin: không đổi.
- Cùng giới hạn như B2/B3: chưa QA được qua trình duyệt thật (môi trường
  không có session Supabase Auth đăng nhập).

---

VO DUONG AI không lưu việc người học đã xem — lưu những gì người học đã
tạo ra. Portfolio là bộ sưu tập thành quả thật, Growth là lịch sử trưởng
thành thật — cả hai đều rỗng trung thực khi người dùng chưa làm gì, không
bao giờ hiển thị số liệu giả để trông "đầy đủ hơn."
