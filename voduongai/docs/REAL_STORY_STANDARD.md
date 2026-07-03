# Real Story Standard

EPIC 02 — Sprint 04.5, Nhiệm vụ 06. Chuẩn cho Case Study/Real Story thật — không Influencer,
không thần tượng hóa.

## Yêu cầu tối thiểu cho mỗi Collection

Mỗi Knowledge Collection (CKOS) nên có ít nhất **một** Real Story gắn với nó, gồm:

1. **Một người thật** — có tên thật hoặc tên viết tắt/nickname thật họ dùng, không phải nhân vật
   hư cấu, không phải người nổi tiếng/Influencer.
2. **Một dự án/công việc thật** — bối cảnh cụ thể (một cửa hàng, một trang cá nhân, một khách
   hàng, một sản phẩm) — không chung chung ("một freelancer nào đó").
3. **Một bài học thật** — điều họ nhận ra SAU KHI áp dụng, không phải kết quả con số ("tăng
   200% doanh thu") làm trọng tâm.

## Đối tượng phù hợp

- Freelancer
- Chủ doanh nghiệp nhỏ
- Marketer
- Founder giai đoạn đầu

**Không dùng**: người có thương hiệu cá nhân lớn/Influencer/celebrity — vì mục đích là "người
như bạn cũng làm được", không phải "hãy ngưỡng mộ người này".

## Cấu trúc một Real Story (3 phần, không phải case study marketing 5-bước)

### 1. Bối cảnh thật (2-3 câu)
Họ là ai, đang làm gì, vấn đề cụ thể họ gặp trước khi áp dụng — không tô hồng, được phép nhắc
tới khó khăn/nghi ngờ ban đầu.

### 2. Điều họ đã làm (trọng tâm chính)
Hành động cụ thể họ thực hiện — gắn trực tiếp với kỹ năng/Seed/Mission trong Collection đó.
Đây là phần dài nhất, tập trung vào QUÁ TRÌNH, không phải kết quả.

### 3. Điều họ đã học
Một câu kết bằng chính lời của họ (hoặc diễn giải sát với giọng người thật) — không phải khẩu
hiệu marketing ("Thay đổi cuộc đời tôi!").

## Đúng / Sai

| Đúng | Sai |
|---|---|
| "Mình từng nghĩ viết content mất cả buổi, giờ chỉ mất 20 phút — nhưng điều mình học được là biết đâu là phần cần chỉnh tay." | "Tăng 300% hiệu suất chỉ trong 1 tuần!" |
| Tên thật/nickname thật + công việc cụ thể | "Một freelancer thành công" |
| Nhắc tới khó khăn ban đầu | Chỉ nói kết quả cuối, bỏ qua quá trình |

## Nguồn dữ liệu (tái dùng, không tạo hạ tầng mới)

Real Story nên tái dùng đúng collection `student-success-stories`/`case_study` đã có trong Admin
(xem `src/lib/admin/supabaseCollections.ts`) — chỉ cần bổ sung field liên kết tới
`collectionSlug`/`journeySlug` để Unlock Rule (`UNLOCK_RULE_STANDARD.md`) biết Real Story nào
gắn với Collection/Journey nào. Không tạo bảng dữ liệu mới ở Sprint Constitution này.

## Khi nào Real Story được mở khóa

Xem `UNLOCK_RULE_STANDARD.md` — trigger tiêu biểu: `collection-completed` (CKOS) hoặc
`real-world-applied` với `minCount ≥ 2` (Academy, nêu ở Blueprint Sprint 04). Real Story thuộc
nhóm có thể là Surprise (không báo trước) tuỳ theo mức độ đặc biệt — xem `DISCOVERY_STANDARD.md`
mục "Discovery vs Surprise vs Unlock".

## Ranh giới

- Real Story Standard không thay thế quy trình biên tập nội dung Case Study hiện có trong
  Admin — chỉ thêm 3 yêu cầu bắt buộc (người thật/dự án thật/bài học thật) và liên kết Unlock.
- Không viết Real Story bằng AI sinh tự động — nội dung phải do đội ngũ thật thu thập/biên tập,
  giống cách `COMPANION_UNLOCK_LANGUAGE.md` yêu cầu câu Companion không AI sinh.
