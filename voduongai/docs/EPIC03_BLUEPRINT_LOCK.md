# EPIC 03 — Blueprint Lock & Architecture Review

Architecture Review chính thức cho toàn bộ Sprint A (A1–A8), trước khi
khóa Blueprint và cho phép Sprint B bắt đầu. Tài liệu review — không code,
không sửa Blueprint đã có, chỉ đối chiếu và ghi nhận kết quả.

**Phạm vi review**: 8 tài liệu Sprint A —

| Task | Tài liệu thật đã tạo | Tên gọi trong brief Task A9 |
|---|---|---|
| A1 | `MISSION_LIBRARY_STANDARD.md` | Mission Library Standard ✔ khớp |
| A2 | `LEARNING_ASSET_STANDARD.md` | Learning Asset Standard ✔ khớp |
| A3 | `LEARNING_JOURNEY_STANDARD.md` | Learning Journey Standard ✔ khớp |
| A4 | `AI_CURRICULUM_STANDARD.md` | Brief gọi là "AI Learning Experience Standard" — **lệch tên**, xem mục 1 |
| A5 | `ASSESSMENT_CAPABILITY_STANDARD.md` + `CAPABILITY_EVIDENCE_FRAMEWORK.md` | Assessment & Capability Standard ✔ khớp (2 file thay vì 1, theo đúng yêu cầu Task A5 gốc) |
| A6 | `AI_IMPACT_ROI_STANDARD.md` | AI Impact & ROI Standard ✔ khớp |
| A7 | `GOLDEN_REFERENCE_MISSION_PACK.md` | Golden Reference Mission Pack ✔ khớp |
| A8 | `LEARNING_OPERATING_SYSTEM_BLUEPRINT.md` | Learning Operating System Blueprint ✔ khớp |

**Product Principle**: Thiết kế một lần. Triển khai nhiều năm. Không
refactor vì thiếu Blueprint.

---

## 1. Executive Summary

7 tài liệu (A1–A7) và 1 tài liệu tích hợp (A8) tạo thành một hệ thống nhất
quán về thuật ngữ, lifecycle, data model, và relationship — **không có
mâu thuẫn nội tại nào chặn việc khóa Blueprint**. Review phát hiện một số
điểm cần làm rõ trước/trong Sprint B1 (không phải lỗi kiến trúc, mà là
việc chuẩn hóa tên gọi và làm rõ ranh giới với tài liệu đã có từ trước
EPIC 03) — liệt kê đầy đủ ở mục 4 (Gap Analysis).

Kết luận: **Blueprint đủ điều kiện khóa (Locked)**. Các điểm cần làm rõ ở
mục 4 không yêu cầu thiết kế lại kiến trúc — chỉ cần chuẩn hóa tên field/
model khi implement Sprint B1 (Data Model Foundation), đúng tinh thần
"không refactor vì thiếu Blueprint."

---

## 2. Architecture Review

### 2.1 Tính nhất quán thuật ngữ (mục 01 của brief)

Đối chiếu thuật ngữ xuyên suốt A1–A8:

| Thuật ngữ | Dùng nhất quán ở | Kết luận |
|---|---|---|
| `PortalModule` (academy/khong-gian-ai/ckos...) | A6, A8 (Universal Context) | Nhất quán — dùng đúng type đã có trong codebase |
| Capability scale 4 mức (Introduced/Practiced/Applied/Mastered) | A1 mục 9, A2 mục 13, A3 mục 9 | Nhất quán |
| Capability scale 7 mức (Biết→...→Hướng dẫn người khác) | A5 mục 9 | **Không mâu thuẫn** — A5 tự khai báo là bản chi tiết hơn, có bảng ánh xạ rõ sang thang 4 mức |
| `unlockCondition`/`requiresMission`/`requiresCapability`/`requiresAny`/`requiresAll` | A1 mục 6, A3 mục 10, A8 mục 11 | Nhất quán — cùng 1 cú pháp điều kiện dùng lại ở mọi tầng (Mission/Journey) |
| `startCompanionWorkspace(context)` là điểm gọi duy nhất | A6 (kế thừa Sprint 02), A8 mục 6/7 | Nhất quán — không tài liệu nào đề xuất cơ chế CTA thứ hai |
| Growth Event là "một Event, nhiều nơi đọc" | A3 mục 11, A4 mục 15, A8 mục 9 | Nhất quán, lặp lại đúng cùng nguyên tắc ở cả 3 tài liệu |
| "Không chấm điểm, không Quiz, không Certificate" | Lặp lại ở A2, A4, A5, A6, A8 | Nhất quán tuyệt đối — không tài liệu nào đề xuất cơ chế điểm số |

