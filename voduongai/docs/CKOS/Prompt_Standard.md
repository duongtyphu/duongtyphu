# Prompt Standard

Chuẩn cho **Prompt Experience** (Feature 06, Sprint 03) và **Prompt Pack** (Sprint 04 v2).
Component: `src/features/knowledge/components/PromptExperience.tsx`, `PromptPack.tsx`.

## Mục đích

Một prompt trong CKOS không phải là văn bản trang trí — nó phải copy-paste dùng được ngay,
cho ra kết quả gần đúng ý ngay lần thử đầu tiên.

## Cấu trúc bắt buộc — 7 phần

Mỗi prompt phải trả lời được (không nhất thiết ghi rõ nhãn trong prompt cuối, nhưng người viết
phải tự kiểm tra đủ 7 phần trước khi công bố):

| Phần | Ý nghĩa | Ví dụ |
|---|---|---|
| **Role** | AI đóng vai gì | "Bạn là một trợ lý viết nội dung" |
| **Context** | Bối cảnh cụ thể | "cho một công ty B2B SaaS" |
| **Goal** | Mục tiêu cụ thể | "viết email xin phản hồi sau cuộc họp" |
| **Input** | Dữ liệu đầu vào, đặt trong `[ngoặc vuông]` | "gửi tới [tên người nhận] về [nội dung]" |
| **Output** | Định dạng mong muốn | "một email ngắn gọn" |
| **Constraints** | Ràng buộc (độ dài, giọng văn) | "giọng chuyên nghiệp, không thúc ép, dưới 100 từ" |
| **Tips** | Ghi chú dùng prompt (không nằm trong prompt, hiển thị riêng ở `promptTips`) | "Luôn nêu rõ người nhận và mục đích" |

## Quy tắc

1. Mỗi Knowledge Seed có tối thiểu **5 prompt thật** trong `prompts[]` (Prompt Pack).
2. Prompt chính (`samplePrompt`) phải có ví dụ Input/Output thật đi kèm
   (`promptExampleInput`, `promptExampleOutput`) — không để trống.
3. Biến cần điền luôn đặt trong `[ngoặc vuông]`, viết bằng tiếng Việt dễ hiểu
   (`[tên người nhận]`, không phải `{{recipient}}`).
4. Không viết prompt chỉ đúng cho 1 tình huống hẹp — prompt phải tổng quát hoá được
   (thay biến là dùng lại được cho tình huống tương tự).
5. Tối thiểu 1-2 Prompt Tips mỗi Seed, mỗi tip là 1 mẹo thực chiến, không phải lý thuyết
   về prompt engineering.

## Ví dụ Prompt hoàn chỉnh

```
"Viết giúp tôi một email ngắn gọn, lịch sự, gửi tới [tên người nhận] để xin phản hồi về
[nội dung đã trao đổi] sau cuộc họp ngày [ngày]. Giọng văn chuyên nghiệp, không thúc ép."
```

- Role: (ngầm định — trợ lý viết email)
- Context: sau một cuộc họp
- Goal: xin phản hồi
- Input: `[tên người nhận]`, `[nội dung đã trao đổi]`, `[ngày]`
- Output: một email ngắn gọn
- Constraints: lịch sự, chuyên nghiệp, không thúc ép

Ví dụ Input/Output thật đi kèm (bắt buộc, không được để "..."):

```
Input:  Viết email xin phản hồi sau cuộc họp với anh Minh (Trưởng phòng Kinh doanh) về đề
        xuất ngân sách quý 3, giọng lịch sự không thúc ép.

Output: Chào anh Minh, cảm ơn anh đã dành thời gian trao đổi hôm qua về đề xuất ngân sách
        quý 3. Em muốn xin phản hồi của anh khi có thời gian để em kịp hoàn thiện bản kế
        hoạch. Em cảm ơn anh nhiều.
```

## Ví dụ sai

```
"Viết email hay"
```

Thiếu Context, Input, Output, Constraints — AI không thể trả lời đúng ý ngay lần đầu.
