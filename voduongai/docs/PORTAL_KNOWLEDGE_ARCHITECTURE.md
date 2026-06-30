# PORTAL KNOWLEDGE ARCHITECTURE™

> "Portal không còn là tập hợp các trang. Portal trở thành một cây tri thức để người dùng dễ đi, Admin dễ nhập và Companion dễ hiểu."

---

## I. Tuyên bố

VO DUONG AI Portal được tổ chức theo **Knowledge Architecture** — không phải theo tính năng, không phải theo module kỹ thuật.

Mỗi piece of content trong Portal là một **Knowledge Object** với:
- schema chuẩn
- layout chuẩn
- role rõ ràng
- metadata để Companion đọc hiểu

---

## II. Ba Hành trình

Portal được thiết kế theo **3 hành trình người dùng**:

```
🌱 Học hỏi        →  Tiếp nhận tri thức, công cụ, tài nguyên
🚀 Xây dựng       →  Áp dụng, tạo ra giá trị, mở rộng
🌟 Trưởng thành   →  Phát triển bền vững cùng Companion
```

---

## III. Menu Chính

```
🏠 Trang chủ                    /portal

🌱 HỌC HỎI
   └── Không gian AI            /portal/tools
   └── Thư viện tri thức        /portal/library
   └── Nhật ký học tập          /portal/news

🚀 XÂY DỰNG
   └── Học viện                 /portal/academy
   └── Dự án & Cơ hội          /portal/opportunities
   └── Cộng đồng                /portal/community

🌟 TRƯỞNG THÀNH
   └── Companion                /portal/companion
   └── Hành trình của tôi       /portal/journey
```

### Nguồn sự thật duy nhất

Menu được định nghĩa tại: `src/lib/portal/hubs.ts` → `portalNavSections`

`site.ts` → `portalNavGroups` proxies trực tiếp từ `portalNavSections`.

`PortalSidebar.tsx` render từ `portalNavGroups`. Không component con nào được thêm item vào sidebar.

---

## IV. Vai trò từng mục

### 🏠 Trang chủ
- Điểm khởi đầu mỗi ngày
- Điều hướng thông minh
- Companion presence
- Tiếp tục hành trình
- **Không phải** nơi lưu nội dung chính

### 🌱 Không gian AI
- Trung tâm công cụ AI (AI Chat, Image, Video, Coding, Automation)
- Thư viện Prompt
- Mỗi công cụ dùng **AI Tool Object**
- **Không phải** blog, **không phải** thư viện PDF

### 🌱 Thư viện tri thức
- Kho tài nguyên: Prompt, Checklist, SOP, Template, Framework, PDF
- Mỗi tài nguyên dùng **Resource Object**
- **Không phải** bài viết

### 🌱 Nhật ký học tập
- Kho bài viết: AI, Affiliate, Marketing, Kinh doanh, Tư duy, Hướng dẫn
- Cập nhật thường xuyên
- Mỗi bài dùng **Article Object**
- **Không phải** trang dự án

### 🚀 Học viện
- Khóa học, workshop, mentoring, chương trình đào tạo
- Mỗi khóa dùng **Course Object**

### 🚀 Dự án & Cơ hội
- Research Center — người dùng hiểu trước, tin sau, rồi quyết định
- DigiU, SolarGroup, Blockchain, Crypto, Trading, dự án mới
- Mỗi dự án dùng **Project Object**
- Cơ hội **luôn đặt sau** phần kiến thức và FAQ
- **Không biến thành trang bán hàng**

### 🚀 Cộng đồng
- Kết nối người dùng: nhóm, sự kiện, webinar, offline
- Mỗi cộng đồng dùng **Community Object**

### 🌟 Companion
- Ngôi nhà tri thức của Companion
- Triết lý, Genome, Doctrine, Methods, Civilization Laws, Journey, Legacy Seeds
- **Không phải** trang chat
- Mỗi section dùng **Companion Knowledge Object**

### 🌟 Hành trình của tôi
- Không gian cá nhân
- Hồ sơ, tiến trình học, tài nguyên đã lưu, Legacy Seeds, lịch sử học tập
- Dùng **User Journey Object**

---

## V. 8 Knowledge Object Types

Tất cả nội dung Portal được chuẩn hóa thành 8 loại Object.
Schema đầy đủ tại: `src/lib/portal/knowledge/types.ts`

