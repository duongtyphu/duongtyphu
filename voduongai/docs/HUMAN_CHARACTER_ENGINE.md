# Human Character Engine (Sprint 7.5)

> "AI giúp con người đi nhanh hơn. Nhưng nhân cách mới quyết định họ sẽ đi đến đâu."

Đây là một chương của Product Bible VO DUONG AI. Nó không mô tả một tính
năng — nó mô tả một niềm tin: Portal không chỉ truyền tri thức, Portal
truyền khí chất, bản lĩnh, hy vọng, lòng nhân ái, và tinh thần không bỏ
cuộc. Implementation đi cùng tài liệu này nằm ở:
`src/lib/portal/warrior-spirit.ts`, `small-victories.ts`,
`when-life-is-hard.ts`, `character-moments.ts`.

## Warrior Spirit

"Chiến binh VO DUONG AI" không phải người mạnh nhất hay người đi nhanh
nhất. Đó là người giữ được 7 phẩm chất qua thời gian, kể cả những ngày
không có gì diễn ra rõ ràng: **Kiên định, Kỷ luật, Can đảm, Khiêm tốn,
Chính trực, Phụng sự, Hy vọng**.

Framework này là một ống kính để Portal nhìn người dùng qua, không phải
một thước đo để chấm điểm họ. Không ai "đạt" hay "chưa đạt" một phẩm chất
— mỗi người chỉ đang nuôi dưỡng nó theo nhịp của riêng mình. Chi tiết đầy
đủ (ý nghĩa / dấu hiệu trưởng thành / điều nên khích lệ / điều tuyệt đối
không nên nói / ví dụ giao tiếp cho từng phẩm chất) nằm trong
`warrior-spirit.ts` — đây là nguồn duy nhất, không lặp lại ở đây để tránh
hai bản dễ lệch nhau.

## Character Principles

- Character không phải điều Portal *dạy*. Character là điều Portal *nhận
  ra* ở người dùng và phản chiếu lại cho họ thấy.
- Mọi phản hồi về phẩm chất phải theo đúng `PORTAL_COMPANION_RULES.md`:
  lắng nghe trước, gợi mở sau, hướng dẫn cuối cùng.
- Không bao giờ dùng phẩm chất như một cây roi ("Bạn nên kiên trì hơn").
  Chỉ dùng như một tấm gương ("Mình nhận thấy bạn đang kiên trì với điều
  này").

## Small Victories

Đa số tăng trưởng thật của một con người không nằm ở những cột mốc lớn —
nó nằm ở những lần rất nhỏ: quay lại sau khi vắng mặt, viết Reflection
đầu tiên, lưu lại Prompt đầu tiên, giúp một người khác, hoặc đơn giản là
không bỏ cuộc hôm nay. Portal ghi nhận những điều này bằng một câu chân
thành (`small-victories.ts`), không bằng pháo hoa, huy hiệu, hay điểm số.

## Encouragement Philosophy

Khích lệ không phải là cổ động. Một câu khích lệ đúng của Portal:

- Không hứa hẹn một kết quả Portal không kiểm soát được.
- Không yêu cầu người dùng phải cảm thấy tốt hơn ngay.
- Đứng được một mình, không cần một CTA đi kèm để "hoàn thiện" nó.

## Never Give Up Philosophy

Khi cuộc sống của người dùng đang khó khăn (`when-life-is-hard.ts`),
Portal không nói "cố lên" — Portal nói rằng một bước nhỏ cũng đủ, rằng
không cần phải mạnh mẽ mọi lúc, rằng việc họ vẫn ở đây đã là một điều có
ý nghĩa. Tinh thần không bỏ cuộc không được dạy bằng lời hô hào — nó được
truyền bằng việc Portal vẫn ở đó, kiên nhẫn, qua mọi giai đoạn của người
dùng.

## Founder Principle

Trước khi đưa bất kỳ dòng copy nào về Character vào Portal, nó phải qua
được câu hỏi: **"Nếu chính mình đang trải qua một ngày rất khó khăn, mình
có muốn đọc câu này không?"** Nếu câu trả lời là không, viết lại. Đây là
phiên bản Sprint 7.5 của Founder Principle đã có từ Sprint 7.3 — cùng một
bài kiểm tra, áp dụng nghiêm hơn vì lần này nói về nhân cách, không chỉ về
trải nghiệm.

## No Gamification (ràng buộc tuyệt đối)

Character không phải một trò chơi. Tuyệt đối không:

- XP, điểm số, Level, Rank
- Leaderboard / bảng xếp hạng
- Badge sưu tầm hoặc Achievement săn điểm

Character là để sống, không phải để khoe. Mọi tính năng tương lai động
đến tầng này phải đi qua bài kiểm tra: *tính năng này khiến người dùng
muốn trở thành người tốt hơn, hay khiến họ muốn có thêm một huy hiệu?*
Nếu là huy hiệu — không xây.
