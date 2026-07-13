# COMPANION-SPR-801 — Companion Studio Management

**Epic:** EPIC-02 · **Phase:** Phase 8 — Companion Studio · **Brief:** IMP-COMPANION-801
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package. Portal hiện tại là Reference Source duy nhất. Không xây Chat Runtime mới, không xây Memory Engine mới, không xây MCP mới — chỉ thiết kế/đánh giá kiến trúc mở.

---

## 1. Portal Mapping (Task 1)

Đối chiếu trực tiếp source thật, đính chính Registry cũ (PORTAL-SPR-301/ADM-SPR-201):

| # | Trang | Section/nhóm nội dung | Đính chính |
|---|---|---|---|
| 1 | `/portal/companion` | **9 section** (Presence, Thought, Memory, Thinking, Mission gợi ý, Conversation, Reflection, Silence, Footer) | Registry cũ chỉ ghi 3 section — sửa lại đúng thứ tự JSX render thật (`sectionRegistry.ts`/`contentBlockRegistry.ts`). |
| 2 | `/portal/su-menh-companion` (+ child `companion-qua-hinh-anh`) | 3 nhóm nội dung (Genome 12 gene, Philosophy Pairs, Constitution) | Không đổi — đã đúng từ trước. |
| 3 | `/portal/ai-assistant` | 1 section — "phòng chờ" Companion | **MỚI đưa vào Registry** — route con thật, trước đây bị bỏ sót hoàn toàn khỏi `pageRegistry.ts`/`sectionRegistry.ts`. Comment gốc trong `pageRegistry.ts` từng khẳng định sai "Area companion không có route con" — đã đính chính. |

**Phát hiện quan trọng nhất (chưa từng ghi ở Admin):** `CompanionPresence` (bong bóng Companion + panel `CompanionSpace`) được **mount toàn cục trong `PortalShell.tsx`** — hiển thị trên **mọi route Portal**, không chỉ 3 trang trên. Đây là bề mặt Companion lớn nhất nhưng không khớp mô hình Area→Page→Section (không phải 1 trang, mà 1 lớp phủ). Đã ghi rõ trong Dashboard thay vì ép vào Registry sai chỗ. Đáng chú ý: chính comment gốc trong `CompanionSpace.tsx` đã tự bạch "Không có AI chat thật ở V1 — nói thẳng điều đó, không giả vờ" — khớp hoàn toàn với text tự-bạch trên `/portal/ai-assistant` ("Companion đang được chuẩn bị để có thể trò chuyện cùng bạn").

---

## 2. Studio Structure (Task 2)

Thay `WorkspaceSectionFoundation` placeholder (ADM-SPR-201) bằng Dashboard thật tại `/admin/companion-studio` — vẫn đúng 1 mục IA (`COMPANION_STUDIO_SECTIONS`), không thêm route/menu dư vì toàn bộ nội dung Companion hiện chỉ có 1 Dashboard tổng hợp, chưa có CRUD nào cần trang riêng. Gỡ `comingSoon: true` khỏi `nav.ts`.

---

## 3. Companion Management (Task 3)

Founder xem được (đọc, chưa CRUD — đúng "chỉ bằng dữ liệu/cấu hình hiện có, không tạo đối tượng chưa tồn tại"):

- **Persona/Mentor Profile:** `companion-identity.ts` — tên, sứ mệnh, tính cách, tông giọng, 6 trạng thái chính thức.
- **Agent Registry (Recommendation Strategy):** **32 agent** (đếm bằng TypeScript AST, xác thực — không lặp lại lỗi đếm thủ công của AIWS-SPR-501), 8 module Portal, **100% status = "planned"** (0 "active" — không có Agent AI thật đang chạy).
- **Conversation Strategy:** `conversation-library.ts` — 5 thư viện × 100 câu/thư viện (openers/acknowledgments/questions/encouragements/closings) + `companion-inner-life.ts` — 7 Thought + 7 Musing. Toàn bộ hardcode.
- **Orchestration Rules:** 8 rule (`orchestration-rules.ts`) — rule-based keyword-match, chọn Agent nào "được mời", không gọi AI thật.
- **Reflection Strategy:** `character-memory.ts` — 3 hướng (listen-first/self-discovery/grateful). Lưu ý: `reflection-meaning.ts` là engine dùng chung toàn Portal (Academy/Living Garden...), Companion chỉ tiêu thụ, không sở hữu.
- **Runtime Configuration:** **Không tồn tại** — 0 lời gọi AI Provider API trong toàn bộ `src/companion/`. Không xây form/CRUD giả cho mục này (đúng Acceptance "Không tạo AI Runtime giả").