### 1. AI Tool Object
```
General:  tên, slug, logo, mô tả ngắn, category, website, trạng thái
Guide:    giới thiệu, dùng để làm gì, khi nào nên dùng, ưu điểm, hạn chế
Examples: ví dụ, use cases, prompt mẫu
FAQ:      câu hỏi thường gặp
Related:  bài viết / tài nguyên / công cụ liên quan
SEO
```
**Layout:** Hero → Overview → Guide → Examples → FAQ → Related

### 2. Resource Object
```
General:  tên, loại (Prompt/Checklist/SOP/Template/Framework/PDF), mô tả, cấp độ, chủ đề
Content:  nội dung chính, file đính kèm, hướng dẫn sử dụng
Access:   miễn phí / cần đăng nhập / premium
Related
SEO
```
**Layout:** Hero → Summary → Content/File → How to Use → Related

### 3. Article Object
```
General:  tiêu đề, slug, thumbnail, danh mục, tags, tác giả, ngày xuất bản
Content:  tóm tắt, nội dung chính, key takeaways, CTA cuối bài
Related
SEO
```
**Layout:** Hero → Summary → Content → Key Takeaways → Resources → Related → CTA

### 4. Course Object
```
General:      tên, thumbnail, mô tả, cấp độ
Introduction: dành cho ai, học xong làm được gì, kết quả mong đợi
Curriculum:   modules, bài học, thời lượng
Instructor:   giảng viên, mô tả, ảnh
FAQ
CTA:          đăng ký, liên hệ, link thanh toán
SEO
```
**Layout:** Hero → Who It's For → Outcomes → Curriculum → Instructor → FAQ → CTA

### 5. Project / Opportunity Object
```
General:      tên, logo, banner, màu chủ đạo, website, trạng thái, disclaimer
Introduction: là gì, giải quyết gì, tầm nhìn, giá trị, điểm nổi bật
Ecosystem:    sản phẩm / thành phần
Products:     danh sách dự án thành phần
Resources:    PDF, video, roadmap, whitepaper
FAQ
Articles:     bài viết liên quan
Opportunity:  điều kiện, rủi ro, affiliate link, CTA
Links:        website, Telegram, Facebook, YouTube, Discord, Github
SEO
```
**Layout:** Hero → Introduction → Ecosystem → Products → Resources → FAQ → Articles → Opportunity → Links → CTA

⚠️ **Cơ hội luôn đặt CUỐI — sau kiến thức, tài liệu và FAQ.**

### 6. Community Object
```
General:      tên, mô tả, nền tảng, link tham gia
Introduction: dành cho ai, lợi ích nhận được
Rules:        nội quy, cách tham gia
Events:       webinar, offline, lịch sự kiện
FAQ
SEO
```
**Layout:** Hero → Introduction → Groups → Events → Rules → FAQ → Join

### 7. Companion Knowledge Object
```
section:      who_is_companion | philosophy | purpose | doctrine | genome |
              genome_council | methods | civilization_laws | journey |
              thoughts | book_notes | legacy_seeds | language_constitution
title, summary, content (LocalizedField)
docPath:      đường dẫn đến file .md nguồn
related
companionIndex
```
**Layout:** Hero → Table of Contents → Philosophy → Genome → Methods → Journey → Thoughts → Legacy

### 8. User Journey Object
```
memberId
profile:          fullName, dateOfBirth, goals
savedItems:       list RelatedRef
readArticles:     list id
watchedProjects:  list id
legacySeeds:      list { type, note, date }
learningHistory:  list { objectId, objectType, completedAt }
```

---

## VI. CompanionIndex — Metadata cho Companion

Mỗi Knowledge Object có thể đính kèm `CompanionIndex` để Companion hiểu.
Schema đầy đủ tại: `src/lib/portal/knowledge/companion-index.ts`

```typescript
CompanionIndex {
  knowledgeType:     tool_guide | reference | tutorial | concept | case_study |
                     opportunity | community | personal_space | companion_doc
  category:          ai_workspace | knowledge_library | learning_journal |
                     academy | projects_opportunities | community | companion | my_journey
  topics:            string[]
  targetAudience:    string
  level:             beginner | intermediate | advanced | all
  difficulty:        easy | medium | hard
  relatedObjects:    [{ id, type, reason }]
  recommendedPath:   [{ step, label, href, objectType }]
  summaryForCompanion: string   // "Đây là..." — Companion dùng khi giới thiệu
  sourceType:        internal | external | community | founder
  lastUpdated:       string
  trustLevel:        verified | curated | user_generated | external
  language:          vi | en
  companionNotes:    string     // ghi chú đặc biệt (ví dụ: "trình bày rủi ro trước")
}
```

