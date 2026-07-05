# PROGRAM: PRODUCTION BETA — Program Board

> Từ chỉ đạo này, dự án chuyển từ **Sprint Mode** sang **Program Mode**.
> Có đúng 1 Program: **PRODUCTION BETA**, chia thành 5 Track. Mục tiêu
> duy nhất: đưa VO DUONG AI lên Production Beta trong thời gian ngắn
> nhất với chất lượng cao. Không thay đổi kiến trúc đã khóa.
>
> Board này tính được thật (`src/lib/portal/foundation/program-board.ts`,
> verify bằng `program-board.test.ts`) — dùng lại ĐÚNG checklist thật đã
> có ở `goal-001-dashboard.ts` (không tạo 2 nguồn sự thật khác nhau), chỉ
> nhóm lại theo Track + thêm phần Goal Runtime cho Track E.

## 5 Track

| Track | Tên | Phạm vi | Phụ thuộc |
|---|---|---|---|
| **A** | Core Runtime | Workspace Session Kernel + Growth Event Bus (khóa từ Sprint B2) | Không |
| **B** | AI Workforce | Workforce Registry (30 Companion/7 Department) + Companion Manager | A |
| **C** | AI Operating Center | AI Service Registry/Manager, 10 Provider Adapter, Model Router | A |
| **D** | Workspace Runtime | Output/Review/Approval Center, Portfolio Sync, Memory Sync | A, B, C |
| **E** | Production Goals | Goal Runtime chung + Landing Page Production (Goal đầu tiên) | D |

**Nguyên tắc 1 & 2**: A là nền tảng, không phụ thuộc — B và C triển
khai **song song** (đều chỉ phụ thuộc A). D phải chờ cả A, B, C xong.
E phải chờ D xong (Mission chỉ chạy được khi Workspace Runtime đã sẵn
sàng nhận Output/Review/Approval/Portfolio).

## Trạng thái hiện tại (snapshot từ `computeProgramBoard()`)

| Track | Progress | Status | Risks | Blockers | ETA |
|---|---|---|---|---|---|
| A — Core Runtime | **100%** | done | Kernel còn lưu localStorage, chưa chịu tải nhiều User/thiết bị thật | — | Đã sẵn sàng cho Production Beta ở quy mô single-owner/browser |
| B — AI Workforce | **67%** | in_progress | performanceScore Companion vẫn tĩnh, chưa cập nhật từ Task hoàn thành thật | Chưa verify được Provider thật (không phải Mock) trong sandbox này | Sẵn sàng chức năng; cần môi trường có API key thật để verify Provider trước Production Beta |
| C — AI Operating Center | **60%** | in_progress | ProviderScore hiện là prior tự khai báo, chưa dựa trên dữ liệu đo thật | Chưa có Provider thật verify với API key thật trong sandbox này | Cần 1 vòng verify với ít nhất 1 Provider thật trước khi tuyên bố Production Beta |
| D — Workspace Runtime | **57%** | in_progress | UI Output Center còn hiển thị raw text cho đa số loại Output; chưa có UI Memory Panel | — | Chức năng lõi đã chạy E2E thật (Facebook Content); còn thiếu polish UI, không chặn Production Beta chức năng |
| E — Production Goals | **50%** | in_progress | Mới 1/10 Golden Mission Blueprint có E2E verify thật; Collaboration Matrix nhiều Companion nối tiếp chưa chạy thật | — | Mission 01 (Research & Planning) sẵn sàng bắt đầu — đang chờ xác nhận Owner |

**Overall Program Progress: 67%** (trung bình 5 Track).

Chi tiết checklist item từng Track (đúng/sai cụ thể) xem
`src/lib/portal/foundation/program-board.ts` — nguồn sự thật duy nhất;
bảng trên chỉ là ảnh chụp tại thời điểm viết, cập nhật lại mỗi vòng
Program khi sự thật thay đổi.

## Nguyên tắc PR (bắt buộc từ nay)

Mọi Pull Request phải gắn đủ 4 tag trong tiêu đề hoặc mô tả:

```
Program: PRODUCTION BETA
Track: <A|B|C|D|E> — <tên Track>
Mission: <tên Mission liên quan, nếu có>
Goal: <tên Goal Runtime liên quan, vd "Landing Page Production">
```

Nếu 1 PR không gắn được cả 4 tag — nghĩa là thay đổi đó không phục vụ
trực tiếp GOAL 001/Program PRODUCTION BETA, không triển khai.

## Cuối mỗi vòng phát triển (Definition of Round-Done)

Mỗi Track, khi báo cáo hoàn thành 1 vòng, phải đi qua đủ 4 bước:

1. **Technical Acceptance** — `tsc --noEmit` / `npm run build` / `npm run
   lint` / `npx vitest run` đều pass, không regression.
2. **Product Acceptance** — trả lời được: Người dùng làm được điều gì
   mới? Track này tiến Program bao nhiêu %?
3. **Runtime Demo** — có lệnh `curl`/kịch bản test tái hiện được, không
   chỉ mô tả bằng lời.
4. **Owner Approval** — Owner xác nhận trước khi merge/tiếp tục vòng kế
   tiếp.

## Cách đọc/cập nhật Board

- Track A/B/C/D dùng lại checklist đã có ở `goal-001-dashboard.ts`
  (Workforce/Blueprint/Workspace/AI Provider/Portfolio/Memory Progress)
  — Program Board không tính lại % theo cách khác, chỉ nhóm lại theo
  đúng ranh giới Track.
- Track E cộng thêm 3 mục thật lấy trực tiếp từ `goal-runtime.ts`: Goal
  Runtime hoạt động, Landing Page Production đã gieo, có Mission nào
  hoàn thành chưa — không suy diễn.
- `status` mỗi Track: `blocked` nếu có Blocker thật; `done` nếu Progress
  = 100%; còn lại là `in_progress` (bao gồm cả trường hợp đang chờ
  dependency — Track vẫn có thể tự hoàn thiện phần việc của mình song
  song trong lúc chờ, chỉ không được COI LÀ XONG cho tới khi dependency
  cũng xong).
