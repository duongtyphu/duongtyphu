# Learning Asset Standard

Tiêu chuẩn bắt buộc cho MỌI Mission, MỌI bài học và MỌI nội dung trong VO
DUONG AI. Tài liệu kiến trúc — không code, không UI, không route, không
component, không dữ liệu giả, không viết thêm bài học trong task này. Đây
là tiêu chuẩn nội dung đứng bên trong mỗi Mission được định nghĩa ở
`docs/MISSION_LIBRARY_STANDARD.md` — Mission Library Standard mô tả **đơn
vị công việc**, Learning Asset Standard mô tả **đơn vị học tập lấp đầy
Mission đó**.

**Product Principle**: VO DUONG AI không tạo nội dung. VO DUONG AI tạo
Learning Asset. Mỗi Learning Asset phải giúp người học tạo ra một kết quả
thật, chứng minh được giá trị của AI và trở thành một phần trong hành
trình trưởng thành của họ.

---

## 1. Learning Philosophy

Learning Asset **không phải** bài viết, video, PDF, hay Prompt đơn lẻ.
Learning Asset là **"một đơn vị học tập hoàn chỉnh giúp người học tạo ra
một kết quả thật."**

Một Learning Asset phải trả lời được cả 6 câu hỏi sau — thiếu một câu,
Asset chưa hoàn chỉnh:

| # | Câu hỏi | Ý nghĩa |
|---|---|---|
| 1 | Người học sẽ học điều gì? | Knowledge — ngắn, đúng, thực tế |
| 2 | Người học sẽ làm gì? | Practice — công việc thật, không phải quiz |
| 3 | Companion sẽ hỗ trợ gì? | Điều phối, chia bước, phản hồi — không làm thay |
| 4 | AI Agent sẽ hỗ trợ gì? | Vai trò cụ thể (Research/Writer/Reviewer...) |
| 5 | Người học tạo ra Output gì? | Kết quả thật, dùng được ngay |
| 6 | Portal sẽ chứng minh giá trị gì? | AI Impact đo được — không phải điểm quiz |

Nếu một Asset không dẫn tới Output thật — Asset đó **không đạt tiêu
chuẩn**, bất kể nội dung học hay đến đâu.

---

## 2. Asset Structure

Cấu trúc chuẩn của một Learning Asset, theo đúng thứ tự trình bày (không
phải mọi bước đều bắt buộc hiển thị riêng lẻ với người học — đây là khung
thiết kế nội dung, không phải khung UI):

```
Mission            // Asset luôn thuộc về đúng 1 Mission (xem Mission Library Standard)
  ↓
Goal               // mục tiêu cụ thể của Asset này trong Mission
  ↓
Business Value     // giá trị công việc thật Asset mang lại
  ↓
Prerequisite       // năng lực/Asset cần có trước (có thể rỗng)
  ↓
Knowledge          // kiến thức ngắn, đúng, thực tế — mục 4
  ↓
Real Example       // ví dụ thật, không Lorem Ipsum — mục 5
  ↓
Framework          // mô hình tư duy áp dụng được ngay (nếu có)
  ↓
Checklist          // danh sách kiểm tra thao tác — mục 6
  ↓
Prompt Pack        // bộ Prompt dùng được ngay — mục 6
  ↓
Template Pack      // file mẫu dùng được ngay — mục 6
  ↓
Tool Guide         // hướng dẫn công cụ AI liên quan (nếu cần)
  ↓
Practice           // công việc thật để luyện — mục 7
  ↓
Assignment         // đề bài cụ thể của Practice (input/yêu cầu rõ ràng)
  ↓
Companion Practice // Companion đồng hành khi thực hành — mục 8
  ↓
Workspace          // nơi thực hiện, chỉnh sửa, lưu trữ
  ↓
Output             // kết quả thật — mục 10
  ↓
Review             // Companion review Output — mục 11
  ↓
Reflection         // câu hỏi phản ánh — mục 12
  ↓
Capability Update  // cập nhật năng lực — mục 13
  ↓
Unlock             // mở Asset/Mission tiếp theo — mục 14
```

Nguyên tắc cấu trúc:
- Không phải mọi Asset cần đủ 100% các khối — vd Asset đơn giản (Beginner)
  có thể bỏ qua `Framework`/`Tool Guide`; nhưng thứ tự khi xuất hiện phải
  đúng chuỗi trên.
