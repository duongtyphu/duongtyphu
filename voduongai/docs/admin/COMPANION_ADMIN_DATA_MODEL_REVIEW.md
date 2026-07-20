# Companion Admin — Data Model Review

Trạng thái: review trước migration. `supabase-phase7-companion-admin.sql`
**vẫn chưa apply** — tài liệu này không sửa migration, chỉ phân tích.

## 1. Bảng chi tiết (11 bảng)

Tất cả 11 bảng dùng chung 1 schema vật lý: `id text primary key, data jsonb
not null default '{}', status text not null default 'Draft', "order" int
not null default 0, created_at timestamptz, updated_at timestamptz`. Cột
liệt kê dưới đây là field bên trong `data` (không có ràng buộc DB, chỉ do
`FieldConfig[]` phía Admin quy định).

### 1. `companion_persona`
- **Cũ/mới:** Cũ (tạo ở phase trước, 0 dòng, mồ côi — nay tái sử dụng).
- **Mục đích:** Bản sắc Companion — tên, vai trò, sứ mệnh, giọng điệu.
- **Tab:** Nhân cách.
- **Dữ liệu lưu:** name, role, mission, coreValues, personality, tone,
  addressStyle, behaviorPrinciples, doList, dontList, greeting, closing,
  `updatedBy` (mới thêm ở bản hardening này).
- **Field bắt buộc:** name.
- **Quan hệ:** Không có khoá ngoại. Là 1 trong 3 bảng nằm trong snapshot
  phiên bản (`companion_versions.snapshot.persona`).
- **Lifecycle:** Draft → Review → Approved → Published → Archived (dùng lại
  cột `status` có sẵn, không cần cột mới — xem mục 3).
- **Versioning:** version int lưu ở `companion_versions`, KHÔNG lưu trên
  chính bảng này (bảng này luôn là "bản đang chỉnh sửa" tại một thời điểm).
- **Retention:** Không giới hạn — đây là cấu hình vận hành lâu dài, không
  phải log.
- **RLS:** `select using (status = 'Published')` — bổ sung ở phase 7 (trước
  đó bảng có RLS bật nhưng 0 policy).
- **Consumer:** Chỉ Admin (qua `useCollection`/`SingletonEditor`). Portal
  CHƯA đọc bảng này (nằm ngoài phạm vi việc đã làm).
- **Lý do cần bảng riêng:** Nội dung có shape hoàn toàn khác biệt (văn bản
  mô tả tính cách) so với mọi bảng khác — không thể gộp có nghĩa với các
  domain khác (tri thức, an toàn...) mà không làm mất rõ ràng.

### 2. `companion_conversation_strategy`
- **Cũ/mới:** Cũ (tái sử dụng, cùng tình trạng như trên).
- **Mục đích:** Chiến lược hội thoại chung (nhận diện ý định, hỏi làm rõ...).
- **Tab:** Hội thoại (phần chiến lược chung).
- **Dữ liệu lưu:** intentRecognition, clarifyingQuestions,
  stepByStepGuidance, whenUnsure, whenUserIsLost, nextSuggestion, updatedBy.
- **Field bắt buộc:** không có field required cứng (toàn textarea mô tả).
- **Quan hệ:** Không khoá ngoại. Nằm trong snapshot phiên bản.
- **Lifecycle/Versioning/Retention/RLS:** giống `companion_persona`.
- **Consumer:** Chỉ Admin.
- **Lý do cần bảng riêng:** Là singleton (1 dòng) khác hẳn shape của
  `companion_conversation_examples` (nhiều dòng, mỗi dòng 1 tình huống) —
  gộp 2 bảng này sẽ phải nhồi 2 shape khác nhau vào 1 bảng qua discriminant,
  đánh đổi rõ ràng lấy giảm số bảng (xem Phương án B, mục 4).

### 3. `companion_conversation_examples`
- **Cũ/mới:** Mới.
- **Mục đích:** Mẫu hội thoại / tình huống đặc biệt — nhiều dòng.
- **Tab:** Hội thoại (phần mẫu).
- **Dữ liệu lưu:** title, situation, sampleReply.
- **Field bắt buộc:** title.
- **Quan hệ:** Không khoá ngoại.
- **Lifecycle:** Draft/Published (2 trạng thái, không cần 5 trạng thái đầy
  đủ — mỗi mẫu độc lập, không đi qua vòng duyệt Companion tổng thể).
