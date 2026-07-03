# AI Specialist Team Guide

EPIC 02 — Sprint 04, Nhiệm vụ 03: Team Experience. Quy tắc trình bày đội ngũ AI Specialist
phía sau Companion — không bao giờ như một danh sách tool để chọn.

## Quy tắc cốt lõi

> Người dùng không chọn Agent. Companion chọn Agent.

**Sai** (Agent như tool/menu):
```
Chọn Agent: [ ] Writer  [ ] SEO  [ ] Designer  [Bắt đầu]
```

**Đúng** (Agent như đội ngũ được mời):
```
Để hoàn thành Mission này, mình sẽ mời các chuyên gia sau hỗ trợ chúng ta:

Writer — giúp viết nội dung rõ ràng
Designer — giúp gợi ý hình ảnh
SEO — giúp nội dung dễ được tìm thấy
Reviewer — giúp kiểm tra lại trước khi hoàn thành
```

## Cách triển khai trong code

`CompanionWorkSessionPanel.tsx` render đội ngũ bằng đúng câu giới thiệu cố định + danh sách
`agent.name — agent.role`, không có checkbox/nút chọn nào cạnh tên Agent:

```tsx
<p>Để hoàn thành việc này, mình sẽ mời các chuyên gia sau hỗ trợ chúng ta:</p>
<ul>
  {session.selectedSpecialists.map((agent) => (
    <li key={agent.id}>{agent.name} — {agent.role}</li>
  ))}
</ul>
```

`role` của mỗi Agent (định nghĩa trong `src/companion/agents/agent-registry.ts`) phải luôn là
một câu "giúp làm gì", không phải một danh từ chức danh khô khan ("Content Generator").

## Ai chọn đội ngũ, và chọn như thế nào

Người dùng **không tương tác trực tiếp** với bước chọn Agent — toàn bộ nằm trong
`orchestrate()` (`src/companion/agents/companion-orchestrator.ts` + `orchestration-rules.ts`):
rule khớp theo module + từ khoá trong userGoal, hoặc mặc định 2 Agent đầu của module nếu không
có rule cụ thể. Người dùng chỉ thấy KẾT QUẢ của lựa chọn đó, được Companion giới thiệu.

## Không được làm

- Không tạo trang `/portal/agents` hay bất kỳ route liệt kê toàn bộ Agent Registry cho người
  dùng duyệt.
- Không hiển thị trạng thái nội bộ của registry (`status: "planned"`) ra UI người dùng — đó là
  metadata phát triển, không phải thông tin sản phẩm.
- Không để một Agent "trả lời" trực tiếp trong bong bóng chat riêng — mọi lời của Agent phải đi
  qua câu nói của Companion (xem `CompanionFirstRule.md` và `CompanionWorkLanguage.md`).
- Không thêm quá nhiều Agent mới ngoài Agent Registry đã có ở Product Amendment 02 — Sprint 04
  chỉ dùng lại đội ngũ đã định nghĩa.
