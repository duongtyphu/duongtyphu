# Learning Journey Standard

Tài liệu định nghĩa cách một người học đi từ **Người mới → Biết AI → Ứng
dụng AI → Làm chủ AI → Tạo ra giá trị bằng AI**. Tài liệu kiến trúc — không
code, không UI, không route, không component, không dữ liệu demo, không AI
API, không Agent, không Placeholder.

Đây là tầng cao nhất trong bộ 3 tài liệu chuẩn:

```
Learning Journey Standard   (tài liệu này — hành trình phát triển năng lực)
        ↓ chứa nhiều
Mission Library Standard    (docs/MISSION_LIBRARY_STANDARD.md — đơn vị công việc thật)
        ↓ mỗi Mission lấp đầy bởi
Learning Asset Standard      (docs/LEARNING_ASSET_STANDARD.md — đơn vị học tập)
```

**Product Principle**: VO DUONG AI không tổ chức nội dung theo bài học. VO
DUONG AI tổ chức theo hành trình phát triển năng lực. Người dùng không
hoàn thành một khóa học — người dùng hoàn thành một năng lực mới, được
chứng minh bằng kết quả thật và được lưu lại trong hành trình trưởng thành
của chính họ.

---

## 1. Journey Philosophy

Learning Journey **không phải** danh sách bài học theo thứ tự. Learning
Journey là **một hành trình phát triển năng lực**.

Mỗi Journey phải giúp người học **thay đổi năng lực thật** — không phải
"xem thêm video." Một Journey đạt chuẩn khi, sau khi đi qua nó, người học:

1. Có năng lực (Competency) ở mức cao hơn lúc bắt đầu — đo bằng Output/
   Practice thật, không phải điểm số.
2. Có ít nhất một Output thật đã tạo ra và lưu trong Workspace.
3. Có thể tự nhận biết mình đã thay đổi gì (qua Reflection).
4. Có đường đi rõ ràng tới Journey tiếp theo (Unlock).

Journey không kết thúc ở "Hoàn thành khoá học" — Journey kết thúc ở
"Người học đã làm được điều trước đây họ chưa làm được."

---

## 2. Learning Hierarchy

Kiến trúc phân tầng chuẩn, từ năng lực trừu tượng nhất tới hành động cụ
thể nhất:

```
Competency        // năng lực AI trừu tượng (vd "AI Writing", "AI Data")
   ↓ được rèn qua
Journey            // hành trình phát triển 1+ Competency, có Business Goal
   ↓ chia thành
Collection         // nhóm Mission theo chủ đề công việc con (không phải khóa học)
   ↓ chứa
Mission            // đơn vị công việc thật (docs/MISSION_LIBRARY_STANDARD.md)
   ↓ lấp đầy bởi
Learning Asset      // đơn vị học tập (docs/LEARNING_ASSET_STANDARD.md)
   ↓ dẫn tới
Practice            // công việc thật để luyện, không phải quiz
   ↓ thực hiện trong
Workspace           // nơi lưu quá trình + kết quả + phiên bản
   ↓ sinh ra
Output              // kết quả thật, dùng được ngay
   ↓ đi kèm
Reflection          // người học tự nhận biết mình đã học/thay đổi gì
   ↓ cập nhật
Growth              // Growth Event ghi nhận, nuôi Nhật ký/Hành trình/Khu vườn
   ↓ mở ra
Unlock              // Mission/Collection/Journey tiếp theo
```

Vai trò từng tầng:

| Tầng | Vai trò | KHÔNG phải |
|---|---|---|
| Competency | Đích đến năng lực, trừu tượng, dùng chung nhiều Journey | Một môn học riêng biệt |
| Journey | Khung hành trình có Business Goal rõ ràng | Một khóa học tuyến tính bắt buộc |
| Collection | Nhóm Mission theo chủ đề công việc con | Một khóa học độc lập có "học phí"/"chứng chỉ" riêng |
| Mission | Đơn vị công việc thật nhỏ nhất tạo giá trị | Một bài học để đọc |
| Learning Asset | Nội dung + thực hành lấp đầy 1 Mission | Một bài viết/video đơn lẻ |
| Practice | Hành động thật | Câu hỏi trắc nghiệm |
| Workspace | Nơi hội tụ, lưu trữ | Nơi chứa file tĩnh |
| Output | Bằng chứng năng lực | "Đã đọc xong" |
| Reflection | Nhận biết bản thân | Bài kiểm tra |
| Growth | Dữ liệu trưởng thành thật | Số liệu trang trí |
| Unlock | Cánh cửa tiếp theo, dựa trên bằng chứng thật | Phần thưởng gamification trẻ con |

