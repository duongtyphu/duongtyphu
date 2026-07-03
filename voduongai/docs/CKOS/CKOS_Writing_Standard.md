# CKOS Writing Standard

Chuẩn viết áp dụng cho **mọi phần nội dung** của một Knowledge Seed — Hero, Guide, Prompt,
Example, Checklist, Exercise, Reflection, Companion Note. Các Standard riêng (`Hero_Standard.md`,
`Prompt_Standard.md`...) chi tiết hoá field-by-field; tài liệu này là nguyên tắc chung đứng trên tất cả.

## Mục đích

Đảm bảo bất kỳ ai (hoặc AI nào) viết Knowledge Seed cũng tạo ra chất lượng giống nhau — người đọc
không thể phân biệt Seed nào do Founder viết, Seed nào do cộng tác viên viết, Seed nào do AI hỗ trợ.

## Tone

- **Đồng hành, không giảng dạy.** Nói như một người bạn hiểu việc, không phải giáo viên đứng lớp.
- **Thực tế, không phóng đại.** Không FOMO, không hứa hẹn kết quả quá mức ("tiết kiệm 90% thời gian",
  "thay đổi cuộc đời bạn").
- **Cụ thể, không chung chung.** "Tiết kiệm 25 phút mỗi tuần" tốt hơn "tiết kiệm nhiều thời gian".
- **Tôn trọng thời gian người đọc.** Mỗi câu phải có lý do tồn tại.

## Độ dài

| Phần | Độ dài khuyến nghị |
|---|---|
| Subtitle | 1 câu, dưới 20 từ |
| Problem | 1-2 câu |
| Core Idea | 1-2 câu |
| Guide (mỗi Step) | 1 câu hành động, không quá 25 từ |
| Why This Matters | 1-2 câu |
| Companion Note | 1-2 câu |
| Next Action | 1 câu, bắt đầu bằng động từ |

Nếu một phần vượt quá độ dài khuyến nghị, tách thành nhiều phần nhỏ hơn (list, step, card)
thay vì viết thành đoạn văn dài.

## Quy tắc trình bày

1. Không viết đoạn văn dài quá 3 câu ở bất kỳ đâu trong Seed.
2. Ưu tiên: Heading → List → Card → Step, hạn chế paragraph tự do.
3. Mọi số liệu phải cụ thể (đơn vị thời gian, %, số lượng) — không dùng "nhiều", "nhanh hơn".
4. Mọi Prompt phải copy-paste dùng được ngay, có biến đặt trong `[ngoặc vuông]`.
5. Mọi Checklist là hành động (bắt đầu bằng động từ hoặc câu hỏi có/không), không phải khái niệm.

## Điều nên làm

- Viết Problem dựa trên tình huống thật, cụ thể (nêu rõ ai, làm gì, tốn bao lâu).
- Dùng ví dụ Before/After với số liệu thời gian thật.
- Đặt Companion Note ở góc nhìn thứ nhất, ngắn, có thể đọc thành tiếng mà không ngượng.
- Kết thúc bằng đúng 1 Next Action cụ thể, có thể làm ngay trong 5 phút.

## Điều không nên làm

- Không dùng Lorem Ipsum, placeholder, "TODO", "sẽ cập nhật sau" trong nội dung xuất bản.
- Không viết Companion Note nghe như quảng cáo hoặc như AI ("Hãy cùng nhau chinh phục...").
- Không liệt kê Checklist là lý thuyết ("Hiểu rõ khái niệm X") — phải là hành động cụ thể.
- Không dùng từ tuyệt đối ("luôn luôn", "chắc chắn 100%", "duy nhất").
- Không để một Seed có nhiều hơn 1 Call-to-Action chính (One Next Step / Next Action).

## Ví dụ đúng

> **Problem:** "Bạn mất quá nhiều thời gian nghĩ câu chữ mỗi khi soạn một email công việc, và
> đôi khi vẫn gửi nhầm hoặc thiếu ý."
>
> **Companion Note:** "Nếu hôm nay bạn chỉ có 10 phút, mình nghĩ bạn nên bắt đầu bằng Prompt trước."

Ngắn, cụ thể, đúng giọng đồng hành, không sáo rỗng.

## Ví dụ sai

> **Problem:** "Trong thời đại số hoá 4.0, kỹ năng viết email hiệu quả đóng vai trò vô cùng quan
> trọng đối với sự thành công của mỗi cá nhân trong môi trường công sở hiện đại."
>
> **Companion Note:** "Hãy cùng nhau chinh phục hành trình viết email đỉnh cao và trở thành phiên
> bản tốt nhất của chính mình!"

Sáo rỗng, chung chung, nghe như quảng cáo — không được phép xuất bản dưới CKOS.