- `Knowledge` → `Practice` → `Output` là 3 khối **bắt buộc tuyệt đối** —
  không có ngoại lệ (mục 17, Quality Checklist).

---

## 3. Required Elements

Danh sách khối bắt buộc/tùy chọn:

| Khối | Bắt buộc? | Ghi chú |
|---|---|---|
| Goal | ✔ | 1 câu, rõ ràng, đo được |
| Business Value | ✔ | Trả lời "vì sao công việc này quan trọng thật" |
| Prerequisite | — | Có thể là `[]` (mảng rỗng) |
| Knowledge | ✔ | Theo Knowledge Standard (mục 4) |
| Real Example | ✔ | Theo Example Standard (mục 5) |
| Framework | — | Chỉ khi công việc thật cần mô hình tư duy |
| Checklist | — | Theo Resource Standard (mục 6) |
| Prompt Pack | — | Theo Resource Standard (mục 6) |
| Template Pack | — | Theo Resource Standard (mục 6) |
| Tool Guide | — | Chỉ khi Asset cần hướng dẫn công cụ cụ thể |
| Practice | ✔ | Theo Practice Standard (mục 7) |
| Assignment | ✔ | Đề bài cụ thể của Practice |
| Companion Practice | ✔ | Theo Companion Standard (mục 8) |
| Workspace | ✔ | Luôn có — nơi Output được tạo và lưu |
| Output | ✔ | Theo Output Standard (mục 10) — không có = không đạt chuẩn |
| Review | ✔ | Theo Review Standard (mục 11) |
| Reflection | ✔ | Theo Reflection Standard (mục 12) — tối thiểu 1 câu |
| Capability Update | ✔ | Theo mục 13 |
| Unlock | ✔ | Theo Unlock Standard (mục 14) — kể cả khi điều kiện là "luôn mở" |

Không bắt buộc Asset nào cũng có **tất cả** khối tùy chọn (Checklist/Prompt
Pack/Template Pack/Framework/Tool Guide) — nhưng khối nào xuất hiện phải
tuân đúng chuẩn tương ứng.

---

## 4. Knowledge Standard

Kiến thức trong mỗi Asset phải:

- **Ngắn** — không viết dài dòng kiểu sách giáo khoa; ưu tiên đoạn văn
  ngắn, gạch đầu dòng, câu trực tiếp.
- **Đúng** — chính xác về nghiệp vụ/công cụ AI, không suy đoán.
- **Thực tế** — gắn với tình huống công việc thật, không lý thuyết trừu
  tượng.
- **Nhiều ví dụ** — mỗi khái niệm đi kèm ví dụ cụ thể (mục 5), không dừng
  ở định nghĩa.
- **Không lý thuyết dài dòng** — nếu một đoạn kiến thức không dẫn thẳng
  tới việc người học sẽ làm ở bước Practice, đoạn đó không thuộc Asset.

Kiểm tra nhanh: nếu xoá khối Knowledge, người học có còn hiểu **tại sao**
làm Practice không? Nếu không — Knowledge đủ mỏng và đúng trọng tâm.

---

## 5. Example Standard

Mỗi Asset phải có **Ví dụ thật**, đúng loại công việc mà Asset đó dạy:

| Loại Asset | Ví dụ thật tương ứng |
|---|---|
| Word/viết | Proposal thật, Email thật |
| Excel/dữ liệu | Dashboard thật, bảng phân tích thật |
| Marketing | Kế hoạch Marketing thật |
| Design | Banner/Brand Kit thật |
| Video | Kịch bản/Storyboard thật |

Nguyên tắc:
- **Không dùng Lorem Ipsum** hoặc dữ liệu giả không có ngữ cảnh.
- Ví dụ phải đủ cụ thể để người học có thể **copy cấu trúc**, không chỉ đọc
  hiểu — vd không chỉ nói "một Proposal tốt cần rõ ràng," mà cho xem một
  đoạn Proposal thật với cấu trúc rõ.
- Ví dụ nên thể hiện **trước/sau khi có AI** khi hợp lý, để làm rõ AI
  Impact (mục 10 Mission Library Standard).

---

## 6. Resource Standard

Mỗi Asset phải **quy định rõ** có những loại tài nguyên nào đi kèm — không
bắt buộc có đủ tất cả, nhưng loại nào có phải đạt chuẩn dùng-được-ngay
(khớp Learning OS Principle — không file giả):

