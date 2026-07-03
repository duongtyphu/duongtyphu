# Companion Note Standard

Chuẩn cho **Companion Note** (Feature 12, Sprint 03). Component: `CompanionNoteBlock.tsx`.
Field nguồn: `companionNote` (string).

## Mục đích

Companion Note là khoảnh khắc con người nhất trong toàn bộ Knowledge Seed — lời nhắn cuối
cùng trước khi người học rời trang, như một người bạn vỗ vai chứ không phải hệ thống chào tạm biệt.

## Companion Note phải:

- **Ngắn** — 1-2 câu, không quá 30 từ.
- **Ấm áp** — có cảm xúc thật, không lạnh lùng như thông báo hệ thống.
- **Thực tế** — nói về một tình huống cụ thể ("nếu hôm nay bạn chỉ có 10 phút..."), không nói
  chung chung ("cố gắng lên nhé").
- **Không giáo điều** — không dạy đời, không nói "bạn nên...", "bạn phải...".
- **Không sáo rỗng** — tránh các cụm bị lạm dụng: "hành trình", "chinh phục", "phiên bản tốt
  nhất của bạn", "cùng nhau".
- **Không viết như AI** — tránh cấu trúc liệt kê, tránh giọng văn "trang trọng-chung chung" đặc
  trưng của văn bản AI mặc định.

## Cách nhận biết Companion Note viết "như AI"

| Dấu hiệu AI-voice | Sửa thành giọng Companion |
|---|---|
| "Hãy cùng nhau khám phá..." | Nói thẳng vào tình huống người đọc đang gặp |
| Câu văn cân đối hoàn hảo, không có ngắt quãng tự nhiên | Cho phép câu ngắn, câu dài xen kẽ như hội thoại thật |
| Kết thúc bằng lời động viên chung chung | Kết thúc bằng một gợi ý hành động cụ thể |
| Dùng emoji/dấu chấm than để tạo cảm xúc | Cảm xúc đến từ nội dung câu, không phải ký hiệu |

## Ví dụ đúng

```
Nếu hôm nay bạn chỉ có 10 phút, mình nghĩ bạn nên bắt đầu bằng Prompt trước.
```

```
Không cần tự động hoá tất cả cùng lúc — chỉ cần bắt đầu từ 1 việc, làm tốt, rồi mới sang
việc tiếp theo.
```

Cả hai đều ngắn, thực tế, có lời khuyên cụ thể, giọng văn như một người đồng nghiệp thân thiết.

## Ví dụ sai

```
Chúc mừng bạn đã hoàn thành một bước quan trọng trong hành trình chinh phục AI! Hãy tiếp
tục phát huy tinh thần học hỏi để trở thành phiên bản tốt nhất của chính mình! 🚀✨
```

Sáo rỗng, dùng nhiều cụm bị cấm ("hành trình", "chinh phục", "phiên bản tốt nhất"), dùng
emoji thay cho cảm xúc thật, không có gợi ý hành động cụ thể nào.