---

## 3. Journey Structure

Mỗi Journey phải có đầy đủ:

```
Journey {
  journeyId
  journeyName
  description
  businessGoal          // giá trị công việc thật Journey hướng tới
  targetUser             // ai nên đi Journey này (vai trò/nhu cầu, không phải "trình độ" chung chung)
  competency[]            // Competency chính Journey rèn luyện
  prerequisite[]          // Journey/Capability cần có trước (có thể rỗng)
  estimatedDuration       // tổng thời gian ước tính (tổng hợp từ Mission bên trong)
  difficulty              // Beginner | Intermediate | Advanced | Mixed
  collections[]           // danh sách Collection thuộc Journey — mục 4
  requiredMissions[]      // Mission bắt buộc để coi Journey "hoàn thành" — có thể là tập con của toàn bộ Mission trong Collections
  capabilityRequirement    // ngưỡng Capability để Journey được coi là "đã làm chủ" — mục 9
  completionRequirement    // điều kiện hoàn thành Journey — mục 14
  unlockRules              // điều kiện Journey này được mở — mục 10
  relatedJourney[]         // Journey liên quan (tiếp theo hoặc song song)
  expectedOutcomes[]       // kết quả cụ thể người học đạt được (Output + năng lực)
}
```

---

## 4. Collection Structure

Một Journey có nhiều Collection. Collection **chỉ có nhiệm vụ nhóm
Mission theo chủ đề công việc con** — Collection không phải khóa học, không
có "hoàn thành Collection" riêng biệt tách khỏi Journey.

```
Journey "AI Office"
   ├── Collection "Word"        — Mission liên quan văn bản (Proposal, Email, Báo cáo)
   ├── Collection "Excel"       — Mission liên quan dữ liệu (Dashboard, Phân tích)
   ├── Collection "PowerPoint"  — Mission liên quan trình bày (Slide, Pitch Deck)
   └── Collection "Outlook"     — Mission liên quan giao tiếp email/lịch
```

```
Collection {
  collectionId
  collectionName
  journeyId               // Collection luôn thuộc đúng 1 Journey
  missions[]               // danh sách Mission ID thuộc Collection này
  order?                   // thứ tự gợi ý (không bắt buộc tuyến tính — xem mục 10 Mission Library Standard)
}
```

Nguyên tắc: Collection là **lớp nhóm hiển thị/điều hướng**, không mang
logic Unlock/Capability riêng — mọi logic thật nằm ở tầng Mission và
Journey.

---

## 5. Mission Flow

Luồng chuẩn khi người học đi qua một Mission trong Journey (chi tiết đầy
đủ ở Mission Library Standard mục 5 và Learning Asset Standard mục 2 —
đây là bản rút gọn ở tầng Journey):

```
Mission
   ↓
Learning Asset       // Knowledge + Real Example + Resource
   ↓
Companion Practice   // Companion chia bước, đồng hành
   ↓
Workspace            // thực hiện, chỉnh sửa
   ↓
Output                // kết quả thật
   ↓
Reflection            // tự nhận biết
   ↓
Capability Update      // năng lực được ghi nhận
   ↓
Unlock                 // Mission/Collection/Journey tiếp theo mở ra
```

**Không được kết thúc ở "Hoàn thành bài học."** Mọi Mission Flow trong
Journey phải đi hết tới Unlock — nếu một Mission trong Journey dừng ở
Output mà không có Reflection/Capability Update/Unlock, Mission đó chưa
đạt chuẩn Journey (đối chiếu Quality Checklist ở Learning Asset Standard
mục 17).

---

## 6. Journey Connection (liên kết module — trước Workspace/Companion)

Journey không tồn tại độc lập — phải liên kết xuyên suốt toàn Portal:

