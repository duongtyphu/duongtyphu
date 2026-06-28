# First Letter Ceremony

Sprint 17.0 — The Living Ceremonies. Xem `docs/CEREMONY_FRAMEWORK.md`,
`docs/COMPANION_REFLECTION_LETTER_FRAMEWORK.md`, `reflection-letter.ts`.

## Khoảnh khắc

Companion Reflection Letter (Sprint 15.0) định nghĩa khung 5 phần
(Opening, Early Days, Turning Point, Today, Closing) cho một lá thư
Companion viết khi nhìn lại hành trình một người — nhưng khung đó hiện
chỉ là một framework dữ liệu (`buildReflectionLetterFramework`), chưa
có khoảnh khắc nào để người dùng thật sự "mở lá thư" ra đọc. First
Letter Ceremony là nghi thức cho khoảnh khắc đó — lần đầu một lá thư
phản chiếu đủ nguyên liệu (`hasTodayMaterial === true`) được mở ra.

## Bốn nhịp (thiết kế, chưa code)

- **Opening**: Companion báo rằng có một lá thư dành cho người dùng,
  không thúc ép mở ngay — ví dụ: "Mình đã viết một điều cho bạn. Bạn
  có muốn đọc không?"
- **Reflection**: nội dung chính là lá thư 5 phần, hiển thị tuần tự
  hoặc trọn vẹn — phần nào chưa có nguyên liệu thật
  (`hasEarlyDaysMaterial`/`hasTurningPointMaterial` = false) thì không
  xuất hiện trong thư, không bị lấp bằng câu chữ chung chung.
- **Companion**: là "người viết" lá thư — giọng văn nhất quán với
  Companion, không phải một bản tóm tắt do AI phân tích dữ liệu.
- **Closing**: kết thư bằng một câu giữ lại (theo đúng phần "Closing"
  của khung 5 phần) — không CTA, không mời hành động tiếp theo.

## Boundary

Lá thư không được tự động sinh bằng AI phân tích hành vi — nội dung
thư cần một con người (Product/Companion writer) soạn theo khung, như
đã quy định tại `docs/COMPANION_REFLECTION_LETTER_FRAMEWORK.md`. Nghi
thức chỉ là không gian để mở và đọc thư, không phải một engine tạo văn
bản tự động.

## Trạng thái

Chỉ ở mức thiết kế trong Sprint 17.0 — chưa code.