### 2.2 Lifecycle

Đối chiếu 3 phiên bản "luồng" đã thiết kế riêng lẻ:

- **Mission Flow** (A1 mục 5): `Mission → Learning Asset → Companion Practice → Workspace → Output → Reflection → Capability Update → Unlock`
- **Curriculum Flow 13 bước** (A4 mục 3): `Assessment → Learning → Guided Example → Practice → Companion Coaching → Workspace → AI Agent → Output → Review → Reflection → Capability Update → Growth Event → Unlock`
- **Assessment Lifecycle** (A5 mục 3): `Before Assessment → During Assessment → Output Assessment → Reflection → Companion Review → Capability Update → Growth Event → Journey Update → Unlock`

Cả 3 là **cùng một luồng ở 3 độ chi tiết khác nhau** — A8 (mục 3, Master
Learning Loop) đã hợp nhất đúng thành 1 bản duy nhất, không bỏ sót bước
nào của cả 3 nguồn. **Không phát hiện xung đột thứ tự bước** giữa 3 tài
liệu gốc.

### 2.3 Data Model & Relationship

Đối chiếu các model được định nghĩa rải rác — xem chi tiết đối chiếu từng
model ở mục 3 (Learning Loop) và mục 4 (Gap Analysis, các điểm trùng tên
cần chuẩn hóa).

---

## 3. Consistency Check — Learning Loop hoàn chỉnh

Xác nhận vòng lặp không đứt ở bất kỳ bước nào:

```
Journey ──✔── Mission ──✔── Learning Asset ──✔── Practice ──✔── Workspace
   ──✔── Output ──✔── Review ──✔── Reflection ──✔── Portfolio
   ──✔── Growth Event ──✔── Capability ──✔── Impact ──✔── Unlock
   ──✔── Mission tiếp theo
```

| Bước | Định nghĩa ở đâu | Có đứt không |
|---|---|---|
| Journey → Mission | A3 mục 3-4 (Journey/Collection Structure) | Không — Journey chứa Collection chứa Mission, quan hệ rõ |
| Mission → Learning Asset | A1 mục 5, A2 mục 2 | Không — LearningAsset luôn thuộc đúng 1 Mission |
| Learning Asset → Practice | A2 mục 7 | Không — Practice là bước bắt buộc trong Asset Structure |
| Practice → Workspace | A4 mục 3 bước 4-6 | Không — Practice luôn dẫn vào Companion Coaching rồi Workspace |
| Workspace → Output | A4 mục 10-11, A8 mục 8 | Không — "Không có Output, Asset/Mission không đạt chuẩn" nhắc lại ở mọi tài liệu |
| Output → Review | A2 mục 11, A4 mục 12 | Không |
| Review → Reflection | A4 mục 13 | Không |
| Reflection → Portfolio | A8 mục 8 (Output đạt chuẩn → vào Portfolio) | Không — có điều kiện rõ (Review đạt "sử dụng được" + có Reflection) |
| Portfolio → Growth Event | A8 mục 3, mục 9 | Không |
| Growth Event → Capability | A3 mục 11, A5 mục 9, A8 mục 10 | Không |
| Capability → Impact | A8 mục 10 (2 chiều: cùng 1 Growth Event cập nhật cả 2) | Không |
| Impact → Unlock | A1 mục 6-7, A8 mục 11 | Không — Unlock điều kiện có thể tham chiếu Capability (gián tiếp từ Impact) |
| Unlock → Mission tiếp theo | A1 mục 7 (Dependency), A3 mục 10 | Không |

**Kết luận mục 3**: Learning Loop hoàn chỉnh, không đứt ở bước nào. Toàn
bộ 13 mắt xích đều có định nghĩa rõ ràng, có ít nhất 2 tài liệu độc lập
tham chiếu cùng một cách hiểu.

