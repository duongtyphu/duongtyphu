# AI Department Dashboard — thiết kế màn hình (design-only)

Tài liệu kiến trúc — không code, không UI thật. Thiết kế 1 màn hình
tổng hợp theo từng trong 7 Department, để Owner/Companion (COO) nhìn
thấy Workforce đang hoạt động ra sao — **đọc từ dữ liệu thật đã có**
(Growth Event Bus, Workspace Session, Agent Run Log, Portfolio), không
tạo số liệu giả, đúng tinh thần đã khóa ở `growth-view.ts` ("không dùng
dữ liệu giả để lấp chỗ trống").

## 1. Vị trí trong Portal (đề xuất, chưa triển khai)

Không tạo route mới ở sprint này. Khi triển khai (Sprint sau), Dashboard
này là 1 tab/section trong khu vực Companion/Workspace hiện có — không
phải Admin Dashboard (Admin Dashboard là của chủ Portal, cái này là của
Owner nhìn Workforce của chính họ).

## 2. Nguồn dữ liệu — 100% tái dùng, không tạo store mới

| Dữ liệu hiển thị | Đọc từ (đã có) |
|---|---|
| Danh sách Companion theo Department + trạng thái | `AI Workforce Registry` (roster tĩnh, §3 `AI_WORKFORCE_REGISTRY.md`) |
| Số Output mỗi Department đã tạo | `listAllSessions()` → `session.outputs`, lọc theo Companion/Department qua `missionId` → `primaryCompetencyId` (đã có trong `mission-catalog.ts`) |
| Số lần Agent thật đã chạy | `listAgentRuns(sessionId)` (`agent-run-store.ts`) |
| Trạng thái Approval | `OutputRecord.approvalStatus` |
| Growth Event liên quan Agent | `readGrowthEvents()` lọc `AGENT_RUN_*`, `OUTPUT_REVIEWED`, `USER_APPROVAL_REQUIRED` |
| Portfolio đã hoàn thành theo Department | `listPortfolioItems()` lọc theo `missionId` → map ngược ra Department qua `primaryCompetencyId` |

**Không có số liệu nào trên Dashboard này được tính nếu Owner chưa từng
làm việc thật** — giữ đúng nguyên tắc "trang gọi phải tự xử lý trạng
thái rỗng, không hiển thị số liệu bịa" đã khóa ở `growth-view.ts`.

## 3. Layout màn hình (mô tả, không phải code JSX)

```
┌─────────────────────────────────────────────────────────┐
│  AI Workforce — Tổng quan 7 Department                   │
│  (rỗng nếu Owner chưa từng chạy Workspace nào)            │
├─────────────────────────────────────────────────────────┤
│ [📖 Research]  [✍️ Content]  [📈 Business]  [🎨 Creative] │
│ [⚙️ Technology] [📊 Office]   [🌱 Growth]                  │
│  ── mỗi ô là 1 Department Card (chi tiết §4) ──           │
└─────────────────────────────────────────────────────────┘
```

Click vào 1 Department Card → mở **Department Detail View** (§5), liệt
kê từng Companion trong Department đó.

## 4. Department Card — nội dung mỗi ô

| Trường hiển thị | Nguồn |
|---|---|
| Tên + icon Department | tĩnh, từ `AI_COMPANION_DEPARTMENTS.md` |
| Số Companion đang "agent-live" / tổng số Companion | Workforce Roster |
| Số Output đã tạo bởi Department này (all-time) | tính từ Session Output đã map Department |
| Số Output đang chờ Approve (`approvalStatus !== "approved"`) | tính từ Output |
| Trạng thái rỗng: "Chưa có hoạt động nào ở Department này" | khi Owner chưa từng dùng Blueprint nào thuộc Department đó |

## 5. Department Detail View — khi click vào 1 Department

| Trường hiển thị | Nguồn |
|---|---|
| Danh sách Companion trong Department (tên + Mission 1 dòng) | `AI_COMPANION_REGISTRY.md` |
| Trạng thái từng Companion (`designed`/`agent-live`) | Workforce Roster |
| Output gần nhất Companion đó góp phần tạo ra (nếu suy luận được qua Blueprint) | Session Output + `missionId` |
| Nút "Bắt đầu Workspace mới cho Department này" | trỏ về `startCompanionWorkspace` với `module`/`missionId` phù hợp — tái dùng CTA đã khóa, không tạo entry point mới |

## 6. Nguyên tắc thiết kế bắt buộc (áp dụng khi cài đặt thật, Sprint sau)

1. **Read-only tuyệt đối** — Dashboard không có nút ghi/sửa dữ liệu
   Workforce trực tiếp; mọi hành động (Approve, chạy Agent...) vẫn qua
   đúng luồng Workspace đã khóa, Dashboard chỉ là cửa sổ nhìn vào, giống
   cách `growth-view.ts` được thiết kế cho Learning Journal/My Journey.
2. **Không hiển thị số liệu suy diễn** — nếu 1 Output không map được rõ
   ràng về 1 Department cụ thể (vd `missionId` chưa có
   `primaryCompetencyId`), Dashboard phải hiển thị "chưa phân loại",
   không ép về 1 Department sai.
3. **Không quảng cáo Companion "designed" như đã hoạt động thật** — mỗi
   Companion `status: "designed"` phải có nhãn rõ ràng khác biệt với
   `"agent-live"` trên UI (tương tự nhãn `isMock: true` đã dùng ở MVP),
   tránh Owner hiểu nhầm 29/30 Companion đã chạy AI thật.
4. **Không phá Companion Presence hiện có** — Dashboard là 1 view dữ
   liệu mới, không thay thế CompanionSpace/CompanionPresence đã có ở
   Sprint 8.x — 2 UI phục vụ mục đích khác nhau (đồng hành cảm xúc vs.
   quản trị Workforce).

## 7. Việc KHÔNG làm ở Sprint này

- Không viết component React nào cho Dashboard này.
- Không tạo route mới trong `src/app/portal/`.
- Không tính toán số liệu thật (vì chưa có code) — tài liệu này chỉ mô
  tả **Dashboard sẽ đọc từ đâu và hiển thị gì** khi được cài đặt.