```
Học viện AI  →  Thư viện tri thức  →  AI Workspace  →  Companion
     ↓                                                      ↓
     └──────────────────→  Workspace  ←──────────────────────┘
                              ↓
                            Growth
                              ↓
                          Portfolio
                              ↓
                       Journey tiếp theo
```

Không module nào hoạt động độc lập:
- **Học viện AI** giới thiệu Journey/Mission (Discover — Mission Library
  Standard mục 5).
- **Thư viện tri thức** cung cấp Knowledge sâu hơn khi Learning Asset không
  đủ (mục 8 dưới).
- **AI Workspace** cung cấp Prompt/Workflow/Toolbox hỗ trợ Practice.
- **Companion** điều phối xuyên suốt toàn bộ luồng trên (mục 7).
- **Workspace** là nơi hội tụ Output/Version/Reflection (mục 9).
- **Growth** (Growth Event) nuôi Nhật ký/Hành trình/Khu vườn (mục 13).
- **Portfolio** (khái niệm chưa implement — xem audit) là nơi tổng hợp
  Output đã tạo, làm bằng chứng năng lực lâu dài.

---

## 7. Companion Connection (Companion Role trong Journey)

Companion là **người điều phối Journey**, không phải người dạy thay hay
làm thay:

- Giới thiệu Journey (khi nào nên bắt đầu Journey nào, dựa trên
  targetUser/mục tiêu người học nêu ra).
- Gợi ý Mission tiếp theo trong Journey (không ép thứ tự cứng).
- Chia nhỏ mục tiêu Journey thành Mission cụ thể, dễ bắt đầu.
- Nhắc thực hành (khi người học dừng giữa chừng một Mission).
- Review Output (theo Review Standard, Learning Asset Standard mục 11).
- Đồng hành Reflection (đặt câu hỏi, không đánh giá).
- Gợi ý Journey tiếp theo khi Journey hiện tại đạt Completion Requirement
  (mục 14).

Companion **không làm thay** người học ở bất kỳ bước nào của Journey —
vai trò của Companion luôn là điều phối/hỗ trợ, nhất quán với Companion
Standard ở Learning Asset Standard mục 8.

---

## 8. Knowledge Connection (Thư viện tri thức trong Journey)

Learning Asset **không chứa toàn bộ kiến thức** — Asset chỉ chứa Knowledge
ngắn, đủ dùng (Knowledge Standard, Learning Asset Standard mục 4). Khi
người học cần hiểu sâu hơn:

```
Learning Asset (Knowledge ngắn)
      ↓  cần hiểu sâu hơn
Companion dẫn sang Thư viện tri thức
      ↓  đọc Framework/Case Study/SOP đầy đủ
Quay lại Workspace
      ↓  làm tiếp Practice/Output với kiến thức vừa bổ sung
```

Nguyên tắc: đây là quan hệ **N–N, không phải nhúng nội dung trùng lặp** —
một Knowledge Asset trong Thư viện tri thức có thể được nhiều Learning
Asset/Mission tham chiếu tới làm nguồn đọc sâu, không copy nội dung vào
từng Mission.

---

## 9. Capability Mapping (Capability Connection)

Mỗi Journey phải map tới AI Competency — dùng chung thang đo với Mission
Library Standard (mục 9) và Learning Asset Standard (mục 13):
`Introduced → Practiced → Applied → Mastered`.

```
Journey "Word" (trong AI Office)
   → competency = ["AI Office", "Prompt Engineering",
                    "Communication", "Business Writing"]
   → capabilityRequirement:
       tất cả competency trên đạt tối thiểu "Applied"
       để Journey được coi là "đã làm chủ"
```

Nguyên tắc: `capabilityRequirement` ở tầng Journey là **ngưỡng tổng hợp**
từ Capability Update của từng Mission bên trong — không phải một bài kiểm
tra riêng ở cuối Journey.

---

## 10. Unlock Rules

Unlock **không theo Video đã xem** — theo **Output thật, Capability,
Reflection, Mission Completed** (nhất quán với Mission Library Standard
mục 6 và Learning Asset Standard mục 14), áp dụng ở cả 3 cấp: Mission →
Collection → Journey.

