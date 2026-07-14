# ADMIN BASELINE AUDIT — IMP-ADM-001R (EPIC-02, Giai đoạn 1: Kiểm tra bản Admin hiện tại)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge. Không code fix — đây là Sprint audit-only theo đúng chỉ thị "Không tự sửa. Chỉ báo cáo." (Task 4) và "Không đề xuất code" (Task 7).**

Thực hiện theo Founder Directive Admin Simplicity mới (`docs/admin/FOUNDER_DIRECTIVE_ADMIN_SIMPLICITY.md`, ghi nhận trước Sprint này) — dùng 5 nguyên tắc của Directive đó làm khung đánh giá chính cho Deliverable 2 và 4. Audit thực hiện bằng 3 agent nghiên cứu song song đối chiếu trực tiếp code (không dùng tài liệu/trí nhớ cũ làm nguồn), cộng với xác minh trực tiếp của tôi cho các phần Website/Brand Studio/Media Center (đã xây trong cùng phiên làm việc).

## Kết luận mở đầu (Executive Summary)

**Admin CMS hiện tại CHƯA bám 100% Portal hiện tại**, và **kiến trúc CHƯA đủ linh hoạt** để mở rộng mà không sửa code. Đây không phải là đánh giá tiêu cực về khối lượng công việc đã làm (nhiều Registry thật, CRUD thật đã hoạt động) — mà là phát hiện đúng bản chất Giai đoạn 1 yêu cầu: **có Registry ≠ Registry đó điều khiển Portal thật**. Phát hiện lớn nhất, xuyên suốt: phần lớn Registry ở cả Workspace mới (Website/Brand Studio/Media Center) lẫn Workspace cũ hơn (CKOS một phần, Portal Builder, Digital Assets, Community) đều có **Consumer = 0 hoặc Consumer sai route** — nghĩa là Founder sửa trong Admin nhưng Portal thật không đổi theo, hoặc Admin đang quản lý một route Portal đã bị bỏ.

---

# Deliverable 1 — Admin Baseline Audit Report (Task 1, 2)

## 1.1 Phạm vi đối chiếu

Nguồn tham chiếu DUY NHẤT dùng trong audit này: code thật của `src/app/portal/**`, các trang marketing công khai (`src/app/*`), `src/lib/portal/hubs.ts` (`portalNavSections` — cấu trúc sidebar Portal thật), `src/lib/site.ts` (`mainNav`, `siteConfig`). Không đối chiếu với Legacy Admin (đã xác nhận không còn dấu vết `admin.html` nào trong `voduongai` — file `.html` cũ ở gốc repo là site tĩnh legacy tách biệt, không thuộc phạm vi Admin CMS).

## 1.2 Information Architecture — Task 2

**Sidebar Admin (`src/lib/admin/nav.ts`, 17 nhóm, 111 route)** đối chiếu **Sidebar Portal (`hubs.ts`, đúng 10 mục: Trang chủ Học viện + 9 Portal Area)**:

| Kiểm tra | Kết quả |
|---|---|
| Đủ 10 Portal Area có mặt trong "Portal Navigation" group (`nav.ts:38-50`)? | ✅ Đủ 10, khớp tên |
| Mỗi route trong `nav.ts` có trang thật tương ứng (không route chết)? | ✅ 100% khớp — đối chiếu toàn bộ 97 thư mục route dưới `src/app/admin/(dashboard)/` với `nav.ts`, không có route mồ côi (Task 1.7 chi tiết ở Deliverable 2) |
| `AdminSidebar.tsx` `navIcons` map và `nav.ts` đồng bộ? | ✅ Đối chiếu 111 href — 0 lệch, nhưng cơ chế đồng bộ là **thủ công, không có ràng buộc kiểu (type)** — thêm 1 dòng vào `nav.ts` mà quên thêm icon sẽ không lỗi build, chỉ mất icon âm thầm (rủi ro cấu trúc, xem Deliverable 4) |
| Mỗi Workspace Admin thật sự SỞ HỮU đúng Portal Area nó tuyên bố? | ⚠️ **KHÔNG hoàn toàn** — xem Deliverable 3, nhiều Workspace quản lý route Portal đã lỗi thời (Digital Assets) hoặc route không tồn tại (Portal Builder → `portal_banners` không route nào render) |

