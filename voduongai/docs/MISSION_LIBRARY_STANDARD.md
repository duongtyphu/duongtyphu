# Mission Library Standard

Tài liệu gốc (source of truth) để thiết kế và sinh ra Mission cho toàn bộ
VO DUONG AI. Đây là tài liệu thiết kế — không có code, không UI, không
route, không dữ liệu demo. Mọi Mission tương lai (1, 100, hay 1000+) phải
tuân theo đúng schema/lifecycle/relationship mô tả ở đây mà không cần thay
đổi kiến trúc.

**Product Principle**: VO DUONG AI không tổ chức nội dung theo bài học. VO
DUONG AI tổ chức toàn bộ hệ thống theo Mission. Mission là đơn vị nhỏ nhất
tạo ra giá trị thực cho người học.

---

## 1. Mission Philosophy

Mission KHÔNG phải bài học. Mission là **"một công việc thật mà người dùng
muốn hoàn thành."**

| Sai (thiết kế theo AI Tool) | Đúng (thiết kế theo công việc thật) |
|---|---|
| "Học ChatGPT" | "Viết báo cáo bằng AI" |
| "Học Claude" | "Viết Proposal bằng AI" |
| "Học Gemini" | "Phân tích khách hàng bằng AI" |

Nguyên tắc thiết kế:

1. **Mission bắt đầu từ nhu cầu công việc, không bắt đầu từ công cụ AI.**
   Công cụ (ChatGPT/Claude/Canva/Gamma...) là phương tiện Companion chọn để
   hoàn thành Mission — không bao giờ là chủ đề của Mission.
2. **Mọi Mission phải kết thúc bằng một Output thật** (xem mục 8) — không
   có Mission chỉ để "hiểu biết thêm."
3. **Mission là đơn vị nhỏ nhất** trong hệ thống — Learning Journey/Course
   là tập hợp nhiều Mission có thứ tự gợi ý, không phải ngược lại.
4. **Mission không chấm điểm** — đo bằng Impact thật (mục 9), không phải
   điểm số/quiz.

---

## 2. Mission Taxonomy

Cây phân loại Mission theo **lĩnh vực công việc** (Category), không theo
công cụ AI. Danh sách dưới đây là điểm khởi đầu — không giới hạn số lượng,
thiết kế để mở rộng nhiều năm bằng cách thêm Category/Subcategory mới, không
sửa schema.

```
Mission Category (cấp 1)
 └── Mission Subcategory (cấp 2, tùy chọn)
      └── Mission (cấp 3 — đơn vị thực thi)
```

Danh sách Category khởi điểm:

| Category | Ví dụ Subcategory | Ví dụ Mission |
|---|---|---|
| AI Office | Email, Báo cáo, Trình bày, Bảng tính | Viết Email chuyên nghiệp, Làm Slide thuyết trình |
| AI Writing | Nội dung, Copywriting, Biên tập | Viết bài Blog SEO, Viết Proposal |
| AI Marketing | Content Marketing, Ads, SEO, Social | Xây kế hoạch Marketing, Viết caption bán hàng |
| AI Sales | Kịch bản bán hàng, CRM, Đàm phán | Phân tích khách hàng, Viết kịch bản chốt sale |
| AI Design | Banner, Social Post, Brand Kit | Thiết kế Banner, Tạo Brand Kit cơ bản |
| AI Video | Video ngắn, Kịch bản, Edit | Làm Video ngắn, Viết kịch bản Voiceover |
| AI Research | Nghiên cứu thị trường, Tổng hợp | Nghiên cứu đối thủ, Tóm tắt tài liệu dài |
| AI Data | Phân tích dữ liệu, Dashboard | Làm Dashboard cơ bản, Phân tích dữ liệu bán hàng |
| AI Coding | Tự động hoá script, Debug | Viết script tự động hoá, Sửa lỗi code với AI |
| AI Automation | Workflow, Tích hợp công cụ | Xây Automation email, Xây Workflow đăng bài |
| AI Business | Kế hoạch kinh doanh, Chiến lược | Xây Business Plan, Phân tích SWOT bằng AI |
| AI Affiliate | Chọn ngách, Chọn sản phẩm | Xây hệ thống Affiliate, Viết review sản phẩm |
| AI Learning | Tự học, Ghi chú, Ôn tập | Tóm tắt khoá học, Xây lộ trình tự học |
| AI Personal Productivity | Quản lý thời gian, Ghi chú cá nhân | Lập kế hoạch tuần, Xây hệ thống ghi chú |