```
Ví dụ (Mission cấp thấp nhất):
  "Proposal cơ bản" hoàn thành (có Output + Reflection)
      ↓ unlock
  "Proposal nâng cao" mở ra
  (KHÔNG phải vì đã xem xong Video giới thiệu Proposal nâng cao)

Ví dụ (Journey cấp cao nhất):
  Journey "AI Office" đạt Completion Requirement (mục 14)
      ↓ unlock
  Journey liên quan (vd "AI Business") được gợi ý mở, dựa trên
  relatedJourney + Capability đã đạt
```

Unlock ở tầng Journey luôn dùng cơ chế điều kiện linh hoạt giống Mission
(`requiresMission`/`requiresCapability`/`requiresAny`/`requiresAll`) —
không có logic Unlock riêng biệt cho Journey ngoài việc điều kiện có thể
tham chiếu tới nhiều Mission/Collection cùng lúc thay vì chỉ 1 Mission.

---

## 11. Growth Integration (Growth Connection)

```
Mission hoàn thành
      ↓
Growth Event (vd MISSION_COMPLETED, OUTPUT_CREATED)
      ↓  (một Event, nhiều nơi cùng đọc — không phát riêng cho từng nơi)
      ├── Nhật ký học tập     (hiển thị Output/Mission mới hoàn thành theo dòng thời gian)
      ├── Hành trình của tôi   (cập nhật vị trí trong Journey, Capability đạt được)
      ├── Khu vườn của bạn      (số liệu trưởng thành thật thay số liệu tĩnh)
      └── Dashboard Workspace   (đếm Output theo loại — bài thực hành/Banner/Landing Page...)
```

Nguyên tắc: **một Growth Event, nhiều nơi tiêu thụ** — không thiết kế một
Event riêng cho mỗi màn hình hiển thị. Đây chính là cách vá gap đã ghi nhận
ở `docs/SMART_AI_CURRICULUM_AUDIT.md` (Growth Event hiện chỉ được ghi,
không ai đọc) — khi implement, 4 nơi trên đọc chung một luồng Event.

---

## 12. Journey Completion

Journey chỉ hoàn thành khi đạt **đủ tất cả**, không dùng Quiz:

- ✔ Required Mission — đã hoàn thành đủ Mission bắt buộc trong
  `requiredMissions`.
- ✔ Required Output — mỗi Mission bắt buộc đã có Output thật tương ứng.
- ✔ Reflection — mỗi Mission bắt buộc đã có Reflection.
- ✔ Capability — đạt `capabilityRequirement` (mục 9).
- ✔ Workspace — Output đã được lưu trong Workspace (không chỉ hiển thị
  rồi mất).
- ✔ Growth Event — các Mission Completed Event tương ứng đã được ghi
  nhận.

Thiếu bất kỳ điều kiện nào — Journey ở trạng thái "đang đi," không được
coi là hoàn thành, bất kể người học đã "xem" bao nhiêu nội dung.

---

## 13. Data Model

