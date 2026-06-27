# Portal Memory Rules

Tài liệu chính thức quy định cách Portal được phép "nhớ" về người dùng.
Bổ sung cho `PORTAL_EXPERIENCE_GUIDELINES.md` — áp dụng cho Human Story Engine
(`reflections`, `memory_capsules`, AI Companion Memory) và mọi tính năng lưu
trữ ký ức cá nhân sau này.

## 1. Mục đích của ký ức

Portal không lưu dữ liệu. Portal lưu hành trình.

Mỗi mẩu ký ức được lưu phải trả lời được câu hỏi: "Điều này có giúp người
dùng hiểu rõ hơn về chính họ không?" Nếu không, Portal không nên lưu nó.

## 2. Portal CHỈ được nhớ

- Những câu trả lời người dùng tự nguyện viết ra (Reflection Journal).
- Những khoảnh khắc người dùng tự chọn cất giữ (Memory Capsule).
- Những cột mốc khách quan, có ý nghĩa trưởng thành (ngày đầu tiên tham gia,
  một bài học đầu tiên, một lần giúp người khác).

## 3. Portal KHÔNG BAO GIỜ được nhớ hoặc dùng để

- Theo dõi hành vi để thúc đẩy mua hàng hoặc tạo áp lực quay lại.
- Page View, Session, Click, hoặc bất kỳ chỉ số đo "mức độ dùng app" thuần
  kỹ thuật — đây là việc đo lường sản phẩm, không phải hiểu con người.
- So sánh người dùng này với người dùng khác.
- Bất cứ điều gì người dùng không tự nguyện chia sẻ.

## 4. Cách Portal nhắc lại ký ức

Khi Portal nhắc lại điều người dùng từng chia sẻ, nó phải nói bằng giọng
quan tâm, không phải giọng giám sát.

- Dùng: "Mình nhớ bạn từng chia sẻ..."
- Không dùng: "Theo dữ liệu của bạn..." / "Hệ thống ghi nhận rằng..."

Người dùng luôn có quyền không trả lời, và Portal không bao giờ nhắc lại
việc người dùng đã bỏ qua một câu hỏi.

## 5. Vòng đời của ký ức

- Mọi ký ức gắn với một người dùng cụ thể (`member_id`), được bảo vệ bằng
  Row Level Security — chỉ chính người dùng đó đọc/viết được.
- Người dùng có quyền xóa ký ức của mình bất cứ lúc nào (tính năng xóa sẽ
  được bổ sung ở sprint sau nếu cần — nguyên tắc đã được ghi nhận tại đây).
- Ký ức không có hạn dùng nhân tạo — Portal không xóa ký ức để "dọn dữ liệu",
  trừ khi người dùng yêu cầu.

## 6. Khi mở rộng Human Values Engine

Khi tính `Human Evolution Index` (Kiên trì, Học hỏi, Kiến tạo, Đóng góp,
Hợp tác, Trưởng thành) trong tương lai, chỉ tính từ hành động có ý nghĩa
(hoàn thành, chia sẻ, giúp đỡ, suy ngẫm) — không tính từ thời gian online
hoặc số lần click.
