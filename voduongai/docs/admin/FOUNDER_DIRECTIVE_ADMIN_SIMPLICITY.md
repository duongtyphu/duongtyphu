# FOUNDER DIRECTIVE — ADMIN SIMPLICITY

**Trạng thái: CHỈ THỊ BẮT BUỘC, áp dụng cho toàn bộ Sprint Admin CMS (EPIC-02) từ thời điểm này trở đi.** Ghi lại nguyên văn để tham chiếu xuyên suốt các phiên làm việc sau này (context có thể reset giữa các sprint). Nhận cùng lúc với brief IMP-ADM-001R (Admin Baseline Review & Greenfield Validation).

---

Founder xác nhận: Admin CMS mới là Greenfield Project. Portal hiện tại và Landing Page hiện tại là Reference Source duy nhất.

## Nguyên tắc 1 — Không đưa vào nếu không phục vụ Portal/Landing/Roadmap đã khóa

Nếu một chức năng, menu, trang hoặc module: không còn xuất hiện trên Portal hiện tại, không phục vụ Landing Page hiện tại, không nằm trong Roadmap Admin CMS v1.0 đã được PMO khóa — thì **KHÔNG đưa vào Admin mới**.

## Nguyên tắc 2 — Không giữ lại "biết đâu sau này dùng"

Không giữ lại: Menu cũ, Route cũ, Workspace cũ, CRUD cũ, Placeholder cũ, Dashboard cũ, Navigation cũ, Legacy Page, Legacy Component — chỉ vì "biết đâu sau này dùng". Nếu không thuộc Portal hiện tại thì loại bỏ.

## Nguyên tắc 3 — Ít nhưng đúng

Ưu tiên: Ít nhưng đúng. Không xây Admin thật lớn. Xây Admin đúng với nhu cầu vận hành của Founder.

## Nguyên tắc 4 — Khả năng mở rộng bằng dữ liệu, không phải code

Admin phải có khả năng mở rộng. Nếu sau này Founder tạo: Menu mới, Portal Area mới, Workspace mới, Landing mới, Section mới, Chủ đề mới — thì chỉ cần thêm dữ liệu hoặc cấu hình. **Không phải sửa cấu trúc code.**

## Nguyên tắc 5 — Không giữ trùng lặp/chồng chéo

Nếu phát hiện: module trùng, chức năng chồng chéo, hai nơi cùng quản lý một nội dung, menu dư, route dư, component legacy — **KHÔNG giữ lại**. Đánh dấu trong báo cáo và đề xuất loại bỏ.

## Mục tiêu cuối cùng

Admin CMS phải: gọn, rõ, dễ dùng, không trùng lặp, không chồng chéo, quản lý được 100% Landing Page và Portal hiện tại, sẵn sàng mở rộng trong tương lai mà không cần sửa kiến trúc.

---

## Quan hệ với các chỉ thị/quy trình hiện có

- **`FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`** (EPIC-02, trước IMP-ADM-001R): thiết lập nguyên tắc Portal Coverage First (audit → Coverage Matrix → schema sạch → kết nối → xác minh Portal → mới loại bỏ nguồn cũ) và Clean Schema (Content Core chuẩn, không alias field). Directive này **bổ sung thêm chiều "tối giản"** — không chỉ "xây đúng theo Portal" mà còn "không xây thừa", và bổ sung tiêu chí cụ thể để phát hiện thừa (menu/route/component không phục vụ Portal/Landing/Roadmap đã khóa).
- **`PMO_DIRECTIVE_FOUNDER-001_PORTAL_COVERAGE.md`** (EPIC-02 Phase 2): checklist 20 loại element phải quản lý được + self-check bắt buộc cuối Sprint. Directive này không thay đổi checklist đó — chỉ thêm ràng buộc "không đưa thừa vào" song song với "không bỏ sót".
- **Nguyên tắc 4** (mở rộng bằng dữ liệu, không sửa code) trùng tinh thần với Task 5/7 của brief IMP-ADM-001R (Future Flexibility Review) — dùng làm tiêu chí đánh giá chính cho Deliverable 4 (Future Flexibility Assessment).

## Áp dụng

- IMP-ADM-001R (Giai đoạn 1, Admin Baseline Review) là Sprint đầu tiên áp dụng đầy đủ — kết quả audit dùng chính 5 nguyên tắc trên làm khung đánh giá Greenfield Validation (Task 4) và Future Flexibility (Task 7).
- Không cần Founder/PMO nhắc lại ở các Sprint sau.
