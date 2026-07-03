# Graph Validation Rules

Toàn bộ rule kiểm tra tính toàn vẹn Knowledge Graph. Code:
`src/features/knowledge/quality/ckos-quality-guard.ts` → `validateGraphIntegrity()`.
Chạy: `npm test` (bao gồm trong `ckos-quality-guard.test.ts`).

## 9 kiểm tra

| # | Kiểm tra | Cách phát hiện |
|---|---|---|
| 1 | **Duplicate id** | Đếm `seed.id` trùng lặp trong toàn bộ `knowledgeSeedJourneys`. |
| 2 | **Duplicate slug** | Đếm `seed.slug` trùng lặp. |
| 3 | **Seed mồ côi** | Seed không xuất hiện trong `seedSlugs[]` của bất kỳ Collection nào. |
| 4 | **Collection không liên kết** | `relatedCollections[]` rỗng. |
| 5 | **relatedSeeds/prerequisites/nextSeeds sai** | Slug tham chiếu không tồn tại trong danh sách Seed thật (dangling reference). |
| 6 | **nextSeed trỏ vào chính nó** | `nextSeeds` chứa slug của chính Seed đó. |
| 7 | **collectionSlug sai** | Không khớp `slug` của Collection nào. |
| 8 | **Vòng lặp phụ thuộc (cycle)** | DFS trên đồ thị `prerequisites` — nếu quay lại điểm xuất phát, đó là cycle. |
| 9 | **Seed cô lập** | Không có `skills`, `scenarios`, lẫn `relatedSeeds` nào — đứng hoàn toàn độc lập trong hệ tri thức. |

## Kết quả chạy lần cuối (cuối Sprint 06 / cuối EPIC CKOS)

```
0 issues — 11/11 Seed, 2/2 Collection đều sạch.
```

Chi tiết số liệu đầy đủ: xem `CKOS_Quality_Guard_Report.md` (mục "Kết quả Sprint 06").

## Nguyên tắc mở rộng rule trong tương lai

1. Mỗi rule mới phải là **hàm thuần, không I/O** — để test được bằng vitest như hiện tại.
2. Mỗi rule trả về danh sách lỗi có `slug` (để biết lỗi thuộc Seed/Collection nào) và
   `message` (mô tả rõ ràng, không mã lỗi trừu tượng).
3. Không rule nào tự động sửa dữ liệu — Graph Validation chỉ **báo cáo**, con người quyết định
   sửa như thế nào (nhất quán với nguyên tắc "Không sửa ngay" đã áp dụng từ Sprint 04).
