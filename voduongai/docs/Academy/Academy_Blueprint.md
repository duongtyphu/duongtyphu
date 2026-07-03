# Academy Blueprint

**EPIC 02 — Academy Operating System (AOS)**
Tài liệu gốc. Mọi tài liệu khác trong `/docs/Academy/` là chi tiết hoá của tài liệu này.

---

## 1. Vision

CKOS (EPIC 01, đã graduated) trả lời câu hỏi: **"Tôi cần học điều gì?"**

Academy trả lời câu hỏi tiếp theo: **"Tôi đã trưởng thành hơn ở điều gì?"**

Academy không phải LMS. Academy không phải nơi chứa khoá học, video, hay quiz. Academy là nơi
tri thức từ CKOS được chuyển hoá thành thực hành, năng lực và cảm nhận trưởng thành thật.

Người học không đến Academy để xem video. Người học đến Academy để cảm nhận mình đang
trưởng thành.

## 2. Philosophy

Xem chi tiết đầy đủ ở `Learning_Philosophy.md`. Tóm tắt:

- Học không phải tiếp nhận thông tin — học là thay đổi hành vi.
- Thực hành không phải bài tập chấm điểm — thực hành là làm việc thật, có kết quả thật.
- Năng lực không phải điểm số — năng lực là khả năng làm được một việc mà trước đây chưa
  làm được.
- Trưởng thành không đo bằng số bài hoàn thành — trưởng thành đo bằng: tự tin hơn, làm nhanh
  hơn, ít cần trợ giúp hơn, áp dụng được nhiều hơn.

## 3. Product Goal

1. Biến mỗi Knowledge Seed (CKOS) thành một Lesson có thực hành thật, không phải bài đọc.
2. Đo lường sự trưởng thành bằng Capability, không phải điểm số/chứng chỉ.
3. Companion đồng hành trong quá trình thực hành — phản hồi, không chấm điểm.
4. Không tạo tri thức mới — Academy luôn đọc từ CKOS, không tự viết nội dung tri thức riêng.

## 4. Academy Architecture

```
┌─────────────────────────────────────────────┐
│  CKOS (EPIC 01 — đã graduated)               │  Collection, Knowledge Seed,
│                                               │  Prompt, Example, Checklist...
│                                               │  ("Tôi cần học điều gì?")
├─────────────────────────────────────────────┤
│  Academy (EPIC 02)                           │  Lesson, Practice, Assignment,
│                                               │  Reflection, Capability, Growth
│                                               │  ("Tôi đã trưởng thành hơn ở điều gì?")
└─────────────────────────────────────────────┘
```

Academy là một **tầng đọc** (read layer) đứng trên CKOS, không phải một hệ thống dữ liệu song
song. Một Lesson trong Academy luôn tham chiếu tới đúng 1 Knowledge Seed trong CKOS — không có
Lesson độc lập, không có nội dung tri thức viết riêng cho Academy.

## 5. Learning Flow

```
CKOS Collection
      ↓
Knowledge Seed (tri thức + prompt + example + checklist đã có)
      ↓
Lesson (Academy đóng khung Seed thành 1 buổi học có mục tiêu thực hành)
      ↓
Practice (làm ngay, ngắn, thật — không lý thuyết)
      ↓
Assignment (áp dụng vào công việc thật của người học)
      ↓
Reflection (nhận ra mình vừa thay đổi điều gì)
      ↓
Companion Reflection (phản hồi ngắn, không chấm điểm)
      ↓
Next Lesson
```

## 6. Capability Flow

```
Knowledge (từ CKOS)
      ↓
Practice (làm thử)
      ↓
Capability (làm được, không cần hướng dẫn lại)
      ↓
Confidence (tự tin làm mà không cần kiểm tra lại)
      ↓
Growth (áp dụng được sang tình huống khác, ít cần trợ giúp hơn)
```

Chi tiết: `Capability_Framework.md`.

## 7. Graduation Flow

Một người học "tốt nghiệp" một Lesson/Capability khi:

```
Đã thực hành thật (Practice + Assignment hoàn thành)
      ↓
Đã phản tư (Reflection có nội dung thật, không bỏ trống)
      ↓
Companion xác nhận không còn dấu hiệu cần hỗ trợ thêm
      ↓
Growth Check: người học tự nhận thấy 1 trong 4 dấu hiệu trưởng thành
  (tự tin hơn / làm nhanh hơn / ít cần trợ giúp hơn / áp dụng được nhiều hơn)
```

Không có "chứng chỉ", không có "điểm đậu/rớt". Graduation Flow là một trạng thái cảm nhận
được xác nhận qua Growth Check, không phải một con số.

## 8. Quan hệ với CKOS — nguyên tắc bất biến

- Academy **không tạo Collection/Knowledge Seed mới** — Lesson luôn sinh ra từ Knowledge Seed
  đã tồn tại trong CKOS.
- Academy **không sửa dữ liệu CKOS** — chỉ đọc qua `src/features/knowledge/index.ts`.
- Nếu một Knowledge Seed chưa đủ chất lượng để thành Lesson, vấn đề đó thuộc CKOS (đã
  graduated, quay lại EPIC 01 để sửa), không phải Academy tự vá thêm nội dung.

Xem đầy đủ ràng buộc tại `Academy_Constitution.md`.
