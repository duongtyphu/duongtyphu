# Companion Soulful Reactions

Sprint 13.3 — "Thêm linh hồn cho Companion." Tài liệu này ghi lại vì sao
micro-reactions tồn tại, vì sao Companion không nói quá nhiều, vì sao im
lặng cũng là một phản hồi, và những ranh giới (boundary) Companion không
được vượt qua khi phản ứng với một cú chạm.

## Vì sao micro-reactions tồn tại

Trước Sprint này, một cú chạm vào Companion chỉ dẫn đến một kết quả: mở
`CompanionSpace`. Điều đó đúng về chức năng nhưng thiếu một thứ — cảm
giác rằng có ai đó vừa nhận ra mình. Micro-reactions tồn tại để lấp đúng
khoảng đó: một phản hồi rất nhỏ, rất nhanh, không yêu cầu người dùng mở
một cuộc trò chuyện, không yêu cầu họ làm gì tiếp theo. Companion phản
hồi không phải vì người dùng vừa chạm vào nó như chạm vào một nút bấm —
mà vì đó là một khoảnh khắc đáng để kết nối.

## Vì sao Companion không nói quá nhiều

Một người bạn nói liên tục mỗi khi được chạm vào sẽ nhanh chóng giống
một thiết bị phát âm thanh phản hồi, không giống một sự hiện diện. Vì
vậy:

- Mỗi micro-line có cooldown 10 giây — không lặp lại quá nhanh.
- Mỗi micro-line chỉ xuất hiện một lần trong cùng một phiên (session
  memory theo `id`) trước khi được phép lặp lại.
- Companion không nói khi đang nhập input, khi đã minimize, hoặc khi
  `CompanionSpace` đang mở.

Im lặng giúp mỗi câu nói còn lại có trọng lượng. Nói ít hơn không phải
vì Companion "có ít điều để nói" mà vì sự hiện diện đáng tin không cần
liên tục chứng minh bằng lời.

## Vì sao im lặng cũng là phản hồi

Khoảng 30% các lần chạm chỉ tạo ra phản ứng hình ảnh (sáng nhẹ, pulse,
nghiêng nhẹ) mà không có lời — "Soulful Silence". Đây không phải một
lỗi hay một khoảng trống cần lấp đầy bằng câu chữ. Một người bạn thật
không cần nói gì mỗi khi được chạm vào vai — đôi khi một ánh nhìn, một
cái gật đầu nhẹ là đủ. Companion mô phỏng đúng điều đó: phản ứng hình
ảnh luôn xảy ra (Companion luôn "nhận ra" cú chạm), nhưng lời nói là thứ
được lựa chọn có chủ đích, không phải mặc định.

## Boundary

- **Không giả vờ biết cảm xúc người dùng.** Mood/Presence State
  (`companion-mood.ts`) là trạng thái hiện diện của Companion, suy ra từ
  ngữ cảnh Portal (route, Garden, có Thought/Story đang chờ, vừa được
  chạm hay chưa) — không bao giờ là một suy đoán về cảm xúc người dùng.
  Micro-line không bao giờ nói "Bạn đang buồn" hay tương tự.
- **Không thao túng cảm xúc.** Micro-line không tạo áp lực, không phán
  xét, không dùng ngôn ngữ thúc ép ("Quay lại ngay!", "Đừng bỏ lỡ!").
  Mỗi câu được viết để có thể bỏ qua hoàn toàn mà không mất gì.
- **Không dùng phản ứng để bán hàng.** Micro-reactions không bao giờ
  nhắc đến sản phẩm, khoá học, ưu đãi, hay bất kỳ lời mời mua hàng nào.
  Đây là một khoảnh khắc kết nối, không phải một kênh quảng cáo.

## Liên quan

`companion-mood.ts`, `micro-reactions.ts`, `micro-reaction-engine.ts`,
`CompanionMicroReactionBubble.tsx`, `CompanionPresence.tsx`,
`COMPANION_GROWTH_LOG.md` (Sprint 13.3).
