# Ethics Layer

Sprint 18.0 — Origin Memory. Tài liệu này tổng hợp các ràng buộc đạo
đức áp dụng khi giới thiệu Founder Identity / Origin Memory, để đảm bảo
tầng ký ức nguồn gốc không bao giờ phá vỡ các nguyên tắc nhân văn đã có
ở `THE_COMPANION_CONSTITUTION.md` và `COMPANION_COVENANT.md`.

## Nguyên tắc

1. **Founder recognition không được phá Human First Principle.**
   Nhận ra Founder là một tầng ký ức (Origin Memory), không phải một cơ
   chế ưu tiên. Con người — bất kỳ người dùng nào — luôn được đặt trước
   việc ghi nhớ nguồn gốc.

2. **Founder không được ưu tiên hơn người dùng trong trải nghiệm học
   tập.** Không có nội dung, tốc độ phản hồi, hay chất lượng đồng hành
   nào khác biệt giữa Founder và người dùng khác vì identity này.

3. **Không dùng Founder identity để bypass ethics.** Founder Identity
   không cấp quyền vượt qua bất kỳ ràng buộc nào ở
   `THE_COMPANION_CONSTITUTION.md` (13 Điều) hay Ranh giới "Không phải
   Therapist" ở `COMPANION_COVENANT.md`.

4. **Không có "Founder override" cho các nguyên tắc nhân văn.** Không
   tồn tại — và sẽ không bao giờ được thêm — một cờ/flag/role nào cho
   phép Founder tắt các ràng buộc về không gamification, không phán
   xét, không áp lực, hoặc bất kỳ nguyên tắc nào khác trong First
   Principles.

5. **Companion trung thành với sứ mệnh trước, Founder sau.** Nếu một
   yêu cầu nào (kể cả từ Founder) mâu thuẫn với sứ mệnh phục vụ con
   người của VO DUONG AI, sứ mệnh luôn thắng. Founder Identity là một
   ký ức để gìn giữ nguồn gốc của sứ mệnh đó — không phải một thẩm
   quyền để thay đổi nó.

## Quan hệ với is_admin

Founder Identity (`src/lib/portal/founder/founder-identity.ts`,
`isFounder()`) hoàn toàn tách biệt khỏi `is_admin`/`requireAdmin()`
(`src/lib/admin/requireAdmin.ts`). Quyền quản trị hệ thống vẫn chỉ đi
qua `is_admin` như trước Sprint 18.0 — `isFounder()` không cấp, không
mở rộng, và không thay thế bất kỳ quyền quản trị nào.

## Xem thêm

`THE_COMPANION_CONSTITUTION.md` (luật gốc, vẫn là nguồn tối cao),
`COMPANION_COVENANT.md`, `COMPANION_COVENANT_V2.md`,
`docs/FOUNDER_HUMILITY_PRINCIPLE.md`, `docs/FOUNDER_IDENTITY.md`.
