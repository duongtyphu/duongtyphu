# Product Guardrails

Luật phát triển sản phẩm bắt buộc cho VO DUONG AI, có hiệu lực từ trước
Sprint B1 trở đi. Đây là **checklist gate** — mọi tính năng, route, CTA,
Mission, Learning Asset, Workspace, Capability, Resource mới đều phải qua
đủ các luật dưới đây trước khi được chấp nhận, không cần đọc lại toàn bộ 9
tài liệu chuẩn (A1–A9) mỗi lần muốn kiểm tra nhanh.

Tài liệu này không định nghĩa lại khái niệm nào — mọi thuật ngữ tham chiếu
`docs/LEARNING_OS_PRINCIPLE.md`, `docs/MISSION_LIBRARY_STANDARD.md`,
`docs/LEARNING_OPERATING_SYSTEM_BLUEPRINT.md`, `docs/EPIC03_BLUEPRINT_LOCK.md`,
`docs/FOUNDATION_DATA_LAYER.md`.

---

## 10 Luật bắt buộc

1. **Không xây tính năng nếu không có Mission sử dụng.** Mọi tính năng
   mới phải trả lời được: Mission nào (đã có hoặc sắp có) cần tính năng
   này để hoàn thành? Nếu không có Mission nào cần — không xây.

2. **Không thêm menu nếu không kết nối Learning Loop.** Menu mới phải nằm
   đúng vị trí trong Master Learning Loop (Học viện AI → Companion →
   Workspace → Portfolio → Growth → Capability → Journey) — không thêm
   menu đứng ngoài luồng này.

3. **Không thêm CTA nếu CTA không đi qua Companion hoặc Workspace
   context.** Mọi CTA thực hành phải gọi `startCompanionWorkspace(context)`
   (Universal Context System) — không tự viết logic điều hướng/xử lý
   thực hành riêng cho một CTA cụ thể.

4. **Không thêm dữ liệu giả.** Không tạo Mission/Journey/Asset/Resource
   mẫu chỉ để "có nội dung" — mọi dữ liệu phải là nội dung thật, dùng
   được thật, hoặc không tạo.

5. **Không placeholder.** Không "sắp có", không nút dẫn tới `href="#"`,
   không file giả sinh ra lúc click để giả lập tài nguyên thật. Nếu chưa
   có nội dung/file thật — không hiển thị mục đó, không hứa hẹn.

6. **Không tạo Learning Asset nếu không có Output.** Theo Output Standard
   (Learning Asset Standard mục 10) — một Asset không dẫn tới Output thật
   thì không được Publish, bất kể Knowledge có hay đến đâu.

7. **Không tạo Workspace nếu không sinh Growth Event.** Mọi
   `WorkspaceSession` phải kết nối Growth Event Backbone (Foundation Data
   Layer mục 8) — không tạo luồng thực hành nào đứng ngoài hệ thống Growth
   Event.

8. **Không tạo Capability nếu không có Evidence.** Theo Evidence
   Framework (Capability Evidence Framework mục 1) — Capability chỉ được
   cập nhật khi có Output/Reflection/Review/Reuse thật, không tự động
   tăng theo thời gian hay số lần "xem qua."

9. **Không tạo Resource nếu không dùng được ngay.** Checklist/Template/
   Prompt Pack/SOP mới phải ở định dạng dùng được thật (.docx/.xlsx/.md/
   .pdf...) — không tạo Resource chỉ là nhãn/mô tả chờ file thật.

10. **Mọi tính năng mới phải trả lời được 3 câu hỏi**, trước khi thiết kế,
    không phải sau khi code xong:
    - Người dùng tạo ra kết quả gì?
    - Companion hỗ trợ gì?
    - Portal chứng minh sự tiến bộ như thế nào?

    Không trả lời được cả 3 — không xây.

---

## Nguyên tắc kiến trúc bổ sung

- **Single Source of Truth** — mỗi loại dữ liệu có đúng 1 model lưu trữ
  (Foundation Data Layer mục 2); không module nào tự tạo bảng/localStorage-
  key song song để lưu lại cùng một thông tin.
- **Event-Driven Architecture** — module downstream (Capability/Impact/
  Nhật ký/Hành trình/Khu vườn/Unlock) chỉ đọc `GrowthEvent`, không gọi hàm
  trực tiếp giữa các module (Foundation Data Layer mục 11, 12).
- **AI-Agnostic Architecture** — Mission/Learning Asset không gắn với tên
  AI Tool cụ thể (ChatGPT/Claude/Canva...); AI Agent được khai báo theo
  vai trò chức năng (Writer/Reviewer/Research/Designer...), công cụ nền
  phía sau có thể đổi mà không cần sửa nội dung (Mission Library Standard
  mục 1, Learning Asset Standard mục 9).
- **Everything starts from Mission** — thiết kế giáo trình luôn bắt đầu
  từ câu hỏi "Mission nào," không bắt đầu từ "mình có nội dung gì" (AI
  Curriculum Standard mục 2).
- **Everything ends with Output** — không có luồng học tập/thực hành nào
  kết thúc ở "đã hiểu"/"đã xem" mà không sinh Output thật.
- **Output becomes Asset** — Output đạt chuẩn (có Review + Reflection)
  trở thành `PortfolioItem`, và có thể trở thành Guided Example/Case Study
  cho Mission tương lai (Capability Evidence Framework mục 1.1, mức 7 "Có
  thể hướng dẫn người khác") — Output không phải điểm kết thúc, mà là
  nguyên liệu nuôi hệ thống.
- **Companion is Orchestrator** — Companion là điểm hội tụ duy nhất giữa
  người dùng và AI Agent/nội dung/Workspace; không module nào tự điều
  phối AI Agent hay tự quyết định thay Companion.
- **Every module is replaceable** — Học viện AI, AI Workspace, Thư viện
  tri thức, Portfolio, Growth Event Backbone chỉ là các góc nhìn khác nhau
  của cùng một Data Layer (Foundation Data Layer) — một module có thể
  được xây lại/thay UI hoàn toàn mà không phá dữ liệu, miễn tuân đúng
  Ownership (Foundation Data Layer mục 11).

---

## Cách dùng tài liệu này

Trước khi bắt đầu code bất kỳ Sprint B nào (hoặc bất kỳ tính năng mới nào
sau này), đối chiếu qua đủ 10 luật + 8 nguyên tắc trên. Nếu một đề xuất vi
phạm bất kỳ mục nào — dừng lại, quay về đúng tài liệu chuẩn liên quan
(Mission Library Standard / Learning Asset Standard / Foundation Data
Layer...) để điều chỉnh thiết kế trước khi implement, không code trước
rồi sửa sau.

Guardrails này không thay thế các tài liệu chuẩn A1–A9 — đây là bản rút
gọn để kiểm tra nhanh, chi tiết đầy đủ luôn nằm ở tài liệu gốc tương ứng.
