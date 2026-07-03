# 03 — CKOS Writing Standard

> Phiên bản đóng gói. Bản đầy đủ + Standard con (Hero/Prompt/Example/Exercise/Reflection/
> CompanionNote/Checklist): `/docs/CKOS/`.

## Nguyên tắc cốt lõi

Bất kỳ ai (hoặc AI nào) viết Knowledge Seed cũng phải tạo ra chất lượng giống nhau — người đọc
không thể phân biệt Seed nào do ai viết.

## Tone

Đồng hành, không giảng dạy. Thực tế, không phóng đại, không FOMO. Cụ thể, không chung chung.

## Quy tắc trình bày (áp dụng mọi phần)

1. Không đoạn văn dài quá 3 câu ở bất kỳ đâu.
2. Ưu tiên Heading → List → Card → Step, hạn chế paragraph tự do.
3. Mọi số liệu phải cụ thể — không dùng "nhiều", "nhanh hơn" mà không có đơn vị đo.
4. Mọi Prompt copy-paste dùng ngay được, biến trong `[ngoặc vuông]`.
5. Mọi Checklist là hành động, không phải khái niệm.

## Bảng tổng hợp Standard theo từng phần

| Phần | Field | Quy tắc chính | Chi tiết |
|---|---|---|---|
| Hero | `title`, `subtitle`, `skillsGained` | Động từ + đối tượng cụ thể; subtitle nêu lợi ích + thời gian | `Hero_Standard.md` |
| Prompt | `samplePrompt`, `prompts[]` | Tối thiểu 5 prompt, biến `[ngoặc vuông]`, có ví dụ Input/Output thật | `Prompt_Standard.md` |
| Example | `example` | Format `Trước: ... Sau: ...`, cả 2 vế có số liệu đo lường được | `Example_Standard.md` |
| Exercise | `exercise` | 5-15 phút, dùng dữ liệu thật, có sản phẩm đầu ra kiểm tra được | `Exercise_Standard.md` |
| Reflection | `reflectionQuestions[0]` | Đúng 3 câu hỏi hiển thị (2 cố định + 1 riêng), không textarea dài | `Reflection_Standard.md` |
| Companion Note | `companionNote` | 1-2 câu, ấm áp, không sáo rỗng, không giáo điều | `CompanionNote_Standard.md` |
| Checklist | `checklist[]` | 3-5 mục hành động, tick được, không lý thuyết | `Checklist_Standard.md` |

## Ví dụ đúng vs sai (rút gọn)

**Đúng:** "Bạn mất quá nhiều thời gian nghĩ câu chữ mỗi khi soạn một email công việc, và đôi
khi vẫn gửi nhầm hoặc thiếu ý." — cụ thể, có tình huống thật.

**Sai:** "Trong thời đại số hoá 4.0, kỹ năng viết email hiệu quả đóng vai trò vô cùng quan
trọng." — chung chung, sáo rỗng, không có tình huống cụ thể.

Xem đầy đủ ví dụ theo từng phần trong các file Standard tương ứng ở `/docs/CKOS/`.
