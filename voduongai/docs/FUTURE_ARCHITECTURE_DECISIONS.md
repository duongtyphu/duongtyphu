# Future Architecture Decisions

Ghi lại toàn bộ quyết định kiến trúc tương lai đã khóa cho VO DUONG AI, để
sau này không bị hiểu sai, không phát triển lệch hướng, không tự ý đổi
kiến trúc. Tài liệu này là điểm tham chiếu cuối cùng trước khi Sprint B1
Implementation bắt đầu — không sửa UI, không thêm code tính năng, không
ảnh hưởng build/lint/typecheck.

**Product Principle**: Kiến trúc phải được bảo vệ trước khi hệ thống mở
rộng. VO DUONG AI phát triển nhiều năm nhưng không được đánh mất lõi:
Mission → Output → Evidence → Growth → Capability → Companion đồng hành.

---

## 1. Architecture Decisions đã khóa

Các quyết định sau đã khóa từ Blueprint A1–A9
(`docs/EPIC03_BLUEPRINT_LOCK.md`) và Sprint B1
(`docs/FOUNDATION_DATA_LAYER.md`, `docs/SPRINT_B1_FOUNDATION_REPORT.md`) —
không được đổi mà không qua Architecture Change Proposal (mục 4):

1. **VO DUONG AI là AI Learning Operating System, không phải LMS thông
   thường** — không tổ chức theo khóa học/bài giảng tuyến tính, mà theo
   Mission và hành trình phát triển năng lực (`LEARNING_OS_PRINCIPLE.md`).
2. **Mission là đơn vị trung tâm của toàn bộ hệ thống** — mọi Journey/
   Collection/Learning Asset đều tồn tại để phục vụ Mission, không phải
   ngược lại (`MISSION_LIBRARY_STANDARD.md`).
3. **Mọi Mission phải kết thúc bằng Output thật** — không có Mission nào
   dừng ở "đã hiểu"/"đã xem" (`MISSION_LIBRARY_STANDARD.md` mục 8,
   `LEARNING_ASSET_STANDARD.md` mục 10).
4. **Output trở thành Evidence, Portfolio, Growth và Capability** — Output
   không phải điểm kết thúc, mà là nguyên liệu nuôi toàn bộ hệ thống đo
   lường phía sau (`CAPABILITY_EVIDENCE_FRAMEWORK.md`,
   `LEARNING_OPERATING_SYSTEM_BLUEPRINT.md` mục 8).
5. **Companion là Orchestrator, không phải chatbot thường** — điều phối
   Context/Coaching/AI Agent, không trả lời thay, không quyết định thay
   người dùng (`AI_CURRICULUM_STANDARD.md` mục 7-9,
   `LEARNING_OPERATING_SYSTEM_BLUEPRINT.md` mục 12).
6. **Workspace là nơi thực hành và lưu kết quả** — không thuộc riêng Học
   viện AI hay AI Workspace, là điểm hội tụ chung
   (`LEARNING_OPERATING_SYSTEM_BLUEPRINT.md` mục 2).
7. **Growth Event là backbone kết nối Nhật ký học tập, Hành trình của
   tôi, Khu vườn của bạn** — một Event, nhiều nơi đọc, không ghi cho có
   (`FOUNDATION_DATA_LAYER.md` mục 8, đã có Event Bus thật từ Sprint B1).
8. **Học viện AI = học.**
9. **AI Workspace = làm.**
10. **Thư viện tri thức = tra cứu và dùng ngay.**
11. **Mọi CTA thực hành phải đi qua Universal Context** —
    `startCompanionWorkspace(context)` là điểm gọi duy nhất, không module
    nào tự xử lý thực hành riêng (`FOUNDATION_DATA_LAYER.md` mục 4,
    `PRODUCT_GUARDRAILS.md` luật 3).
12. **Kiến trúc phải AI-Agnostic, không phụ thuộc OpenAI/Anthropic/
    Gemini** — AI Agent khai báo theo vai trò chức năng (Writer/Reviewer/
    Research...), không theo tên sản phẩm AI cụ thể
    (`MISSION_LIBRARY_STANDARD.md` mục 1, `LEARNING_ASSET_STANDARD.md`
    mục 9).