**Kết luận Task 2:** Cấu trúc IA (tên nhóm, số lượng, tên route) bám đúng Portal về mặt **danh sách**, nhưng nhiều nhóm bám SAI về mặt **kết nối dữ liệu thật** — đây là khoảng cách giữa "có tên đúng" và "quản lý đúng nội dung", chi tiết ở Deliverable 3.

## 1.3 Legacy Admin dependency — Task 1

- Không tìm thấy tham chiếu `admin.html` hay CRUD kiểu cũ nào còn sống trong `voduongai/src/**`.
- CKOS canonicalization (ADM-SPR-004/CKOS_MANAGEMENT.md) xác nhận **sạch** — không còn `ResourceManager.tsx`, `CaseStudyForm.tsx`/`actions.ts` cũ, toàn bộ 9 route CKOS-scope đều dùng `KnowledgeCrudPage` chuẩn.
- **Nhưng**: Admin vẫn chạy **2 khung CRUD song song toàn hệ thống** — `CrudPage.tsx`/`ContentManager.tsx` (cũ hơn, ~30 trang non-CKOS: affiliate*, blog, community, digital-assets/*, portal-builder/*, roadmap, services, student-success, updates...) và `KnowledgeCrudPage.tsx` (chuẩn mới, chỉ CKOS-scope). Đây không phải "Legacy Admin" theo đúng nghĩa brief cũ (trước EPIC-02), nhưng là nợ kiến trúc thật — 2 pattern CRUD khác nhau cho cùng một loại nhu cầu (danh sách + form + trạng thái).
- **`titleKey`/`summaryKey`/`bodyKey`** — `FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md` tuyên bố "đã hết hiệu lực", nhưng alias này **vẫn là cơ chế lõi** của toàn bộ CKOS canonical framework hôm nay (`ckos/metadata.ts`, `KnowledgeCrudPage.tsx`, `RelationshipPicker.tsx`, và 7 route dùng trực tiếp). Đây là **mâu thuẫn trực tiếp giữa văn bản chỉ thị và code đã ship** — không Sprint nào xử lý từ khi Directive ban hành. Không tự sửa (Task 4 yêu cầu chỉ báo cáo) — xem Deliverable 5.

---

# Deliverable 2 — Greenfield Validation Report (Task 4)

Đánh giá theo đúng 5 Nguyên tắc của Founder Directive Admin Simplicity. Bảng dưới liệt kê MỌI phát hiện trùng lặp/chồng chéo/legacy, với khuyến nghị REMOVE / KEEP / NEEDS PMO DECISION — **không tự thực hiện REMOVE nào**, chỉ đánh dấu.

| # | Phát hiện | Bằng chứng | Khuyến nghị |
|---|---|---|---|
| 1 | **Portal Builder — CTA/Featured/Sections/Welcome/Today-actions/Start-here/User-goals** (`nav.ts:171-177`, nhóm "Content") | Grep 6 bảng Supabase (`portal_cta`, `portal_featured`, `portal_sections`, `portal_welcome`, `today_action_cards`, `start_here_steps`) trong `src/app/portal/**` + `src/components/portal/**`: **0 kết quả** — không route Portal nào đọc | **REMOVE** — CRUD thật nhưng ghi vào khoảng không, đúng định nghĩa Nguyên tắc 2 ("CRUD cũ... chỉ vì biết đâu sau này dùng") |
| 2 | **Portal Builder — Banner** (`portal_banners` → `NotificationTicker.tsx`) | Trước đó các báo cáo cũ ghi "đã nối dây thật" — **audit này xác minh lại trực tiếp và phát hiện `NotificationTicker.tsx` KHÔNG được import ở bất kỳ đâu trong `src/app/portal/**` hoặc `PortalShell.tsx`** — component tồn tại, đọc dữ liệu thật, nhưng chưa từng được mount lên trang nào. **Sửa lại phát hiện cũ: Banner cũng đang mồ côi, không phải trường hợp ngoại lệ đã kết nối như báo cáo BRAND/WEB trước đây khẳng định.** | **NEEDS PMO DECISION** (không REMOVE ngay vì gần với "sẵn sàng, chỉ thiếu 1 dòng import" hơn là "không phục vụ Portal" — nhưng hiện trạng thật là CHƯA hoạt động, phải sửa nhận định trong mọi báo cáo trước) |
| 3 | **`/admin/seo` (top-level, `nav.ts:182`)** vs **`/admin/website/seo`** | `/admin/seo` chỉ render `<ComingSoon>` rỗng; `/admin/website/seo` là `SEORegistry` thật (WEB-SPR-005), tự nhận biết trùng tên trong chính UI copy | **REMOVE** `/admin/seo` — bị thay thế hoàn toàn bởi bản thật |
| 4 | **System Settings (`/admin/settings`) vs Website Global Settings vs Brand Global Settings** | 3 nơi cùng khai báo field logo/favicon/tagline/SEO mặc định — chỉ System Settings có Consumer thật (Footer/SEO meta); 2 Registry còn lại Consumer = 0, tự nhận trùng lặp trong chính UI copy (`brand/settings/page.tsx`, `brand/assetRegistry.ts:159`) | **NEEDS PMO DECISION** — khuyến nghị kỹ thuật: hoặc (a) xoá field trùng khỏi 2 Registry mới, chỉ tham chiếu System Settings, hoặc (b) xây "Publish Bridge" để 2 Registry mới trở thành nguồn thật rồi khử field cũ khỏi System Settings — không được giữ 3 nơi không đồng bộ |
| 5 | **Portal Builder (Banner/CTA/Featured) vs Website Shared Sections (category Banner/CTA/Announcement)** | Cả 2 tự nhận không thay thế nhau (ghi rõ trong `WEBSITE_WORKSPACE_FOUNDATION.md`, WEB-SPR-004) — 2 hệ thống cùng khái niệm, cả 2 Consumer thật đều = 0 hoặc gần 0 | **NEEDS PMO DECISION** — trong lúc chờ, **REMOVE** phần CTA/Featured mồ côi (mục #1), giữ Shared Sections làm hướng đi tới nhưng chưa xác nhận chính thức |
| 6 | **Portal Management "Content Registry" (`/admin/portal/content`) vs Website "Portal Mapping" (`/admin/website/portal-mapping`)** | Cả 2 đều là view tổng hợp read-only "nội dung nào map vào Portal nào" — trùng mục đích, khác phạm vi (toàn Admin vs riêng Website) | **NEEDS PMO DECISION** — nên gộp, Content Registry (Portal Management) là ứng viên umbrella tự nhiên |
| 7 | **Website/Brand Studio/Media Center Registry — Consumer = 0 toàn bộ** | Xác nhận độc lập bởi cả agent legacy-audit và toàn bộ báo cáo Sprint các Workspace này (không route Portal nào đọc `website-pages`, `website-shared-sections`, `website-navigation-*`, Brand asset keys, Media asset keys) | **NEEDS PMO DECISION** (không phải REMOVE — đây là công việc mới/hướng tới tương lai, không phải legacy — nhưng đúng là chưa "phục vụ Portal hiện tại" theo nghĩa đen của Nguyên tắc 1; cần quyết định: đầu tư "Publish Bridge" tiếp theo, hay tạm dừng mở Workspace mới cho tới khi các Workspace đã có Consumer thật) |
| 8 | **`titleKey`/`summaryKey`/`bodyKey`** vẫn là cơ chế lõi CKOS dù Directive tuyên bố hết hiệu lực | `ckos/metadata.ts`, `KnowledgeCrudPage.tsx`, 7 route dùng trực tiếp | **NEEDS PMO DECISION** — xoá đòi hỏi migrate tên field vật lý phía Portal, không phải xoá đơn giản |
| 9 | **`case_study` (Admin ghi) vs `case_studies` (Portal đọc)** — 2 bảng Supabase khác nhau cho cùng khái niệm | `/admin/case-study` ghi bảng `case_study`; `/portal/case-studies`, `congdongai`, search API đều đọc `case_studies` — Case Study mới tạo trong Admin **không bao giờ lên Portal** | **NEEDS PMO DECISION nhưng ưu tiên cao** — đây là lỗi vận hành đang diễn ra (authoring bug), không chỉ kiến trúc |
| 10 | **`/admin/digital-assets/**` (Projects & Opportunities, 11 route) quản lý route Portal đã bị khai tử** | `/portal/duan-cohoi/[ecosystemSlug]/page.tsx` có comment rõ ràng "Rule #0: NOTHING here links to `/portal/digital-assets/**`" (chỉ thị Product Owner trước đó) — Admin CRUD (`digital-asset-projects`, `digital-asset-links`) chỉ được `/portal/digital-assets/**` (route KHÔNG có trong `portalNavSections`, không ai vào được từ menu thật) đọc, không phải `/portal/duan-cohoi` (route thật) | **NEEDS PMO DECISION** — vi phạm rõ nhất "Portal Coverage First": Admin đang tốn công quản lý 1 route đã bị bỏ, trong khi route thật hoàn toàn hardcode |
| 11 | **`/admin/community` (CrudPage riêng, seed `communityChannelsSeed`) vs Website Navigation External group vs System Settings social URLs** | 3 nơi cùng khái niệm "link mạng xã hội", **giá trị KHÁC NHAU thật** (VD Facebook: `communityChannelsSeed` dùng link Group riêng, Website Navigation dùng `siteConfig.links.facebook`) — `/portal/congdongai` không đọc `communityChannelsSeed` (0 kết quả grep) | **NEEDS PMO DECISION** — phát hiện MỚI của Sprint này (Website Navigation External group là chính tôi vừa xây ở WEB-SPR-202 — tự ghi nhận đây cũng là một phần của sự chồng chéo, không né tránh) |
| 12 | **2 khung CRUD song song** (`CrudPage` vs `KnowledgeCrudPage`) toàn hệ thống | Xem Mục 1.3 | **NEEDS PMO DECISION** (ưu tiên thấp, không khẩn) |
| 13 | **CKOS Goals/Workflows/Best Practices/FAQs/Evaluations** — CRUD thật nhưng **0 trang Portal nào hiển thị** (không phải hardcode thay thế — không có bề mặt hiển thị nào cả) | `/portal/ckos/page.tsx` tự ghi `hasRoute:false` cho Best Practice | **NEEDS PMO DECISION** — khác các mục khác: đây không phải trùng lặp mà là CRUD "đi trước" chưa có nơi hiển thị |
| 14 | **`/admin/daily-missions`, `/admin/community`** — CRUD thật, Supabase thật, **0 nơi hiển thị bất kỳ dạng nào** (không hardcode fallback, không gì cả) | Grep toàn bộ `src/app/portal`, `src/components/portal` cho tên collection — 0 kết quả | **NEEDS PMO DECISION** |

**Không phát hiện thêm route mồ côi nào khác** (100% route trong `nav.ts` có trang thật tương ứng, xem Mục 1.2).

---

# Deliverable 3 — Portal Coverage Validation (Task 3, Task 6)

Bảng dưới đối chiếu **10 Portal Area thật** + Website/Brand Studio/Media Center với khả năng quản trị thật của Admin (không phải "có Registry" mà là "Registry đó có Consumer Portal thật hay không").

| Portal Area | Nội dung thật hiện tại | Verdict quản trị | Nếu Founder vẫn phải sửa code — sửa gì |
|---|---|---|---|
| **Trang chủ Học viện** (`/portal`) | 100% hardcode `src/app/portal/page.tsx` (7 `PillarEntranceCard`) | **KHÔNG quản trị được** — "Portal Builder" (nhóm Content) mồ côi gần hết (xem Deliverable 2 #1-2) | Sửa trực tiếp `src/app/portal/page.tsx` |
| **CKOS (Hệ tri thức AI)** | Hub hardcode + Lesson library từ `knowledge-seed-data.ts` (1684 dòng) | **MỘT PHẦN** — Tools/Prompts/Checklists/Templates quản trị được thật; Resources/SOP/Case Study mồ côi; Goals/Workflows/Best Practices/FAQs/Evaluations không có nơi hiển thị; Lesson (nội dung lõi) 100% code | Sửa `knowledge-seed-data.ts` cho Lesson, `src/data/sop.ts`/`resources.ts` cho SOP/Resources |
| **Học viện AI (Academy)** | Hub là phép chiếu từ CKOS Collections; Roadmap quản trị được | **MỘT PHẦN** — Roadmap OK; Daily Missions mồ côi; Journey content = code (kế thừa từ CKOS) | Sửa `knowledge-collections.ts` |
| **AI Workspace** | 100% hardcode `src/data/khong-gian-ai.ts` | **KHÔNG quản trị được** — chỉ có Landing Foundation (`comingSoon:true`), tự nhận "chưa có Registry/CRUD nào" | Sửa `khong-gian-ai.ts` |
| **Premium** | Hub hardcode (copy 5 chương trình) + giá/trạng thái từ Supabase | **MỘT PHẦN** — Giá/coupon/dịch vụ/affiliate quản trị được thật; copy chương trình = code; catalog "Sản phẩm số" có CRUD nhưng KHÔNG có trang duyệt/mua công khai nào (sản phẩm mới tạo không ai tìm thấy được) | Sửa `premium-programs.ts` cho copy |
| **Dự án & Cơ hội** | `/portal/duan-cohoi` (route thật) 100% hardcode `ecosystems.ts`; `/admin/digital-assets` quản lý `/portal/digital-assets` (route đã bị khai tử theo chỉ thị Product Owner cũ) | **KHÔNG quản trị được cho route thật** — đây là vi phạm Portal Coverage First rõ nhất tìm thấy trong audit | Sửa `src/data/portal/ecosystems.ts` |
| **Companion** | 100% hardcode/tính toán client (`companion-inner-life.ts`, `growth-view.ts`) | **KHÔNG quản trị được** — chỉ Landing Foundation, tự nhận có "3 hệ thống bộ nhớ song song chưa hợp nhất" | Sửa `companion-inner-life.ts`, `thought-seeds.ts` |
| **Cộng đồng AI** | `siteConfig` (social links) + hardcode `founder.ts` | **KHÔNG quản trị được** — `/admin/community` có CRUD thật nhưng mồ côi (0 nơi đọc) | Sửa `site.ts`, `founder.ts` |
| **Hành trình của tôi / Journey Hub** (+ Story/Mirror/Nhật ký/Khu vườn) | Hardcode + `growth-view.ts` (event-log tính toán) | **KHÔNG quản trị được** — chỉ Landing Foundation | Sửa trực tiếp từng route con |
| **Website (marketing site công khai)** | Trang chủ + trang tĩnh + navigation + shared sections | **Registry hoạt động thật, nhưng Consumer = 0** — Founder SỬA ĐƯỢC trong Admin, nhưng Portal thật KHÔNG đổi theo (chưa nối dây) | Vẫn phải sửa code thật (`src/components/home/*.tsx`, `Footer.tsx`) cho tới khi có Publish Bridge |
| **Brand Studio** | Logo/Wordmark/Typography/Color/Theme/Icon/OG/Global Settings | **Registry hoạt động thật, Consumer = 0** — như trên | Vẫn phải sửa `globals.css`/component logo cho tới khi có Publish Bridge |
| **Media Center** | Image/Video/Document/Audio metadata | **Registry hoạt động thật, Consumer = 0** — như trên | Asset thật vẫn phải thêm/sửa trực tiếp trong `public/`/`src/assets/` |
| **Founder Workspace / Portal Management** | Lớp oversight (đọc, không ghi) | **Đúng như tự nhận** — không tuyên bố CRUD nào nó không có, hoạt động đúng thiết kế (audit layer) | N/A — không phải Workspace nội dung |

## Kết luận Task 6 (Portal Coverage Validation)

**Không đạt "100% nội dung Portal có khả năng được quản lý trong Admin".** Cụ thể:
- **3/10 Portal Area hoàn toàn không quản trị được** (AI Workspace, Companion, Journey Hub) — chỉ có Landing Foundation, tự nhận trung thực.
- **1/10 Portal Area Admin quản lý nhầm route** (Dự án & Cơ hội — CRUD trỏ vào route đã khai tử).
- **1/10 Portal Area CRUD tồn tại nhưng mồ côi hoàn toàn** (Cộng đồng AI).
- **3/10 Portal Area quản trị một phần** (CKOS, Academy, Premium) — nhiều module con vẫn code-only hoặc CRUD mồ côi.
- **1/10 (Trang chủ Học viện)** gần như hoàn toàn không quản trị được.
- **Website/Brand Studio/Media Center** (3 Workspace mới, không phải Portal Area nhưng nằm trong Roadmap) có Registry hoạt động thật đầy đủ nhất trong toàn bộ Admin, nhưng **chưa Workspace nào có Consumer Portal thật** — khoảng cách giữa "quản trị được trong Admin" và "thay đổi thật trên Portal" tồn tại xuyên suốt toàn bộ Admin CMS, không riêng gì các Workspace cũ.

---

# Deliverable 4 — Future Flexibility Assessment (Task 5, Task 7)

Đánh giá theo Nguyên tắc 4 (Founder Directive Admin Simplicity): "chỉ cần thêm dữ liệu hoặc cấu hình — không phải sửa cấu trúc code." Không đề xuất code — chỉ phân tích nguyên nhân.

| Kịch bản mở rộng | Kết quả | File/dòng | Nguyên nhân gốc |
|---|---|---|---|
| Thêm 1 **Menu item** vào vị trí đã có (VD thêm 1 link Footer) | ✅ **CHỈ CẦN DỮ LIỆU** | `NavigationRegistry.tsx` → `useCollection().add()` | CRUD thật, form thật |
| Thêm 1 **Workspace mới hoàn toàn** | ❌ **CẦN SỬA CODE** | `nav.ts` (thêm group) + `AdminSidebar.tsx` (`navIcons` map) + route mới dưới `src/app/admin/(dashboard)/` | 3 nơi phải sửa thủ công, không có schema chung ràng buộc — hợp lý ở mức "Workspace mới = tính năng mới", nhưng rủi ro đồng bộ giữa `nav.ts` và `navIcons` không được compiler bắt lỗi (thiếu icon → im lặng mất icon, không lỗi build) |
| Thêm 1 **Portal Area mới** | ❌ **CẦN SỬA CODE, kể cả phía Admin** | `src/lib/admin/portal/areas.ts` (`PORTAL_AREAS`) — mảng phẳng, KHÔNG có `useCollection`, không CRUD UI nào ghi vào đây | Ngay cả phần "mô tả Portal Area" phía Admin cũng là code cứng, chưa nói tới việc route Next.js thật luôn cần code (hợp lý), nhưng phần Admin lẽ ra có thể là Registry |
| Thêm 1 **Landing Page mới** | ⚠️ **CHỈ ĐĂNG KÝ METADATA ĐƯỢC, không tạo trang thật** | `pageRegistry.ts` (`PAGE_TYPES` đã có "Landing Page") — tạo record qua UI là dữ liệu thuần, nhưng **không có gì đọc record đó để render trang** | Page Registry tự nhận trong doc comment: "tracks page metadata only... does not store or edit page content" — trang landing thật vẫn cần file `.tsx` mới dưới `src/app/` |
| Thêm 1 **Section CATEGORY mới** (VD "Testimonial Carousel" — loại chưa từng có) | ❌ **CẦN SỬA CODE** | `sharedSectionRegistry.ts:24-34` `SECTION_CATEGORIES = [...] as const` | Union kiểu TypeScript đóng — `<select>` trong form sinh trực tiếp từ mảng này, không nhập được giá trị mới từ UI |
| Thêm 1 **CTA/Banner mới** (instance của category có sẵn) | ✅ **CHỈ CẦN DỮ LIỆU** | Cùng file trên — "CTA"/"Banner" đã có sẵn trong `SECTION_CATEGORIES` | Đây là instance mới, không phải category mới — phân biệt quan trọng với dòng trên |
| Thêm 1 **Category/Topic mới** ở Workspace khác (Brand Role, Media Category, CKOS Status...) | ❌ **CẦN SỬA CODE** (hầu hết) | 17 union `as const` khác nhau tìm thấy xuyên `src/lib/admin/**` (`ASSET_CATEGORIES`, `COLOR_ROLES`, `TYPOGRAPHY_ROLES`, `MEDIA_CATEGORIES`, `PAGE_TYPES`, `NAVIGATION_LOCATIONS`, `SECTION_CATEGORIES`, `KNOWLEDGE_STATUSES`, v.v.) | Cùng một nguyên nhân gốc lặp lại 17 lần: phân loại đóng bằng TypeScript union, không phải bảng dữ liệu Founder tự quản. Ngoại lệ: `KnowledgeItem.category` (CKOS) là `string` tự do — đã là dữ liệu thuần |
| Thêm 1 **Workspace Mapping** (bảng sở hữu Workspace ↔ Portal Area) | ❌ **CẦN SỬA CODE** | `workspaceOwnership.ts` — mảng phẳng, `WorkspaceOwnerPanel.tsx` chỉ đọc (`.map()`), không `add`/`update` nào | Không có CRUD UI nào cho bảng này — sửa/thêm 1 dòng sở hữu Workspace bắt buộc sửa trực tiếp file `.ts` |

## Kết luận Task 7 (Future Flexibility Review)

**CHƯA đạt.** Nguyên nhân gốc lặp lại xuyên suốt toàn bộ Admin CMS, không phải lỗi riêng của 1 Workspace:

1. **Phân loại (category/type/role) luôn là TypeScript union đóng**, không phải bảng CRUD — mọi Registry mới xây trong EPIC-02 (Website/Brand/Media) đều lặp lại đúng pattern này 17 lần khác nhau. Đây là quyết định thiết kế nhất quán (dễ kiểm soát, tránh dữ liệu rác) nhưng trực tiếp mâu thuẫn với Nguyên tắc 4 — mỗi lần Founder muốn một PHÂN LOẠI mới (không phải một MỤC mới trong phân loại có sẵn), phải quay lại Claude Code để sửa code.
2. **`workspaceOwnership.ts` không có CRUD UI nào** — đây là gap rõ ràng nhất, không có nuance: bảng sở hữu Workspace ↔ Portal Area 100% chỉ sửa được bằng code.
3. **Đăng ký Landing Page mới chỉ là ghi metadata, không tạo trang thật** — khoảng cách giữa "Admin nói có Landing Page X" và "Landing Page X tồn tại trên Portal" vẫn luôn cần 1 file code mới. Đây có thể là giới hạn hợp lý (Admin CMS không phải Visual Builder, đã được `Không triển khai` xác nhận ở nhiều brief) — nhưng cần Founder xác nhận đây là giới hạn CHẤP NHẬN ĐƯỢC, không phải thiếu sót.
4. **`nav.ts` và `AdminSidebar.tsx` đồng bộ bằng kỷ luật thủ công**, không có ràng buộc kiểu — rủi ro thấp (chưa từng lệch trong 111 route hiện tại) nhưng là điểm yếu cấu trúc thật.

---

# Deliverable 5 — Danh sách điểm cần hoàn thiện trước Phase 2 (Punch List)

Ưu tiên theo tác động thật tới Founder (P0 = lỗi vận hành đang diễn ra hoặc chặn Coverage; P1 = trùng lặp/mồ côi cần dọn; P2 = nợ kiến trúc dài hạn).

### P0 — Lỗi vận hành / chặn Portal Coverage
1. **`case_study` vs `case_studies`** — Case Study tạo mới trong Admin không bao giờ lên Portal. Cần PMO quyết định bảng nào là chính thức.
2. **Digital Assets CRUD (11 route) quản lý route Portal đã khai tử** (`/portal/digital-assets` thay vì `/portal/duan-cohoi`) — công sức Admin không tới được Founder.
3. **`portal_banners`/`NotificationTicker` thực ra KHÔNG hoạt động** (phát hiện mới, đính chính báo cáo cũ) — cần cập nhật lại mọi tài liệu trước đó từng khẳng định "đã nối dây thật".
4. **3 Portal Area hoàn toàn không quản trị được**: AI Workspace, Companion, Journey Hub — chỉ có Landing Foundation.

### P1 — Trùng lặp/mồ côi cần PMO quyết định loại bỏ hay hợp nhất
5. `/admin/seo` top-level (ComingSoon rỗng) — khuyến nghị REMOVE, đã có bản thật ở Website Workspace.
6. Portal Builder CTA/Featured/Sections/Welcome/Today-actions/Start-here/User-goals — khuyến nghị REMOVE, mồ côi hoàn toàn.
7. System Settings vs Website/Brand Global Settings — 3 nơi chồng field, chỉ 1 nơi có Consumer thật.
8. `/admin/community` vs Website Navigation External vs System Settings social URLs — 3 nguồn dữ liệu khác nhau cho cùng khái niệm.
9. Portal Management "Content Registry" vs Website "Portal Mapping" — 2 view tổng hợp trùng mục đích.
10. CKOS Goals/Workflows/Best Practices/FAQs/Evaluations, Daily Missions — CRUD thật, 0 nơi hiển thị.

### P2 — Nợ kiến trúc dài hạn (không khẩn, cần lộ trình)
11. `titleKey`/`summaryKey`/`bodyKey` — mâu thuẫn với Founder Directive Greenfield, cần migrate tên field vật lý phía Portal mới xoá được.
12. 2 khung CRUD song song (`CrudPage` vs `KnowledgeCrudPage`) toàn hệ thống.
13. 17 union `as const` đóng — không có cơ chế chung để Founder thêm phân loại mới qua UI.
14. `workspaceOwnership.ts` không có CRUD UI.
15. Website/Brand Studio/Media Center — Consumer = 0 toàn bộ, cần Sprint "Publish Bridge" trước khi tuyên bố các Workspace này "hoàn thành".

---

# Tự kiểm tra Acceptance (trung thực, theo đúng tinh thần FOUNDER-001 Nguyên tắc 6)

| Tiêu chí | Kết quả |
|---|---|
| ✓ Admin được xác nhận bám 100% Portal hiện tại | ❌ **CHƯA đạt** — xem Deliverable 3, nhiều Portal Area không quản trị được hoặc quản lý nhầm route |
| ✓ Không còn phụ thuộc Legacy Admin | ⚠️ **Đạt phần lớn** — không còn `admin.html`/CRUD kiểu cũ trước EPIC-02; nhưng vẫn còn nợ kiến trúc nội bộ (2 khung CRUD, alias field) không phải "Legacy Admin" theo nghĩa hẹp nhưng cùng bản chất "giữ lại vì tiện" |
| ✓ Xác định đầy đủ các điểm còn phải hoàn thiện | ✅ Đạt — Deliverable 5, 15 mục, phân loại P0/P1/P2 |
| ✓ Kiến trúc đủ linh hoạt để Founder mở rộng Portal tương lai mà không cần sửa code | ❌ **CHƯA đạt** — xem Deliverable 4, nguyên nhân gốc lặp lại xuyên suốt (union đóng, `workspaceOwnership.ts` không CRUD, Landing Page chỉ đăng ký metadata) |

**Kết luận chung: Sprint Giai đoạn 1 hoàn thành đúng mục tiêu của nó (audit đầy đủ, trung thực, không tự sửa) — nhưng bản thân Admin CMS CHƯA sẵn sàng cho Phase 2 theo đúng nghĩa "đã bám 100% Portal và đủ linh hoạt". Đây là kết quả audit, không phải thất bại của Sprint này.**

---

# Cần PMO/Founder quyết định (tổng hợp toàn bộ audit)

Xem chi tiết từng mục ở Deliverable 2 (#4-14) và Deliverable 5 (P0/P1). Danh sách rút gọn theo thứ tự ưu tiên:

1. `case_study` vs `case_studies` — chọn 1 bảng chính thức (ưu tiên cao nhất, đang là lỗi vận hành thật).
2. Digital Assets CRUD — nối vào `/portal/duan-cohoi` thật hay xoá phần chỉ phục vụ route đã khai tử `/portal/digital-assets`.
3. Portal Builder (Banner/CTA/Featured/...) — xoá phần mồ côi, quyết định Banner có đáng nối `NotificationTicker` vào layout hay không.
4. System Settings vs Website/Brand Global Settings — hợp nhất hay xây Publish Bridge.
5. `/admin/community` vs Website Navigation External vs System Settings — chọn 1 nguồn social link chính thức.
6. Có nên đầu tư Sprint "Website/Brand/Media Publish Bridge" trước khi mở thêm Workspace mới (AI Workspace/Companion/Journey) hay không — vì tất cả đều đang ở tình trạng Consumer = 0/thấp giống nhau.
7. `titleKey`/`summaryKey`/`bodyKey` — chấp nhận là compatibility shim có chủ đích, hay lên lịch migrate.
8. Landing Page Registry chỉ đăng ký metadata (không tạo trang thật) — xác nhận đây là giới hạn chấp nhận được của Admin CMS v1.0 (không phải Visual Builder).