- **Versioning:** KHÔNG nằm trong snapshot phiên bản hiện tại (giới hạn đã
  ghi rõ trong `COMPANION_ADMIN_DESIGN_REPORT.md`).
- **Retention:** Không giới hạn.
- **RLS:** `select using (status='Published')`.
- **Consumer:** Chỉ Admin.
- **Lý do cần bảng riêng:** Shape lặp lại (list of examples), khác hẳn
  singleton ở trên — đúng đúng tinh thần "1 bảng = 1 shape" xuyên suốt
  codebase (giống cách `home_cards` tách khỏi `founder_profile`).

### 4. `companion_knowledge_refs`
- **Cũ/mới:** Mới.
- **Mục đích:** Tham chiếu (KHÔNG copy) tới nội dung CKOS thật.
- **Tab:** Tri thức.
- **Dữ liệu lưu:** sourceCollection, sourceId, sourceLabel, priority,
  enabled, note.
- **Field bắt buộc:** sourceCollection, sourceId.
- **Quan hệ:** "Khoá ngoại mềm" — `sourceId` trỏ tới `id` của bảng
  `tools`/`prompts`/`sop`/`resources` (qua `SUPABASE_COLLECTIONS`), hoặc
  `slug` của `getAllKnowledgeSeeds()` (lesson), hoặc `id` của `case_studies`
  (ép String()) — KHÔNG có ràng buộc FK thật ở DB (rủi ro: có thể trỏ tới
  ID đã bị xoá, xem mục "invalid reference" trong UI hardening).
- **Lifecycle:** Published (bật) / Review (đề xuất chờ duyệt).
- **Versioning:** KHÔNG nằm trong snapshot phiên bản hiện tại.
- **Retention:** Không giới hạn.
- **RLS:** `select using (status='Published')`.
- **Consumer:** Chỉ Admin.
- **Lý do cần bảng riêng:** Đây là bảng JOIN thuần (2 cột khoá + metadata),
  hoàn toàn khác shape nội dung — không thể gộp vào bảng content nào.

### 5. `companion_memory_policy`
- **Cũ/mới:** Mới (seed sẵn 6 dòng cố định).
- **Mục đích:** CHÍNH SÁCH ghi nhớ — không phải dữ liệu trí nhớ thật.
- **Tab:** Trí nhớ.
- **Dữ liệu lưu:** memoryType, allowed, writeCondition, retention,
  forgetCondition, privacyNote, userCanViewDelete.
- **Field bắt buộc:** memoryType.
- **Quan hệ:** Không khoá ngoại.
- **Lifecycle:** Published (seed đã published sẵn — đây là chính sách cố
  định, không cần vòng duyệt riêng).
- **Versioning:** KHÔNG nằm trong snapshot phiên bản hiện tại.
- **Retention:** Không giới hạn (chính sách, không phải log).
- **RLS:** `select using (status='Published')`.
- **Consumer:** Chỉ Admin.
- **Lý do cần bảng riêng:** Taxonomy cố định (6 loại), không liên quan cấu
  trúc tới bất kỳ bảng nào khác.

### 6. `companion_coaching_strategy`
- Giống hệt `companion_conversation_strategy` về mọi tiêu chí, khác domain
  nội dung (coaching/reflection thay vì hội thoại). Singleton, nằm trong
  snapshot phiên bản.

### 7. `companion_training_scenarios`
- Giống hệt `companion_conversation_examples` về mọi tiêu chí — thêm
  `expectedResponse`, `reviewerNotes`. Đây là cặp bảng có shape GẦN GIỐNG
  NHẤT trong 11 bảng (xem đề xuất gộp ở mục 4).

### 8. `companion_capabilities`
- **Cũ/mới:** Mới (seed 11 dòng cố định, tất cả "Sắp phát triển").
- **Mục đích:** Danh mục năng lực — phản ánh THỰC TRẠNG KỸ THUẬT, không
  phải nội dung Admin biên tập.