**Phát hiện Memory — đính chính finding cũ:** Portal Coverage Audit (ADM-SPR-201) từng ghi "3 hệ thống bộ nhớ song song". Đối chiếu lại trực tiếp: thực tế là **6** hệ thống riêng biệt, chưa hợp nhất — Workspace Runtime Memory, Memory Capsule (Supabase), Character Memory (localStorage), Core Memory, Origin Memory (static), Story Memory (bridge). Ghi đầy đủ trong Dashboard, không hợp nhất (ngoài phạm vi "chỉ thiết kế/đánh giá kiến trúc").

---

## 4. Workspace Ownership (Task 4)

Cập nhật `workspaceOwnership.ts` — Companion Studio sở hữu: 3 trang Portal + Presence toàn cục, Persona/Identity, Agent Registry metadata, Orchestration Rules, Conversation/Inner-life library, Character/Core/Origin/Story Memory. **Không sở hữu:** Knowledge/CKOS (Tools/Prompts/Seed thật — các agent "ckos-*" chỉ orchestrate, không sở hữu dữ liệu), Learning/Academy (Mission/Journey/Roadmap thật), Commercial/Premium (Pricing/Order/Entitlement), Website (Page/Nav/SEO), Media (Asset), Brand (Logo/Theme), Reflection Meaning Engine (dùng chung).

---

## 5. Future Flexibility Review (Task 5 — chỉ đánh giá, không triển khai)

| Khả năng | Đánh giá |
|---|---|
| AI Chat | Chưa có điểm nối AI thật; kiến trúc không khoá cứng model nào (vì chưa gọi model nào). |
| Conversation Management | Chỉ có context tạm 1-lượt (sessionStorage) — chưa có khái niệm Session/Turn. |
| Memory | **Yếu nhất** — 6 hệ thống song song, hợp nhất là quyết định kiến trúc lớn, không phải mở rộng thêm. |
| AI Runtime | 0% đã xây, nhưng cũng 0% khoá cứng (rule-based thuần) — không tạo giả. |
| Multi Model | Trung lập mặc định (chưa dùng provider nào), chưa phải thiết kế chủ đích. |
| Agent Capability | **Tốt nhất** — `AgentStatus` ("active"\|"planned") đã sẵn, bật Agent thật không cần đổi schema. |
| Tool Calling | Đã phân vùng theo module (`MODULE_ROUTE_PREFIXES`) nhưng "gọi" hiện chỉ là hiển thị text. |
| Workflow (Goal→...→Recommendation) | Khá tốt — state machine `work-session-engine.ts` đã mô phỏng đúng nhịp 7 bước. |
| Voice | Chưa có điểm nối nào — không xung đột, chỉ là tầng chưa tồn tại. |
| Multi Channel | **Yếu** — toàn bộ logic nằm trong tầng UI React (PortalShell), chưa tách thành service độc lập kênh. |

---

## 6. Build/test

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công, xác nhận `/admin/companion-studio` + `/portal/ai-assistant` build đúng
- [x] `npm run test` — 139/139 pass

---

## 7. Files changed

**Mới:**
- `src/lib/admin/companionStudio/navigation.ts` — `COMPANION_STUDIO_SECTIONS`.
- `docs/admin/COMPANION_STUDIO_MANAGEMENT_COMPANION-SPR-801.md` (file này).

**Sửa:**
- `src/app/admin/(dashboard)/companion-studio/page.tsx` — thay placeholder bằng Dashboard thật (Task 1-5).
- `src/lib/admin/nav.ts` — gỡ `comingSoon: true`.
- `src/lib/admin/portal/pageRegistry.ts` — thêm `page_ai_assistant` (child page của `page_companion`), đính chính comment sai.
- `src/lib/admin/portal/sectionRegistry.ts` — `page_companion` 3→9 section; thêm `page_ai_assistant` (1 section).
- `src/lib/admin/portal/contentBlockRegistry.ts` — content block tương ứng.
- `src/lib/admin/workspaceOwnership.ts` — entry `companion-studio` ghi rõ phạm vi thật + loại trừ.

Không merge. Không deploy Production. Chờ PMO review.
