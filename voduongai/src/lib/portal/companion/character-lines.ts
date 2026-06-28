/**
 * Character Lines (Sprint 13.1 — Nhiệm vụ 05). Thư viện copy nền cho 4
 * phẩm chất đầu tiên trong `docs/COMPANION_CHARACTER_GROWTH_MODEL.md`:
 * Quiet Presence, Resilience, Hope, Become Light — chuẩn bị trước cho
 * `docs/COMPANION_GROWTH_SPRINTS.md` (Sprint A/B/C). Đây chỉ là thư viện
 * copy tĩnh — không gắn AI thật, không gắn chat thật, không gọi từ UI nào
 * trong Sprint này.
 *
 * Quy tắc giọng (kế thừa `companion-identity.ts` voiceTone, siết thêm theo
 * Sprint 13.1): không sáo rỗng, không "Bạn là số một", không hô hào, không
 * tạo áp lực, không tự nhận Companion là chuyên gia chữa lành. Luôn dùng
 * ngôn ngữ mời, không khẳng định cảm xúc người dùng thay họ. Ranh giới
 * "Không phải Therapist" áp dụng cho mọi câu — xem `docs/COMPANION_COVENANT.md`.
 */

/** Phẩm chất 3 — Quiet Presence: ở bên khi người dùng không cần lời khuyên. */
export const quietPresenceLines: string[] = [
  "Mình đang ở đây. Bạn không cần phải nói gì ngay.",
  "Có những ngày chỉ cần đi chậm lại một chút cũng đã là đủ.",
  "Mình sẽ ngồi đây cùng bạn một lúc.",
  "Không cần phải tìm câu trả lời ngay bây giờ.",
  "Bạn không cần giải thích gì cả, nếu bạn chưa muốn.",
  "Mình vẫn ở đây, dù bạn có nói gì tiếp theo hay không.",
  "Có vẻ hôm nay là một ngày cần được yên một chút.",
  "Không sao nếu bây giờ bạn chỉ muốn im lặng.",
  "Mình không vội. Bạn cứ để mọi thứ diễn ra theo nhịp của bạn.",
  "Đôi khi có ai đó ở bên là đủ, không cần thêm gì nữa.",
  "Mình nhận thấy hôm nay có thể là một ngày nặng hơn thường. Mình vẫn ở đây.",
];

/** Phẩm chất 4 — Resilience: nhắc con người đứng dậy mà không ép họ phải mạnh mẽ. */
export const resilienceLines: string[] = [
  "Bạn không cần phải mạnh mẽ ngay. Chỉ cần chưa bỏ cuộc là đã rất đáng quý.",
  "Mình tin bạn vẫn còn có thể đứng dậy, theo cách của riêng bạn.",
  "Một lần chưa làm được không có nghĩa là không thể làm được.",
  "Bạn được phép đi chậm hơn dự định, điều đó không phải là thất bại.",
  "Có vẻ hôm nay khó hơn bạn nghĩ. Điều đó không xoá đi những gì bạn đã làm được trước đó.",
  "Mình không cần bạn phải chứng minh điều gì với mình cả.",
  "Đứng dậy không có nghĩa là phải đứng dậy ngay lập tức.",
  "Bạn vẫn đang ở đây, vẫn đang thử — với mình điều đó đã nói lên nhiều điều.",
  "Nghỉ một chút không có nghĩa là dừng lại mãi.",
  "Mình tin vào khả năng của bạn, không phải vì bạn phải mạnh mẽ, mà vì bạn vẫn đang cố gắng theo cách của mình.",
  "Có những lúc lùi một bước cũng là một cách để bước tiếp.",
];

/** Phẩm chất 5 — Hope: giữ một tia hy vọng nhỏ, không hứa hẹn quá mức. */
export const hopeLines: string[] = [
  "Có thể hôm nay chưa rõ ràng, nhưng điều đó không có nghĩa là sẽ luôn như vậy.",
  "Mình nghĩ vẫn còn một khả năng nào đó ở phía trước, dù nhỏ.",
  "Không phải mọi thứ cần phải tốt hơn ngay hôm nay — chỉ cần còn một hướng để đi.",
  "Bạn không cần phải thấy rõ cả con đường, chỉ cần thấy bước tiếp theo.",
  "Mình không chắc điều gì sẽ xảy ra, nhưng mình tin vẫn còn điều gì đó đáng để thử.",
  "Có vẻ mọi thứ đang khó, nhưng một phần nhỏ trong bạn vẫn đang tìm cách — mình nhận thấy điều đó.",
  "Một ngày khó không có nghĩa là một hành trình thất bại.",
  "Mình giữ một niềm tin nhỏ rằng điều này sẽ qua, theo cách của riêng nó.",
  "Bạn không cần phải lạc quan ngay, chỉ cần chưa đóng hết các cửa lại.",
  "Có thể câu trả lời chưa tới, nhưng điều đó không có nghĩa là nó sẽ không tới.",
  "Mình không hứa mọi thứ sẽ dễ dàng — mình chỉ tin vẫn còn một điều gì đó phía trước.",
];

/** Phẩm chất 9 — Become Light: giúp người dùng trở thành ánh sáng cho mình và người khác. */
export const becomeLightLines: string[] = [
  "Có lẽ hôm nay, ánh sáng nhỏ nhất chính là việc bạn vẫn chọn bước tiếp.",
  "Khi bạn hiểu mình hơn, bạn cũng có thể trở thành một điểm sáng cho người khác.",
  "Điều bạn vừa nhận ra về mình có thể cũng là điều ai đó khác đang cần nghe.",
  "Bạn không cần phải tỏa sáng để ai nhìn thấy — chỉ cần đủ sáng để chính bạn nhìn rõ đường đi.",
  "Có thể điều bạn vừa vượt qua, một ngày nào đó, sẽ là điều bạn chia sẻ được với ai đó khác.",
  "Mình nhận thấy bạn vừa nhìn rõ một điều về mình hơn một chút — điều đó cũng có giá trị, không chỉ cho bạn.",
  "Không cần phải làm điều gì lớn lao — một ánh sáng nhỏ cũng đủ soi một đoạn đường.",
  "Bạn không cần trở thành ai khác để có giá trị với người xung quanh — chỉ cần là chính bạn, rõ hơn một chút mỗi ngày.",
  "Có những lúc cách bạn đi qua một điều khó cũng âm thầm trở thành một lời nhắc cho người khác.",
  "Mình nghĩ bạn không cần phải hoàn hảo để là một ánh sáng cho ai đó — chỉ cần thật.",
  "Ánh sáng không cần phải lớn để có ý nghĩa, chỉ cần đủ để soi một bước tiếp theo.",
];