**Quy tắc mở rộng Taxonomy**: thêm Category/Subcategory mới bất kỳ lúc nào,
miễn Category mới mô tả một **lĩnh vực công việc thật**, không phải một
công cụ AI hay một tính năng sản phẩm.

---

## 3. Mission Schema

Cấu trúc dữ liệu logic của một Mission (không phải code — đây là mô hình
khái niệm để sau này ánh xạ vào bất kỳ hệ thống lưu trữ nào, kể cả CKOS
Knowledge Asset hiện có).

```
Mission {
  missionId
  missionName
  missionCategory        // Mission Taxonomy — mục 2
  missionSubcategory?     // tùy chọn
  competency[]            // AI Competency mà Mission rèn luyện — mục 8
  difficulty              // Beginner | Intermediate | Advanced
  estimatedTime           // vd "20-30 phút"
  prerequisite[]          // Mission ID hoặc Capability tối thiểu — mục 6
  requiredAiSkills[]      // vd "Prompt cơ bản", "Context Engineering"
  learningObjectives[]    // "Sau Mission này, người dùng có thể ___"
  expectedOutput          // Output Standard — mục 7
  workspaceType           // loại Workspace Mission mở ra (vd document/design/data/video)
  relatedPromptPacks[]
  relatedTemplates[]
  relatedChecklists[]
  relatedKnowledgeAssets[] // liên kết CKOS Knowledge Asset (Guide/Framework/Case Study...)
  relatedLearningJourney[] // Journey mà Mission này thuộc về (có thể nhiều/không)
  unlockCondition          // điều kiện mở khoá Mission này — mục 6
  capabilityMapping        // mục 8
  reflectionQuestions[]    // câu hỏi phản ánh sau khi hoàn thành
  aiImpactMetrics[]        // mục 9
  growthEventType          // loại Growth Event Mission này phát ra
}
```

### 4. Mission Metadata — mô tả từng field

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `missionId` | string (slug) | ✔ | Định danh duy nhất, ổn định vĩnh viễn — không đổi khi nội dung sửa |
| `missionName` | string | ✔ | Tên công việc thật, không chứa tên AI Tool (mục 1) |
| `missionCategory` | enum (Taxonomy) | ✔ | Một trong các Category ở mục 2 |
| `missionSubcategory` | string | — | Tùy chọn, làm rõ thêm trong Category |
| `competency[]` | string[] | ✔ | Danh sách năng lực AI mà Mission rèn — dùng cho Capability Mapping |
| `difficulty` | enum | ✔ | Beginner / Intermediate / Advanced |
| `estimatedTime` | string | ✔ | Thời gian ước tính hoàn thành thực hành |
| `prerequisite[]` | Mission ID hoặc Capability threshold | — | Có thể rỗng — không bắt buộc thứ tự cứng (mục 6) |
| `requiredAiSkills[]` | string[] | — | Kỹ năng AI cần có trước, không phải Mission cụ thể |
| `learningObjectives[]` | string[] | ✔ | Mục tiêu học, viết dạng hành động ("có thể viết...", "có thể phân tích...") |
| `expectedOutput` | Output object (mục 7) | ✔ | Bắt buộc — Mission không có Output không hợp lệ |
| `workspaceType` | enum | ✔ | document / spreadsheet / presentation / design / video / data / automation / research |
| `relatedPromptPacks[]` | ID[] | — | Có thể rỗng nếu chưa có Prompt Pack tương ứng |
| `relatedTemplates[]` | ID[] | — | — |
| `relatedChecklists[]` | ID[] | — | — |
| `relatedKnowledgeAssets[]` | ID[] | — | Liên kết CKOS Knowledge Asset đã có (Guide/Framework/Case Study/SOP) |
| `relatedLearningJourney[]` | ID[] | — | Mission có thể thuộc 0, 1, hoặc nhiều Journey |
| `unlockCondition` | Condition object (mục 6) | ✔ | Có thể là "luôn mở" (không điều kiện) |
| `capabilityMapping` | Capability object (mục 8) | ✔ | — |
| `reflectionQuestions[]` | string[] | ✔ | Tối thiểu 1 câu — không chấm điểm, chỉ phản ánh |
| `aiImpactMetrics[]` | Metric[] (mục 9) | ✔ | Ít nhất 1 metric đo được, không phải điểm Quiz |
| `growthEventType` | enum | ✔ | Loại Growth Event Mission phát ra khi hoàn thành (mở rộng từ `WORKSPACE_STARTED` hiện có, thêm `MISSION_COMPLETED`, `OUTPUT_CREATED`...) |

