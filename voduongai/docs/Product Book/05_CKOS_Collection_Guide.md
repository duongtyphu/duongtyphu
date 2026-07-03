# 05 — CKOS Collection Guide

Hướng dẫn thiết kế một Collection mới. **Sprint 04 không tạo Collection mới** — tài liệu này
chuẩn bị cho việc mở rộng trong tương lai.

## Collection là gì

Một nhóm Knowledge Seed cùng chủ đề lớn, có thứ tự học rõ ràng, không phải một "danh mục" gắn
tag lỏng lẻo. Ví dụ hiện có: **AI Office** (8 Seed về công việc văn phòng), **AI Research &
Productivity** (3 Seed về nghiên cứu/năng suất cá nhân).

## Tiêu chí một chủ đề đủ điều kiện thành Collection

1. Có thể chia thành 5-10 Seed độc lập nhưng liên quan (ít hơn 5 thì nên gộp vào Collection
   khác; nhiều hơn 10 thì nên tách thành 2 Collection).
2. Có thứ tự học tự nhiên — Seed sau có thể tận dụng kiến thức Seed trước (dù không bắt buộc).
3. Có một persona rõ ràng được hưởng lợi (VD: "Nhân viên văn phòng" cho AI Office).
4. Trả lời được câu hỏi: "Hoàn thành Collection này, người học thay đổi được điều gì trong
   công việc thật của họ?" — nếu câu trả lời mơ hồ, chủ đề chưa đủ chín để thành Collection.

## Cấu trúc dữ liệu

```ts
{
  id: "collection-[slug]",
  slug: "[slug]",
  title: "[Tên Collection — ngắn, không phụ đề]",
  description: "[1-2 câu mô tả — persona nào, học được gì]",
  seedSlugs: [
    "seed-slug-1",  // thứ tự học chính thức — quyết định Previous/Next
    "seed-slug-2",
    // ...
  ],
}
```

## Quy tắc thứ tự Seed trong Collection

- Seed dễ nhất / nền tảng nhất đứng đầu.
- Nếu 2 Seed không phụ thuộc nhau, sắp theo tần suất sử dụng thực tế (Seed dùng hàng ngày
  trước Seed dùng hàng tuần).
- Seed cuối cùng nên là Seed "tổng hợp" hoặc nâng cao nhất trong chủ đề (VD: AI Office kết
  bằng "Tự Động Hóa Công Việc Văn Phòng bằng AI" — seed tổng hợp nhiều kỹ năng trước đó).

## Không được làm khi thiết kế Collection

- Không gộp các Seed không liên quan chỉ để đủ số lượng.
- Không đặt Seed vào 2 Collection cùng lúc (một Seed chỉ có 1 `collectionSlug`).
- Không tạo Collection chỉ có 1-2 Seed — dùng `relatedSeeds[]` thay vì Collection trong trường
  hợp này.

## Sau khi tạo Collection mới

1. Thêm vào `knowledgeCollections[]` trong `knowledge-collections.ts`.
2. Đảm bảo mọi Seed trong `seedSlugs[]` đã có `collectionSlug` trỏ đúng.
3. Chạy qua `06_CKOS_Quality_Checklist.md` cho từng Seed trong Collection.
4. Xác nhận `computeCollectionProgress` trả về đúng `totalSeeds` (kiểm tra thủ công qua
   Collection Dashboard trong Portal).
