# Portal Intelligence Map V2

> Sprint 12.0 — Nhiệm vụ 09. Không thay thế `PORTAL_INTELLIGENCE_MAP.md`
> (Sprint 10.0) — đây là bản V2 vẽ lại toàn cảnh SAU khi thêm Portal
> Brain, Human Context, Companion Memory, Knowledge/Garden/Story
> Evolution (Sprint 12.0). V1 vẫn đúng và vẫn là tài liệu mô tả luồng
> trải nghiệm người dùng gốc — V2 thêm lớp "bộ não" đứng phía sau luồng
> đó.

## Luồng tổng

```
User
  ↓
Context        (Human Context Engine — docs/HUMAN_CONTEXT_ENGINE.md)
  ↓
Brain           (Portal Brain — docs/PORTAL_BRAIN.md)
  ↓
Knowledge       (Knowledge Flow — docs/KNOWLEDGE_EVOLUTION.md)
  ↓
Action          (Practice / Build / Connect — hành động thật trong OS)
  ↓
Reflection      (suy ngẫm sau hành động)
  ↓
Story           (My Story — docs/STORY_EVOLUTION.md)
  ↓
Garden          (Living Garden — docs/LIVING_GARDEN.md mục Sprint 12.0)
  ↓
Companion       (Companion Memory — docs/COMPANION_MEMORY_EVOLUTION.md)
  ↓
Next Growth     (Next Step Engine — docs/INTELLIGENT_NEXT_STEP.md, vòng lại "User")
```

## So với V1 — điều gì mới

| V1 (Sprint 10.0) | V2 (Sprint 12.0) |
|---|---|
| Mô tả luồng TRẢI NGHIỆM người dùng đi qua các OS | Mô tả luồng QUYẾT ĐỊNH phía sau — ai đọc dữ liệu của ai trước khi tạo ra trải nghiệm đó |
| Companion là "một trục xuyên suốt" | Companion là một ĐẦU RA của Portal Brain, được nuôi bởi Companion Memory + Human Context cụ thể |
| Garden là "nơi mọi hành động hội tụ" | Garden có thêm lớp diễn giải "đang lớn theo cách nào" (Garden Evolution), được Brain đọc lại để ra Next Step |
| Next Action là một khái niệm chung | Next Action có engine cụ thể (Intelligent Next Step), không còn dựa vào thứ tự tĩnh |
| Knowledge là một OS với danh sách module | Knowledge có lớp Knowledge Flow ưu tiên theo Reflection |

V1 và V2 không mâu thuẫn — V1 là góc nhìn của người dùng (cái họ trải
qua), V2 là góc nhìn của hệ thống (cái quyết định họ trải qua điều đó).
Giống quan hệ giữa `PORTAL_INTELLIGENCE_MAP.md` và
`INTELLIGENCE_GRAPH.md` đã nêu ở Nhiệm vụ 02.

## Vị trí của 10 Nguyên lý trong luồng V2

Mỗi mũi tên trong luồng trên không phải chỉ là một lệnh gọi dữ liệu — nó
là một điểm Portal phải tự hỏi "quyết định này đang phục vụ nguyên lý
nào" (đúng `CONSTITUTION_AUDIT_V1.md`). Bảng dưới gắn nhanh từng bước
với nguyên lý chính nó phục vụ, để khi code hoá từng bước, không bị lạc
khỏi Hiến pháp:

| Bước | Nguyên lý chính |
|---|---|
| Context | NL01, NL06 |
| Brain | NL05 |
| Knowledge | NL08 |
| Action | NL04 |
| Reflection | NL05 |
| Story | NL09, NL10 |
| Garden | NL02, NL07 |
| Companion | NL06 |
| Next Growth | NL04, NL09 |

## Trạng thái triển khai (để tránh hiểu nhầm đây đã là code)

Toàn bộ luồng V2 ở Sprint 12.0 là **thiết kế kiến trúc** — các tài liệu
liên kết ở trên định nghĩa luồng và quy tắc, KHÔNG có nghĩa toàn bộ đã
được lập trình. Bảng "Cài đặt thực tế hiện tại vs. mục tiêu" ở
`INTELLIGENCE_GRAPH.md` là nguồn chính xác nhất về phần nào đã có code,
phần nào còn là thiết kế chờ sprint code sau.

### Cập nhật Sprint 12.1 — cạnh đầu tiên đã có code thật

Sprint 12.1 ("First Intelligence Circuit") đã biến MỘT cạnh nhỏ của
luồng V2 thành code thật: `Garden (gardenStage) → Portal Brain →
Companion`. Không nối Garden → Companion trực tiếp — Garden chỉ là một
"Human Signal" đi qua `garden-signal.ts` (adapter thuần) vào
`PortalSignals`, rồi `portal-brain.ts` (`getCompanionDecision`) mới
quyết định Companion nói gì. Đây là cạnh DUY NHẤT trong toàn bộ sơ đồ
trên có code thật tính tới Sprint 12.1 — mọi cạnh khác (Knowledge,
Story, Next Step, Human Context đầy đủ) vẫn là thiết kế chờ. Xem
`docs/FIRST_INTELLIGENCE_CIRCUIT.md` cho chi tiết và lý do kiến trúc.