---

## 5. Mission Lifecycle

Vòng đời chuẩn của một Mission, từ lúc người dùng khám phá tới khi mở khoá
Mission tiếp theo:

```
Discover
   ↓  (người dùng thấy Mission — trong Học viện AI, AI Workspace, hoặc gợi ý Companion)
Learn
   ↓  (đọc Knowledge Asset liên quan — Guide/Framework/Case Study nếu cần)
Practice
   ↓  (thử với Prompt Pack/Template/Checklist liên quan)
Companion
   ↓  (giao việc cho Companion — Companion điều phối AI Agent phù hợp)
Workspace
   ↓  (Companion + người dùng cùng tạo, chỉnh sửa trong Workspace)
Output
   ↓  (sinh ra Output thật — mục 7 — được lưu, không phải xem xong là xong)
Review
   ↓  (người dùng tự xem lại Output, có thể chỉnh sửa → Version tiếp theo)
Reflection
   ↓  (trả lời Reflection Questions — không chấm điểm)
Capability Update
   ↓  (competency[] liên quan được ghi nhận đã thực hành — không phải "điểm", mà là "đã áp dụng")
Unlock Next Mission
   (Mission khác có unlockCondition thoả mãn được mở ra)
```

Ghi chú lifecycle:
- Một Mission có thể được thực hiện lại (Version 2, Version 3) — mỗi lần
  lặp lại là một "run" mới của lifecycle, không phải Mission mới.
- "Learn"/"Practice" có thể bị bỏ qua nếu người dùng đã có năng lực (do
  `prerequisite`/`requiredAiSkills` đã thỏa) — lifecycle không ép tuyến
  tính cứng, chỉ mô tả đường đi đầy đủ nhất.
- "Companion" không phải bước chọn Agent thủ công — Companion tự điều phối
  Agent phù hợp dựa trên `workspaceType`/`competency`.

---

## 6. Mission Relationship

Một Mission liên kết N–N tới các thực thể sau (không phải quan hệ 1–1):

```
Mission ──< relatedKnowledgeAssets  >── Knowledge Asset (Guide/Framework/Case Study/SOP...)
Mission ──< relatedPromptPacks      >── Prompt
Mission ──< relatedTemplates        >── Template
Mission ──< relatedChecklists       >── Checklist
Mission ──< suggestedAiTools        >── AI Tool (không bắt buộc, Companion tự chọn)
Mission ──< occursIn                >── Workspace (nhiều lần thực hiện = nhiều Workspace session)
Mission ──< belongsTo               >── Learning Journey (0, 1, hoặc nhiều)
```

Nguyên tắc thiết kế relationship:

1. **Không quan hệ bắt buộc 1–1** — một Mission có thể không cần Prompt
   Pack/Template nào (Mission thuần tư duy/phân tích), hoặc cần nhiều loại
   cùng lúc (Mission phức tạp như "Xây kế hoạch Marketing" cần cả
   Framework + Template + Checklist).
2. **Một Knowledge Asset/Prompt/Template có thể phục vụ nhiều Mission** —
   quan hệ N–N hai chiều, tận dụng lại nội dung đã có (khớp nguyên tắc
   "không tạo 1000 Prompt, hãy tạo 100 Prompt dùng được" — vì mỗi Prompt
   dùng lại được cho nhiều Mission).
