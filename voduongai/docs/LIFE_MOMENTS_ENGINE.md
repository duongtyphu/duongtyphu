# Life Moments Engine (Sprint 18.1)

"Companion học cách tri ân những ngày đáng nhớ của một con người."

Xem thêm: `docs/BIRTHDAY_CEREMONY.md`, `docs/CULTURE_BOOK.md`,
`docs/ORIGIN_MEMORY.md`, `docs/COMPANION_GROWTH_LOG.md`.

## Life Moments là gì?

Life Moments là những cột mốc có ý nghĩa trong hành trình của một con
người trên VO DUONG AI — không phải mọi sự kiện, mà là những khoảnh
khắc xứng đáng được Companion nhận ra và tri ân.

Life Moments Engine là nền móng giúp Companion:
1. Nhận ra khi một trong những khoảnh khắc đó đang diễn ra (Detector).
2. Có một cách nói phù hợp, chân thành, không sáo rỗng để ghi nhận nó
   (Copy Library).
3. Hiển thị điều đó cho người dùng một cách tôn trọng, không ép buộc
   (Companion Integration).
4. Cho người dùng quyền giữ lại khoảnh khắc đó nếu họ muốn (Memory
   Capsule), không tự động lưu thay họ.

## Vì sao VO DUONG AI cần tri ân các cột mốc?

Một người đồng hành thật sự không chỉ xuất hiện trong những ngày bình
thường — họ còn nhớ những ngày đặc biệt. Một năm đã trôi qua, ngày đầu
tiên ai đó bước vào Portal, câu chuyện thứ một trăm được lưu lại — đó là
những dấu mốc của một con người, không phải số liệu vận hành.

Nếu VO DUONG AI bỏ qua những ngày này, Companion sẽ giống một công cụ
chạy đúng giờ hơn là một người đồng hành thật sự nhớ đến bạn.

## Life Moments khác gì Notification?

| Notification | Life Moment |
|---|---|
| Mục tiêu: kéo người dùng quay lại app | Mục tiêu: ghi nhận một điều đã xảy ra trong đời người dùng |
| Thường lặp lại, có thể đến từ nhiều nguồn (email, push, badge số) | Hiếm, gắn với đúng một khoảnh khắc cụ thể, không lặp tùy ý |
| Có thể được gửi dù người dùng không mở app | Chỉ xuất hiện khi người dùng đang ở Portal |
| Thường có CTA hành động ("Mở app ngay") | Không có CTA bán hàng, không ép phản hồi |
| Đo bằng tỉ lệ click/mở | Không đo, không track như một chỉ số tăng trưởng |

## Life Moments khác gì Achievement?

| Achievement / Gamification | Life Moment |
|---|---|
| Do hệ thống định nghĩa "đạt được" (level, badge, streak) | Do cuộc đời người dùng định nghĩa (sinh nhật, một năm đồng hành) |
| So sánh được giữa người dùng (leaderboard, rank) | Không thể so sánh — mỗi người chỉ có một hành trình của riêng họ |
| Tạo động lực thông qua phần thưởng/điểm số | Không có phần thưởng, không có điểm số hiển thị cho người dùng |
| Khuyến khích lặp lại hành vi để "lên cấp" | Không khuyến khích hành vi nào — chỉ ghi nhận một điều đã có thật |
| Cảm giác: "tôi đã hoàn thành cái gì đó" | Cảm giác: "có ai đó nhớ và trân trọng điều này cùng tôi" |

## Vì sao đây là một nghi thức văn hóa, không phải một tính năng kỹ thuật?

Life Moments không được đo bằng tỉ lệ tương tác, không có A/B test để
"tối ưu hoá" cách trình bày sao cho người dùng bấm vào nhiều hơn. Nó
được thiết kế giống một nghi thức: xuất hiện đúng lúc, nói đúng điều cần
nói, rồi lặng lẽ rút lui — không chiếm Portal, không lặp lại không cần
thiết, không nài người dùng phản hồi.

Một nghi thức thật sự không cần người tham gia phải làm gì để "mở khoá"
nó — nó chỉ cần xảy ra đúng lúc và được tôn trọng. Đó là chuẩn mà Life
Moments Engine phải đạt.

## Nguyên tắc bắt buộc (Boundary)

- Không spam — tối đa một Life Moment hiển thị mỗi ngày, có cooldown.
- Không popup lớn, không chiếm toàn bộ Portal nếu không cần.
- Không ép người dùng phản hồi — người dùng có thể đóng bất cứ lúc nào.
- Không biến thành achievement, không leaderboard, không level, không
  rank.
- Không dùng CTA bán hàng.
- Không giả vờ thân mật quá mức khi chưa có đủ dữ liệu thật (ví dụ:
  không đoán sinh nhật, không bịa ra một cột mốc không có thật).
- Mọi Life Moment phải tôn trọng người dùng — kể cả khi họ chọn không
  xem, không lưu lại, không phản hồi gì cả.

## Companion Thought Governance (Sprint 18.6) — nợ kỹ thuật đã ghi nhận

Sprint 18.6 thêm một lớp điều phối phía trên các moment của Companion
(`thought-governance.ts`, xem `docs/COMPANION_THOUGHT_GOVERNANCE.md`)
để chọn MỘT moment được nói khi nhiều moment cùng đủ điều kiện. Trong
bảng ưu tiên đó, Life Moment/Return After Silence/Birthday đứng trên
cả Daily Thought và Proactive Thought.

Tuy nhiên, `LifeMomentBubble` và `ReturnAfterSilenceCeremony` hiện vẫn
render độc lập ở `src/app/portal/layout.tsx` (server component) —
KHÔNG đi qua `chooseCompanionMoment()`, vì chúng tách biệt khỏi cây
client-state của `CompanionPresence.tsx`. Nói cách khác: thứ tự ưu
tiên trên giấy đã đúng, nhưng việc thực thi nó giữa Life Moment và
Thought/Story chưa được nối thật. Rủi ro thực tế thấp vì Life Moments
đã tự giới hạn 1 lần/ngày (mục Boundary phía trên) nên hiếm khi chồng
lấp — nhưng đây là điểm cần khép lại khi có một coordinator chia sẻ
state qua client/server boundary trong một sprint tương lai.
