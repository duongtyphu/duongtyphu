# Companion Admin — Báo cáo thiết kế

Nhánh: `admin-rebuild`. Trạng thái: **đã code xong, CHƯA merge, CHƯA deploy
production, CHƯA apply migration Supabase.**

## 1. Kiến trúc thông tin (Information Architecture)

1 mục sidebar duy nhất **"Companion"** (`/admin/companion`) chứa 10 tab
trong cùng 1 trang (`?tab=` đồng bộ URL để deep-link) — không tạo 10 route
riêng, không có menu con kỹ thuật nào lộ ra ngoài:

Tổng quan · Nhân cách · Hội thoại · Tri thức · Trí nhớ · Dẫn dắt & Huấn
luyện · Công cụ · An toàn · Kiểm tra Companion · Phiên bản & Xuất bản.

Toàn bộ nhãn hiển thị bằng tiếng Việt. Không xuất hiện các từ Workspace/
Registry/Collection/Runtime/Orchestration Registry/Agent Registry/CRUD ở
bất kỳ đâu trong UI — các khái niệm này chỉ tồn tại dưới dạng key kỹ thuật
nội bộ (`collectionKey`, tên bảng, tên biến).

## 2. Mapping dữ liệu — bảng nào phục vụ tab nào

| Tab | Bảng Supabase | collectionKey | Loại |
|---|---|---|---|
| Nhân cách | `companion_persona` (đã có từ trước, mồ côi — nay tái sử dụng) | `companion-persona` | Singleton `id="current"` |
| Hội thoại (chiến lược chung) | `companion_conversation_strategy` (đã có từ trước, mồ côi — nay tái sử dụng) | `companion-conversation-strategy` | Singleton |
| Hội thoại (mẫu hội thoại) | `companion_conversation_examples` (mới) | `companion-conversation-examples` | List |
| Tri thức | `companion_knowledge_refs` (mới) — chỉ lưu `{sourceCollection, sourceId}` | `companion-knowledge-refs` | List, tham chiếu ID thuần |
| Trí nhớ | `companion_memory_policy` (mới, seed 6 dòng) | `companion-memory-policy` | List (chính sách, không phải dữ liệu thật) |
| Dẫn dắt & Huấn luyện (chiến lược chung) | `companion_coaching_strategy` (mới) | `companion-coaching-strategy` | Singleton |
| Dẫn dắt & Huấn luyện (tình huống mẫu) | `companion_training_scenarios` (mới) | `companion-training-scenarios` | List |
| Công cụ | `companion_capabilities` (mới, seed 11 dòng) | `companion-capabilities` | List, chỉ đọc |
| An toàn | `companion_safety_rules` (mới) | `companion-safety-rules` | List |
| Kiểm tra Companion | `companion_test_sessions` (mới) | `companion-test-sessions` | List, không public read |
| Phiên bản & Xuất bản | `companion_versions` (mới) | `companion-versions` | List (lịch sử), không public read |

Tất cả 11 bảng dùng chung đúng 1 schema generic
(`id text/data jsonb/status/order/created_at/updated_at`) và API route
`/api/admin/collections/[table]` đã có sẵn — **không viết API/Server Action
mới nào**.

## 3. Danh sách năng lực (tab Công cụ) — đã rà soát trung thực

Đã kiểm tra toàn bộ codebase trước khi seed dữ liệu: **không có
tool-calling harness, không có chat runtime nào tồn tại cho Companion
end-user hôm nay.** "Companion Studio™" (`src/ai/**`) là hệ thống KHÁC —
trợ lý viết nội dung cho Admin, có gọi Anthropic/OpenAI thật, không liên
quan tới Companion hiển thị cho người dùng.

Cả 11 dòng seed đều đánh dấu **"Sắp phát triển"** — không có dòng nào đánh
dấu "Đã có" để tránh tạo cảm giác hoàn thiện giả:

Tìm kiếm Hệ tri thức (CKOS) · Gợi ý khoá học · Gợi ý công cụ AI · Theo dõi
tiến độ học tập · Ghi nhận suy ngẫm (Reflection) · Tác vụ tự động (Agent) ·
Gọi công cụ (Tool Calling) · Kết nối MCP · Lịch & nhắc việc · Gửi email ·
Giọng nói.