```
Journey {
  journeyId, journeyName, description, businessGoal, targetUser
  competency[], prerequisite[], estimatedDuration, difficulty
  collections[]            // Collection ID[]
  requiredMissions[]        // Mission ID[]
  capabilityRequirement      // { competency, minLevel }[]
  completionRequirement       // theo mục 12
  unlockRules                 // theo mục 10
  relatedJourney[]
  expectedOutcomes[]
}

Collection {
  collectionId, collectionName, journeyId, missions[], order?
}

Mission {
  // đầy đủ tại docs/MISSION_LIBRARY_STANDARD.md mục 3
  missionId, missionName, missionCategory, competency[], difficulty,
  estimatedTime, prerequisite[], expectedOutput, workspaceType,
  relatedLearningJourney[], unlockCondition, capabilityMapping,
  reflectionQuestions[], aiImpactMetrics[], growthEventType
}

Asset (LearningAsset) {
  // đầy đủ tại docs/LEARNING_ASSET_STANDARD.md mục 15
  assetId, missionId, journeyId[], competencyId[], goal, businessValue,
  knowledge, realExample, resources{}, practice{}, workspaceType,
  outputType, reviewRules, reflectionQuestions[], capabilityMapping,
  unlockRules, growthEvents[], status, version
}

Workspace {
  workspaceId, missionId, assetId, userId
  context            // module/source/itemId/itemType/expectedOutput (đã có — companion-workspace.ts)
  outputs[]           // danh sách Output + Version — hiện CHƯA có, là gap cần bổ sung
}

Output {
  outputId, workspaceId, outputType, outputFormat, content/fileRef
  version, createdAt
  reviewedBy: "Companion", reviewResult  // theo Review Standard
}

Reflection {
  reflectionId, missionId/assetId, question, answer, createdAt
}

Capability {
  competencyId, userId, practiceLevel   // Introduced|Practiced|Applied|Mastered
  contributingMissions[]                 // Mission đã đóng góp vào mức hiện tại
}

Unlock {
  unlockedEntityId    // Mission|Collection|Journey ID được mở
  unlockedEntityType
  condition            // điều kiện đã thoả (tham chiếu mục 10)
  unlockedAt
}

GrowthEvent {
  eventType    // MISSION_COMPLETED | OUTPUT_CREATED | REFLECTION_SUBMITTED
               // | JOURNEY_COMPLETED | CAPABILITY_UPDATED | ... (mở rộng được)
  userId, missionId?, journeyId?, payload, timestamp
}
```

Ghi chú tương thích với hệ thống hiện có: `Journey`/`Collection` ánh xạ
trực tiếp từ `LearningJourney`/CKOS `KnowledgeCollection` đã tồn tại
(`src/features/academy/services/journey.service.ts`,
`src/features/knowledge/data/knowledge-collections.ts`) — không cần cấu
trúc mới hoàn toàn, chỉ cần bổ sung field còn thiếu (`businessGoal`,
`capabilityRequirement`, `completionRequirement`, `unlockRules` tường
minh) đúng như gap đã nêu ở `docs/SMART_AI_CURRICULUM_AUDIT.md`.

---

## 14. Examples

5 Journey mẫu minh họa cấu trúc — **không cần đầy đủ Mission**, chỉ để làm
rõ hình dạng Journey/Collection theo chuẩn trên.

### Journey 1 — AI Office

```
Journey {
  journeyId: "journey-ai-office"
  journeyName: "AI Office"
  businessGoal: "Làm được công việc văn phòng hàng ngày nhanh và chuyên nghiệp hơn bằng AI"
  targetUser: "Nhân viên văn phòng, người mới bắt đầu dùng AI trong công việc"
  competency: ["AI Office", "Prompt Engineering", "Business Writing"]
  collections: ["Word", "Excel", "PowerPoint", "Outlook"]
  requiredMissions: ["viet-email-chuyen-nghiep", "viet-proposal-khach-hang", "dashboard-co-ban"]
  capabilityRequirement: [{ competency: "AI Office", minLevel: "Applied" }]
  relatedJourney: ["journey-ai-business"]
  expectedOutcomes: ["Có ít nhất 1 Proposal, 1 Dashboard, 1 chuỗi Email thật đã tạo bằng AI"]
}
```

### Journey 2 — AI Content

```
Journey {
  journeyId: "journey-ai-content"
  journeyName: "AI Content"
  businessGoal: "Tạo nội dung (bài viết, caption, kịch bản) nhất quán và nhanh hơn bằng AI"
  targetUser: "Người làm nội dung, content creator, chủ shop online"
  competency: ["AI Writing", "Content Strategy"]
  collections: ["Blog & SEO", "Social Content", "Video Script"]
  relatedJourney: ["journey-ai-marketing"]
  expectedOutcomes: ["Có ít nhất 1 bài Blog, 1 bộ caption, 1 kịch bản Video thật"]
}
```

### Journey 3 — AI Marketing

```
Journey {
  journeyId: "journey-ai-marketing"
  journeyName: "AI Marketing"
  businessGoal: "Xây dựng và triển khai kế hoạch marketing thật bằng AI"
  targetUser: "Marketer, chủ doanh nghiệp nhỏ"
  competency: ["AI Marketing", "Strategy", "Data Analysis"]
  collections: ["Market Research", "Campaign Planning", "Ads & Content"]
  prerequisite: ["journey-ai-content"]
  relatedJourney: ["journey-ai-sales"]
  expectedOutcomes: ["Có 1 kế hoạch Marketing quý thật, 1 bộ nội dung Campaign thật"]
}
```

