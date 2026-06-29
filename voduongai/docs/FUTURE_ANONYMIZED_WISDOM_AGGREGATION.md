# Future: Anonymized Wisdom Aggregation

> Future Work — KHÔNG phải Sprint hiện tại, KHÔNG có code, KHÔNG có
> thiết kế chi tiết. Ghi lại ở đây để không bị quên, đúng nguyên tắc
> "không che giấu limitation". Xem `docs/EXPERIENCE_HARVEST.md` và
> `docs/EXPERIENCE_LIFECYCLE.md` (Sprint 21.6) cho vòng đời dẫn tới
> điểm này.

## Vì sao tài liệu này tồn tại, nhưng chưa được làm

`docs/EXPERIENCE_LIFECYCLE.md` định nghĩa bước cuối "Heritage
Candidate" — một Lesson đã được kiểm chứng nhiều lần CHO MỘT người
dùng, đề xuất ở mức trừu tượng. Nhưng việc nhiều Heritage Candidate từ
NHIỀU người dùng khác nhau có thể được tổng hợp (aggregate) thành một
Living Wisdom chung cho mọi người dùng sau này — **cross-user
learning** — là một bước XA HƠN, đòi hỏi thiết kế privacy hoàn toàn
riêng, không thể làm ngầm trong Sprint 21.6.

## Những gì Sprint này CỐ Ý không xây

- Cross-user learning (một Lesson của người A ảnh hưởng Decision cho
  người B).
- Anonymized lesson mining (quét nhiều Reflection của nhiều người để
  tìm pattern chung).
- Wisdom database (lưu trữ tập trung các Lesson đã gỡ định danh).
- AI training pipeline (dùng dữ liệu người dùng để huấn luyện mô hình).
- Analytics system đo lường Lesson/Meaning ở cấp toàn hệ thống.

Mỗi điều trên đều CÓ THỂ hữu ích về lâu dài — nhưng đều đòi hỏi: (1)
consent rõ ràng từ người dùng, (2) cơ chế kỹ thuật đảm bảo không thể
truy ngược định danh, (3) một Sprint riêng với thiết kế privacy là
trọng tâm, không phải một dòng phụ trong Sprint khác.

## Điều kiện để Sprint tương lai này được phép bắt đầu

1. Phải có cơ chế consent rõ ràng, không mặc định (opt-in, không
   opt-out).
2. Phải định nghĩa được "không thể truy ngược định danh" theo nghĩa kỹ
   thuật cụ thể (không chỉ "đã xoá tên").
3. Phải đi qua đầy đủ Bước 1–7 của `docs/EXPERIENCE_LIFECYCLE.md` cho
   từng người dùng riêng trước khi bất kỳ điều gì được đưa vào tổng hợp
   — không tổng hợp dữ liệu thô, chỉ tổng hợp Heritage Candidate đã qua
   kiểm chứng.
4. Phải được Sprint riêng tên gọi rõ ràng (ví dụ "Sprint X.Y — The
   Anonymized Wisdom Aggregation"), không phải một nhiệm vụ phụ.

Không có deadline cho Sprint này — nó chỉ nên bắt đầu khi có nhu cầu
thật từ đủ nhiều Heritage Candidate đã tồn tại, không phải vì kỹ thuật
"có thể làm".

Xem tiếp: `docs/EXPERIENCE_HARVEST.md`, `docs/EXPERIENCE_LIFECYCLE.md`,
`docs/LIVING_HERITAGE.md`.
