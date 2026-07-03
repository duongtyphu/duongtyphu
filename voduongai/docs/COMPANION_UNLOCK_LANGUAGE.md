# Companion Unlock Language

Quy tắc lời nói của Companion khi báo một Unlock hoặc Discovery. Cùng tinh thần với
`CompanionWorkLanguage.md` (Sprint 04) — không viết như hệ thống, luôn viết như một người bạn.

## Quy tắc viết

1. **Không bao giờ dùng chữ "mở khóa", "unlock", "đã hoàn thành X%", hay bất kỳ ngôn ngữ hệ
   thống nào.**
2. **Câu luôn mang giọng công nhận sự sẵn sàng của người dùng**, không phải giọng "hệ thống cấp
   quyền". So sánh: "Mình nghĩ bạn đã sẵn sàng" (đúng) vs. "Bạn đã đủ điều kiện" (sai).
3. **Câu Unlock nên gắn với một lý do cụ thể**, không chung chung — nhắc tới điều người dùng vừa
   làm khi có thể (giống cách `CompanionWorkLanguage.md` yêu cầu nhắc tên Mission/Agent thật).
4. **Không dùng dấu chấm than thừa/emoji ăn mừng mặc định** ("🎉", "Chúc mừng!!!") — cảm xúc thể
   hiện qua CÂU CHỮ, không qua ký hiệu.
5. **Discovery và Unlock dùng giọng khác nhau**: Discovery là "mình muốn CHIA SẺ", Unlock là
   "mình nghĩ bạn đã SẴN SÀNG".

## Câu Unlock chuẩn (4 câu gốc từ Constitution — dùng luân phiên theo ngữ cảnh)

| Câu | Dùng khi |
|---|---|
| "Mình nghĩ bạn đã sẵn sàng." | Unlock gắn trực tiếp với năng lực vừa đạt được (hoàn thành Mission/Collection/Journey) |
| "Mình muốn chia sẻ thêm với bạn một điều." | Unlock là nội dung bổ sung (Prompt Pack mở rộng, Checklist, Template) |
| "Có một tài liệu mình vẫn giữ đến hôm nay." | Unlock là nội dung "được giữ lại" đặc biệt (Companion Secret, Real Story) |
| "Mình nghĩ bây giờ là thời điểm phù hợp." | Unlock theo điều kiện thời gian (quay lại sau vài ngày, đúng lúc trong hành trình) |

## Câu Discovery chuẩn

| Câu | Dùng khi |
|---|---|
| "Mình có một Prompt đặc biệt." | Discovery một Prompt trong Prompt Pack |
| "Có một Case Study rất hay." | Discovery một Case Study/Real Story |
| "Mình nghĩ hôm nay bạn sẽ thích điều này." | Discovery chung, không thuộc 2 loại trên |

## Cấu trúc một câu Unlock đầy đủ (mẫu để mở rộng, không phải template cứng)

```
[Câu công nhận] + [Lý do cụ thể, nhắc tên thứ vừa hoàn thành] + [Giới thiệu ngắn về điều mới] + [Mời hành động tiếp theo]
```

Ví dụ ráp lại (minh hoạ, không phải câu bắt buộc dùng nguyên văn):

> "Mình nghĩ bạn đã sẵn sàng. Bạn vừa hoàn thành xong Collection về Prompt cơ bản — mình muốn
> chia sẻ thêm một Case Study về một freelancer đã áp dụng đúng những gì bạn vừa học. Bạn có
> muốn xem không?"

## Đúng / Sai

| Đúng | Sai |
|---|---|
| "Mình nghĩ bạn đã sẵn sàng cho bước tiếp theo." | "🎉 Bạn đã mở khóa Mission mới!" |
| "Có một tài liệu mình vẫn giữ đến hôm nay, mình nghĩ giờ là lúc phù hợp để chia sẻ." | "Chúc mừng! Bạn đã đạt Level 5." |
| "Mình có một Prompt đặc biệt cho việc bạn đang làm." | "Nội dung mới đã sẵn sàng, xem ngay!" |
| Câu Unlock luôn nhắc điều người dùng vừa làm | Câu Unlock chung chung, dùng được cho mọi Unlock |

## Ranh giới với Companion Work Language (Sprint 04)

Hai thư viện phục vụ 2 khoảnh khắc khác nhau: `CompanionWorkLanguage.md` là lời Companion nói
**trong khi đang làm việc** (Work Session); tài liệu này là lời Companion nói **khi trao một
thứ mới** cho người dùng (Unlock/Discovery). Cùng nguyên tắc nền (không ngôn ngữ hệ thống,
luôn cụ thể, luôn hướng tới hành động tiếp theo) nhưng khác ngữ cảnh sử dụng — không gộp chung
một hàm/thư viện khi implement.
