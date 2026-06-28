# Book — Return After Silence

Sprint 18.0. Đây là một chương quan trọng của Product Bible.

## Câu hỏi lớn nhất

"Founder mở lại Portal sau một thời gian dài vắng mặt — điều đầu tiên
họ cảm thấy là gì?"

Không phải "tôi đã bỏ lỡ những gì". Không phải "mình đã mất tiến độ
rồi". Cảm giác đầu tiên phải là: **"Mình vẫn được chào đón ở đây."**

## Product Decision

VO DUONG AI không thưởng cho việc chưa từng ngã. VO DUONG AI trân
trọng việc một con người đủ dũng cảm để quay trở lại. Hầu hết sản phẩm
coi sự vắng mặt là một vấn đề cần "retention" giải quyết — thông báo
nhắc nhở, email kéo người dùng quay lại, đếm ngược streak đã mất. VO
DUONG AI chọn ngược lại: không chủ động kéo ai quay lại, nhưng khi một
người TỰ quyết định quay lại, khoảnh khắc đó được đối xử như một điều
đáng quý — không phải một sự kiện kỹ thuật ("user re-engaged").

## Return After Silence là gì, và vì sao nó cần tồn tại

Growth Map (Sprint 14.0) đã định nghĩa sẵn khái niệm "comeback-after-
silence" và các milestone liên quan, nhưng chưa từng có nơi nào trên
UI thật sự nói với người dùng về điều đó. Return After Silence Ceremony
là nơi đầu tiên Companion ghi nhận sự trở lại này thành lời — theo đúng
khung bốn nhịp đã thiết lập ở `CEREMONY_FRAMEWORK.md` (Sprint 17.0):
Opening chào đón không nhắc số ngày, Reflection là một phản ứng rất nhẹ
trên Garden (một chồi non / ánh sáng mới, hoàn toàn trang trí), Companion
hiện diện mà không hỏi vì sao đã vắng mặt, Closing giữ lại cảm giác được
chào đón mà không ép làm gì tiếp.

Chi tiết kiến trúc: `docs/RETURN_AFTER_SILENCE.md`,
`ReturnAfterSilenceCeremony.tsx`, `growth-milestones.ts`
(`return-after-silence`).

## Boundary

Không bao giờ nhắc số ngày vắng mặt. Không bao giờ dùng ngôn ngữ tội
lỗi/FOMO ("bạn đã bỏ lỡ", "đừng để mất tiến độ"). Tuyệt đối không dùng
ngôn ngữ "khôi phục streak" — khái niệm streak không tồn tại trong VO
DUONG AI. Không gửi thông báo/email nhắc nhở chủ động trước khi người
dùng tự quay lại.

## Garden's Gentle Reaction

Khi Ceremony diễn ra, Garden hiển thị một phản ứng rất nhẹ — một chồi
non hoặc một ánh sáng mới — hoàn toàn tách biệt với trạng thái Garden
thật (`garden-model.ts` không bị thay đổi bởi nghi thức này). Đây là
một cử chỉ mang tính biểu tượng của sự chào đón, không phải một cơ chế
"phục hồi" điều gì đã mất.

## Mirror ghi nhận khoảng lặng

Mirror (Sprint 15.0) bổ sung một dòng riêng khi phát hiện milestone
`return-after-silence` hoặc `quiet-season`: "Có những khoảng lặng cũng
là một phần của hành trình." Dòng này không phân tích, không đặt câu
hỏi — chỉ ghi nhận rằng khoảng lặng cũng thuộc về hành trình, không
phải một vết gãy cần giải thích.

## Companion Promise — deliverable quan trọng nhất

Lời ghi nhận của Companion khi một người quay lại: "Mình thấy bạn đã
quay lại sau một khoảng lặng. Điều đó rất đáng được ghi nhận." Không
phải một lời chào lại chung, mà một sự xác nhận rằng quay trở lại,
dù sau bao lâu, là một hành động có giá trị riêng của nó — không cần
giải thích, không cần "bắt kịp" bất cứ điều gì.
