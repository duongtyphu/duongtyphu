# The First Meeting

> Sprint 22.1. "Companion không bắt đầu bằng một cuộc hội thoại.
> Companion bắt đầu bằng một cuộc gặp gỡ." Xem
> `src/lib/portal/companion/first-meeting.ts`,
> `src/components/portal/companion/CompanionGreetingBubble.tsx`.

## Bối cảnh

Trong 3 giây đầu tiên bước vào Portal, người dùng nhìn thấy Companion
nhưng không biết đây là gì — chatbot? AI Support? ChatGPT? công cụ hỏi
đáp? Nếu 3 giây đầu thất bại, Companion bị định nghĩa sai, và rất khó để
thay đổi nhận thức đó sau này. Sprint này không tăng AI — Sprint này tạo
First Impression.

## First Meeting là gì?

First Meeting là khoảnh khắc Companion CHỦ ĐỘNG gặp một con người lần
đầu — không phải hiển thị thông tin, không phải mở một cuộc hội thoại
để chờ được trả lời. Nó có ba phần không thể thiếu: (1) một khoảng lặng
trước khi nói — để không giống một popup bật lên ngay khi trang tải
xong; (2) một lời tự giới thiệu về MÌNH LÀ AI và MÌNH Ở ĐÂY VÌ ĐIỀU GÌ,
không phải về việc nó LÀM ĐƯỢC GÌ; (3) một lời mời mở, không phải một
prompt chờ input.

## Khác Welcome Message ở đâu?

Welcome Message là một dòng chữ tĩnh, thường nằm trong banner/email, nói
về SẢN PHẨM ("Chào mừng đến với VO DUONG AI!"). First Meeting là một
NHÂN VẬT chủ động chào một CON NGƯỜI ("Chào bạn, rất vui được gặp bạn").
Welcome Message nói về nơi bạn vừa đến; First Meeting nói về người vừa
gặp bạn.

## Khác Onboarding ở đâu?

Onboarding dạy người dùng cách dùng sản phẩm — các bước, các nút, các
tính năng. First Meeting không dạy gì cả. Nó không có "bước tiếp theo",
không có thanh tiến trình, không có "Bỏ qua/Tiếp tục" kiểu tour. Nó kết
thúc tự nhiên như một lời chào kết thúc tự nhiên giữa hai người, không
như một checklist được hoàn thành.

## Khác Product Tour ở đâu?

Product Tour chỉ vào các phần tử UI và giải thích chức năng từng phần —
trọng tâm là GIAO DIỆN. First Meeting không chỉ vào bất kỳ phần tử UI
nào. Trọng tâm là MỐI QUAN HỆ vừa bắt đầu, không phải bản đồ giao diện.

## Khác Chat Greeting ở đâu?