- **Tab:** Công cụ.
- **Dữ liệu lưu:** label, readiness, description.
- **Field bắt buộc:** không (UI hiện chỉ-đọc, không có form Thêm/Sửa).
- **Quan hệ:** Không khoá ngoại.
- **Lifecycle:** Published tĩnh — không có vòng duyệt.
- **Versioning:** Không áp dụng.
- **Retention:** Không giới hạn.
- **RLS:** KHÔNG có (không public).
- **Consumer:** Chỉ Admin, chỉ-đọc.
- **⚠️ Đánh giá rủi ro:** Đây là **ứng viên mạnh nhất để KHÔNG cần là bảng
  Supabase** — nội dung phản ánh thực trạng ENGINEERING (có/chưa có
  runtime), không phải nội dung Admin có thể thay đổi được. Lưu dưới dạng
  hằng số TypeScript (giống `COMPANION_TODAY_THOUGHTS` ở hệ Companion cũ)
  sẽ đúng bản chất hơn — tránh Admin hiểu lầm đây là "dữ liệu quản lý được".
  Giữ trong DB ở bản này vì đã lỡ thiết kế đồng bộ 100% qua
  `useCollection`/generic API — đề xuất cân nhắc lại ở lần refactor sau,
  KHÔNG sửa trong việc này (đúng yêu cầu "không tạo thêm bảng/không sửa
  migration").

### 9. `companion_safety_rules`
- **Cũ/mới:** Mới.
- **Mục đích:** Quy tắc an toàn/ứng xử.
- **Tab:** An toàn.
- **Dữ liệu lưu:** title, category, condition, action, description.
- **Field bắt buộc:** title, category.
- **Quan hệ:** Không khoá ngoại.
- **Lifecycle:** Draft/Published.
- **Versioning:** KHÔNG nằm trong snapshot phiên bản hiện tại — đây là
  **rủi ro cần lưu ý nhất**: quy tắc an toàn thay đổi mà không được ghi vào
  lịch sử phiên bản Companion, nghĩa là không thể biết "phiên bản Published
  vN đang áp dụng đúng quy tắc an toàn nào" một cách chắc chắn.
- **Retention:** Không giới hạn.
- **RLS:** KHÔNG có (không public).
- **Consumer:** Chỉ Admin + hiển thị tham khảo ở tab Kiểm tra Companion.
- **Lý do cần bảng riêng:** Shape rule-list độc lập, không liên quan cấu
  trúc tới nội dung khác.

### 10. `companion_test_sessions`
- **Cũ/mới:** Mới.
- **Mục đích:** Quản lý test case + kết quả kiểm tra CỦA ADMIN.
- **Tab:** Kiểm tra Companion.
- **Dữ liệu lưu (mở rộng ở bản hardening này):** title, question,
  expectedBehavior, passCriteria, importance, scenarioGroup, versionTested,
  result, reviewNotes.
- **Field bắt buộc:** title, question.
- **Quan hệ:** `versionTested` là tham chiếu MỀM tới
  `companion_versions.version` (không FK thật).
- **Lifecycle:** Draft/Published (test case có thể ở dạng nháp trước khi
  chạy).
- **Versioning:** Không áp dụng (đây là log/test asset, không phải nội dung
  Companion).
- **Retention:** Không giới hạn — cân nhắc dọn định kỳ sau này nếu số lượng
  lớn (chưa cần xử lý ở quy mô hiện tại).
- **RLS:** KHÔNG có (không public — **quan trọng**, tách biệt vật lý khỏi
  `reflections`/`memory_capsules` là bảng người dùng thật).
- **Consumer:** Chỉ Admin.
- **Lý do cần bảng riêng:** Retention/quyền truy cập khác hẳn mọi bảng nội
  dung khác (không bao giờ public, không bao giờ liên quan người dùng
  thật) — bắt buộc tách vật lý vì lý do an toàn dữ liệu, không phải vì tiện
  lợi kỹ thuật.

### 11. `companion_versions`
- **Cũ/mới:** Mới.
- **Mục đích:** Lịch sử publish — nguồn sự thật cho "phiên bản đang hoạt
  động".
- **Tab:** Phiên bản & Xuất bản (+ đọc bởi Tổng quan, Kiểm tra Companion).
- **Dữ liệu lưu:** version (int), changedBy, approvedBy, changeSummary,
  releaseNotes (mới thêm ở bản hardening), publishedAt, snapshot
  (persona + conversationStrategy + coachingStrategy tại thời điểm đó).
- **Field bắt buộc:** version.
- **Quan hệ:** Không FK thật, nhưng snapshot chứa BẢN SAO nội dung 3 bảng
  singleton tại thời điểm publish — đây là nơi DUY NHẤT dữ liệu bị "nhân
  bản" có chủ đích (đúng thiết kế version-log, không phải lỗi trùng lặp).
- **Lifecycle:** Cột `status` ở đây được TÁI SỬ DỤNG để lưu CHÍNH giai đoạn
  vòng đời (Draft/Review/Approved/Published/Archived) — mỗi dòng là 1 mốc
  lịch sử, không phải 1 "bản ghi có thể publish/unpublish".
- **Versioning:** Chính bảng này LÀ cơ chế versioning.
- **Retention:** Không giới hạn — lịch sử publish cần giữ vĩnh viễn cho
  audit.
- **RLS:** KHÔNG có (không public).
- **Consumer:** Chỉ Admin.
- **Lý do cần bảng riêng:** Là bảng append-mostly (lịch sử), hành vi hoàn
  toàn khác các bảng content — không thể gộp mà không phá vỡ ngữ nghĩa
  audit-log.

## 2. Rủi ro của schema generic (`id/data jsonb/status/order`)

Đây là pattern ĐÃ DÙNG cho 30+ bảng khác trong hệ thống (không phải phát
minh riêng cho Companion) — rủi ro dưới đây là rủi ro CÓ SẴN của toàn bộ
kiến trúc Admin, không riêng Companion:

1. **Không có type safety ở tầng DB.** Mọi field bên trong `data` chỉ được
   đảm bảo đúng kiểu bởi `FieldConfig[]` phía React — sai lệch giữa
   `FieldConfig` và dữ liệu thật (vd. đổi tên field trong code nhưng dữ
   liệu cũ vẫn còn field tên cũ) sẽ ÂM THẦM mất dữ liệu, không có lỗi nào
   báo ở build/runtime.
2. **Không có ràng buộc khoá ngoại thật.** `companion_knowledge_refs.
   sourceId` có thể trỏ tới 1 ID đã bị xoá ở bảng gốc — không có gì ngăn
   hay cảnh báo tự động (đã xử lý 1 phần ở bản hardening này bằng cách
   kiểm tra tồn tại phía client — xem `COMPANION_ADMIN_DESIGN_REPORT.md`
   mục cập nhật).
3. **Không có CHECK constraint trên `status`.** Đây là ưu điểm (linh hoạt,
   cho phép Companion dùng 5 trạng thái thay vì 3 trạng thái chuẩn mà không
   cần đổi schema) NHƯNG cũng là rủi ro (gõ sai chính tả 1 giá trị status
   sẽ không bị chặn ở DB, chỉ phụ thuộc code phía client).
4. **Không có index ngoài primary key.** Với quy mô dữ liệu hiện tại (vài
   chục dòng mỗi bảng) không phải vấn đề — sẽ cần xem lại nếu
   `companion_test_sessions`/`companion_versions` phình to theo thời gian.
5. **Versioning không đồng nhất giữa các bảng** (mục 1, các dòng "⚠️" ở
   trên) — đây là rủi ro LỚN NHẤT được phát hiện qua review này, không
   phải rủi ro chung của pattern generic mà là rủi ro riêng của cách
   Companion đang dùng pattern này (xem mục 3, câu hỏi "đảm bảo draft
   không ghi đè active version").

## 3. Trả lời trực tiếp các câu hỏi

**Vì sao cần 9 bảng mới?** Mỗi bảng map 1:1 với 1 shape dữ liệu + 1 tab
riêng biệt, đúng convention hiện có của toàn bộ Admin (33 collection trước
Companion cũng theo đúng logic "1 bảng = 1 shape", không có bảng "gộp
nhiều loại nội dung"). Cách này giữ 100% việc tái dùng
`useCollection`/`DataTable`/`VisualEditor`/API route sẵn có — không viết
backend mới.

**Bảng nào có thể gộp?**
- `companion_conversation_examples` + `companion_training_scenarios`: shape
  GẦN NHƯ giống hệt nhau (title/situation/expected-content), chỉ khác domain
  hiển thị. Có thể gộp thành 1 bảng `companion_scenarios` với field phân
  biệt `kind: "conversation" | "training"`.
- `companion_capabilities`: như phân tích ở mục 1.8 — ứng viên để KHÔNG cần
  là bảng DB (chuyển thành hằng số code).
- `companion_memory_policy` + `companion_safety_rules`: CÓ THỂ gộp thành 1
  bảng "quy tắc" chung với field `ruleType: "memory" | "safety"`, nhưng 2
  domain này có tập field khác nhau khá nhiều (memory có retention/forget
  condition, safety có category/condition/action) — gộp sẽ tạo nhiều field
  optional lẫn lộn, KHÔNG khuyến nghị gộp 2 bảng này.

**Dữ liệu nào thuộc Companion Version?** `companion_persona`,
`companion_conversation_strategy`, `companion_coaching_strategy` — 3 bảng
"bản sắc cốt lõi", đã snapshot vào `companion_versions`. **Chưa gồm**
`companion_knowledge_refs`, `companion_memory_policy`,
`companion_safety_rules` — đây là giới hạn phạm vi đã biết trước.

**Dữ liệu nào là reference?** `companion_knowledge_refs` — CHỈ bảng này.
Không bảng nào khác lưu tham chiếu chéo tới hệ thống khác.

**Dữ liệu nào thuộc test/evaluation?** `companion_test_sessions`.

**Dữ liệu nào thuộc runtime và KHÔNG được lưu như CMS?** Không bảng nào
trong 11 bảng lưu dữ liệu runtime thật — đã xác nhận rõ: trí nhớ thật của
người dùng (không tồn tại, không xây), hội thoại thật giữa người dùng và
Companion (không tồn tại, không xây). `companion_capabilities` là trường
hợp biên — về mặt Ý NGHĨA nó phản ánh runtime/engineering state chứ không
phải nội dung CMS, nhưng hiện lưu dưới dạng bảng CMS chỉ-đọc (xem mục 1.8).

**Cách rollback một phiên bản Companion?** Đọc `companion_versions` của
phiên bản muốn khôi phục → lấy `data.snapshot` (persona +
conversationStrategy + coachingStrategy) → `update()` đè lên 3 bảng
singleton hiện tại (đặt `status='Draft'`) → tự động thêm 1 dòng
`companion_versions` MỚI ghi lại chính hành động rollback (không sửa/xoá
lịch sử cũ — rollback là 1 sự kiện mới, không phải time-travel thật).

**Cách đảm bảo draft không làm thay đổi active version?**
**⚠️ ĐÂY LÀ LỖ HỔNG THẬT ĐÃ TÌM THẤY QUA REVIEW NÀY** — bản build trước
(commit `21ff67e`) CHƯA đảm bảo điều này: `companion_persona` chỉ có
DUY NHẤT 1 dòng (`id="current"`) cho cả "bản đang published" lẫn "bản đang
sửa" — sửa trực tiếp field nào cũng ghi đè ngay dòng đó bất kể `status`
đang là gì, kể cả khi đang `Published`. Đã SỬA ở bản hardening này (xem
`COMPANION_ADMIN_DESIGN_REPORT.md`, mục Lifecycle UX): khi
`status !== 'Draft'`, `SingletonEditor` chuyển sang chế độ chỉ-đọc, bắt
buộc bấm "Tạo bản nháp mới" (chuyển `status` về `Draft`, KHÔNG đổi nội
dung) trước khi chỉnh sửa được — đảm bảo nội dung đã Published không bao
giờ bị ghi đè âm thầm. Bản snapshot mới nhất có `status='Published'` trong
`companion_versions` luôn là "active version" thật, độc lập với việc bản
nháp sau đó bị sửa thế nào.

## 4. So sánh 2 phương án

### Phương án A — Giữ mô hình 11 bảng (ĐANG DÙNG)

| Tiêu chí | Đánh giá |
|---|---|
| Maintainability | Tốt — mỗi bảng 1 khái niệm, khớp convention 30+ bảng hiện có, dễ đọc/dễ tìm |
| Type safety | Yếu (như mọi bảng generic khác trong hệ thống) — không tệ hơn, không tốt hơn |
| Query | Đơn giản, mỗi bảng nhỏ, không cần filter theo loại |
| Validation | Không có ở DB, dựa hoàn toàn vào `FieldConfig` phía client (như hiện có) |
| Versioning | **Yếu — chỉ 3/11 bảng nằm trong snapshot phiên bản** |
| Rollback | Đầy đủ cho 3 bảng cốt lõi, KHÔNG bao gồm Tri thức/Trí nhớ/An toàn |
| RLS | Đơn giản, đồng nhất, đã áp dụng đúng |
| Future expansion | Thêm loại nội dung mới = thêm 1 bảng (quen thuộc, nhanh) nhưng số bảng tăng tuyến tính |

### Phương án B — Mô hình hợp nhất, version-first (ĐỀ XUẤT, CHƯA LÀM)

Gộp 7 bảng nội dung (persona/2 chiến lược/2 danh sách ví dụ/memory-policy/
safety-rules) thành 1 bảng `companion_content` (discriminant `contentType`),
giữ riêng `companion_knowledge_refs`/`companion_test_sessions`/
`companion_versions` (3 bảng có access pattern thật sự khác biệt) → còn
4 bảng.

| Tiêu chí | Đánh giá |
|---|---|
| Maintainability | Ít bảng hơn nhưng `companion_content` trở thành bảng hỗn hợp nhiều loại — cần filter `contentType` ở MỌI nơi đọc, dễ quên |
| Type safety | Yếu hơn Phương án A — trộn nhiều shape trong 1 bảng tăng rủi ro nhầm loại khi query |
| Query | Phức tạp hơn — mọi truy vấn cần thêm điều kiện `contentType`, generic API `/api/admin/collections/[table]` hiện KHÔNG hỗ trợ filter theo field tuỳ ý → **cần viết API mới**, vi phạm trực tiếp nguyên tắc "không viết Server Action mới" đã áp dụng xuyên suốt |
| Validation | Khó hơn — 1 handler chung phải biết validate nhiều shape khác nhau |
| Versioning | **Tốt hơn hẳn — mọi content type nằm trong 1 bảng, snapshot có thể bao phủ toàn bộ dễ dàng, đúng nghĩa "version-first"** |
| Rollback | Đầy đủ, atomic, 1 thao tác duy nhất |
| RLS | Phức tạp hơn — cần policy nhận biết `contentType` để tránh lộ nhầm loại nội dung khi mở public read sau này |
| Future expansion | Thêm loại nội dung mới = thêm 1 giá trị `contentType` (không cần bảng mới) nhưng ẩn/khó phát hiện hơn so với thêm hẳn 1 bảng rõ ràng |

### Khuyến nghị

**Giữ Phương án A** cho giai đoạn này — lý do chính: Phương án B đòi hỏi
viết API mới (phá vỡ ràng buộc kỹ thuật cốt lõi đã định hướng toàn bộ việc
xây Companion Admin: "không viết Server Action/API mới"), và migration
Phương án A ĐÃ VIẾT XONG, chỉ chờ duyệt — chuyển sang B nghĩa là làm lại từ
đầu. Lỗ hổng versioning (chỉ 3/11 bảng) là có thật nhưng đã được giảm nhẹ ở
bản hardening này (bảo vệ active version khỏi bị sửa trực tiếp — mục 3).
Đề xuất: **mở rộng phạm vi snapshot phiên bản để gồm thêm
`companion_knowledge_refs` và `companion_safety_rules`** ở một đợt sau
(không phải bây giờ, không cần đổi schema — chỉ cần sửa hàm `logVersion()`
phía client), thay vì tái cấu trúc toàn bộ sang Phương án B.
