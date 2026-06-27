# Companion Integration V1 (Sprint 8.2)

> "Gọi Companion bước ra ánh sáng."

Sprint đầu tiên đưa Companion thành một sự hiện diện thật trong Portal,
không chỉ là tài liệu hay copy. Tài liệu này mô tả Companion Presence là
gì, vì sao nó không phải chatbot, bản sắc thị giác đã hoàn thiện, hệ
trạng thái, quy tắc tương tác, và lộ trình tiếp theo.

## Companion Presence là gì?

Một sự hiện diện ấm áp, luôn ở một góc của Portal (góc dưới-phải trên
desktop, nổi nhẹ ở dưới trên mobile) — không che nội dung chính, không
ép buộc tương tác. Người dùng tự quyết định có mở Companion Space hay
không; Companion không bao giờ tự bật lên.

## Vì sao không phải Chatbot?

Theo `docs/THE_COMPANION.md` và `docs/THE_COMPANION_CONSTITUTION.md`,
Companion không tồn tại để trả lời nhanh nhất — nó tồn tại để người
dùng không cảm thấy đơn độc. Ở V1, chưa có AI model thật phía sau, nên
Companion Space không giả vờ có cuộc trò chuyện AI thật — nó nói thẳng:
"Trò chuyện sâu với Companion đang được chuẩn bị." Đây là một sự hiện
diện (Presence), không phải support widget, không phải popup quảng cáo,
không phải cửa sổ chat kiểu ChatGPT/Messenger/Intercom.

## Bản sắc thị giác (đã khóa theo Master Design V1.0)

Xem đầy đủ tại `docs/design/companion/Companion_Guidelines.md`. Tóm
tắt: viên ngọc/tinh thể sống hình cầu, gradient navy-blue → blue →
violet, halo vàng kim.

**Hai chữ V:**

- **V trắng ở trung tâm** — trái tim, sự kết nối, bản sắc VO DUONG AI.
- **V vàng kim ở đỉnh** — nguồn sáng, trí tuệ, định hướng, tinh thần
  dẫn đường.

Hai chữ V này còn mang ý nghĩa cá nhân của Founder — **"Võ và Văn"**.

## Hệ trạng thái (5 trạng thái)

| Trạng thái | Câu nói | Khi nào xuất hiện |
|---|---|---|
| Lặng yên (`idle`) | "Mình đang ở đây." | Mặc định, các route chưa map |
| Lắng nghe (`listening`) | "Mình đang lắng nghe." | `/portal/story`, `/portal/legacy`, `/portal/ai-assistant` |
| Suy nghĩ (`thinking`) | "Mình đang suy nghĩ." | `/portal/knowledge` |
| Truyền cảm hứng (`encouraging`) | "Mình có một điều muốn chia sẻ." | `/portal`, `/portal/home`, `/portal/build`, `/portal/connect` |
| Chúc mừng (`celebrating`) | "Mình rất vui vì bạn đã tiến thêm một bước." | Dự trữ cho các khoảnh khắc cột mốc — chưa có trigger tự động ở V1 |

Định nghĩa đầy đủ tại `src/lib/portal/companion/companion-identity.ts`
(`states`, `routeStateMap`, `getStateForPath`). Đây là ánh xạ đơn giản
theo route — không có logic phức tạp ở V1; một sprint sau có thể làm
state phản ứng theo hành vi thật (ví dụ vừa hoàn thành một mốc → chuyển
`celebrating` trong vài giây).

## Quy tắc tương tác

- Không tự động popup — người dùng luôn là người chủ động mở.
- Không badge thông báo, không số đỏ.
- Đóng được bằng nút X, bằng phím Escape, hoặc bấm ra ngoài overlay.
- Trên mobile, panel trượt lên từ dưới, không chiếm toàn màn hình, có
  thể đóng dễ dàng.
- Chuyển động chỉ là breathing/glow nhẹ — xem
  `docs/design/companion/Companion_Motion.md`.

## Companion Space — nội dung

1. Lời chào ấm: "Mình đang ở đây. Hôm nay bạn muốn chia sẻ điều gì?"
2. "Hôm nay của bạn" — placeholder dùng ngôn ngữ hedging (mình nhận
   thấy...), sẽ thay bằng dữ liệu Human Flow/Next Best Action thật khi
   có route phù hợp để truyền context vào.
3. "Điều Companion muốn chia sẻ" — lấy một dòng từ
   `warmth-engine.ts` (`getWarmthLine("encouragement")`).
4. Reflection prompt mời lưu lại một "dấu chân" nhỏ, kèm câu nói thẳng
   chưa có AI chat thật.
5. 3 CTA: "Chia sẻ với Companion" (→ `/portal/ai-assistant`, nơi đã có
   copy hội thoại Companion từ Sprint 7.6), "Mở My Story" (→
   `/portal/story`), "Tiếp tục hành trình" (→ `/portal/journey`).

## Tích hợp vào Portal

`CompanionPresence` được mount trong `PortalShell`
(`src/components/portal/PortalShell.tsx`) — áp dụng cho toàn bộ
`/portal/*`, không áp dụng cho Admin Dashboard (Admin có layout/shell
riêng, không dùng `PortalShell`).

## Asset system

Chưa có asset chính thức tách lớp từ Master Design — `CompanionCrystal`
(`src/assets/companion/placeholder/CompanionCrystal.tsx`) là một SVG
placeholder tạm thời, giữ đúng DNA + Identity theo
`Companion_Guidelines.md`, giảm hiệu ứng glow để nhẹ. Khi Product Team
có asset chính thức, thay nội dung trong `src/assets/companion/`, giữ
nguyên cấu trúc thư mục.

## Roadmap tiếp theo (đề xuất, chưa thực hiện)

- Kết nối state `celebrating` với một sự kiện thật (ví dụ hoàn thành
  một mốc trong Roadmap) thay vì chỉ định nghĩa tĩnh.
- Đưa dữ liệu Human Flow/Next Best Action thật vào mục "Hôm nay của
  bạn" khi có một điểm nối dữ liệu phù hợp.
- Khi có AI model thật (xem `COMPANION_BRAIN_ARCHITECTURE.md`), thay
  phần "Chia sẻ với Companion" bằng trò chuyện thật, vẫn tuân theo 8
  tầng suy nghĩ và Conversation Pipeline đã thiết kế.
- Khi Product Team xuất asset chính thức từ Master Design, thay thế
  `CompanionCrystal` placeholder.