### Companion có thể trả lời

Với CompanionIndex đầy đủ, Companion có thể:
- "Mục này là gì?" → `summaryForCompanion`
- "Dùng cho ai?" → `targetAudience` + `level`
- "Nên đọc phần nào trước?" → `recommendedPath`
- "Tài liệu nào liên quan?" → `relatedObjects`
- "Cơ hội nằm ở đâu?" → `knowledgeType: "opportunity"`
- "Rủi ro nằm ở đâu?" → `companionNotes`

---

## VII. Internal Links

Mỗi Object phải có `related` — không để nội dung đứng một mình.

```
AI Tool    → Article (hướng dẫn dùng) / Resource (prompt mẫu)
Article    → AI Tool / Course / Resource
Project    → Article / Resource / Opportunity
Course     → Article / Resource
Companion  → Journey / Legacy / Language / Methods
```

**Quy tắc:** Nếu một Object không có relatedObjects → đó là nội dung cô lập → xem lại.

---

## VIII. i18n Foundation

Mọi content field dùng `LocalizedField<T>`:

```typescript
title:       { vi: string; en?: string }
description: { vi: string; en?: string }
summary:     { vi: string; en?: string }
content:     { vi: string; en?: string }
```

**Fallback policy:** nếu thiếu `en` → trả về `vi`. Không crash, không undefined.

Xem: `src/lib/i18n/content-model.ts`, `docs/PORTAL_MULTILINGUAL_FOUNDATION.md`

---

## IX. Admin UX — Nguyên tắc

Admin **không thiết kế trang**. Admin **điền form theo Object**.

```
Muốn thêm công cụ AI    → chọn AI Tool Object
Muốn thêm tài nguyên    → chọn Resource Object
Muốn viết bài           → chọn Article Object
Muốn thêm dự án         → chọn Project / Opportunity Object
Muốn thêm khóa học      → chọn Course Object
```

**Nguyên tắc form:**
- Nhóm fields theo schema (General / Guide / Examples / FAQ / Related / SEO)
- Dùng tab hoặc accordion theo nhóm
- Có trạng thái `draft` / `published`
- Không bắt buộc điền tất cả field ngay
- Field quan trọng có placeholder / tooltip gợi ý
- English fields có nhưng không bắt buộc

---

## X. Architecture Debt

Những việc đã định nghĩa schema nhưng chưa build UI:

| Debt | Mức | Ghi chú |
|---|---|---|
| Admin forms theo Object type | MEDIUM | Schema có rồi, form chưa build |
| Frontend layouts per Object | MEDIUM | Spec có rồi, component chưa build |
| Companion Knowledge page đầy đủ | LOW | Page tối giản đã có |
| Nhật ký học tập category filter | LOW | Route có, category filter chưa có |
| Project Object cho DigiU/SolarGroup | MEDIUM | Schema có, data chưa migrate |
| CompanionIndex cho existing content | LOW | Schema có, chưa annotate content cũ |
| Internal link graph | LOW | Defined, chưa implement |

---

## XI. Genome Review

### 1. Purpose Alignment
**Câu hỏi:** Architecture này phục vụ ai?
**Verdict:** Ba nhóm: người dùng (dễ đi), Admin (dễ nhập), Companion (dễ hiểu). Tất cả đều được phục vụ.

### 2. Overbuild Check
**Câu hỏi:** Có gì thừa không?
**Verdict:** Schema là type-only — không tăng bundle size. Menu là data thay đổi — không break routes. Companion page là minimal — không overbuild.

### 3. 10-Year Question
**Câu hỏi:** Nếu 10 năm sau Portal có 1000 pieces of content — kiến trúc này có còn đứng không?
**Verdict:** Có. 8 Object types đủ để classify bất kỳ nội dung nào. CompanionIndex đủ để Companion hiểu bất kỳ object nào.

### 4. Human Question
**Câu hỏi:** Architecture này coi người dùng như người trưởng thành không?
**Verdict:** Có. 3 hành trình rõ ràng — người dùng biết mình đang ở đâu và đang đi đâu.

---

**Genome Verdict: PASS**
**Genome Debt:** Xem bảng Architecture Debt ở trên (Section X).
**Genome Recommendation:** Sprint tiếp theo ưu tiên giải Debt MEDIUM: Admin forms và Project Object cho DigiU/SolarGroup.

---

*Established: 2026-06-30*
*Status: ACTIVE*
*Authority: Portal Knowledge Architecture Sprint*
