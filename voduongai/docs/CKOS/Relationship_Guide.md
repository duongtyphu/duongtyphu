# Relationship Guide

Quy tắc cho 3 loại quan hệ trong Knowledge Graph: **Related Knowledge** (Feature 02),
**Knowledge Dependency** (Feature 06), **Collection Relationship** (Feature 07).

## Related Knowledge (`relatedSeeds[]`)

**Không random.** Mỗi Seed trong `relatedSeeds[]` phải thoả ít nhất 1 điều kiện:

- Có chung ít nhất 1 Skill (kiểm tra bằng `getSeedsBySharedSkill()` trong
  `knowledge-graph.service.ts`), hoặc
- Có chung ít nhất 1 Scenario, hoặc
- Là Seed liền kề logic trong cùng quy trình công việc (VD: "Viết Báo Cáo Tuần" liên quan
  "Ghi Chú Cuộc Họp" vì báo cáo tuần thường tổng hợp từ ghi chú họp).

Số lượng: 1-3 Seed liên quan. Không liệt kê toàn bộ Seed cùng Collection — chỉ Seed thực sự
liên quan về nội dung.

## Knowledge Dependency (`prerequisites[]`)

Khác với thứ tự Collection (`seedSlugs[]` — thứ tự học được đề xuất trong 1 Collection),
`prerequisites[]` là phụ thuộc **thực chất**, có thể bắc cầu giữa các Collection khác nhau.

Quy tắc:
1. Chỉ thêm prerequisite khi Seed B thực sự khó hiểu/khó áp dụng nếu chưa học Seed A.
2. Không tạo chu trình: nếu A là prerequisite của B, B không được là prerequisite của A (trực
   tiếp hoặc gián tiếp qua chuỗi dài hơn).
3. Ưu tiên tối đa 1-2 prerequisite mỗi Seed — nếu một Seed cần quá nhiều điều kiện tiên quyết,
   cân nhắc nó có đang ở đúng vị trí trong Collection hay không.

**Ví dụ áp dụng thật:** "Viết Prompt Hiệu Quả" là prerequisite của toàn bộ 10 Seed AI Office
+ AI Research khác — vì mọi Seed đều dùng Prompt, và viết prompt tốt là điều kiện để các Seed
khác phát huy hết giá trị. Đây là ví dụ dependency bắc cầu hợp lý: "Viết Prompt Hiệu Quả" nằm
ở vị trí thứ 5 trong Collection AI Office (không phải đầu tiên) nhưng vẫn là prerequisite thực
chất của các Seed khác — Companion Guide (`getPrerequisiteGuidance`) xử lý thứ tự Collection
liền kề; `prerequisites[]` xử lý phụ thuộc bắc cầu này riêng.

## Collection Relationship (`relatedCollections[]`)

Một Collection có thể liên kết tới Collection khác đã tồn tại — không tạo Collection giả để
lấp đầy một chuỗi hình dung sẵn.

Quy tắc:
1. Chỉ liên kết tới Collection **đã publish thật**, không liên kết tới Collection dự kiến
   trong tương lai (VD: AI Office chưa liên kết tới "AI Content" vì Collection đó chưa tồn
   tại — xem `CKOS_Blueprint.md` §8 Future Roadmap).
2. Quan hệ nên là 2 chiều nếu 2 Collection bổ trợ nhau trực tiếp (AI Office ↔ AI Research &
   Productivity), hoặc 1 chiều nếu là quan hệ "học xong A thì nên học B" không đối xứng.
3. Khi tạo Collection mới, cập nhật `relatedCollections[]` của các Collection liên quan đã có
   — đừng chỉ thêm quan hệ 1 chiều.

## Cách kiểm tra không đứt gãy (dùng cho Feature 09 — Quality Review)

- Mọi slug trong `relatedSeeds[]` / `prerequisites[]` phải trỏ tới Seed thật sự tồn tại trong
  `knowledgeSeedJourneys`.
- Mọi slug trong `relatedCollections[]` phải trỏ tới Collection thật sự tồn tại trong
  `knowledgeCollections`.
- Không có Seed nào 0 kết nối (không Skill, không Scenario, không relatedSeeds, không
  prerequisite lẫn dependent) — nếu có, Seed đó đang "đứng độc lập", vi phạm Product Rule của
  Sprint 05.