| Loại tài nguyên | Định dạng chuẩn | Ghi chú |
|---|---|---|
| Checklist | .xlsx, Google Sheet | Danh sách kiểm tra thao tác cụ thể |
| Prompt Pack | .md, .txt, JSON | Prompt dùng được ngay, không phải teaser |
| Word Template | .docx | Có cấu trúc sẵn, chỉ cần điền |
| Excel Template | .xlsx | Có công thức/format sẵn |
| PowerPoint | .pptx | Bố cục sẵn, không cần dựng từ đầu |
| PDF | .pdf | Tài liệu tham khảo hoàn chỉnh |
| Case Study | .md, .pdf | Câu chuyện thật, có số liệu/kết quả |
| Workflow | .md, sơ đồ | Các bước quy trình rõ ràng |
| Mindmap | Mindmap file, ảnh | Cấu trúc tư duy trực quan |
| Dataset | .csv, .xlsx | Dữ liệu mẫu thật để luyện phân tích |
| Reference | link, .md | Nguồn tham khảo bổ sung |

Nguyên tắc:
- Asset **phải khai báo rõ** danh sách tài nguyên đi kèm (kể cả khi rỗng)
  — không được để ngỏ "sẽ có sau" (vi phạm trực tiếp nguyên tắc không
  Placeholder).
- Một tài nguyên có thể dùng chung cho nhiều Asset/Mission (quan hệ N–N,
  khớp Mission Relationship ở Mission Library Standard).

---

## 7. Practice Standard

Practice **không phải Quiz**. Practice là **một công việc thật**.

| Học | Practice đúng chuẩn | Practice sai chuẩn |
|---|---|---|
| Viết Email | Viết một Email thật, gửi được | Chọn đáp án đúng/sai về cách viết Email |
| Làm Dashboard | Làm một Dashboard thật từ dữ liệu mẫu | Trả lời câu hỏi trắc nghiệm về Dashboard |
| Thiết kế | Tạo một Banner thật | Xem video rồi bấm "đã hiểu" |

Nguyên tắc:
- Practice luôn gắn với **Assignment cụ thể** — có input/ngữ cảnh/yêu cầu
  rõ ràng, không mơ hồ ("hãy thử viết gì đó").
- Practice luôn dẫn thẳng tới Workspace + Output — không có Practice đứng
  một mình không sinh Output.
- Không chấm đúng/sai — chỉ có Output hoàn thành hay chưa.

---

## 8. Companion Standard

Trong một Learning Asset, Companion:

**Companion làm:**
- Giải thích (khi người học chưa rõ Knowledge)
- Chia nhỏ Practice/Assignment thành bước dễ làm
- Nhắc (khi người học bỏ dở)
- Phản hồi (trong Workspace, khi có Output nháp)
- Review (sau khi có Output — mục 11)
- Điều phối AI Agent phù hợp (mục 9)

**Companion không làm:**
- Không trả lời thay/làm hộ toàn bộ Assignment cho người học.
- Không chấm điểm/xếp hạng.
- Không tự chọn Agent thay người dùng biết trước — Companion chọn ngầm,
  người dùng chỉ thấy kết quả điều phối, không phải bảng chọn Agent.

---

## 9. AI Agent Standard

Mỗi Asset, nếu cần AI Agent hỗ trợ, phải **định nghĩa rõ Agent nào làm gì**
— chỉ thiết kế vai trò, không implement:

| Agent | Vai trò |
|---|---|
| Research Agent | Thu thập/tổng hợp thông tin, dữ liệu nền cho Practice |
| Writer Agent | Soạn thảo nội dung văn bản (Email/Proposal/Bài viết) |
| Reviewer Agent | Đọc lại Output, góp ý theo Review Standard (mục 11) |
| Designer Agent | Hỗ trợ tạo Output hình ảnh/thiết kế (Banner/Slide) |
| Office Agent | Hỗ trợ tài liệu văn phòng (Word/Excel/PowerPoint) |
| Planner Agent | Hỗ trợ lập kế hoạch/quy trình nhiều bước |

