# GOAL 001 — Production Beta

> Từ Sprint này trở đi: **Production Validation Mode**. Mọi công việc
> phải phục vụ trực tiếp GOAL 001. Không kiến trúc mới, không Epic mới,
> không Phase mới — chỉ triển khai hạng mục còn thiếu để đạt Production
> Beta. Dashboard này tính toán được thật (`goal-001-dashboard.ts`,
> verify bằng test), không phải con số cảm tính.

**Definition of Success**: VO DUONG AI có thể tự sử dụng chính mình để
hoàn thành các Goal thực tế.

**Bằng chứng đầu tiên (đã có)**: E2E test Sprint 003
(`workspace-runtime-integration.test.ts`) chạy đúng 1 Goal thật — *"Tạo
bài Facebook giới thiệu VO DUONG AI"* — qua trọn Runtime Flow (Companion
→ Provider → Output → Review → Approval → Portfolio → Memory). Đây là
lần đầu tiên hệ thống "tự dùng chính mình" theo đúng nghĩa Definition of
Success, dù mới ở dạng test tự động, dùng Mock Provider, chưa phải một
phiên làm việc thật của Owner qua UI trên trình duyệt.

---

## Goal Dashboard (tính từ `computeGoal001Progress()`)

| Hạng mục | % | Ghi chú |
|---|---|---|
| **Overall Progress** | **63%** | Trung bình 6 hạng mục dưới |
| Workforce Progress | 67% (4/6) | 30/30 Companion + 7/7 Department + Lifecycle + Companion Manager đã chạy thật. Thiếu: Provider thật đã verify, Performance đo thật (còn tĩnh 50) |
| Blueprint Progress | 60% (3/5) | 10/10 Golden Mission + Blueprint Lock + Execution Timeline đã chạy thật. Thiếu: 9/10 Blueprint chưa có E2E verify, Collaboration Matrix chưa chạy thật (mới tài liệu hoá) |
| Workspace Progress | 71% (5/7) | Kernel + Companion→Output + Memory Sync + Event Timeline đã chạy thật. Thiếu: backend bền vững (còn localStorage), UI Output Center chưa đẹp cho 28/30 Companion (raw text) |
| AI Provider Progress | 60% (3/5) | AI Service Registry/Manager + 10/10 Adapter + Routing/Fallback/Cost Optimization đã chạy thật. Thiếu: chưa verify Provider thật với API key thật, ProviderScore vẫn là prior tự khai báo |
| Portfolio Progress | 60% (3/5) | Auto-promote + Single Source of Truth + E2E verify đã chạy thật. Thiếu: backend bền vững, UI hiển thị rõ Companion/Provider |
| Memory Progress | 60% (3/5) | Contract + Sync thật + idempotent đã chạy thật. Thiếu: UI Memory Panel, phản hồi ngược vào Learning Coach |

Chi tiết từng checklist item (đúng/sai cụ thể) xem
`src/lib/portal/foundation/goal-001-dashboard.ts` — nguồn sự thật duy
nhất, Dashboard doc này chỉ là ảnh chụp lại tại thời điểm viết.

## Cách đọc Dashboard

- Mỗi hạng mục = 1 checklist cụ thể, đếm được (`done: true/false`),
  % = số mục đạt / tổng số mục — không làm tròn lên khi chưa có bằng
  chứng.
- Test `goal-001-dashboard.test.ts` khoá Dashboard vào dữ liệu registry
  thật (30 Companion, 10 Golden Mission) — nếu số liệu trôi khỏi thực
  tế, test fail, không để Dashboard nói dối.

---

## Sprint Report Template (bắt buộc cho mọi Sprint từ nay)

1. **Goal tiến thêm bao nhiêu %?** — so sánh `overallPercent` trước/sau
   Sprint qua `computeGoal001Progress()`.
2. **Người dùng làm được điều gì mới?** — 1-2 câu, cụ thể, không chung
   chung.
3. **Workforce mạnh hơn ở điểm nào?** — hạng mục nào trong Workforce
   Progress chuyển từ `false` → `true`.
4. **Có demo chạy được không?** — lệnh `curl`/test cụ thể để tái hiện.
5. **Có build/test pass không?** — `tsc --noEmit` / `npm run build` /
   `npm run lint` / `npx vitest run`, dán kết quả cuối.

## Nguyên tắc PR

Mọi thay đổi kể từ hôm nay phải trả lời được: **"Thay đổi này giúp
`overallPercent` của GOAL 001 tăng ở hạng mục nào?"** Nếu không trả lời
được — không triển khai.

## Ưu tiên tiếp theo (theo hạng mục còn thấp nhất, không phải cảm tính)

Dựa trên Dashboard hiện tại, 5 hạng mục đang ở 60% (thấp nhất, đồng
hạng) — bất kỳ hạng mục nào trong số này đều là ứng viên hợp lý cho
Sprint kế tiếp: Blueprint (verify thêm Blueprint E2E), AI Provider
(verify 1 Provider thật nếu có key), Portfolio, Memory (UI + phản hồi
Capability). Quyết định cụ thể Sprint nào để lại cho chỉ đạo tiếp theo —
tài liệu này không tự chọn Sprint kế tiếp thay quyết định của Owner.