3. **Journey là tập hợp Mission, không phải ngược lại** — một Learning
   Journey tham chiếu tới danh sách Mission theo thứ tự gợi ý, nhưng
   Mission vẫn tồn tại độc lập, có thể đứng một mình hoặc thuộc nhiều
   Journey khác nhau.

---

## 7. Mission Dependency

Dependency mô tả **điều kiện nên hoàn thành trước**, không phải thứ tự bắt
buộc cứng.

```
unlockCondition = 
  | "none"                                   // luôn mở, không điều kiện
  | { requiresMission: [missionId, ...] }     // đã hoàn thành Mission khác
  | { requiresCapability: { competency, minLevel } }  // đạt ngưỡng năng lực
  | { requiresAny: [condition, ...] }          // thoả 1 trong nhiều điều kiện
  | { requiresAll: [condition, ...] }          // thoả tất cả điều kiện
```

Ví dụ:

```
Mission "Dashboard nâng cao":
  unlockCondition = requiresAny([
    requiresMission(["dashboard-co-ban"]),
    requiresCapability({ competency: "AI Data", minLevel: "Intermediate" })
  ])
```

Nguyên tắc:
- Dependency là **linh hoạt, không tuyến tính** — người có năng lực đủ có
  thể bỏ qua Mission tiền đề mà không cần "hoàn thành" nó theo nghĩa hệ
  thống ghi nhận.
- Dependency không bao giờ khoá cứng theo thứ tự Category/Journey — một
  Mission ở Category "AI Data" có thể yêu cầu năng lực từ Category
  "AI Office" nếu hợp lý (vd Dashboard cần kỹ năng Excel cơ bản).
- Không có Mission "mồ côi" — mọi Mission phải có `unlockCondition` tường
  minh, kể cả khi giá trị là `"none"`.

---

## 8. Mission Output Standard

**Không có Mission nào không có Output.** Output là bằng chứng công việc
thật đã hoàn thành, ở định dạng dùng được ngay (theo Learning OS Principle —
không placeholder, không file giả).

```
ExpectedOutput {
  outputType     // Document | Spreadsheet | Presentation | PDF | Markdown
                 // | Video | Image | LandingPage | Automation | Report
                 // | Research | Proposal | ...
  outputFormat[] // định dạng file cụ thể, vd [".docx", ".pdf"]
  outputDescription  // mô tả cụ thể "cái gì" được tạo ra, vd
                     // "Một bản Proposal hoàn chỉnh 1-2 trang, sẵn sàng gửi khách hàng"
  savedTo        // luôn là Workspace — nơi lưu Output + Version + Companion Feedback
}
```

Bảng ví dụ mapping Category → Output điển hình:

| Category | Output điển hình | Format |
|---|---|---|
| AI Office | Báo cáo, Email, Slide | .docx, .pdf, .pptx |
| AI Writing | Bài viết, Proposal | .docx, .md |
| AI Marketing | Kế hoạch Marketing, Caption | .docx, .md |
| AI Design | Banner, Brand Kit | .png/.fig/Canva link |
| AI Video | Video ngắn, Kịch bản | .mp4, .md |
| AI Data | Dashboard, Báo cáo phân tích | .xlsx, .pdf |
| AI Automation | Workflow, Script | .json, .md |
| AI Business | Business Plan, SWOT | .docx, .pdf |