Nguyên tắc:
- Asset khai báo Agent theo **vai trò chức năng**, không theo tên sản phẩm
  AI cụ thể (ChatGPT/Claude/Canva...) — vai trò ổn định, công cụ nền phía
  sau có thể đổi mà không cần sửa Asset (khớp nguyên tắc "không thiết kế
  theo AI Tool" ở Mission Library Standard).
- Một Asset có thể cần nhiều Agent phối hợp (vd Research Agent → Writer
  Agent → Reviewer Agent theo trình tự Practice).
- Không phải Asset nào cũng cần Agent — Asset thuần phản ánh/checklist thủ
  công có thể không cần Agent nào.

---

## 10. Output Standard

Asset phải sinh Output — **không có Output, Asset không đạt chuẩn**, bất
kể phần Knowledge có hay đến đâu.

Loại Output hợp lệ: Word, Excel, PowerPoint, PDF, Markdown, Landing Page,
Prompt (khi Asset dạy viết Prompt), Video Script, Automation (workflow/
script) — danh sách mở, không giới hạn.

Nguyên tắc:
- Output phải là **artefact cụ thể, dùng được ngay trong công việc thật**
  — không phải "đã hiểu bài," không phải "đã xem xong."
- Output luôn được lưu vào Workspace (không phải chỉ hiển thị rồi mất).
- Output là căn cứ cho Review (mục 11), Capability Update (mục 13), và AI
  Impact Mapping (Mission Library Standard mục 10) — nếu không có Output,
  các bước sau không có gì để căn cứ vào.

---

## 11. Review Standard

Sau khi Output được tạo, Companion review — **không chấm điểm**.

Cấu trúc Review chuẩn:

```
Review {
  strengths[]       // Điểm mạnh — cụ thể, dựa trên Output thật vừa tạo
  improvements[]    // Điểm cần cải thiện — cụ thể, có thể hành động được
  nextTimeSuggestion // Lần sau nên làm gì — 1 gợi ý cụ thể, không chung chung
}
```

Nguyên tắc:
- Review luôn có cả 3 phần — không chỉ nêu điểm yếu, cũng không chỉ khen.
- Review bám vào Output thật vừa tạo, không phải nhận xét chung chung về
  "kỹ năng nói chung."
- Review không phải điều kiện bắt buộc để Unlock — Review là phản hồi
  giúp cải thiện, Unlock (mục 14) căn cứ vào Output/Capability, không phải
  Review có "đạt" hay không.

---

## 12. Reflection Standard

Sau mỗi Asset, Portal phải hỏi Reflection. Ví dụ câu hỏi chuẩn:

- "Bạn học được điều gì?"
- "Điều gì khó nhất?"
- "AI giúp bạn ở đâu?"
- "Nếu làm lại, bạn sẽ thay đổi điều gì?"

Nguyên tắc:
- Reflection **không bắt buộc dài** — có thể là câu trả lời 1 dòng.
- Reflection **phải có**, tối thiểu 1 câu hỏi mỗi Asset — không được bỏ
  qua bước này dù Asset đơn giản đến đâu.
- Reflection không chấm điểm, không đúng/sai (nhất quán với
  `GrowthCheckpoint` đã có trong hệ thống hiện tại).
- Reflection là input thật cho Nhật ký học tập/Hành trình của tôi — không
  phải chỉ lưu rồi bỏ quên (đây là gap đã ghi nhận ở
  `docs/SMART_AI_CURRICULUM_AUDIT.md`, cần được nối lại khi implement).

---

## 13. Capability Mapping (Capability Update)

Hoàn thành Asset → Capability được cập nhật. **Không dùng Quiz** để đo —
dùng tổ hợp:

```
CapabilityUpdate = f(Output, Reflection, Review, Practice)
```

| Nguồn | Đóng góp vào Capability như thế nào |
|---|---|
| Output | Bằng chứng đã áp dụng được — yếu tố chính |
| Reflection | Bằng chứng người học nhận biết được điều mình học |
| Review | Companion xác nhận Output có đạt chất lượng công việc thật |
| Practice | Số lần thực hành cùng Competency — tăng dần practiceLevel |

Nguyên tắc: Capability tăng theo **hành động thật đã hoàn thành**, không
theo số câu trả lời đúng — nhất quán với Capability Mapping trong Mission
Library Standard (mục 9), dùng chung thang đo `Introduced → Practiced →
Applied → Mastered`.

---

## 14. Unlock Rules

Mission/Asset tiếp theo **không mở theo Video đã xem** — mở theo:

- **Output** đã tạo (đã có Output thật của Asset hiện tại).
- **Capability** đạt ngưỡng cần thiết (không nhất thiết phải qua đúng
  Asset tiền đề, nếu năng lực đã đủ — dùng chung cơ chế `unlockCondition`
  linh hoạt ở Mission Library Standard mục 6).
- **Journey** — vị trí trong lộ trình gợi ý (không bắt buộc tuyến tính).

Nguyên tắc: Unlock luôn dựa trên **bằng chứng đã làm được điều gì đó**,
không dựa trên "đã xem/đã đọc." Không có Asset nào mở khoá chỉ vì đã xem
hết Video hoặc đọc hết Knowledge mà chưa có Output.

---

## 15. Data Model

Mô hình dữ liệu logic (không implement) — nhất quán và tương thích với
Mission Schema ở Mission Library Standard:

```
LearningAsset {
  assetId
  missionId              // Asset luôn thuộc đúng 1 Mission
  journeyId[]             // Journey mà Asset xuất hiện (0, 1, hoặc nhiều)
  competencyId[]          // Competency được rèn luyện

  difficulty               // Beginner | Intermediate | Advanced
  estimatedTime

  goal                     // Goal — mục 2 Asset Structure
  businessValue            // Business Value — mục 2
  prerequisite[]           // Asset ID hoặc Capability threshold

  knowledge                // Knowledge block — theo Knowledge Standard (mục 4)
  realExample               // Real Example — theo Example Standard (mục 5)
  framework?                // tùy chọn

  resources {               // theo Resource Standard (mục 6)
    checklists[]
    promptPacks[]
    templates[]
    toolGuides[]
    caseStudies[]
    workflows[]
    mindmaps[]
    datasets[]
    references[]
  }

  practice {                // theo Practice Standard (mục 7)
    assignment
    companionPracticeMode   // cách Companion đồng hành — mục 8
    requiredAgents[]         // theo AI Agent Standard (mục 9)
  }

  workspaceType             // loại Workspace mở ra khi thực hành

  outputType                // theo Output Standard (mục 10)
  outputFormat[]

  reviewRules {              // theo Review Standard (mục 11)
    dimensions[]              // vd ["rõ ràng", "đúng ngữ cảnh", "sẵn sàng dùng"]
  }

  reflectionQuestions[]       // theo Reflection Standard (mục 12), tối thiểu 1

  capabilityMapping           // theo mục 13, dùng chung schema Mission Library Standard

  unlockRules                 // theo Unlock Standard (mục 14)

  growthEvents[]               // loại Growth Event Asset này phát ra
                                // (vd ASSET_STARTED, OUTPUT_CREATED,
                                //  REFLECTION_SUBMITTED, ASSET_COMPLETED)

  status                       // Lifecycle — mục 16
  version
}
```

Ghi chú tương thích: `LearningAsset` có thể ánh xạ trực tiếp từ
`KnowledgeSeed` hiện có trong hệ thống (CKOS) — không cần cấu trúc dữ liệu
mới hoàn toàn, chỉ cần bổ sung các field còn thiếu (Business Value,
Capability Mapping tường minh, Unlock Rules tường minh, Growth Events) mà
audit trước đã chỉ ra là chưa có.

---

## 16. Lifecycle

```
Draft
  ↓  (soạn nội dung theo đủ Asset Structure — mục 2)
Review
  ↓  (kiểm tra theo Quality Checklist — mục 17, trước khi publish)
Published
  ↓  (người học có thể truy cập, thực hành, tạo Output)
Improved
  ↓  (cập nhật dựa trên Reflection/Review thật từ người học)
Version 2
  ↓  (thay đổi đáng kể — giữ assetId, tăng version, không xoá lịch sử cũ)
Archived
  (không còn hiển thị cho người học mới, nhưng Output/lịch sử người học cũ vẫn giữ nguyên)
```

Nguyên tắc: một Asset không bao giờ nhảy thẳng từ Draft sang Published —
phải qua bước Review nội bộ đạt đủ Quality Checklist (mục 17).

---

## 17. Quality Checklist

Một Asset **chỉ được Publish** khi đạt đủ:

- ✔ Goal rõ ràng, đo được
- ✔ Có Output (thật, dùng được ngay — không placeholder)
- ✔ Có Practice (công việc thật, không phải quiz)
- ✔ Có Companion (vai trò rõ theo Companion Standard)
- ✔ Có Resource (khai báo rõ, kể cả khi rỗng có chủ đích)
- ✔ Có Reflection (tối thiểu 1 câu hỏi)
- ✔ Có Unlock (điều kiện rõ, kể cả khi là "luôn mở")
- ✔ Có Capability Mapping (competency + practice level rõ)
- ✔ Có AI Impact (ít nhất 1 metric đo được — theo Mission Library Standard
  mục 10)

Thiếu bất kỳ mục nào — Asset ở trạng thái Draft, không được chuyển
Published.

---

## 18. Examples

### Ví dụ 1 — Learning Asset đầy đủ (thuộc Mission "Viết Proposal gửi khách hàng bằng AI")

```
LearningAsset {
  assetId: "asset-viet-proposal-b2b-co-ban"
  missionId: "viet-proposal-khach-hang"
  journeyId: ["journey-ai-office"]
  competencyId: ["ai-writing", "business-communication"]
  difficulty: "Intermediate"
  estimatedTime: "20 phút"

  goal: "Viết được một bản Proposal 1 trang bằng AI, đúng giọng văn khách hàng B2B"
  businessValue: "Rút ngắn thời gian soạn Proposal từ 2 giờ xuống 20 phút, vẫn giữ chất lượng chuyên nghiệp"
  prerequisite: []

  knowledge: "3 nguyên tắc viết Proposal AI hiệu quả: (1) cho AI biết rõ bối cảnh khách hàng, (2) yêu cầu cấu trúc rõ (Vấn đề–Giải pháp–Giá trị–Lời kêu gọi), (3) luôn tự đọc lại và điều chỉnh giọng văn."
  realExample: "Một bản Proposal thật cho khách hàng ngành F&B (kèm bản gốc AI viết + bản đã chỉnh sửa để so sánh)"
  framework: "Cấu trúc Problem–Solution–Value–CTA"

  resources: {
    checklists: ["checklist-proposal-truoc-khi-gui"],
    promptPacks: ["prompt-pack-proposal-b2b"],
    templates: ["template-proposal-1-trang"],
    toolGuides: [],
    caseStudies: ["case-study-proposal-thanh-cong-nganh-fnb"],
    workflows: [], mindmaps: [], datasets: [], references: []
  }

  practice: {
    assignment: "Viết một Proposal thật cho một khách hàng có thật hoặc giả định gần thực tế của chính bạn",
    companionPracticeMode: "chia bước: bối cảnh → cấu trúc → soạn → tự review",
    requiredAgents: ["Writer Agent", "Reviewer Agent"]
  }

  workspaceType: "document"
  outputType: "Proposal"
  outputFormat: [".docx", ".pdf"]

  reviewRules: { dimensions: ["rõ ràng", "đúng ngữ cảnh khách hàng", "sẵn sàng gửi"] }
  reflectionQuestions: ["Điều gì trong Proposal AI viết ra bạn phải sửa lại nhiều nhất? Vì sao?"]

  capabilityMapping: { competency: ["ai-writing", "business-communication"], practiceLevel: "Introduced" }
  unlockRules: "none"
  growthEvents: ["ASSET_STARTED", "OUTPUT_CREATED", "REFLECTION_SUBMITTED", "ASSET_COMPLETED"]

  status: "Published"
  version: 1
}
```

### Ví dụ 2 — Asset tối giản (không cần Framework/Tool Guide)

```
LearningAsset {
  assetId: "asset-viet-email-tu-choi-lich-su"
  missionId: "viet-email-chuyen-nghiep"
  difficulty: "Beginner"
  goal: "Viết được một Email từ chối lịch sự, giữ mối quan hệ tốt"
  businessValue: "Tránh mất khách hàng/đối tác vì cách từ chối thiếu khéo léo"
  knowledge: "2 nguyên tắc: cảm ơn trước, đưa giải pháp thay thế nếu có"
  realExample: "Một Email từ chối thật của một freelancer từ chối gia hạn deadline"
  practice: { assignment: "Viết Email từ chối một tình huống thật bạn từng gặp" }
  workspaceType: "document"
  outputType: "Email"
  outputFormat: [".docx", ".md"]
  reflectionQuestions: ["AI giúp bạn ở đâu khi viết Email này?"]
  status: "Published"
  version: 1
}
```

---

Tài liệu này là chuẩn thiết kế nội dung — chưa tạo Asset thật nào trong
task này. Áp dụng chuẩn này (kết hợp `docs/MISSION_LIBRARY_STANDARD.md`)
là bước tiếp theo khi tổ chức lại các Knowledge Asset hiện có thành Mission
+ Learning Asset hoàn chỉnh theo đúng framework này.
