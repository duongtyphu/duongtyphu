# Return After Silence

Sprint 18.0 — Return After Silence Ceremony. Xem `docs/CEREMONY_FRAMEWORK.md`,
`growth-signals.ts` (`deriveComebackSignals`), `growth-milestones.ts`
(`return-after-silence`, `first-comeback`, `quiet-season`).

## Triết lý

VO DUONG AI không thưởng cho việc chưa từng ngã. VO DUONG AI trân
trọng việc một con người đủ dũng cảm để quay trở lại.

Một khoảng lặng không phải một thất bại cần được "khôi phục". Nó chỉ
là một phần thật của hành trình — và việc quay lại, dù sau bao lâu,
đáng được chào đón đúng như lần đầu tiên một người ghé Portal.

## Khoảnh khắc

Growth Map (Sprint 14.0) đã định nghĩa `comeback-after-silence` và các
milestone `first-comeback` / `return-after-silence` / `quiet-season` —
nhưng chưa từng có nơi nào trên UI ghi nhận chúng. Return After Silence
Ceremony là nơi đầu tiên những tín hiệu đó được Companion thật sự nói
ra, khi milestone `return-after-silence` vừa xảy ra gần đây (trong vòng
7 ngày, theo ngưỡng đã có ở `growth-milestones.ts`).

## Bốn nhịp

- **Opening**: Companion không nói "Bạn đã vắng mặt N ngày" — không có
  con số nào, không nhắc thời gian. Một câu duy nhất: "Chào bạn, mình
  rất vui vì bạn đã quay lại."
- **Reflection**: Garden phản ứng rất nhẹ — một chồi non / một ánh sáng
  mới, thuần trang trí, không phải một thay đổi trạng thái Garden thật
  (`garden-model.ts` không bị ảnh hưởng). Tuyệt đối không dùng ngôn ngữ
  "khôi phục streak", không liệt kê những gì đã bỏ lỡ.
- **Companion**: hiện diện qua `CompanionAvatar`, chỉ ghi nhận sự trở
  lại — không hỏi vì sao đã vắng mặt, không yêu cầu giải thích.
- **Closing**: một câu giữ lại cảm giác được chào đón, ví dụ: "Mình vẫn
  ở đây. Và mình rất vui vì bạn cũng vậy." Không CTA, không ép tiếp tục
  một nhiệm vụ cụ thể.

## Mirror

Mirror (`/portal/mirror`) ghi nhận thêm một dòng riêng khi có milestone
`return-after-silence` hoặc `quiet-season`: "Có những khoảng lặng cũng
là một phần của hành trình." — không phân tích, không đặt câu hỏi.

## Boundary

- Không bao giờ dùng ngôn ngữ tội lỗi/FOMO ("bạn đã bỏ lỡ", "đừng để
  mất tiến độ", "khôi phục streak").
- Không gửi thông báo/email nhắc nhở trước khi người dùng tự quay lại —
  nghi thức chỉ kích hoạt SAU KHI người dùng đã tự quyết định trở lại.
- Chỉ xuất hiện một lần cho mỗi lần-trở-lại (mỗi milestone mới, theo
  `occurredAt` của nó) — không lặp lại mỗi lần ghé Portal sau đó.

## Trạng thái

Đã hiện thực hóa tại Sprint 18.0
(`ReturnAfterSilenceCeremony.tsx`, `src/app/portal/layout.tsx`,
`src/app/portal/mirror/page.tsx`).

## Presence Coordinator (Sprint 18.8)

Từ Sprint 18.8, `ReturnAfterSilenceCeremony` không còn render trực tiếp ở
`layout.tsx` ngoài governance. `milestoneOccurredAt` được thread xuống
`CompanionPresence.tsx` qua `PortalShell`, và component chỉ thật sự hiện khi
`presence-coordinator.ts` chọn `"return-after-silence"` là moment cao nhất
(qua `chooseCompanionMoment()`, Sprint 18.6) — ví dụ không hiện cùng lúc với
Greeting. Logic điều kiện hiển thị gốc (`hasSeenForMilestone`) không đổi —
chỉ lộ thêm `isReturnAfterSilenceEligibleToShow()` để coordinator dùng lại,
không đoán lại. Xem `docs/PRESENCE_COORDINATOR.md`.
