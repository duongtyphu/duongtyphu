# Knowledge Evolution — Knowledge Flow

> Sprint 12.0 — Nhiệm vụ 06. Thiết kế kiến trúc cho Knowledge OS chuyển
> từ "menu tĩnh" sang "luồng tiến hoá theo Reflection". Phục vụ NL08
> (Portal dạy tư duy, không chỉ dạy công cụ) và NL05 (Phản chiếu tạo nên
> trí tuệ).

## Hiện tại vs. mục tiêu

**Hiện tại:** Knowledge OS (`src/lib/portal/hubs.ts` nhóm `knowledge`,
`KNOWLEDGE_ARCHITECTURE.md`) hiển thị một danh sách module cố định (Học
viện, Thư viện AI, Prompt, Công cụ AI, Template, Workflow, Checklist,
SOP, Ebook, Thực chiến, Case Study) — thứ tự và nội dung hiển thị giống
nhau cho mọi người dùng, không đổi theo những gì người dùng vừa
Reflection.

**Mục tiêu — Knowledge Flow:** nội dung tiếp theo được ưu tiên theo chủ
đề Reflection gần nhất, tạo thành một chuỗi tiến hoá hợp lý, ví dụ đúng
như yêu cầu Sprint:

```
Reflection về "Tư duy"
        ↓
Portal ưu tiên bài: Decision Making
        ↓
Sau đó: Critical Thinking
        ↓
Sau đó: AI Reasoning
```

## Cấu trúc Knowledge Flow

Knowledge Flow không thay thế cấu trúc Knowledge OS hiện có
(`KNOWLEDGE_ARCHITECTURE.md`, `KNOWLEDGE_METADATA_STANDARD.md`) — nó là
một **lớp sắp xếp lại thứ tự ưu tiên** trên cùng dữ liệu đã có, dựa vào
2 thứ:

1. **Content Relationship Graph đã có** (`VO_DUONG_AI_KNOWLEDGE_GRAPH.md`,
   Sprint strategic trước Sprint 11) — các cạnh `leads_to` đã định nghĩa
   bài nào dẫn tới bài nào.
2. **Chủ đề Reflection gần nhất** (Human Context / Companion Memory) —
   dùng để CHỌN điểm bắt đầu trong graph đó, không phải để tạo graph
   mới.

Nói cách khác: Knowledge Graph đã có trả lời "bài A dẫn tới bài nào",
Knowledge Flow trả lời "với người này, lúc này, nên bắt đầu từ đâu trong
graph đó".

```
Chủ đề Reflection gần nhất ("Tư duy")
        ↓ map sang node gần nhất trong Knowledge Graph
Node: "Decision Making"
        ↓ đi theo cạnh `leads_to` đã có sẵn trong graph
Node: "Critical Thinking"
        ↓
Node: "AI Reasoning"
```

## Vì sao đây không phải gợi ý ngẫu nhiên kiểu "có thể bạn quan tâm"

Khác với gợi ý kiểu e-commerce ("sản phẩm liên quan" dựa trên hành vi
nhấp chuột), Knowledge Flow chỉ di chuyển theo các cạnh ĐÃ ĐƯỢC THIẾT KẾ
TRƯỚC trong `VO_DUONG_AI_KNOWLEDGE_GRAPH.md` — đảm bảo logic tiến hoá
luôn có chủ đích sư phạm (đúng NL08: dạy tư duy theo một trình tự có ý
nghĩa), không phải logic tối ưu engagement.

## Đầu vào, đầu ra

| | |
|---|---|
| Đầu vào | Chủ đề Reflection gần nhất (1-3 chủ đề), vị trí hiện tại trong Knowledge Graph (nếu đã có), Garden (`leaves` đang yếu/mạnh) |
| Đầu ra | Một bài tiếp theo được nêu bật (không phải danh sách dài) trong Knowledge OS, kèm một dòng lý do ngắn nối Reflection với bài đó (ví dụ: "Vì bạn vừa viết về Tư duy, đây là bước tiếp theo phù hợp") |

## Khi không có Reflection nào khớp chủ đề nào trong Graph

Quay về thứ tự nền tảng hiện có (AI Foundation → Prompt → Workflow) —
không bịa ra một liên kết không có thật trong graph. Đây là cùng
nguyên tắc "im lặng/an toàn khi thiếu tín hiệu" đã áp dụng ở
`INTELLIGENT_NEXT_STEP.md` bước 4.

## Điều tuyệt đối không làm

- Không tạo cạnh mới trong Knowledge Graph chỉ để "có gợi ý" — cạnh
  phải được Product Team thiết kế có chủ đích sư phạm trước
  (`VO_DUONG_AI_KNOWLEDGE_GRAPH.md` đã có quy trình này).
- Không ẩn hoàn toàn menu Knowledge OS hiện có để chỉ còn "1 bài được
  gợi ý" — Knowledge Flow là một lớp NHẤN MẠNH thêm vào trên menu đã
  có, không phải thay thế quyền tự do duyệt toàn bộ thư viện của người
  dùng.