### Journey 4 — AI Research

```
Journey {
  journeyId: "journey-ai-research"
  journeyName: "AI Research"
  businessGoal: "Nghiên cứu, tổng hợp thông tin đáng tin cậy nhanh hơn bằng AI"
  targetUser: "Người cần nghiên cứu thị trường/đối thủ/tài liệu học thuật"
  competency: ["AI Research", "Critical Thinking"]
  collections: ["Market Research", "Document Synthesis", "Competitive Analysis"]
  relatedJourney: ["journey-ai-marketing", "journey-ai-business"]
  expectedOutcomes: ["Có ít nhất 1 báo cáo nghiên cứu thật, có trích dẫn nguồn rõ ràng"]
}
```

### Journey 5 — AI Affiliate

```
Journey {
  journeyId: "journey-ai-affiliate"
  journeyName: "AI Affiliate"
  businessGoal: "Xây hệ thống Affiliate thật, có thu nhập đo được, dùng AI hỗ trợ toàn bộ quy trình"
  targetUser: "Người muốn kiếm thu nhập online qua Affiliate"
  competency: ["AI Marketing", "AI Writing", "Business Strategy"]
  collections: ["Chọn ngách & sản phẩm", "Xây nội dung", "Xây hệ thống & Automation"]
  prerequisite: ["journey-ai-content"]
  relatedJourney: ["journey-ai-marketing"]
  expectedOutcomes: ["Có 1 hệ thống Affiliate thật đang chạy (trang/landing page + nội dung + workflow)"]
}
```

---

## 15. Future Expansion Strategy

Mục tiêu: mở rộng tới **100+ Journey, 1000+ Mission, 10000+ Learning
Asset** mà không cần thay đổi kiến trúc ở trên.

1. **Journey mới = chỉ thêm bản ghi Journey**, tham chiếu Collection/Mission
   đã có hoặc mới — không đổi schema.
2. **Collection là lớp nhóm rẻ để tạo** — thêm Collection mới trong một
   Journey không ảnh hưởng Journey khác.
3. **Mission dùng chung nhiều Journey** (quan hệ N–N qua
   `relatedLearningJourney`) — một Mission tốt (vd "Viết Email chuyên
   nghiệp") có thể xuất hiện ở cả Journey "AI Office" và "AI Personal
   Productivity" mà không cần nhân bản nội dung.
4. **Competency là danh mục mở** — thêm Competency mới không phá vỡ
   `capabilityRequirement` của Journey đã có.
5. **Unlock Rules dùng biểu thức điều kiện chung** — mở rộng số lượng
   Mission/Journey không cần thêm loại điều kiện mới, chỉ thêm tham chiếu
   ID mới vào `requiresMission`/`requiresAny`/`requiresAll`.
6. **Growth Event là danh mục mở** — thêm `eventType` mới (khi có nhu cầu
   đo thêm) không phá vỡ 4 nơi tiêu thụ hiện có (mục 11) vì chúng đọc theo
   loại Event, không đọc theo cấu trúc cứng.
7. **Không cần migration lớn khi mở rộng** — toàn bộ quan hệ đều N–N hoặc
   tham chiếu ID, giống nguyên tắc mở rộng ở Mission Library Standard mục
   12; Journey Standard chỉ thêm một tầng gộp phía trên, không thêm ràng
   buộc cứng nào.

---

Tài liệu này hoàn thiện bộ 3 chuẩn kiến trúc nội dung (Learning OS
Principle → Learning Journey Standard → Mission Library Standard →
Learning Asset Standard). Bước tiếp theo (ngoài phạm vi task A3) là áp
dụng cả bộ 3 để tổ chức lại nội dung CKOS hiện có (2 Collection thật, 80
Knowledge Asset, phần lớn chưa gắn Collection — xem
`docs/SMART_AI_CURRICULUM_AUDIT.md`) thành Journey/Mission/Asset hoàn
chỉnh đầu tiên.
