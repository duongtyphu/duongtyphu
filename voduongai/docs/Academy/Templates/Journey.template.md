# Journey Template

Xem quy tắc đầy đủ: `../Learning_Journey_Blueprint.md`, `../JourneyRules.md`.

Một Learning Journey **luôn** chiếu 1:1 từ 1 CKOS Collection đã tồn tại — không điền tay các
field dưới đây, chúng được sinh tự động bởi `journey.service.ts`:

```ts
{
  id: `journey-${collection.slug}`,
  slug: collection.slug,          // = collectionSlug, không tự đặt tên khác
  title: collection.title,        // lấy nguyên từ CKOS Collection
  goal: collection.description,   // lấy nguyên từ CKOS Collection
  collectionSlug: collection.slug,
}
```

## Khi thêm Collection mới vào CKOS

Không cần thao tác gì thêm ở Academy — `getAllLearningJourneys()` tự động tạo Journey mới
tương ứng ngay khi Collection mới xuất hiện trong `knowledgeCollections`. Đây chính là ý nghĩa
"Academy đọc CKOS" (Academy Constitution #1) — không có bước đồng bộ thủ công.

## Checklist trước khi coi 1 Journey sẵn sàng hiển thị

- [ ] Collection nguồn đã qua Quality Guard của CKOS (0 lỗi)
- [ ] `title`/`description` của Collection đủ ngắn gọn để hiển thị trên Journey Card (tiêu đề
      không quá 40 ký tự, mô tả không quá 120 ký tự — nếu dài hơn, sửa ở CKOS, không cắt ở
      tầng Academy)
- [ ] Collection có ít nhất 3 Seed (Journey quá ngắn — dưới 3 giai đoạn thực hành — không đủ
      để tạo cảm giác trưởng thành có ý nghĩa)