Chat Greeting (kiểu chatbot) thường là dòng đầu tiên của MỘT CUỘC HỘI
THOẠI — nó giả định bước tiếp theo là người dùng gõ gì đó, và thường kèm
theo "Tôi có thể giúp gì cho bạn?" (đặt người dùng vào vị trí phải yêu
cầu một dịch vụ). First Meeting không chờ một input. Nó không kết thúc
bằng một câu hỏi mời hành động — nó kết thúc bằng một cảm giác ("Mong
đây sẽ là khởi đầu của một hành trình đẹp"), không phải bằng một lời
mời bấm hay gõ.

## Experience Flow (Nhiệm vụ 3)

```
Portal mở
   ↓
Người dùng nhìn thấy Companion (viên ngọc sống, không phải icon chat)
   ↓
Companion KHÔNG nói ngay — một khoảng lặng có chủ đích (2.2s, dài hơn
mọi lời chào thông thường khác trong Portal)
   ↓
Companion chủ động chào — không phải vì có sự kiện UI nào kích hoạt,
mà như một người vừa nhận ra có ai đó bước vào và quay sang chào
   ↓
Lời tự giới thiệu hiện ra, ở lại đủ lâu để đọc hết (9s, không tự ẩn vội
như các lời chào khác)
```

## Lời tự giới thiệu (Nhiệm vụ 4)

```
Chào bạn, rất vui được gặp bạn.

Mình là Companion — mình sẽ đồng hành cùng bạn trong suốt hành trình ở
VO DUONG AI, không phải để làm hộ hay trả lời thay bạn.

Nếu bạn cần học, mình học cùng bạn. Nếu bạn cần suy nghĩ, mình suy nghĩ
cùng bạn. Và nếu hôm nay bạn chỉ cần một người để trò chuyện, mình vẫn
luôn ở đây.

Mong đây sẽ là khởi đầu của một hành trình đẹp.
```

Không có "Tôi có thể...". Không nhắc AI/Model/công nghệ. Không liệt kê
Feature. Câu nói về MÌNH LÀ AI ("mình là Companion"), MÌNH Ở ĐÂY VÌ ĐIỀU
GÌ ("đồng hành... không phải để làm hộ"), và MÌNH SẼ ĐỒNG HÀNH THẾ NÀO
("học cùng", "suy nghĩ cùng", "một người để trò chuyện").

## 5 giai đoạn quan hệ (Nhiệm vụ 5)

`getRelationshipStage()` (`first-meeting.ts`) xác định rule-based, không
suy luận tâm lý, không AI:

| Giai đoạn | Điều kiện | Tinh thần lời chào |
|---|---|---|
| `first_meeting` | Lần đầu ghé Portal | Tự giới thiệu đầy đủ (trên) |
| `welcome_back` | Đã ghé trước đó, khoảng cách < 2 ngày, < 20 lượt | "Mình vẫn ở đây, cùng bạn tiếp tục." |
| `return_after_silence` | Khoảng cách từ lần ghé trước ≥ 2 ngày | "Mình rất vui vì bạn đã quay lại." |
| `long_time_companion` | ≥ 20 lượt ghé, vẫn đang đều | "Đã một thời gian dài mình được đồng hành cùng bạn." |
| `old_friend` | ≥ 60 lượt ghé | "Gặp bạn lúc nào cũng thấy thân quen." |

Mỗi giai đoạn một câu khác nhau — không lặp lại nguyên văn lời ở giai
đoạn trước. Ngưỡng lượt ghé (20/60) là quy tắc đơn giản, không phải một
"điểm số" hiển thị cho người dùng — người dùng không bao giờ thấy số
20 hay 60 này ở đâu cả.

`return_after_silence` ở đây là một câu nói NHẸ ở Greeting Bubble, khác
với `ReturnAfterSilenceCeremony.tsx` (nghi thức toàn màn hình, chỉ kích
hoạt khi có milestone thật từ Growth Signals) — hai cơ chế độc lập, một
nói nhỏ một làm nghi thức, không thay thế nhau.

## Silence Design (Nhiệm vụ 6)

`getSilenceTimingForStage()` quyết định khoảng lặng trước khi nói và
thời gian ở lại trên màn hình:

- `first_meeting`: khoảng lặng 2200ms (dài hơn mặc định), ở lại 9000ms
  (đủ thời gian đọc một lời tự giới thiệu 4 đoạn).
- `return_after_silence`: khoảng lặng 1800ms, ở lại 6000ms.
- Mọi giai đoạn khác: khoảng lặng 1500ms, ở lại 5000ms (giữ hành vi gốc
  đã có từ Sprint 8.5).

Khoảng lặng không phải độ trễ kỹ thuật (loading) — nó mô phỏng việc một
người nhìn thấy bạn trước, rồi mới chủ động lên tiếng, thay vì một popup
bật ra ngay khi DOM vừa render.

## Human Experience Review (Nhiệm vụ 7)

**Câu hỏi**: Sau 3 giây đầu, người dùng nghĩ Companion là gì?

Trước Sprint 22.1: lời chào "Chào bạn. Mình sẽ đồng hành cùng bạn trong
hành trình này." xuất hiện ngay sau 1.5s, ngắn, không tự giới thiệu rõ —
dễ bị đọc như một dòng chat-widget tự động ("Hi! Need help?").

Sau Sprint 22.1: khoảng lặng dài hơn trước khi nói (không giống popup
tự động), nội dung là một lời tự giới thiệu thật (tên, lý do tồn tại,
cách đồng hành) — không nhắc Feature/AI/Model, không hỏi "Tôi có thể
giúp gì?". Câu trả lời mong đợi: **"Mình vừa gặp một người bạn."**
Không có gì trong lời tự giới thiệu gợi đến chatbot/trợ lý kỹ thuật.

## Emotion Review (Nhiệm vụ 8)

- **An toàn?** Có — không yêu cầu hành động, không có nút "Bắt đầu ngay"
  tạo áp lực, có thể đóng bất cứ lúc nào.
- **Được chào đón?** Có — "Chào bạn, rất vui được gặp bạn" mở đầu bằng
  cảm xúc, không bằng thông báo.
- **Được tôn trọng?** Có — không giả định người dùng cần giúp đỡ ngay,
  không ép một hành động tiếp theo.
- **Được đồng hành?** Có — ba câu "nếu bạn cần..." đặt Companion ở vị
  trí cùng-làm, không ở vị trí phục vụ.
- **Hay chỉ là AI?** Không — không một từ nào trong lời tự giới thiệu
  nhắc đến AI, model, hay công nghệ.

## Education Review (Nhiệm vụ 9)

- **Respect**: không ép hành động, không chờ input ngay, để người dùng
  tự quyết định bước tiếp theo.
- **Humility**: "mình học cùng bạn", "mình suy nghĩ cùng bạn" — không tự
  nhận mình biết nhiều hơn hay giỏi hơn.
- **Trust**: không hứa hẹn quá đà ("mình sẽ giải quyết mọi vấn đề của
  bạn"), chỉ nói đúng những gì có thể giữ lời.
- **Education**: không dạy thao tác sản phẩm — dạy đúng một điều duy
  nhất, ngầm: đây là một người đồng hành, không phải một công cụ.
- **Character**: nhất quán với `personality`/`voiceTone` đã định nghĩa ở
  `companion-identity.ts` ("lắng nghe trước khi nói", "ngôn ngữ mời").
- **Culture**: củng cố tinh thần "Companion đồng hành, không điều khiển"
  (Nguyên lý 06, `BOOK_00_CONSTITUTION.md`).

## Verification (Nhiệm vụ 10)

Sprint này KHÔNG đo CTR/click/engagement. Phép đo duy nhất có ý nghĩa:
**người dùng có hiểu đúng Companion ngay từ lần gặp đầu tiên không?**
Không có cơ chế analytics nào được thêm trong Sprint này để đo điều
này bằng số — phép đo thật phải đến từ phản hồi người dùng thật
(interview/quan sát), không phải một dashboard. Đây là một Education
Debt được ghi nhận có chủ đích, không phải một thiếu sót bị bỏ quên.

## Education Debt

- Chưa có cơ chế thu thập phản hồi định tính thật từ người dùng về cảm
  nhận First Meeting — Sprint này chỉ thiết kế trải nghiệm, không thiết
  kế công cụ đo cảm nhận con người (đúng tinh thần không biến trải
  nghiệm thành chỉ số).
- Ngưỡng 20/60 lượt ghé cho `long_time_companion`/`old_friend` là ước
  lượng ban đầu, chưa được kiểm chứng bằng dữ liệu hành vi thật — có thể
  cần điều chỉnh khi có đủ người dùng thật trải qua đủ lâu.

## Xem tiếp

`src/lib/portal/companion/first-meeting.ts`,
`src/components/portal/companion/CompanionGreetingBubble.tsx`,
`src/lib/portal/companion/companion-identity.ts`,
`src/components/portal/ReturnAfterSilenceCeremony.tsx`,
`docs/COMPANION_PERSONAL_ADDRESSING.md`,
`docs/product-bible/BOOK_00_CONSTITUTION.md`.