13. **Single Source of Truth**: dữ liệu chỉ lưu một lần, các module khác
    tham chiếu qua ID, không copy/nhân bản (`FOUNDATION_DATA_LAYER.md`
    mục 7).
14. **Event-Driven Architecture**: module giao tiếp qua Event, không gọi
    chéo trực tiếp — Workspace không tự cập nhật Capability/Impact/Unlock,
    chỉ phát Event, Engine tương ứng tự đọc và cập nhật
    (`FOUNDATION_DATA_LAYER.md` mục 11-12).
15. **Không dùng placeholder, dữ liệu giả, file giả, tài nguyên giả** — nội
    dung/tài nguyên chỉ được hiển thị khi thật và dùng được ngay
    (`PRODUCT_GUARDRAILS.md` luật 4, 5, 9).

---

## 2. Các phần cố ý CHƯA triển khai

Sprint B1 (`docs/SPRINT_B1_FOUNDATION_REPORT.md`) chỉ xây foundation
data/context/event layer — **cố ý chưa làm** các phần sau, không phải bỏ
sót:

| Chưa triển khai | Lý do |
|---|---|
| AI Agent thật (gọi model thật cho người học) | Chưa cần khi nền dữ liệu (Output/Portfolio/Capability) chưa ổn định — gọi AI thật trước khi có nơi lưu kết quả thật là vô nghĩa |
| Multi-Agent Orchestration | Cần Companion Orchestrator thật (điều phối nhiều Agent theo trình tự) — phụ thuộc AI Agent thật ở trên, chưa tới lượt |
| AI API cho người học | Cùng lý do — Sprint B1 giữ nguyên "chưa gọi AI thật, chưa có Agent thật" từ Sprint 01/02 |
| Adaptive Curriculum tự động | Personalization (AI Curriculum Standard mục 17) cần dữ liệu Capability/Output thật tích lũy đủ lâu mới có cơ sở gợi ý đúng — chưa có dữ liệu thật để "adaptive" dựa vào |
| Capability scoring tự động | Cần Capability Engine đọc Growth Event thật (Sprint B5) — Sprint B1 mới có Event Bus, chưa có Engine tiêu thụ |
| AI Impact dashboard | Cần Impact Engine + đủ dữ liệu Before/After thật tích lũy — chưa tới Sprint B5, và Dashboard là UI, ngoài phạm vi B1 |
| Portfolio nâng cao (filter, chia sẻ, xuất bản) | Cần Portfolio MVP cơ bản trước (Sprint B4) — chưa có Portfolio cơ bản để nâng cao |
| Unlock nâng cao (điều kiện phức tạp nhiều tầng) | Cần Unlock MVP cơ bản trước (Sprint B6), và cần điều hòa với `unlock-engine.ts` hiện có (Technical Debt đã ghi ở Sprint B1 Report mục 8) |
| File resource thật quy mô lớn (hàng trăm Checklist/Template thật) | Cần quy trình sản xuất nội dung thật ổn định trước (Sprint B7/EPIC 06) — tạo hàng loạt file thật khi kiến trúc lưu trữ/Portfolio chưa xong là lãng phí công sức |
| Video lesson | Chưa có trong 10 thành phần bắt buộc nào được ưu tiên ở giai đoạn nền tảng; cần hạ tầng lưu trữ/phát video riêng, chưa phải Sprint B |
| Admin quản trị giáo trình thông minh | Cần Foundation Data Layer ổn định trước (đang làm ở B1) — Admin UI quản lý Mission/Journey/Asset chỉ có ý nghĩa khi schema đã khóa |

**Lý do chung**: Sprint B1 chỉ xây foundation data/context/event layer
trước, không triển khai logic thông minh khi nền dữ liệu chưa ổn định —
đúng nguyên tắc "Audit trước. Thiết kế sau. Implement cuối." đã nêu từ đầu
EPIC 03.

---

## 3. Future Epic Direction