---

## 4. Gap Analysis

Các điểm cần làm rõ trước/trong Sprint B1 — **không chặn việc khóa
Blueprint**, chỉ cần xử lý khi implement:

### 4.1 Trùng tên model cần chuẩn hóa (mục 02 của brief — kiểm tra chồng chéo)

| Khái niệm | Tên gọi khác nhau ở các tài liệu | Đề xuất chuẩn hóa cho Sprint B1 |
|---|---|---|
| Companion nhận xét Output | `Review` (A2 mục 11), `CompanionReview` (A8 mục 5) | Dùng `CompanionReview` làm tên model (A8, capstone), `Review` chỉ dùng làm tên bước trong Flow |
| Bản ghi Output vào Portfolio | `PortfolioEntry` (A5 Evidence Framework mục 3), `PortfolioItem` (A8 mục 5) | Dùng `PortfolioItem` (A8) làm tên model chính thức |
| Trạng thái năng lực hiện tại của người dùng | `Capability` (A5 mục 14), `CapabilityProfile` (A8 mục 5) | Dùng `CapabilityProfile` (A8) làm tên model chính thức, `Capability`/`CapabilityUpdate` chỉ dùng làm tên khái niệm/hành động |
| Bản ghi Impact | `Impact`/`OutputImpact`/`Roi`/`BusinessValueRecord`/`LongTermGrowthSnapshot` (A6 mục 10, 5 model con) vs `ImpactRecord` (A8 mục 5, 1 model gộp) | Sprint B1 cần bảng ánh xạ rõ: `ImpactRecord` (A8) là bản ghi chính; `OutputImpact`/`Roi`/`BusinessValueRecord`/`LongTermGrowthSnapshot` (A6) là các "view"/tính toán phái sinh từ tập hợp `ImpactRecord`, không phải bảng độc lập song song |
| Điều kiện mở khóa vs sự kiện đã mở khóa | `unlockCondition` (định nghĩa gắn trên Mission/Journey — A1/A3) vs `Unlock`/`UnlockRule` (A3 mục 13, A5 mục 14, A8 mục 5 — bản ghi đã xảy ra) | Không phải trùng lặp — là 2 khái niệm khác nhau (định nghĩa điều kiện vs bản ghi kết quả); Sprint B1 cần đặt tên tách bạch: `UnlockRule` (định nghĩa, gắn trên Mission/Journey) và `UnlockRecord` (bản ghi 1 lần mở khóa cho 1 user) |

Không có model nào bị **cô lập** (mục 04 của brief) — mọi model trong bảng
trên đều liên kết được với ít nhất 1 model khác qua ID tham chiếu, đã xác
nhận ở A8 mục 5.

### 4.2 Xung đột/chồng chéo với tài liệu đã có TRƯỚC EPIC 03

Repo có sẵn một số tài liệu kiến trúc/chiến lược từ trước Sprint A, nằm
ngoài phạm vi review A1–A8 nhưng cần ghi nhận vì dùng thuật ngữ trùng:

- **`JOURNEY_UNLOCK_BLUEPRINT.md`** (Product Constitution có sẵn) đã định
  nghĩa một hệ "6 lớp Unlock" (LOCKED/NEXT JOURNEY...) áp dụng toàn Portal
  (CKOS/Academy/Opportunities/Premium/Journey/Garden/Companion). Đây là
  một **Unlock Framework khác**, ở tầng UI/trải nghiệm hiển thị nội dung
  dần dần — khác phạm vi với Unlock System ở A1/A3/A8 (tầng dữ liệu: điều
  kiện Mission/Journey nào mở Mission/Journey nào). **Không mâu thuẫn về
  logic**, nhưng cần một ghi chú tường minh khi implement Sprint B6 (Unlock
  MVP) để 2 hệ không dẫm chân nhau: Unlock System (A1/A3/A8) quyết định
  **Mission/Journey nào khả dụng**; Journey Unlock Framework (tài liệu cũ)
  quyết định **cách hiển thị dần dần** những gì đã khả dụng. Đề xuất: nếu
  cần thay đổi, xử lý bằng Architecture Change Proposal riêng (mục 6),
  không tự ý sửa trong Sprint B.
