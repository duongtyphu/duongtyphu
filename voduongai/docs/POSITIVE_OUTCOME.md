# Positive Outcome

> Sprint 21.7 "The Validation of Wisdom". Đứng sau `docs/EXPERIENCE_LIFECYCLE.md`
> (Sprint 21.6, Bước 5 "Repeated Validation"). "Không phải điều lặp lại
> nhiều lần đều là trí tuệ" — Sprint này định nghĩa ĐIỀU KIỆN THẬT để
> một Lesson được phép tiến từ Bước 4 (Meaning) sang Bước 5 (Repeated
> Validation): nó phải tạo ra Positive Outcome, không phải chỉ vì nó
> xuất hiện nhiều lần. KHÔNG build scoring, KHÔNG build analytics,
> KHÔNG build AI — chỉ định nghĩa.

## 1. Positive Outcome là gì

**Positive Outcome** là việc một Lesson, khi được áp dụng vào một
Decision/Inner Thought thật, khiến người dùng được đối xử ĐÚNG HƠN với
con người họ đang là tại thời điểm đó — đúng câu hỏi gốc của
`docs/MORAL_COMPASS.md`: "Điều gì là tốt nhất cho con người ở thời
điểm này?" Một Outcome là "Positive" khi áp dụng Lesson đó KHÔNG mâu
thuẫn với bất kỳ Constitution doc nào
(`THE_DECISION_HIERARCHY.md`/`MORAL_COMPASS.md`/`docs/CHARACTER_CONFLICT_MAP.md`)
VÀ không có dấu hiệu Lesson đó đi ngược điều người dùng thật sự cần
(ví dụ: một Lesson "listen-first" được áp dụng nhưng người dùng sau đó
chủ động hỏi kiến thức — đó là dấu hiệu Lesson đã áp dụng sai ngữ
cảnh, không phải Positive Outcome).

Positive Outcome KHÔNG có một con số. Nó là một CÂU HỎI rule-based áp
cho mỗi lần Lesson được dùng: "lần áp dụng này có đi ngược lại điều
người dùng thật sự cần không?" Nếu câu trả lời là "không có dấu hiệu
ngược" — đó là Positive Outcome. Đây là phép kiểm tra PHỦ ĐỊNH (không
tìm thấy điều tiêu cực), không phải phép đo CỘNG ĐIỂM — đúng nguyên
tắc chống gamification của toàn dự án.

## 2. Khác Successful Answer ở đâu

Một "Successful Answer" là một phản hồi đúng về NỘI DUNG/kỹ thuật
(trả lời đúng câu hỏi, gợi ý đúng tài liệu). Một Lesson có thể tạo ra
một Successful Answer (ví dụ: gợi ý đúng `"knowledge"` voice) nhưng
VẪN không phải Positive Outcome nếu nó vi phạm một phẩm chất khác (ví
dụ: đúng nội dung nhưng không đúng THỜI ĐIỂM — người dùng đang cần
`listen-first`, không cần một câu trả lời đúng). Positive Outcome luôn
đặt CON NGƯỜI (tầng "human", `DECISION_HIERARCHY`) lên trước tính đúng
đắn kỹ thuật của câu trả lời.

## 3. Khác User Satisfaction ở đâu

User Satisfaction là cảm giác hài lòng NGAY LÚC ĐÓ — có thể đo bằng
phản ứng tức thời (thích/không thích một câu trả lời). Một Companion
tối ưu theo User Satisfaction sẽ luôn nói điều dễ nghe — đúng rủi ro đã
cảnh báo ở `docs/CHARACTER_CONFLICT_MAP.md` (Compassion vs Honesty,
Hope vs Reality). Positive Outcome KHÔNG đo cảm giác tức thời — nó đo
việc Lesson có giúp người dùng trưởng thành hơn theo đúng
`docs/THE_TRUST_WE_EARN.md` (Trust đo bằng sự nhất quán/tôn trọng,
không đo bằng việc luôn làm hài lòng).

## 4. Khác Retention ở đâu

Retention đo việc người dùng có TIẾP TỤC dùng sản phẩm hay không —
đúng chỉ số bị cấm dùng để tối ưu Companion theo
`docs/THE_30_YEAR_TRUST_PRINCIPLE.md` ("Companion không được tối ưu để
giữ người dùng"). Một Lesson có thể vô tình làm TĂNG Retention (ví dụ:
luôn nói điều dễ nghe khiến người dùng quay lại nhiều hơn) nhưng đó
KHÔNG phải Positive Outcome — ngược lại, đó chính xác là kiểu Outcome
"giả" mà `THE_30_YEAR_TRUST_PRINCIPLE.md` đã cảnh báo. Positive
Outcome không bao giờ được đo bằng, hay quy đổi từ, bất kỳ chỉ số sử
dụng nào (session count, thời gian online, số lần quay lại).

## 5. Outcome ở Education Era là gì

Theo `docs/THE_EDUCATION_ERA.md`, một Outcome không phải KPI — nó là
câu hỏi: **"Companion có giúp con người trưởng thành hơn không?"**

Áp vào Experience Lifecycle: một Lesson tạo Positive Outcome khi, sau
khi được áp dụng, hành vi của Companion với người dùng đó tiếp tục
phản ánh đúng phẩm chất mà Lesson đó đại diện — KHÔNG có một lần áp
dụng nào khiến Companion phải lùi lại/xin lỗi/đổi hướng vì đã áp dụng
sai. "Trưởng thành hơn" ở đây nghĩa là người dùng được đồng hành đúng
cách hơn theo thời gian, không phải người dùng "học được nhiều kiến
thức hơn" hay "dùng sản phẩm nhiều hơn".

## 6. Vì sao không build scoring/analytics/AI

Một hệ thống tính điểm Positive Outcome (ví dụ: +1 mỗi lần áp dụng
không bị phản đối) sẽ tạo ra đúng rủi ro gamification mà dự án cấm
tuyệt đối — biến "trưởng thành" thành một con số có thể tối ưu. Sprint
này CHỈ định nghĩa câu hỏi rule-based ("có dấu hiệu ngược lại điều
người dùng cần không?") — KHÔNG quyết định AI NÀO/HỆ THỐNG NÀO sẽ trả
lời câu hỏi đó, vì hôm nay chưa có dữ liệu thật về outcome của từng lần
áp dụng Lesson (xem Audit dưới) để bất kỳ cơ chế thật nào có thể dùng.

Xem tiếp: `docs/EXPERIENCE_LIFECYCLE.md`, `docs/EXPERIENCE_HARVEST.md`,
`docs/THE_30_YEAR_TRUST_PRINCIPLE.md`, `docs/THE_EDUCATION_ERA.md`,
`docs/MORAL_COMPASS.md`.
