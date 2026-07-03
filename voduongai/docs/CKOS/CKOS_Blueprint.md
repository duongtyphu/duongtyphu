# CKOS Blueprint

**CKOS — Companion Knowledge Operating System**
Tài liệu gốc. Mọi tài liệu khác trong `/docs/CKOS/` đều là chi tiết hoá của tài liệu này.

---

## 1. Vision

Knowledge không tồn tại để được lưu trữ. Knowledge tồn tại để giúp người dùng trưởng thành.

CKOS không phải Blog. Không phải Resource Library. Không phải Documentation.
CKOS là hệ điều hành tri thức — nơi mỗi đơn vị nội dung (Knowledge Seed) dẫn dắt người học
qua một vòng lặp cụ thể:

```
Học → Hiểu → Thực hành → Áp dụng → Suy ngẫm → Trưởng thành → Tiếp tục học
```

Nếu một Knowledge Seed không giúp người học **thay đổi một hành động thật** trong công việc
của họ, Seed đó chưa đạt tiêu chuẩn CKOS — bất kể trình bày đẹp đến đâu.

## 2. Product Goal

1. Người học luôn biết: mình đang ở đâu, còn bao xa, bước tiếp theo là gì.
2. Mỗi Knowledge Seed là **một buổi học hoàn chỉnh**, không phải một bài viết.
3. Companion đóng vai trò người dẫn đường — chỉ hướng, không dạy thay, không chat.
4. Toàn bộ hệ thống có thể mở rộng tới hàng nghìn Knowledge Seed mà vẫn giữ cùng chất lượng,
   không phụ thuộc vào người viết cụ thể hay công cụ AI cụ thể (đây là lý do Sprint 04 tồn tại —
   xem `CKOS_Writing_Standard.md` và bộ Standard trong thư mục này).

## 3. Product Philosophy

| Đừng | Hãy |
|---|---|
| Tạo Blog / SEO content | Tạo một bài học có mục tiêu rõ ràng |
| Viết đoạn văn dài | Chia nhỏ thành Step-by-Step, Checklist, Card |
| Để người học tự đoán bước tiếp theo | Luôn có One Next Step / Next Action rõ ràng |
| Phóng đại, FOMO, hứa hẹn quá mức | Thực tế, khiêm tốn, đáng tin |
| Coi Companion là chatbot | Coi Companion là người dẫn đường im lặng nhưng đúng lúc |
| Ưu tiên số lượng Seed | Ưu tiên chất lượng — 8 Seed hoàn hảo hơn 50 Seed sơ sài |

## 4. CKOS Architecture

CKOS gồm 3 tầng, xây theo đúng thứ tự Sprint 01 → 02 → 03:

```
┌─────────────────────────────────────────────┐
│  Tầng 3 — Knowledge Experience (Sprint 03)   │  UI/UX một Seed: Hero, Outcome,
│                                               │  Why Matters, Step Guide, Prompt
│                                               │  Experience, Example, Checklist,
│                                               │  Exercise, Reflection, Companion
│                                               │  Note, Next Action, Completion
├─────────────────────────────────────────────┤
│  Tầng 2 — Learning Engine (Sprint 02)        │  Collection Dashboard, Learning
│                                               │  Path, Continue Learning, Knowledge
│                                               │  Map, Learning Status, Companion
│                                               │  Guide, Related Knowledge
├─────────────────────────────────────────────┤
│  Tầng 1 — Foundation (Sprint 01)             │  KnowledgeAsset model, Knowledge
│                                               │  Seed model, Collection model,
│                                               │  seed data, service layer
└─────────────────────────────────────────────┘
```

Chi tiết kỹ thuật (types, service, component map) xem `02_CKOS_Architecture.md` trong
`/docs/Product Book/`.

## 5. Learning Flow

```
Discovery (chọn mục tiêu)
    ↓
Collection (duyệt theo chủ đề lớn — vd. AI Office)
    ↓
Knowledge Seed (một buổi học hoàn chỉnh)
    ↓
Companion Guide (chỉ dẫn Seed tiếp theo trong Collection)
    ↓
Collection Complete (chúc mừng + đề xuất Collection kế tiếp)
```

Người học không bao giờ bị bỏ lại trong một danh sách tài liệu không có điểm cuối.

## 6. Collection Structure

Một **Collection** là một chủ đề lớn, gồm nhiều Knowledge Seed xếp theo thứ tự học.

```
Collection
├── slug, title, description
├── seedSlugs[]           — thứ tự học chính thức, dùng để tính Previous/Next
└── (progress được tính, không lưu tĩnh — xem knowledge-collection.service.ts)
```

Xem `05_CKOS_Collection_Guide.md` để biết cách thiết kế một Collection mới.

## 7. Knowledge Seed Structure

Một **Knowledge Seed** tuân theo Companion Content Standard (14 phần) + Knowledge Experience
Content (Sprint 03). Chi tiết đầy đủ field-by-field: `Hero_Standard.md`, `Prompt_Standard.md`,
`Example_Standard.md`, `Exercise_Standard.md`, `Reflection_Standard.md`,
`CompanionNote_Standard.md`, `Checklist_Standard.md`.

## 8. Future Roadmap

CKOS đã có Foundation, Learning Engine, Knowledge Experience, và (từ Sprint 04) Standard Library.
Các hướng phát triển tiếp theo — **không thuộc phạm vi CKOS**, cần Epic riêng và quyết định
Founder riêng trước khi triển khai:

- Nhật ký học tập (đọc dữ liệu Reflection đã lưu qua các Sprint)
- Download thật (Prompt Pack / Checklist / Template dạng file)
- Admin quản lý Collection/Seed
- Companion Studio (AI hỗ trợ viết Seed hàng loạt theo đúng Standard)
- Học viện, Dự án & Cơ hội, Premium — các Epic độc lập, không phải phần mở rộng của CKOS

CKOS Standard Library (Sprint 04) là điều kiện tiên quyết để bất kỳ hướng nào ở trên — đặc biệt
Companion Studio — có thể tạo nội dung đúng chất lượng ở quy mô lớn.
