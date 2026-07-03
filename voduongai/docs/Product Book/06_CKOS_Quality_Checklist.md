# 06 — CKOS Quality Checklist

Checklist tổng hợp — chạy qua toàn bộ trước khi coi một Knowledge Seed đã sẵn sàng xuất bản.
Gộp từ checklist riêng của từng Standard trong `/docs/CKOS/`.

## Hero
- [ ] Tiêu đề có động từ + đối tượng cụ thể, không phải câu hỏi
- [ ] Subtitle nêu lợi ích + thời gian cụ thể
- [ ] 2-4 `skillsGained`, mỗi cái là cụm động từ ngắn
- [ ] `collectionSlug` trỏ đúng Collection đã tồn tại

## Core Knowledge
- [ ] `problem` có bối cảnh thật, có số liệu nếu có thể
- [ ] `coreIdea` giải thích đúng nguyên lý, không chỉ mô tả lại `problem`
- [ ] `guideSteps` 2-4 bước, mỗi bước 1 hành động

## Prompt
- [ ] Đủ 5 prompt trong `prompts[]`
- [ ] Mỗi prompt có biến trong `[ngoặc vuông]`
- [ ] Có `promptExampleInput`/`promptExampleOutput` thật, không để trống
- [ ] Có 1-2 `promptTips` thực chiến

## Example
- [ ] Đúng format `Trước: ... Sau: ...` (hoặc dạng tương đương được `split-before-after.ts`
      hỗ trợ — kiểm tra code trước khi dùng dạng khác)
- [ ] Cả 2 vế mô tả cùng một công việc cụ thể
- [ ] Cả 2 vế có số liệu đo lường được

## Checklist
- [ ] 3-5 mục
- [ ] Mỗi mục là hành động hoặc câu hỏi có/không kiểm tra được ngay
- [ ] Không mục nào là khái niệm/lý thuyết

## Exercise
- [ ] Có động từ hành động cụ thể ở đầu câu
- [ ] Dùng dữ liệu/công việc thật của người học
- [ ] Làm được trong 5-15 phút
- [ ] Có sản phẩm đầu ra kiểm tra được

## Reflection
- [ ] `reflectionQuestions` có đúng 1 câu hỏi riêng của Seed (2 câu còn lại tự động cố định)
- [ ] Câu hỏi cụ thể theo đúng nội dung Seed

## Companion Note
- [ ] 1-2 câu, dưới 30 từ
- [ ] Không chứa cụm bị cấm ("hành trình", "chinh phục", "phiên bản tốt nhất", "cùng nhau")
- [ ] Có gợi ý hành động cụ thể

## Next Action
- [ ] Bắt đầu bằng động từ hành động
- [ ] Chỉ 1 hành động duy nhất
- [ ] Không phải "bài liên quan"

## Metadata
- [ ] `goal[]` khớp Companion Discovery hiện có
- [ ] `relatedSeeds[]` là Seed thật sự liên quan (1-3 mục)
- [ ] `downloadPack` có đủ 3 nhãn
- [ ] `steps[]` — mỗi step có `assetId` thật hoặc `required` được đặt đúng (xem
      `04_CKOS_Content_Workflow.md` Bước 3)

## Toàn cục
- [ ] Đọc toàn bộ Seed từ đầu đến cuối — có tạo cảm giác "một bài học hoàn chỉnh" không, hay
      vẫn giống một bài viết dài?
- [ ] Câu hỏi cuối: "Nếu đây là bài học duy nhất người dùng đọc hôm nay, họ có thay đổi được
      một điều gì trong công việc thật không?" — nếu KHÔNG, không xuất bản.