- **`THE_COMPANION_CURRICULUM.md`** (tài liệu có sẵn) dùng chữ "Curriculum"
  cho một khái niệm hoàn toàn khác — chương trình trưởng thành nhiều-năm
  của chính Companion (Year 1/Year 2...), không phải quy trình thực thi
  Mission. Trùng chữ với **AI Curriculum Standard (A4)** nhưng **không
  trùng phạm vi** — A4 là quy trình 13 bước cho mỗi Mission; tài liệu cũ là
  narrative trưởng thành của Companion. Đề xuất: không đổi tên A4 (đã dùng
  xuyên suốt A1-A8), chỉ cần chú thích rõ trong `docs/` (vd một dòng ở đầu
  mỗi file) để tránh nhầm lẫn khi tìm kiếm.
- **`METHOD_TO_OS_MAPPING.md`** dùng chữ "OS" cho 5 khối lớn của Portal
  (Journey OS/Knowledge OS/Build OS/Connect OS/Legacy OS theo GEM Method) —
  phạm vi rộng hơn nhiều so với "Learning Operating System" ở A8 (chỉ tập
  trung Academy/Workspace/Mission). Đề xuất: A8's "Learning Operating
  System" nên hiểu là **hệ điều hành của riêng lớp học tập/Mission**, là
  một phần bên trong "Knowledge OS" + "Build OS" ở mapping cũ, không phải
  tên gọi thay thế cho toàn bộ 5 OS đó. Không cần sửa A8, chỉ cần ghi nhận
  ranh giới phạm vi này trong Blueprint Lock (đã ghi ở đây).

**Kết luận mục 4.2**: Đây là các điểm **cần làm rõ ranh giới phạm vi**
(scope boundary), không phải mâu thuẫn logic — không tài liệu nào trong
A1-A8 đưa ra quy tắc trái ngược với tài liệu cũ, chỉ là vùng phủ khác nhau
dùng chung một số từ khóa. Không chặn Blueprint Lock.

### 4.3 Golden Reference Mission — độ đại diện (mục 10 của brief)

10 Golden Reference Mission (A7) phủ 8/14 Category trong Mission Taxonomy
(A1 mục 2): AI Office, AI Writing, AI Data, AI Design, AI Marketing, AI
Research, AI Sales, AI Business. **Chưa có Mission mẫu** cho: AI Video, AI
Coding, AI Automation, AI Affiliate, AI Learning, AI Personal
Productivity (6/14 Category).

Đây là **gap đã biết, chấp nhận được cho Sprint A** — mục tiêu của A7 là
chứng minh Blueprint dùng được (Reference Quality), không phải phủ hết
Taxonomy. Đề xuất: Sprint B7 (Connect 10 Golden Missions) nên bổ sung
thêm tối thiểu 1 Mission mẫu cho mỗi Category còn thiếu, dùng đúng Mission
Blueprint (A7 mục 2) — không cần tài liệu thiết kế mới, chỉ áp dụng khuôn
đã có.

---

## 5. Architecture Freeze

Sau Review, xác nhận:

- ✔ **CTA**: mọi CTA trong A1–A8 đều đi qua Universal Context System
  (`startCompanionWorkspace(context)`) — không có CTA nào tự xử lý thực
  hành riêng (đối chiếu mục 06 brief).
- ✔ **Growth Event**: mọi Growth Event (9 loại, A8 mục 9) đều được thiết
  kế để tối thiểu 3 module đọc (Nhật ký/Hành trình/Khu vườn), có thể thêm
  Capability/AI Impact/Dashboard — đối chiếu mục 07 brief.
- ✔ **Output & Portfolio**: mọi Mission đều bắt buộc sinh Output (A1 mục
  8, A2 mục 10, A4 mục 11); mọi Output đạt chuẩn đều có đường vào Portfolio
  (A8 mục 8) — đối chiếu mục 08 brief.
- ✔ **Impact**: mọi Mission đều khai báo AI Impact (A1 mục 10, A6), Business
  Impact và Human Impact (A7 — cả 10 Golden Mission đều điền đủ 3 trường
  này) — đối chiếu mục 09 brief.