Nguyên tắc: `outputFormat` phải là định dạng **ứng dụng được ngay** trong
công việc thật (khớp Learning OS Principle mục "File đính kèm phải dùng
được thật") — không chấp nhận Mission có `outputType` là "kiến thức" hay
"hiểu biết" chung chung.

---

## 9. Mission Capability Mapping

Mỗi Mission map tới một hoặc nhiều **AI Competency** — năng lực được ghi
nhận "đã thực hành", không phải điểm số.

```
CapabilityMapping {
  competency[]     // vd ["AI Writing", "AI Office", "Prompt Engineering",
                    //     "Business Communication"]
  practiceLevel     // Introduced | Practiced | Applied | Mastered
                    // (mức độ dựa trên số lần Mission liên quan đã hoàn
                    //  thành + Output đã tạo, KHÔNG dựa trên điểm số)
}
```

Ví dụ:

```
Mission "Viết Proposal":
  competency = ["AI Writing", "AI Office", "Prompt Engineering",
                "Business Communication"]
```

Nguyên tắc:
- Một Mission luôn map tới **nhiều hơn 1 Competency** khi hợp lý (công việc
  thật hiếm khi chỉ dùng một kỹ năng đơn lẻ).
- Competency là danh mục mở, giống Mission Taxonomy — mở rộng tự do, không
  giới hạn.
- `practiceLevel` tăng dần theo số Mission cùng Competency đã hoàn thành có
  Output thật, không dựa trên bài kiểm tra.

---

## 10. Mission AI Impact Mapping

Mỗi Mission xác định trước **Portal sẽ đo điều gì** khi Mission hoàn thành —
không dùng điểm Quiz.

```
AiImpactMetric {
  metricType   // TimeSaved | QualityImproved | AutomationLevel
               // | ConfidenceGained | OutputCompleted | BusinessValue
  measureBy    // cách đo cụ thể, vd:
               //   TimeSaved: "so với làm tay ước tính X phút"
               //   OutputCompleted: đếm số Output tạo ra loại này
               //   ConfidenceGained: câu hỏi tự đánh giá 1 câu, không chấm điểm
  displayAs    // cách hiển thị cho người dùng (Dashboard Workspace — mục 8
               // Learning OS Principle), vd "12 Proposal đã tạo"
}
```

Ví dụ:

```
Mission "Viết Proposal":
  aiImpactMetrics = [
    { metricType: "OutputCompleted", measureBy: "đếm số Proposal đã lưu Workspace",
      displayAs: "Proposal đã tạo" },
    { metricType: "TimeSaved", measureBy: "ước tính X phút tiết kiệm so với viết tay",
      displayAs: "Thời gian tiết kiệm" },
    { metricType: "ConfidenceGained", measureBy: "câu hỏi tự đánh giá sau Reflection",
      displayAs: "Mức tự tin tăng" }
  ]
```

Nguyên tắc: Impact luôn là số liệu **đếm được hoặc tự-báo-cáo trung thực**,
không bao giờ là điểm số/thứ hạng. Đây chính là dữ liệu nuôi Dashboard
Workspace và Khu vườn của bạn (đã audit là đang dùng số liệu tĩnh — Mission
Impact chính là nguồn thật để thay thế).

---

## 11. Examples

### Ví dụ đầy đủ 1 Mission

```
Mission {
  missionId: "viet-proposal-khach-hang"
  missionName: "Viết Proposal gửi khách hàng bằng AI"
  missionCategory: "AI Writing"
  missionSubcategory: "Business Communication"
  competency: ["AI Writing", "AI Office", "Prompt Engineering",
               "Business Communication"]
  difficulty: "Intermediate"
  estimatedTime: "25-35 phút"
  prerequisite: []   // không bắt buộc, gợi ý requiredAiSkills bên dưới
  requiredAiSkills: ["Viết Prompt cơ bản"]
  learningObjectives: [
    "Có thể mô tả bối cảnh khách hàng đủ rõ để AI viết đúng giọng văn",
    "Có thể chỉnh sửa Proposal AI tạo ra sao cho phù hợp thực tế"
  ]
  expectedOutput: {
    outputType: "Proposal",
    outputFormat: [".docx", ".pdf"],
    outputDescription: "Một bản Proposal 1-2 trang, sẵn sàng gửi khách hàng thật",
    savedTo: "Workspace"
  }
  workspaceType: "document"
  relatedPromptPacks: ["prompt-pack-proposal-b2b"]
  relatedTemplates: ["template-proposal-1-trang"]
  relatedChecklists: ["checklist-proposal-truoc-khi-gui"]
  relatedKnowledgeAssets: ["guide-viet-proposal-hieu-qua"]
  relatedLearningJourney: ["journey-ai-office"]
  unlockCondition: "none"
  capabilityMapping: { competency: [...], practiceLevel: "Introduced" }
  reflectionQuestions: [
    "Điều gì trong Proposal AI viết ra bạn phải sửa lại nhiều nhất? Vì sao?"
  ]
  aiImpactMetrics: [
    { metricType: "OutputCompleted", displayAs: "Proposal đã tạo" },
    { metricType: "TimeSaved", displayAs: "Thời gian tiết kiệm" }
  ]
  growthEventType: "MISSION_COMPLETED"
}
```

### Ví dụ Mission Dependency thật (chuỗi 2 Mission)

```
Mission "dashboard-co-ban" (AI Data, Beginner)
  → hoàn thành, sinh Output loại Spreadsheet, competency "AI Data" → Practiced

Mission "dashboard-nang-cao" (AI Data, Advanced)
  unlockCondition = requiresAny([
    requiresMission(["dashboard-co-ban"]),
    requiresCapability({ competency: "AI Data", minLevel: "Intermediate" })
  ])
```

### Ví dụ Mission liên kết nhiều loại tài nguyên cùng lúc

```
Mission "xay-ke-hoach-marketing" (AI Marketing, Advanced)
  relatedKnowledgeAssets: ["framework-marketing-4p", "case-study-chien-dich-thanh-cong"]
  relatedTemplates: ["template-ke-hoach-marketing-quy"]
  relatedChecklists: ["checklist-truoc-khi-launch-campaign"]
  relatedPromptPacks: ["prompt-pack-phan-tich-thi-truong", "prompt-pack-viet-content-calendar"]
```

---

## 12. Future Expansion Strategy

Mục tiêu: sinh ra 1000+ Mission mà **không cần sửa schema/kiến trúc** ở
trên. Chiến lược mở rộng:

1. **Mở rộng theo chiều ngang (Taxonomy)**: thêm Category/Subcategory mới
   bất kỳ lúc nào — schema Mission không thay đổi, chỉ giá trị
   `missionCategory` có thêm lựa chọn.
2. **Mở rộng theo chiều dọc (Difficulty)**: mỗi Category có thể có nhiều
   Mission từ Beginner → Advanced cho cùng một loại công việc (vd "Viết
   Email" → "Viết Email đàm phán phức tạp bằng AI").
3. **Tái sử dụng tài nguyên qua N–N relationship**: một Prompt Pack/
   Template/Knowledge Asset chất lượng cao có thể phục vụ hàng chục Mission
   khác nhau — ưu tiên tái sử dụng trước khi tạo tài nguyên mới (khớp
   nguyên tắc chất lượng hơn số lượng).
4. **Competency là hệ thống mở**: khi xuất hiện nhu cầu công việc mới chưa
   có Competency phù hợp, thêm Competency mới — không giới hạn danh sách.
5. **Mission do cộng đồng/chuyên gia đóng góp**: về sau có thể cho phép đề
   xuất Mission mới, miễn tuân thủ đúng Schema (mục 3) và Output Standard
   (mục 8) — không cần thay đổi hệ thống lõi để chấp nhận Mission mới.
6. **Versioning Mission**: khi một Mission cần cập nhật lớn (đổi Output
   Standard, đổi Competency mapping), tạo `missionId` mới thay vì sửa đè —
   giữ nguyên lịch sử Mission cũ mà người dùng đã hoàn thành.
7. **Không cần migration lớn khi mở rộng**: vì mọi quan hệ đều N–N và mọi
   field mở rộng (Category/Competency/Output type) đều là enum mở, việc
   thêm Mission thứ 1001 dùng đúng quy trình như Mission thứ 1.

---

Tài liệu này là chuẩn thiết kế — chưa có Mission thật nào được tạo ra trong
task này. Bước tiếp theo (ngoài phạm vi task A1) là áp dụng chuẩn này để tổ
chức lại các Knowledge Asset đã có (xem `docs/SMART_AI_CURRICULUM_AUDIT.md`
mục P0 #3) thành các Mission đầu tiên.
