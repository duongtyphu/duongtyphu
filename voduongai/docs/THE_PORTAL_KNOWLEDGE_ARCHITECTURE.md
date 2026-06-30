# THE PORTAL KNOWLEDGE ARCHITECTURE

**Phiên bản:** 1.0  
**Ngày cập nhật:** 2026-06-30  
**Sprint:** Portal Information Architecture  
**Trạng thái:** Tài liệu chính thức

---

## Mục lục

1. [Triết lý Portal](#1-triết-lý-portal)
2. [Triết lý Menu](#2-triết-lý-menu)
3. [Knowledge Objects — 8 Loại Đối Tượng Tri Thức](#3-knowledge-objects--8-loại-đối-tượng-tri-thức)
4. [Lộ Trình Học Tập (User Journey)](#4-lộ-trình-học-tập-user-journey)
5. [Admin CMS — Quản Trị Dựa Trên Schema](#5-admin-cms--quản-trị-dựa-trên-schema)
6. [Companion Knowledge Index](#6-companion-knowledge-index)
7. [Companion Guide](#7-companion-guide)
8. [Internal Linking — Liên Kết Nội Bộ](#8-internal-linking--liên-kết-nội-bộ)
9. [Các Tầng Kiến Trúc Thông Tin](#9-các-tầng-kiến-trúc-thông-tin)
10. [Definition of Done](#10-definition-of-done)

---

## 1. Triết Lý Portal

### Portal không còn là website

Portal không phải là tập hợp các trang web. Portal là một **Knowledge Operating System** — hệ thống vận hành tri thức. Mỗi nội dung xuất hiện trên Portal không chỉ tồn tại để hiển thị, mà tồn tại để phục vụ một vai trò cụ thể trong toàn bộ hệ sinh thái học tập.

### Nguyên tắc nền tảng

Mọi nội dung trên Portal đều phải có đầy đủ 6 yếu tố sau:

| Yếu tố | Ý nghĩa |
|--------|---------|
| **Vai trò** | Nội dung này là gì trong hệ thống? (Tool, Article, Course, ...) |
| **Mục đích** | Nội dung này giải quyết vấn đề gì cho người dùng? |
| **Lộ trình** | Nội dung này nằm ở đâu trong hành trình học tập? |
| **Schema** | Cấu trúc dữ liệu được định nghĩa trước, không tùy biến tự do |
| **Liên kết** | Nội dung này dẫn đến đâu tiếp theo? Đến từ đâu? |
| **Metadata** | Thông tin phụ trợ để Companion hiểu và điều hướng |

### Ba nhóm người dùng cần phục vụ

Portal được thiết kế để phục vụ đồng thời ba nhóm người dùng, với mức độ ưu tiên bằng nhau:

**User — Người học**  
Trải nghiệm phải dễ hiểu, không bao giờ bị lạc. Người dùng luôn biết mình đang ở đâu, đã học gì, và nên làm gì tiếp theo.

**Admin — Người quản trị**  
Việc tạo và cập nhật nội dung phải nhanh, có hệ thống, không cần kỹ năng thiết kế. Admin tạo Object theo schema, không thiết kế trang.

**Companion — Trợ lý AI của Portal**  
Companion cần hiểu toàn bộ Portal để đưa ra điều hướng chính xác, phù hợp ngữ cảnh. Mọi Object đều phải có metadata đủ để Companion đọc và sử dụng.

---

## 2. Triết Lý Menu

### Ba hành trình người dùng

Menu của Portal được tổ chức theo ba hành trình lớn, phản ánh vòng đời phát triển của một người học AI:

---

### Hành trình 1: Học hỏi

> Người dùng bắt đầu khám phá AI, tích lũy kiến thức, và ghi lại quá trình học.

Bao gồm:
- **Không gian AI** — Khám phá các công cụ AI theo danh mục
- **Thư viện tri thức** — Kho tài nguyên: Prompt, Checklist, SOP, Template, Ebook
- **Nhật ký học tập** — Bài viết chia sẻ kinh nghiệm, bài học thực tế

---

### Hành trình 2: Xây dựng

> Người dùng áp dụng kiến thức vào thực tế, xây dựng năng lực, kết nối với cộng đồng.

Bao gồm:
- **Học viện** — Khóa học có cấu trúc, lộ trình rõ ràng
- **Dự án & Cơ hội** — Theo dõi hệ sinh thái AI, cơ hội ứng dụng thực tế
- **Cộng đồng** — Kết nối với học viên khác, chia sẻ và cùng phát triển

---

### Hành trình 3: Trưởng thành

> Người dùng có hệ thống học tập cá nhân hóa, được hỗ trợ bởi Companion.

Bao gồm:
- **Companion** — Trợ lý AI hiểu toàn bộ Portal và hành trình cá nhân
- **Hành trình của tôi** — Dashboard cá nhân: đã học gì, đang ở đâu, nên làm gì tiếp

---

### Quy tắc về Menu

**Không thêm mục menu mới nếu không có lý do kiến trúc rõ ràng.**

Trước khi thêm bất kỳ mục menu nào, phải trả lời được ba câu hỏi:

1. Mục này thuộc hành trình nào trong ba hành trình trên?
2. Người dùng sẽ đến đây từ đâu và đi tiếp đến đâu?
3. Nội dung trong mục này thuộc Knowledge Object loại nào?

Nếu không trả lời được, không thêm menu.

---

## 3. Knowledge Objects — 8 Loại Đối Tượng Tri Thức

Toàn bộ nội dung trên Portal được phân loại thành 8 loại Knowledge Object. Mỗi loại có schema riêng, layout riêng, và vai trò riêng trong hệ thống.

---

### 3.1 AiToolObject — Công Cụ AI

**Định nghĩa:** Đại diện cho một công cụ AI cụ thể (chatbot, image generator, code assistant, ...).

**Vai trò trong hệ thống:** Điểm khởi đầu của hành trình khám phá. Người dùng thường gặp công cụ AI trước khi tìm đến bài viết hay khóa học.

**Các trường schema chính:**
- Tên công cụ, nhà phát triển, link chính thức
- Danh mục AI (Chat, Image, Code, Voice, Video, ...)
- Tính năng nổi bật, giới hạn, giá
- Mức độ phù hợp (Người mới / Trung cấp / Nâng cao)
- CompanionIndex, companionSummary
- Liên kết đến: ResourceObject, ArticleObject, CourseObject liên quan

**Layout chuẩn:** Hero + Mô tả + Tính năng + Hướng dẫn bắt đầu + Tài nguyên liên quan + Bước tiếp theo

---

### 3.2 ResourceObject — Tài Nguyên Thực Hành

**Định nghĩa:** Tài nguyên có thể tải xuống hoặc sử dụng trực tiếp: Prompt, Checklist, SOP, Template, PDF, Ebook.

**Vai trò trong hệ thống:** Cầu nối giữa lý thuyết và thực hành. Người dùng đọc bài viết, sau đó dùng tài nguyên để áp dụng ngay.

**Các trường schema chính:**
- Tiêu đề, loại tài nguyên (Prompt / Checklist / SOP / Template / PDF / Ebook)
- Mô tả ngắn, trường hợp sử dụng
- File đính kèm hoặc nội dung nhúng
- Ngành / lĩnh vực áp dụng
- CompanionIndex, companionSummary
- Liên kết đến: AiToolObject, ArticleObject, CourseObject liên quan

---

### 3.3 ArticleObject — Bài Viết Nhật Ký Học Tập

**Định nghĩa:** Bài viết chia sẻ kiến thức, kinh nghiệm, bài học thực tế về AI.

**Vai trò trong hệ thống:** Tạo chiều sâu cho từng chủ đề. Bài viết giải thích ngữ cảnh, chia sẻ góc nhìn, kể câu chuyện ứng dụng thực tế.

**Các trường schema chính:**
- Tiêu đề, tác giả, ngày xuất bản
- Danh mục, thẻ chủ đề
- Nội dung chính (rich text)
- Tóm tắt cho Companion (companionSummary)
- CompanionIndex
- Liên kết pillar post, bài cùng chủ đề, trang khóa học liên quan

**Lưu ý:** Mỗi ArticleObject phải tuân theo quy tắc internal linking (xem Mục 8).

---

### 3.4 CourseObject — Khóa Học

**Định nghĩa:** Khóa học có cấu trúc bài bản trong Học viện.

**Vai trò trong hệ thống:** Tạo lộ trình học tập có hệ thống. Khóa học chuyển hóa kiến thức rời rạc thành năng lực có thể ứng dụng.

**Các trường schema chính:**
- Tên khóa học, giảng viên, thời lượng
- Cấp độ, đối tượng phù hợp
- Danh sách bài học (modules + lessons)
- Kết quả đầu ra (learning outcomes)
- Link đăng ký, giá
- CompanionIndex, companionSummary
- Liên kết đến: AiToolObject, ResourceObject, ProjectObject liên quan

---

### 3.5 ProjectObject — Dự Án & Hệ Sinh Thái

**Định nghĩa:** Dự án AI đang theo dõi hoặc hệ sinh thái AI đáng chú ý.

**Vai trò trong hệ thống:** Kết nối người học với thực tế ngành AI đang diễn ra. Giúp người dùng không chỉ học lý thuyết mà còn hiểu bức tranh toàn cảnh.

**Các trường schema chính:**
- Tên dự án / hệ sinh thái, mô tả
- Trạng thái (Đang phát triển / Ra mắt / Ổn định)
- Cơ hội liên quan (việc làm, hợp tác, đầu tư)
- Nguồn tham khảo, link theo dõi
- CompanionIndex, companionSummary
- Liên kết đến: CourseObject, CommunityObject liên quan

---

### 3.6 CommunityObject — Cộng Đồng Học Viên

**Định nghĩa:** Không gian cộng đồng: nhóm học tập, diễn đàn, sự kiện, buổi chia sẻ.

**Vai trò trong hệ thống:** Duy trì sự gắn kết lâu dài. Học viên không chỉ học một mình mà có cộng đồng đồng hành.

**Các trường schema chính:**
- Tên nhóm / sự kiện, mô tả
- Loại cộng đồng (Nhóm học tập / Sự kiện / Diễn đàn)
- Lịch hoạt động, link tham gia
- CompanionIndex, companionSummary
- Liên kết đến: CourseObject, UserJourneyObject liên quan

---

### 3.7 CompanionKnowledgeObject — Tri Thức Về Companion

**Định nghĩa:** Tài liệu, hướng dẫn, và tri thức về cách Companion hoạt động và cách sử dụng Companion hiệu quả.

**Vai trò trong hệ thống:** Giúp người dùng khai thác tối đa khả năng của Companion. Đây là nội dung nền tảng cho hành trình Trưởng thành.

**Các trường schema chính:**
- Tiêu đề, loại nội dung (Hướng dẫn / Ví dụ / Best Practice)
- Nội dung chi tiết
- Cấp độ người dùng phù hợp
- CompanionIndex, companionSummary
- Liên kết đến: UserJourneyObject, CourseObject liên quan

---

### 3.8 UserJourneyObject — Hành Trình Cá Nhân

**Định nghĩa:** Hồ sơ hành trình học tập của từng học viên, được cá nhân hóa theo thời gian.

**Vai trò trong hệ thống:** Tạo trải nghiệm cá nhân hóa. Mỗi người dùng có một bản đồ hành trình riêng, Companion có thể đọc để đưa ra gợi ý phù hợp.

**Các trường schema chính:**
- Danh sách Object đã xem, đã hoàn thành
- Mục tiêu học tập, lĩnh vực quan tâm
- Cấp độ hiện tại, điểm tiến độ
- Gợi ý tiếp theo (do Companion cập nhật)
- Lịch sử tương tác với Companion

---

## 4. Lộ Trình Học Tập (User Journey)

### Nguyên tắc: Không bao giờ có điểm kết thúc

Mọi Object trên Portal đều phải có phần **"Tiếp theo bạn nên..."** — một hành động rõ ràng, cụ thể, dẫn người dùng đến bước tiếp theo phù hợp.

Người dùng không bao giờ đọc xong một trang và không biết phải làm gì.

### Lộ trình chuẩn

```
AiToolObject
    → ArticleObject (đọc bài viết về công cụ / chủ đề liên quan)
        → CourseObject (học khóa học có hệ thống)
            → ProjectObject (áp dụng vào dự án thực tế)
                → CommunityObject (kết nối, chia sẻ với cộng đồng)
                    → CompanionKnowledgeObject (làm chủ Companion)
                        → UserJourneyObject (hành trình cá nhân hóa)
```

### Lộ trình theo từng điểm vào

Người dùng có thể vào Portal từ nhiều điểm khác nhau. Mỗi điểm vào đều có lộ trình hợp lý:

| Điểm vào | Bước tiếp theo gợi ý |
|----------|----------------------|
| Tìm kiếm công cụ AI | AiToolObject → ResourceObject → ArticleObject |
| Tìm tài nguyên thực hành | ResourceObject → ArticleObject → CourseObject |
| Đọc bài viết | ArticleObject → CourseObject → CommunityObject |
| Xem khóa học | CourseObject → ProjectObject → CommunityObject |
| Khám phá dự án | ProjectObject → CourseObject → CommunityObject |

### Companion hỗ trợ lộ trình

Companion có thể đọc UserJourneyObject của người dùng và đề xuất bước tiếp theo cá nhân hóa, thay vì lộ trình mặc định. Đây là lý do mọi Object đều cần CompanionIndex đầy đủ.

---

## 5. Admin CMS — Quản Trị Dựa Trên Schema

### Admin tạo Object, không tạo trang

Nguyên tắc cốt lõi của hệ thống quản trị Portal:

> **Admin không bao giờ thiết kế layout. Admin chỉ điền dữ liệu vào schema.**

Layout được định nghĩa cố định bởi Knowledge Architecture. Khi Admin tạo một CourseObject mới, hệ thống tự động render đúng layout của khóa học — Admin không cần biết CSS hay thiết kế.

### Quy trình tạo nội dung

1. Admin chọn loại Object cần tạo (1 trong 8 loại)
2. Hệ thống hiển thị form theo schema của loại đó
3. Admin điền đầy đủ các trường, bao gồm `companionSummary`
4. Hệ thống tự động render trang theo layout chuẩn
5. Admin publish — nội dung xuất hiện trên Portal với đúng vị trí trong kiến trúc

### Các trường bắt buộc cho mọi Object

Dù là loại Object nào, các trường sau đều bắt buộc:

- `title` — Tiêu đề
- `objectType` — Loại Object
- `status` — Trạng thái (Draft / Published / Archived)
- `createdAt`, `updatedAt` — Thời gian tạo và cập nhật
- `companionSummary` — Tóm tắt cho Companion (xem Mục 6)
- `companionIndex` — Metadata cho Companion (xem Mục 6)
- `relatedObjects` — Liên kết đến Object liên quan
- `nextStep` — Gợi ý bước tiếp theo cho người dùng

### Quy tắc quản lý nội dung

- Một Object đã Published không được xóa — chỉ có thể Archived
- Object Archived vẫn còn trong hệ thống nhưng không hiển thị với người dùng
- Khi cập nhật Object, `updatedAt` tự động cập nhật và Companion được thông báo
- Admin có thể xem trước (Preview) trước khi Publish

---

## 6. Companion Knowledge Index

### Mọi Object đều có CompanionIndex

CompanionIndex là bộ metadata đặc biệt được gắn vào mọi Object, giúp Companion hiểu và sử dụng nội dung đó trong quá trình hỗ trợ người dùng.

### Cấu trúc CompanionIndex

```yaml
companionIndex:
  knowledgeType: "tool" | "resource" | "article" | "course" | "project" | "community" | "companion-knowledge" | "user-journey"
  category: string          # Danh mục chính (vd: "AI Chat", "Productivity", "Image AI")
  topics: string[]          # Các chủ đề liên quan (vd: ["prompt engineering", "ChatGPT", "writing"])
  targetAudience: string[]  # Đối tượng phù hợp (vd: ["người mới", "marketer", "developer"])
  level: "beginner" | "intermediate" | "advanced"
  difficulty: 1 | 2 | 3 | 4 | 5   # 1 = rất dễ, 5 = rất khó
  summaryForCompanion: string       # Tóm tắt ngắn gọn để Companion đọc nhanh
  relatedObjects: ObjectReference[] # Danh sách Object liên quan kèm loại và ID
  recommendedPath: ObjectReference[] # Lộ trình gợi ý từ Object này
  trustLevel: "verified" | "community" | "draft"
  language: "vi" | "en" | "bilingual"
  lastIndexed: datetime
```

### Hướng dẫn viết summaryForCompanion

`summaryForCompanion` là trường quan trọng nhất trong CompanionIndex. Đây là đoạn văn ngắn (50-150 từ) viết cho Companion đọc — không phải cho người dùng đọc.

Yêu cầu:
- Trả lời câu hỏi: "Object này là gì và khi nào Companion nên giới thiệu nó?"
- Nêu rõ đối tượng phù hợp và trường hợp sử dụng
- Không dùng ngôn ngữ marketing, chỉ dùng ngôn ngữ mô tả chính xác

Ví dụ tốt:
> "AiToolObject về ChatGPT — công cụ AI chat đa năng của OpenAI. Phù hợp cho người mới bắt đầu khám phá AI. Companion nên giới thiệu khi người dùng hỏi về AI chat, viết lách bằng AI, hoặc chưa biết bắt đầu từ đâu. Liên kết với ResourceObject 'Prompt ChatGPT cơ bản' và ArticleObject '5 cách dùng ChatGPT cho công việc hàng ngày'."

---

## 7. Companion Guide

### CompanionGuide Card — Định hướng ngữ cảnh

Mỗi section lớn trên Portal có một **CompanionGuide card** hiển thị ở đầu trang section. Đây là lời hướng dẫn trực tiếp từ Companion đến người dùng, giúp họ hiểu mình đang ở đâu và nên bắt đầu từ đâu.

CompanionGuide không phải banner quảng cáo. Đây là điều hướng thông minh dựa trên ngữ cảnh.

### Nguyên tắc viết CompanionGuide

- Viết ở ngôi thứ nhất (Companion nói chuyện trực tiếp với người dùng)
- Ngắn gọn, không quá 3-4 câu
- Luôn có một hành động cụ thể được gợi ý
- Phân nhánh theo trạng thái người dùng (lần đầu / đã quen)

### Ví dụ CompanionGuide theo từng section

**Không gian AI:**
> "Nếu đây là lần đầu bạn khám phá AI, hãy bắt đầu từ danh mục AI Chat — đó là nơi hầu hết mọi người khởi đầu. Nếu bạn đã biết mình cần gì, dùng bộ lọc bên trái để tìm đúng công cụ theo ngành và mục đích sử dụng."

**Thư viện tri thức:**
> "Nếu chưa biết đọc gì, bắt đầu từ Prompt AI — đây là tài nguyên được dùng nhiều nhất. Nếu bạn đang làm một việc cụ thể, dùng bộ lọc theo loại tài nguyên: Checklist cho quy trình, SOP cho hệ thống, Template cho mẫu sẵn có."

**Dự án & Cơ hội:**
> "Hãy đọc phần Giới thiệu về hệ sinh thái trước khi xem Cơ hội — điều đó giúp bạn hiểu bối cảnh và đánh giá cơ hội chính xác hơn. Nếu bạn đang tìm việc làm liên quan AI, lọc theo danh mục Cơ hội nghề nghiệp."

**Học viện:**
> "Chưa biết nên học khóa nào? Cho tôi biết bạn đang làm nghề gì và muốn dùng AI để làm gì — tôi sẽ gợi ý khóa học phù hợp nhất. Hoặc bắt đầu với khóa miễn phí 'AI cho người mới' nếu bạn chưa từng học AI có hệ thống."

**Cộng đồng:**
> "Cộng đồng hoạt động chủ yếu qua các nhóm học tập theo ngành. Tham gia nhóm phù hợp với công việc của bạn để nhận gợi ý và chia sẻ từ những người có bối cảnh tương tự."

**Companion (section giới thiệu Companion):**
> "Tôi có thể giúp bạn tốt hơn nếu bạn cho tôi biết bạn đang học vì mục đích gì. Hành trình của tôi lưu lại những gì bạn đã xem và học — dựa vào đó tôi sẽ gợi ý chính xác hơn theo thời gian."

---

## 8. Internal Linking — Liên Kết Nội Bộ

### Nguyên tắc: Không có điểm chết

Mọi Object đều phải liên kết ra ngoài — đến ít nhất một Object khác loại. Không có trang nào là điểm kết thúc tuyệt đối.

### Cấu trúc liên kết chuẩn theo chiều ngang

Mỗi Object phải có:

| Loại liên kết | Mô tả | Số lượng |
|---------------|-------|----------|
| **Pillar link** | Liên kết đến Object tổng quan / gốc của chủ đề | 1 |
| **Related links** | Liên kết đến Object cùng chủ đề, khác loại | 2-3 |
| **Destination link** | Liên kết đến trang hành động tiếp theo (course, tool, community) | 1 |
| **Next step** | Gợi ý "Tiếp theo bạn nên..." rõ ràng | 1 |

### Quy tắc liên kết cho ArticleObject

Mỗi bài viết mới phải có:
1. Một liên kết đến bài nền tảng (pillar post) của chủ đề
2. Hai hoặc ba liên kết đến bài cùng chủ đề
3. Một liên kết đến trang SOLO hoặc SCALE phù hợp (khóa học tương ứng)

### Quy tắc liên kết xuyên Object-type

```
AiToolObject      → liên kết đến ResourceObject, ArticleObject, CourseObject
ResourceObject    → liên kết đến AiToolObject, ArticleObject, CourseObject
ArticleObject     → liên kết đến AiToolObject, ResourceObject, CourseObject
CourseObject      → liên kết đến AiToolObject, ResourceObject, ProjectObject
ProjectObject     → liên kết đến CourseObject, CommunityObject
CommunityObject   → liên kết đến CourseObject, UserJourneyObject
```

### Kiểm tra Internal Linking

Trước khi publish một Object, Admin phải kiểm tra:
- [ ] Có ít nhất 2 liên kết đến Object khác loại
- [ ] Có phần "Tiếp theo bạn nên..." rõ ràng
- [ ] Không có liên kết broken (URL 404)
- [ ] `relatedObjects` trong CompanionIndex đã được cập nhật

---

## 9. Các Tầng Kiến Trúc Thông Tin

Portal được tổ chức theo 4 tầng kiến trúc, từ macro đến micro:

---

### Tầng 1: Navigation (Điều Hướng)

**Cấp độ:** Toàn Portal  
**Nội dung:** 3 hành trình lớn, 8 section chính

Đây là khung xương của Portal. Không thay đổi thường xuyên. Mọi quyết định thêm/bớt ở tầng này phải được xem xét kỹ về kiến trúc.

Cấu trúc:
```
Portal
├── Học hỏi
│   ├── Không gian AI
│   ├── Thư viện tri thức
│   └── Nhật ký học tập
├── Xây dựng
│   ├── Học viện
│   ├── Dự án & Cơ hội
│   └── Cộng đồng
└── Trưởng thành
    ├── Companion
    └── Hành trình của tôi
```

---

### Tầng 2: Section Pages (Trang Danh Mục)

**Cấp độ:** Từng section  
**Nội dung:** Trang tổng quan của mỗi section trong 8 section

Cấu trúc chuẩn của một Section Page:
1. **Hero** — Tiêu đề section, mô tả ngắn, giá trị cốt lõi
2. **CompanionGuide** — Card điều hướng từ Companion
3. **Search & Filter** — Tìm kiếm và lọc nội dung trong section
4. **Categories** — Phân loại nội dung theo danh mục con
5. **Content Grid** — Danh sách Object trong section

---

### Tầng 3: Object Pages (Trang Chi Tiết)

**Cấp độ:** Từng Object  
**Nội dung:** Trang chi tiết của từng Knowledge Object

Mỗi loại Object có layout riêng được định nghĩa cố định. Layout này không thay đổi giữa các Object cùng loại — chỉ nội dung thay đổi theo schema.

Cấu trúc chung của một Object Page:
1. **Header** — Tiêu đề, metadata, breadcrumb
2. **Hero content** — Nội dung chính theo loại Object
3. **Related section** — Object liên quan
4. **Next step** — Bước tiếp theo rõ ràng
5. **CompanionGuide** — Gợi ý ngữ cảnh từ Companion

---

### Tầng 4: Companion Knowledge Index (Metadata Tầng Sâu)

**Cấp độ:** Hệ thống  
**Nội dung:** Metadata của toàn bộ Object, phục vụ Companion

Tầng này không hiển thị trực tiếp với người dùng thông thường. Đây là "tầng ngầm" giúp Companion đọc, hiểu, và điều hướng toàn bộ Portal một cách thông minh.

Companion Knowledge Index bao gồm:
- CompanionIndex của tất cả Object đã Published
- Sơ đồ liên kết giữa các Object (knowledge graph)
- Lịch sử UserJourneyObject của từng học viên
- CompanionGuide của từng section

---

## 10. Definition of Done

### Portal được coi là hoàn thiện khi đạt đủ 5 tiêu chí:

---

### Tiêu chí 1: Knowledge OS

Portal hoạt động như một hệ thống tri thức có cấu trúc:

- [ ] Mọi nội dung đều thuộc một Object type được định nghĩa
- [ ] Mọi Object đều có schema đầy đủ, không có trường tùy biến ngoài schema
- [ ] Không có nội dung "ngoài hệ thống" (trang độc lập không có Object type)
- [ ] Kiến trúc 4 tầng được triển khai đầy đủ

---

### Tiêu chí 2: Education OS

Portal hỗ trợ học tập có lộ trình, có tiến độ, có kết quả:

- [ ] Mọi Object đều có phần "Tiếp theo bạn nên..."
- [ ] Lộ trình chuẩn (Tool → Article → Course → Project → Community → Companion) được liên kết đầy đủ
- [ ] Người dùng không bao giờ bị bế tắc (no dead ends)
- [ ] UserJourneyObject theo dõi được tiến độ học tập

---

### Tiêu chí 3: Companion Ready

Companion có đủ thông tin để hỗ trợ người dùng thông minh:

- [ ] 100% Object Published có `companionSummary` đầy đủ
- [ ] 100% Object Published có `companionIndex` đầy đủ
- [ ] Mọi section đều có CompanionGuide card
- [ ] Companion có thể truy cập và đọc UserJourneyObject của người dùng

---

### Tiêu chí 4: Admin Friendly

Admin có thể quản trị Portal hiệu quả mà không cần kỹ năng kỹ thuật:

- [ ] CMS có form riêng cho từng Object type theo schema
- [ ] Admin không cần chỉnh sửa HTML hay CSS để tạo nội dung mới
- [ ] Workflow tạo → preview → publish hoạt động trơn tru
- [ ] Admin có thể tìm kiếm, lọc, và quản lý Object theo trạng thái

---

### Tiêu chí 5: User Friendly

Người dùng luôn biết mình đang ở đâu và nên làm gì tiếp:

- [ ] Navigation 3 hành trình rõ ràng, dễ hiểu
- [ ] Mỗi trang có CompanionGuide hướng dẫn bắt đầu
- [ ] Internal linking đầy đủ, không có trang cụt
- [ ] Người dùng mới có thể tự tìm được lộ trình phù hợp trong vòng 3 click

---

## Phụ lục: Thuật Ngữ Sử Dụng Trong Tài Liệu

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| Knowledge Object | Đơn vị nội dung cơ bản trên Portal, có schema và layout cố định |
| CompanionIndex | Bộ metadata gắn vào mỗi Object để Companion đọc và sử dụng |
| CompanionGuide | Card điều hướng từ Companion, hiển thị đầu mỗi section |
| companionSummary | Đoạn tóm tắt ngắn của Object, viết cho Companion đọc |
| Knowledge OS | Knowledge Operating System — cách gọi Portal theo triết lý kiến trúc |
| Schema | Cấu trúc dữ liệu định nghĩa trước cho từng loại Object |
| Pillar post | Bài viết tổng quan / gốc của một chủ đề |
| Object type | Một trong 8 loại Knowledge Object được định nghĩa trong kiến trúc |
| Dead end | Trang không có liên kết ra ngoài, không có gợi ý bước tiếp theo |
| UserJourneyObject | Hồ sơ hành trình học tập cá nhân của từng học viên |

---

*Tài liệu này được duy trì và cập nhật bởi đội ngũ kiến trúc Portal. Mọi thay đổi về kiến trúc thông tin phải được ghi nhận vào tài liệu này trước khi triển khai.*