- ✔ **Module Connection hai chiều**: Học viện AI ↔ Companion ↔ Workspace ↔
  Portfolio ↔ Growth ↔ Capability ↔ Journey đã xác nhận hai chiều qua cơ
  chế Personalization (A4 mục 17 — Capability/Output/Reflection có thể
  khiến Companion gợi ý quay lại Journey khác) và Knowledge Connection (A3
  mục 8 — Journey ↔ Thư viện tri thức hai chiều: Asset dẫn sang Thư viện,
  Thư viện dẫn ngược về Workspace). Riêng cặp **Thư viện tri thức ↔ AI
  Workspace trực tiếp** chưa có tài liệu nào mô tả tường minh (cả hai chỉ
  được xác nhận hội tụ gián tiếp qua Companion/Workspace) — ghi nhận như
  một điểm làm rõ thêm ở Sprint B, không phải lỗi kiến trúc (đối chiếu mục
  05 brief).

**BLUEPRINT LOCKED.**

Từ thời điểm tài liệu này được commit: Sprint B **không được tự ý đổi kiến
trúc** đã mô tả trong A1–A8 + A8 Module Connection Map + Shared Data
Model. Bất kỳ thay đổi kiến trúc nào (thêm/bớt model, đổi lifecycle, đổi
Universal Context System, đổi Growth Event Backbone) đều phải đi qua một
**Architecture Change Proposal** riêng — không sửa trực tiếp trong lúc
code Sprint B.

Các điểm ở mục 4 (Gap Analysis) **không phải ngoại lệ cho quy tắc trên** —
đó là việc chuẩn hóa tên gọi/làm rõ ranh giới trong lúc implement, không
phải thay đổi kiến trúc, nên không cần Architecture Change Proposal.

---

## 6. Definition of Ready — Sprint B

Sprint B sẵn sàng bắt đầu khi (đối chiếu lại từ A8 mục 15, xác nhận qua
Review này):

- ✔ Không có mâu thuẫn nội tại giữa A1–A8 (mục 2-3 Review).
- ✔ Data Model tổng thể đã có, các điểm trùng tên đã có đề xuất chuẩn hóa
  cụ thể để B1 áp dụng ngay (mục 4.1).
- ✔ Ranh giới với tài liệu cũ (Journey Unlock Framework, Companion
  Curriculum, Method to OS Mapping) đã được ghi nhận rõ, không cần sửa tài
  liệu cũ hay tài liệu mới (mục 4.2).
- ✔ Gap về độ phủ Golden Mission (6/14 Category chưa có mẫu) đã có kế
  hoạch xử lý trong B7, không chặn B1-B6 (mục 4.3).
- ✔ Universal Context System, Growth Event Backbone, Output/Portfolio
  Flow, Unlock System đều đã Freeze (mục 5).

**Sprint B có thể bắt đầu từ B1 (Data Model Foundation) mà không cần thiết
kế lại kiến trúc.**

---

## 7. Sprint B Roadmap (nhắc lại từ A8 mục 13, không đổi)

| Sprint | Tên | Điều kiện bổ sung từ Review này |
|---|---|---|
| B1 | Data Model Foundation | Áp dụng chuẩn hóa tên model ở mục 4.1 khi implement schema |
| B2 | Workspace Output Storage | Không đổi so với A8 |
| B3 | Growth Event Reader | Không đổi so với A8 |
| B4 | Portfolio MVP | Dùng tên `PortfolioItem` (không dùng `PortfolioEntry`) |
| B5 | Capability & Impact MVP | Dùng tên `CapabilityProfile`/`ImpactRecord`, có bảng ánh xạ với các model con A6 |
| B6 | Unlock MVP | Tách rõ `UnlockRule` (định nghĩa) và `UnlockRecord` (bản ghi); ghi chú ranh giới với Journey Unlock Framework cũ (mục 4.2) |
| B7 | Connect 10 Golden Missions | Bổ sung tối thiểu 1 Mission mẫu cho mỗi Category còn thiếu (mục 4.3), dùng đúng Mission Blueprint A7 mục 2 |

---

Sprint A hoàn thành. Blueprint (A1–A8) đã qua Architecture Review, không
phát hiện mâu thuẫn chặn triển khai, và được đánh dấu **LOCKED** kể từ tài
liệu này. Sprint B có thể bắt đầu.
