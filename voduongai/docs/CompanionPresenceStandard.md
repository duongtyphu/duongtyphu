# Companion Presence Standard

EPIC 02 — Sprint 04, Nhiệm vụ 01. Chuẩn hoá 9 trạng thái tối thiểu của Companion và cách mỗi
trạng thái nên "cảm thấy" như thế nào — không phải chỉ là tên biến.

## 9 trạng thái

| Trạng thái | Khi nào | Cảm giác cần tạo ra |
|---|---|---|
| `SILENT` | Không có Work Session, người dùng chưa tương tác | Hiện diện rất nhẹ, không nói |
| `OBSERVING` | Vừa nhận một hành động thật (route/click) | "Mình thấy bạn đang ở đây" |
| `THINKING` | Vừa hiểu xong mục tiêu, đang cân nhắc | Tạm dừng ngắn — không vội trả lời ngay |
| `PLANNING` | Đang chia nhỏ việc | Có định hướng rõ, không mơ hồ |
| `INVITING_AGENT` | Chuẩn bị mời 1 Specialist | Chủ động, không chờ người dùng yêu cầu |
| `WAITING_AGENT` | Specialist "đang làm" (mô phỏng) | Không rời đi — vẫn đang đồng hành, không phải màn hình loading vô cảm |
| `SYNTHESIZING` | Đang gộp kết quả từ các Specialist | Đang chọn lọc, không chỉ dán lại nguyên văn |
| `READY` | Có kết quả + bước tiếp theo | Rõ ràng, mời người dùng hành động tiếp |
| `CELEBRATING` | Người dùng vừa xác nhận đã hoàn thành/thử | Ghi nhận thật, không phải hiệu ứng confetti vô nghĩa |

## Quy tắc hiển thị

1. **Không có Work Session → luôn là `SILENT`/`OBSERVING` mặc định.** Companion không tự bịa ra
   trạng thái "đang làm việc" khi không có hành động thật nào kích hoạt.
2. **Một trạng thái tại một thời điểm.** Không hiển thị 2 trạng thái cùng lúc trên UI.
3. **Chuyển trạng thái phải có nhịp** (~1.3s/bước trong bản rule-based hiện tại — xem
   `use-companion-work-session.ts`), không nhảy thẳng từ `OBSERVING` sang `READY`.
4. **Không có trạng thái nào hiển thị số liệu** ("80% hoàn thành", "3/5 bước") — dùng checklist
   ✓/●/○ theo tên bước, không phải phần trăm (giữ đúng nguyên tắc "không LMS" của EPIC 02).
5. **`READY` không tự động chuyển sang `CELEBRATING`.** Chỉ người dùng xác nhận
   ("Mình đã thử rồi") mới kích hoạt `CELEBRATING` — Companion không tự ăn mừng thay người dùng.

## Ánh xạ sang hệ visual hiện có

Sprint 04 **không xây lại** hệ thống visual Living Core/mood đã có (Sprint 8.x) — chỉ ánh xạ
9 trạng thái Work Session vào 6 mood key đã tồn tại (`idle`/`listening`/`thinking`/
`encouraging`/`celebrating`/`comeback`, xem `companion-identity.ts`):

| Companion Status | Mood key hiện có |
|---|---|
| `SILENT`, `OBSERVING` | `idle` |
| `THINKING`, `PLANNING`, `INVITING_AGENT`, `WAITING_AGENT`, `SYNTHESIZING` | `thinking` |
| `READY` | `encouraging` |
| `CELEBRATING` | `celebrating` |

Xem `CompanionPresence.tsx` (biến `workSessionMoodKey`) cho cách ánh xạ thật trong code.

## Vị trí trong code

- Types: `src/companion/work-session/work-session.types.ts`
- Engine (pure, testable): `src/companion/work-session/work-session-engine.ts`
- Hook điều khiển nhịp: `src/companion/work-session/use-companion-work-session.ts`
- UI: `src/components/portal/companion/CompanionWorkSessionPanel.tsx`