## 4. Xác nhận quyền sở hữu (Ownership validation)

- Companion **KHÔNG sở hữu** Knowledge Object của CKOS, Learning Object của
  Academy, Commercial Object của Premium, Media Asset, hay dữ liệu người
  dùng runtime — xác nhận qua code: `companion_knowledge_refs` chỉ lưu cặp
  `{sourceCollection, sourceId}`, không có cột nào chứa nội dung sao chép.
- Tab Tri thức đọc trực tiếp Tool/Prompt/Workflow/Resource qua
  `useCollection()` (cùng nguồn dữ liệu thật `/admin/tools`,
  `/admin/ckos/*` đang quản lý), Lesson qua `getAllKnowledgeSeeds()`
  (chỉ đọc), Case Study qua Supabase browser client với RLS có sẵn (chỉ
  đọc) — không ghi ngược vào bất kỳ bảng CKOS nào.
- **Phát hiện quan trọng, đã xử lý trung thực:** "Goals" và "FAQ" trong yêu
  cầu ban đầu **không tồn tại** trong hệ thống CKOS thật (đã đọc toàn bộ
  `/portal/ckos/page.tsx` — mô hình thật chỉ có 7 loại: Tool/Prompt/
  Workflow/Resource/Lesson/Best Practice/Case Study, không có Goals/FAQ).
  "Best Practice" cũng chưa có bảng lưu trữ thật trong production (Phase H
  chưa từng apply). UI hiển thị đúng sự thật này ("Chưa có nguồn dữ liệu
  này trong hệ thống"), không bịa dữ liệu cho 3 mục trên.
- **Không đụng** bất kỳ file nào trong `src/lib/portal/companion/**`,
  `src/companion/**`, `/portal/companion/**`, `src/ai/**` — hệ Companion
  runtime hiện có (thư viện câu văn tĩnh + rule chọn theo mood, hiển thị
  cho end-user) giữ nguyên 100%. Việc nối Portal đọc từ CMS mới này là việc
  riêng, chưa làm ở đây.

## 5. Kiến trúc đủ mở cho tương lai (Expansion validation)

- Schema generic (`data jsonb`) cho phép thêm field mới (vd. `voiceProfile`,
  `mcpServers`, `toolDefinitions`) vào bất kỳ bảng nào **không cần đổi
  schema** — chỉ cần thêm `FieldConfig` mới ở đúng tab.
- Tab "Công cụ" đã có sẵn cấu trúc danh mục năng lực — khi Chat/Agent/MCP/
  Voice thật được xây, chỉ cần đổi `readiness` từ "Sắp phát triển" sang
  "Đã có", không cần đổi UI.
- Tab "Kiểm tra Companion" đã có khung test log (`companion_test_sessions`)
  tách biệt khỏi dữ liệu người dùng thật — khi có Chat runtime thật, chỉ
  cần nối phần "Chưa kết nối runtime" sang gọi runtime thật, giữ nguyên
  toàn bộ UI còn lại.
- Tab "Phiên bản & Xuất bản" dùng snapshot jsonb — mở rộng phạm vi phiên
  bản hoá (thêm Tri thức/Trí nhớ/An toàn vào snapshot) chỉ cần sửa 1 hàm
  `logVersion()`, không đổi schema.

**Giới hạn phạm vi đã biết trước (ghi rõ, không giấu):** phiên bản hoá ở
lần build này chỉ bao phủ 3 bảng "cốt lõi" (Nhân cách + 2 chiến lược chung)
— CHƯA gồm Tri thức/Trí nhớ/An toàn/Công cụ trong snapshot rollback. Đây là
quyết định phạm vi có chủ đích để giữ độ phức tạp hợp lý cho lần build đầu,
không phải thiếu sót.

## 6. Component mới dùng chung (tái dùng được ngoài Companion)

- `AdminTabs.tsx` — tab bar generic, đồng bộ URL, ARIA đầy đủ.
- `SingletonEditor.tsx` — form toàn trang cho collection 1 dòng (mẫu đầu
  tiên trong Admin — trước đây `founder_profile`/`projects` chưa có UI nào
  dùng pattern này).
- `FieldInput.tsx` — tách từ `DataTableRowPanel.tsx`, dùng chung giữa
  slide-over và `SingletonEditor`.
- `AdminAtmosphere.tsx` — thêm prop `atmosphere?: ReactNode` để nhận thẳng
  component nền (không chỉ 1 class), phục vụ `<SanctuaryBackground/>` của
  Companion.

## 7. Việc CHƯA làm (theo đúng Out of Scope)

- Chưa kết nối AI Provider mới, chưa xây Chat/Memory Engine/MCP/Voice/Agent
  Runtime thật.
- Chưa `apply_migration` file `supabase-phase7-companion-admin.sql` —
  **chờ Founder duyệt riêng** trước khi chạy (đúng nguyên tắc "không thay
  đổi database production nếu chưa được phê duyệt").
- Chưa merge vào `main`, chưa deploy production.
- Chưa nối Portal đọc từ CMS mới này (Portal vẫn dùng nguyên hệ hardcode
  hiện có).

## 8. Verification đã chạy

- `npx tsc --noEmit` — sạch.
- `npm run lint` (ESLint) — sạch (chỉ 2 warning `<img>` có sẵn từ trước,
  không liên quan).
- `npm run build` — sạch, route `/admin/companion` xuất hiện đúng.
- `npm test` (vitest run) — 139/139 test hiện có đều pass, không vỡ test
  nào.
- Rà thủ công: không thuật ngữ kỹ thuật lộ ra UI, không menu trùng, không
  copy dữ liệu CKOS, không Runtime/Chat/Memory giả.
- **Chưa chụp được ảnh màn hình có dữ liệu thật** — sandbox hiện không có
  `.env.local`/Supabase credentials nên không khởi động được server ở
  trạng thái đăng nhập Admin thật để chạy Playwright. Đã xác nhận đúng cấu
  trúc/route qua build output thay thế.

## 9. Đợt hardening theo PMO Review (trước khi apply migration)

Sau khi bản dựng đầu tiên (mục 1-8) được review, PMO yêu cầu 10 việc hardening
UI/UX **trước khi** cho phép `apply_migration` — không thêm tính năng mới,
không thêm bảng, không đổi schema. Toàn bộ 10 việc đã hoàn thành trên nhánh
`admin-rebuild`, chưa merge `main`, chưa deploy, chưa apply migration.

| # | Yêu cầu PMO | Đã làm |
|---|---|---|
| 1 | Data Model Review, so sánh Option A/B | `docs/admin/COMPANION_ADMIN_DATA_MODEL_REVIEW.md` — phân tích đủ 11 bảng, khuyến nghị giữ Option A (generic hiện tại), không sửa migration. |
| 2 | Bỏ nút gộp "Gửi duyệt/Xuất bản", khoá sửa trực tiếp bản active | `SingletonEditor.tsx`: thêm `isLocked` (khoá khi `status !== "Draft"`), `<fieldset disabled>` chỉ-đọc, nút "Tạo bản nháp mới" tường minh trước khi sửa tiếp — vá đúng lỗi kiến trúc tự phát hiện: bản build đầu chưa thực sự chặn ghi đè bản Published. |
| 3 | Dashboard dữ liệu thật/empty-state trung thực, thẻ bấm được, phân loại thông báo, hạ cấp cảnh báo AI | `OverviewTab.tsx` viết lại: 8 `StatCard` bấm được (đều `goToTab()`), danh sách "Phần chưa hoàn thành" trỏ đúng tab, `Notification` phân 4 loại (Lỗi/Cảnh báo/Thông tin/Sắp phát triển) — "chưa cấu hình AI" chuyển xuống loại Thông tin, không còn là cảnh báo chặn soạn nội dung. |
| 4 | Sửa lỗi cắt tab cuối, giữ 1 route `?tab=`, thêm nhóm + điều hướng bàn phím | `AdminTabs.tsx` viết lại: `pr-6` chống cắt tab cuối, `scrollIntoView` cho tab đang chọn, `groups?: AdminTabGroup[]` (Nền tảng/Năng lực/Quản trị, chỉ là divider + label, không route mới), điều hướng ArrowLeft/ArrowRight/Home/End với `tabIndex` roving. |
| 5 | Trạng thái lưu theo từng tab + cảnh báo rời trang khi có thay đổi chưa lưu | `SingletonEditor.tsx`: state machine `idle/dirty/saving/saved/error` hiển thị qua `SaveStateBadge`, so sánh field-by-field để phát hiện dirty, `beforeunload` chặn rời trang khi còn thay đổi chưa lưu. Không bật autosave (chưa đủ an toàn với cơ chế khoá bản active ở mục 2). |
| 6 | Version tab: phân biệt active/draft, diff, ghi chú phát hành, lịch sử duyệt, rollback | `VersionsTab.tsx`: thêm `approvedBy`/`releaseNotes` vào `VersionLog` + form nhập khi publish, `DiffView` so 4 field nhân cách với bản Published gần nhất, lịch sử hiển thị đầy đủ người duyệt/ghi chú, rollback ghi thêm 1 dòng lịch sử (không sửa/xoá dòng cũ). Không bịa lịch sử nếu bảng rỗng — hiển thị empty-state thật. |
| 7 | Kiểm tra Companion: bộ test case tái sử dụng thật, không phải log dùng 1 lần | `TestTab.tsx` viết lại hoàn toàn từ form nhập 1 lần thành `VisualEditor` CRUD đầy đủ trên `companion_test_sessions` (title/question/expectedBehavior/passCriteria/importance/scenarioGroup/versionTested/result/reviewNotes/status) — vẫn giữ đúng trạng thái "Chưa kết nối hệ thống trả lời" (không giả lập AI), không đụng `reflections`/`memory_capsules`. |
| 8 | Tri thức: phân biệt nguồn còn tồn tại/không, cờ tham chiếu hỏng | `KnowledgeTab.tsx`: thêm cơ chế `validIds` (Set ID thật lấy từ từng nguồn qua callback `onLoaded`), đánh dấu "Không hợp lệ / đã gỡ khỏi nguồn gốc" cho tham chiếu mồ côi, tách `toggleEnabled()` khỏi xoá, thêm cột Bật/Cập nhật vào bảng tổng hợp, stamp `updatedAt`. |
| 9 | Xác nhận cấu hình AI Provider không nằm trong Companion, không secret nào lộ ra JSONB/form | Rà lại bằng grep (`apiKey|api_key|secret|token`) trên toàn bộ `src/components/admin/companion/` — 0 kết quả. Xác nhận `isAiConfigured()` chỉ đọc biến môi trường phía server, trả về `boolean`, không truyền giá trị secret nào xuống Client Component. Cấu hình AI Provider thật thuộc phạm vi Settings hệ thống, không phải nội dung Companion — đúng như PMO yêu cầu, không cần sửa gì thêm. |
| 10 | Verification + báo cáo | Xem mục dưới. |

### Kết quả verification (đợt hardening)

- `npx tsc --noEmit` — sạch.
- `npx eslint .` — sạch (0 lỗi; chỉ còn 2 warning `<img>` có sẵn từ trước, không liên quan tới Companion).
- `npm run build` — sạch, route `/admin/companion` vẫn xuất hiện đúng.
- `npm test` (vitest run) — 139/139 test pass.
- Đã thử khởi động `next start` + gọi `curl`/Playwright để chụp ảnh redirect
  chưa đăng nhập — xác nhận `/admin/companion` trả `307` (redirect) đúng như
  kỳ vọng khi chưa đăng nhập. **Không chụp được ảnh màn hình có dữ liệu
  thật** vì 2 lý do độc lập: (a) sandbox không có `.env.local`/Supabase
  credentials nên không đăng nhập được để vào các tab có dữ liệu; (b) gói
  `playwright` không tồn tại trong `node_modules` của dự án (không phải lỗi
  cấu hình `NODE_PATH` — kiểm tra trực tiếp `node_modules/playwright` xác
  nhận package chưa từng được cài, dự án không khai báo `playwright` như một
  dependency). Đây là giới hạn môi trường sandbox, không phải lỗi code — ghi
  nhận trung thực thay vì cố lách qua.
