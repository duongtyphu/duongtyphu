# Learning Path Engine (Sprint 8.1 — Nhiệm vụ 03)

> "Không phải menu. Mà là hành trình."

Một menu cho người dùng *chọn* việc cần làm. Một hành trình cho người
dùng biết *vì sao* bước tiếp theo là bước đó. Learning Path Engine là tập
nguyên tắc để Portal — và sau này Companion — gợi ý đúng bước tiếp theo,
dựa trên `KNOWLEDGE_ARCHITECTURE.md`, không phải dựa trên danh sách menu
tĩnh.

Không có implementation đi kèm tài liệu này (không có DB, không có
recommendation engine code). Đây là chuẩn thiết kế — `human-flow.ts` và
`NextBestActionCard` (đã có từ Sprint 7.x) là nơi tự nhiên để hiện thực
hóa các nguyên tắc này trong một sprint sau, nếu cần.

## Hành trình mặc định

```
Người mới
   ↓
AI Foundation         (Tầng 2 — Knowledge)
   ↓
Prompt                (Tầng 2)
   ↓
Workflow              (Tầng 2)
   ↓
Automation            (Tầng 2)
   ↓
Affiliate             (Tầng 3 — Action)
   ↓
Build System          (Tầng 3)
   ↓
Share                 (Tầng 3 → Tầng 1, qua Community)
   ↓
Mentor                (Tầng 1 — Human, Dẫn dắt)
```

Đây là hành trình **mặc định gợi ý**, không phải đường ống bắt buộc.
Người dùng có thể vào ở bất kỳ điểm nào (ví dụ một người đã biết Prompt
có thể bắt đầu từ Workflow), và có thể dừng ở bất kỳ điểm nào mà không
được coi là "chưa hoàn thành" — không có khái niệm hoàn thành hành trình
này theo nghĩa tuyến tính.

## Nguyên tắc thiết kế hành trình

1. **Mỗi bước phải trả lời "vì sao bước này, ngay lúc này"** — không chỉ
   "bước tiếp theo trong danh sách là gì". Nếu không trả lời được, đó là
   một mục menu, không phải một bước hành trình.
2. **Hành trình ánh xạ vào season trong `human-life-cycle.ts`**, không
   tồn tại song song với nó:
   - 🌱 Khởi đầu → Người mới, AI Foundation
   - 📚 Học hỏi → Prompt, Workflow
   - 🛠 Thực hành → Automation, thực hành đầu tiên
   - 🚀 Kiến tạo → Affiliate, Build System
   - 🤝 Chia sẻ → Share
   - 🌳 Dẫn dắt → Mentor
   - 🍃 Tái tạo → quay lại bất kỳ điểm nào để học sâu hơn, không phải "đã
     xong rồi nghỉ"
3. **Một bước có thể kích hoạt nhiều con đường tiếp theo**, không phải
   một đường thẳng duy nhất. Ví dụ: sau Automation, một người có thể đi
   về Affiliate (kiếm thu nhập) hoặc về Project (ứng dụng cho công việc
   hiện tại) — Learning Path Engine gợi ý cả hai, không ép một hướng.
4. **Không thúc ép tiến độ.** Gợi ý bước tiếp theo phải dùng ngôn ngữ mời,
   không dùng ngôn ngữ tạo áp lực (đối chiếu `PORTAL_MICROCOPY_STANDARDS.md`,
   Điều 4 — `THE_COMPANION_CONSTITUTION.md`). "Khi bạn sẵn sàng" luôn
   đúng hơn "Bạn cần phải".
5. **Bước tiếp theo phải đi qua Content Relationship**
   (`KNOWLEDGE_ARCHITECTURE.md`, Nhiệm vụ 02) — không gợi ý nhảy thẳng từ
   một bài học sang một dự án nếu không có Prompt/Workflow/Tool nào nằm
   giữa, trừ khi người dùng đã có nền tảng đó từ trước.

## Vai trò của Companion trong Learning Path Engine

Khi Companion (Role Selection Engine, `ROLE_SELECTION_ENGINE.md`) đứng ở
vai trò **Guide** hoặc **Coach**, nó dùng Learning Path Engine để gợi mở
hướng đi — không phải để liệt kê toàn bộ bản đồ tri thức cho người dùng
tự chọn, mà để gợi ý một bước, dựa trên nơi người dùng đang đứng. Đây là
sự khác biệt giữa hành trình và menu: menu liệt kê hết, hành trình chỉ
gợi ý điều phù hợp nhất tiếp theo.
