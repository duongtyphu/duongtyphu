# Product Decisions

Nhật ký các quyết định sản phẩm có tính nguyên tắc — không phải mọi
quyết định nhỏ, chỉ những quyết định định hình cách Portal được xây và
đo lường. Đánh số theo đúng số Founder đặt khi công bố.

## #050 — Đo lường giá trị bằng hành động, không bằng số lượng nội dung

> "VO DUONG AI sẽ không đo lường giá trị bằng số lượng nội dung. VO DUONG
> AI sẽ đo lường giá trị bằng số lượng hành động mà tri thức đó tạo ra
> trong cuộc sống của người học."

**Bối cảnh:** Công bố cùng Sprint 8.1 (Knowledge Architecture), khi
Founder mô tả VO DUONG AI có ba tầng — Human, Knowledge, Action — và nhận
ra rằng Tầng 2 (Knowledge) chỉ có giá trị thật khi nó dẫn tới Tầng 3
(Action) hoặc được Tầng 1 (Human) giữ ấm.

**Hệ quả thiết kế:**

- Knowledge Map (`KNOWLEDGE_ARCHITECTURE.md`) yêu cầu mọi nhóm tri thức
  có ít nhất một liên kết ra khỏi Tầng 2.
- Knowledge Metadata Standard (`KNOWLEDGE_METADATA_STANDARD.md`) yêu cầu
  `relatedContent` của nội dung Tầng 2 phải trỏ ra ngoài Tầng 2.
- Bất kỳ số liệu sản phẩm tương lai nào (nếu có) nên ưu tiên đo "người
  dùng đã áp dụng điều gì" hơn "Portal có bao nhiêu bài viết" — quyết
  định này không yêu cầu xây dashboard đo lường ngay, chỉ là kim chỉ nam
  cho việc ưu tiên.