```
EPIC 03 — Smart AI Learning Engine
   (đang triển khai: Blueprint A1-A9 → Sprint B1 Foundation → B2-B7)
        ↓
EPIC 04 — AI Execution Engine / Companion Agent Orchestration
   (AI Agent thật, Multi-Agent Orchestration, Companion gọi AI thật
    có kiểm soát, vẫn AI-Agnostic theo quyết định mục 1.12)
        ↓
EPIC 05 — Growth, Capability & AI Impact Analytics
   (Capability Engine/Impact Engine thật, Dashboard trưởng thành,
    Portfolio nâng cao, dựa trên dữ liệu Growth Event đã tích lũy đủ)
        ↓
EPIC 06 — Real Resource Library & Smart Curriculum Admin
   (sản xuất file resource thật quy mô lớn, Admin quản trị giáo trình
    thông minh, tổ chức lại toàn bộ Knowledge Asset theo Mission)
        ↓
EPIC 07 — Adaptive Learning & Personalized Companion
   (Adaptive Curriculum tự động, Capability scoring tự động,
    Personalization thật dựa trên dữ liệu đã đủ lớn từ EPIC 04-06)
```

Nguyên tắc thứ tự: mỗi EPIC sau **phụ thuộc dữ liệu/hạ tầng đã ổn định** từ
EPIC trước — không nhảy cóc (vd không làm Adaptive Curriculum ở EPIC 04
khi chưa có Impact Analytics ở EPIC 05, không làm Impact Analytics khi
chưa có AI Execution Engine thật ở EPIC 04 để tạo đủ dữ liệu thật).

---

## 4. Architecture Change Rule

**Từ sau file này**: không được thay đổi bất kỳ quyết định nào ở mục 1
(và toàn bộ kiến trúc đã khóa ở A1–A9 + Foundation Data Layer) nếu không
tạo **Architecture Change Proposal**.

Mỗi Proposal phải ghi đủ:

```
Architecture Change Proposal {
  thayĐổiGì            // mô tả cụ thể thay đổi kiến trúc đề xuất
  lýDo                  // vì sao cần thay đổi, dữ liệu/vấn đề thực tế nào dẫn tới đề xuất
  ảnhHưởngModule[]        // module nào bị ảnh hưởng (Companion/Workspace/Portfolio/Growth...)
  ảnhHưởngDataModel[]       // model nào trong Foundation Data Layer bị đổi/thêm/bớt
  ảnhHưởngLearningLoop        // có làm đứt Learning Loop (Journey→...→Unlock→Mission tiếp theo) không
  cóPháProductGuardrailsKhông  // đối chiếu từng luật ở PRODUCT_GUARDRAILS.md, ghi rõ có vi phạm không
  rollbackPlan                  // cách quay lại trạng thái trước nếu thay đổi gây vấn đề
}
```

Không có Proposal đầy đủ 7 mục trên — không được implement thay đổi kiến
trúc, bất kể lý do gì (kể cả "chỉ sửa nhỏ" hay "deadline gấp"). Việc chuẩn
hóa tên gọi thuần túy (vd các đổi tên đã thống nhất ở
`EPIC03_BLUEPRINT_LOCK.md` mục 4.1, `FOUNDATION_DATA_LAYER.md`) **không**
cần Proposal vì không đổi model/relationship/logic, chỉ đổi tên gọi khi
implement — ranh giới này đã minh định ở 2 tài liệu đó.

---

## 5. Product Guardrails Reference

Mọi thay đổi tương lai phải tuân thủ `docs/PRODUCT_GUARDRAILS.md`.

Nếu một tính năng không trả lời được:
- Người dùng tạo ra kết quả gì?
- Companion hỗ trợ gì?
- Portal chứng minh sự tiến bộ như thế nào?

Thì không được triển khai — bất kể tính năng đó đến từ EPIC nào trong
Future Epic Direction (mục 3), hay từ Architecture Change Proposal nào
(mục 4). 3 câu hỏi này là bộ lọc cuối cùng, áp dụng sau khi Proposal đã
qua đủ 7 mục ở mục 4.

---

## 6. Kết luận

Tài liệu này khóa lại toàn bộ 15 quyết định kiến trúc, ghi rõ 11 phần cố ý
chưa làm và lý do, định hướng 5 EPIC tiếp theo, và thiết lập quy trình bắt
buộc (Architecture Change Proposal) cho mọi thay đổi kiến trúc từ đây về
sau. Sprint B1 Implementation có thể bắt đầu, với lõi được bảo vệ: Mission
→ Output → Evidence → Growth → Capability → Companion đồng hành.
