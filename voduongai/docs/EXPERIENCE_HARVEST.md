# Experience Harvest

> Sprint 21.6 "The Experience Harvest". Đứng sau `docs/THE_LIVING_WISDOM_SYSTEM.md`
> (chuỗi chuyển hoá 8 bước), `docs/LIVING_HERITAGE.md` (5 điều kiện trở
> thành di sản), `docs/CHARACTER_MEMORY.md`, `docs/CHARACTER_COHERENCE.md`
> (Sprint 21.5). Sprint này KHÔNG thêm AI/LLM/database/aggregation — chỉ
> định nghĩa CÁCH một trải nghiệm có thể trở thành Lesson, rồi sau nhiều
> lần kiểm chứng mới có thể trở thành Living Wisdom.

## 1. Experience Harvest là gì

Companion đã có nhiều nguyên tắc, phẩm chất, tài liệu giáo dục — nhưng
chưa có một mô tả rõ ràng về CÁCH một cuộc gặp gỡ thật (một Reflection,
một Story được lưu, một Memory Capsule) đi qua các bước cụ thể để trở
thành điều có ích lâu dài. Experience Harvest là **lớp mô tả vòng đời**
đó — không thu thập dữ liệu thô mới, không tạo Engine mới; nó chỉ rọi
sáng những bước đã có ý định trong `THE_LIVING_WISDOM_SYSTEM.md`
(Experience → Reflection → Lesson → Meaning → Value → Character →
Action → Contribution) và làm rõ ĐIỀU KIỆN cụ thể để đi từ bước này
sang bước kia, cùng RANH GIỚI quyền riêng tư ở mỗi bước.

"Harvest" (thu hoạch) không có nghĩa "thu thập nhiều hơn" — nghĩa là
nhận biết khi nào một trải nghiệm đã chín đủ để trở thành bài học, và
dừng lại khi nó chưa chín, thay vì ép mọi trải nghiệm phải tạo ra một
bài học.

## 2. Khác Memory ở đâu

Memory (`memoryCapsules.ts`, `CharacterMemoryEntry`) là **nơi LƯU** một
khoảnh khắc/một tín hiệu — nó trả lời "điều gì đã xảy ra, khi nào".
Experience Harvest trả lời câu hỏi khác: "điều đã lưu đó có ĐỦ ĐIỀU
KIỆN để trở thành một bài học không, và nếu có, nó đang ở bước nào
trong vòng đời?" Memory là nguyên liệu đầu vào (input) của Harvest,
không phải Harvest tự nó.

## 3. Khác Story ở đâu

Story (`living-stories.ts`) là **nội dung đã viết sẵn**, do Companion kể
lại cho người dùng — không phải trải nghiệm CỦA người dùng được thu
hoạch. Một Story có thể là nơi một Lesson đã hình thành được DIỄN ĐẠT
lại cho người dùng nghe (ví dụ một `wisdom_story`), nhưng Story không
tự sinh ra Lesson — nó chỉ là một hình thức trình bày.

## 4. Khác Lesson Memory ở đâu

Hệ thống hiện tại đã có khái niệm "Lesson" ở hai nơi riêng:
`LESSON_FROM_REFLECTION` (`portal-brain.ts`, một bảng tra cứu nội bộ
Companion tự nhắc mình, KHÔNG hiển thị cho người dùng) và bước "Lesson"
trong chuỗi 8 bước của `THE_LIVING_WISDOM_SYSTEM.md`. Experience Harvest
không tạo một khái niệm Lesson thứ ba — nó mô tả CÁCH một Lesson (theo
đúng nghĩa đã có ở chuỗi 8 bước) hình thành từ Experience/Reflection
thật, và đặt thêm bước "Repeated Validation" cần thiết trước khi một
Lesson được coi là đủ chắc để gọi là Living Wisdom — điều mà chuỗi 8
bước cũ chưa nói rõ "lặp lại bao nhiêu lần, kiểm tra theo điều kiện
nào."

## 5. Khác Living Heritage ở đâu

`docs/LIVING_HERITAGE.md` đã định nghĩa 5 điều kiện để một Lesson được
xét thành Heritage (đã trở thành Character, áp dụng nhiều lần, luôn
tích cực, không mâu thuẫn Constitution, có giá trị cho nhiều thế hệ).
Living Heritage là **đích đến cuối cùng, hiếm, đã qua kiểm chứng dài
hạn**. Experience Harvest là **con đường dẫn tới đích đó** — nó mô tả
TỪNG BƯỚC nhỏ (Experience → Reflection → Lesson → Meaning → Repeated
Validation → Living Wisdom → Heritage Candidate) trước khi một điều gì
đó đủ tư cách được XÉT bởi 5 điều kiện của Living Heritage. "Heritage
Candidate" ở cuối vòng đời Harvest chỉ là ỨNG VIÊN được đưa vào hàng
đợi xét duyệt — không tự động trở thành Heritage.

## 6. Vì sao Companion không thu thập cuộc đời, mà chỉ gìn giữ bài học

Một trải nghiệm thật của con người (một Reflection, một câu chuyện cá
nhân) thuộc về người đó — Companion được phép NHỚ nó để đồng hành tốt
hơn với chính người đó, nhưng không được phép biến nó thành "dữ liệu"
để học từ nhiều người. Khoảng cách giữa "ghi nhận một trải nghiệm" và
"thu thập cuộc đời người dùng" chính là khoảng cách giữa Lesson (trừu
tượng, không định danh, áp dụng được cho chính người đó hoặc — sau
repeated validation thật nghiêm — cho người khác ở mức nguyên tắc) và
dữ liệu thô (câu chuyện cụ thể, có thể nhận diện). Experience Harvest
tồn tại để Companion luôn biết mình đang ở phía nào của khoảng cách đó.

Xem tiếp: `docs/EXPERIENCE_LIFECYCLE.md`, `docs/THE_LIVING_WISDOM_SYSTEM.md`,
`docs/LIVING_HERITAGE.md`, `docs/CHARACTER_MEMORY.md`,
`docs/FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`.
