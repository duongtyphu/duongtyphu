# AI Curriculum Standard

Tiêu chuẩn thiết kế giáo trình của toàn bộ VO DUONG AI. Mọi Journey, mọi
Mission, mọi Learning Asset đều phải tuân theo tài liệu này. Đây là tài
liệu kiến trúc — không code, không UI, không route, không AI Agent, không
dữ liệu giả, không viết bài học, không tạo Mission trong task này.

Đây là tài liệu **thứ 4 và là lớp quy trình thực thi**, đứng trên cả bộ 3
tài liệu trước:

```
Learning OS Principle          (triết lý nền tảng — docs/LEARNING_OS_PRINCIPLE.md)
        ↓ áp dụng qua
Learning Journey Standard        (hành trình năng lực — docs/LEARNING_JOURNEY_STANDARD.md)
        ↓ chứa
Mission Library Standard          (đơn vị công việc — docs/MISSION_LIBRARY_STANDARD.md)
        ↓ lấp đầy bởi
Learning Asset Standard            (đơn vị học tập — docs/LEARNING_ASSET_STANDARD.md)
        ↓ được THỰC THI theo
AI Curriculum Standard              (tài liệu này — quy trình 13 bước bắt buộc cho MỌI Mission)
```

**Product Principle**: VO DUONG AI không đào tạo người dùng hoàn thành bài
học. VO DUONG AI đào tạo người dùng tạo ra kết quả thật. Mỗi Mission phải
chứng minh: người học đã làm được điều mà trước đây họ chưa làm được. Đó
mới là tiêu chuẩn hoàn thành của giáo trình.

---

## 1. Curriculum Philosophy

VO DUONG AI không thiết kế khóa học. VO DUONG AI thiết kế **hành trình tạo
ra năng lực**.

Mỗi Mission không kết thúc khi người học **hiểu** — Mission kết thúc khi
người học **tạo ra được một kết quả thật**. Mọi giáo trình, trước khi được
thiết kế, phải trả lời được:

> "Người học sẽ làm được gì sau Mission này?"

Nếu câu trả lời là "hiểu thêm về X" thay vì "làm được Y" — giáo trình đó
chưa đạt chuẩn, phải thiết kế lại theo hướng năng lực-hành động.

---

## 2. Curriculum Hierarchy

Nhất quán với Learning Hierarchy ở `docs/LEARNING_JOURNEY_STANDARD.md`
mục 2 — nhắc lại ở đây với vai trò nhìn từ góc độ **thiết kế giáo trình**:

```
Competency   // năng lực đích — mọi thiết kế giáo trình bắt đầu từ đây, không phải từ nội dung
   ↓
Journey       // khung hành trình gom nhiều Mission theo Business Goal
   ↓
Collection    // nhóm Mission theo chủ đề công việc con (lớp hiển thị, không phải logic)
   ↓
Mission        // đơn vị công việc — nơi Curriculum Flow (mục 3) được áp dụng
   ↓
Learning Asset  // nội dung + thực hành lấp đầy Mission
   ↓
Practice         // hành động thật
   ↓
Workspace         // nơi thực hiện + lưu trữ
   ↓
Output             // bằng chứng năng lực
   ↓
Reflection          // người học tự nhận biết
   ↓
Capability           // năng lực được cập nhật
   ↓
Growth                // dữ liệu trưởng thành thật
   ↓
Unlock                 // cánh cửa tiếp theo
```

Vai trò trong thiết kế giáo trình: **Competency luôn là điểm bắt đầu thiết
kế** (không phải "mình có nội dung gì thì viết nấy") — mọi Mission được
thiết kế lùi từ câu hỏi "Mission này rèn Competency nào, chứng minh bằng
Output gì."

---

## 3. Curriculum Flow — 13 bước bắt buộc cho MỌI Mission

Mọi Mission phải đi qua đủ 13 bước theo đúng thứ tự — **không được thiếu
bước**:

```
1.  Assessment          // Companion đánh giá trước khi bắt đầu — mục 4
     ↓
2.  Learning              // Knowledge ngắn, đúng, thực tế — mục 5
     ↓
3.  Guided Example         // ví dụ hoàn chỉnh thật — mục 6
     ↓
4.  Practice                // công việc thật, không quiz — mục 7
     ↓
5.  Companion Coaching        // Companion đồng hành, không làm thay — mục 8
     ↓
6.  Workspace                  // nơi thực hiện — mục 10
     ↓
7.  AI Agent (nếu cần)           // điều phối theo vai trò — mục 9
     ↓
8.  Output                        // kết quả thật — mục 11
     ↓
9.  Review                          // Companion review, không chấm điểm — mục 12
     ↓
10. Reflection                        // tự nhận biết — mục 13
     ↓
11. Capability Update                   // năng lực cập nhật — mục 14
     ↓
12. Growth Event                          // ghi nhận trưởng thành — mục 15
     ↓
13. Unlock                                  // mở Mission/Journey tiếp theo — mục 16
```

Đối chiếu với Mission Flow ở Learning Asset Standard/Journey Standard: 13
bước ở đây là **bản đầy đủ nhất, có thêm Assessment ở đầu** — Assessment
là điểm khác biệt chính của AI Curriculum Standard so với 2 tài liệu
trước, dùng để cá nhân hóa (mục 17) trước khi Learning bắt đầu.

---

## 4. Assessment Standard

Trước khi bắt đầu Mission, Companion đánh giá — **không phải kiểm tra
kiến thức**, mà để **cá nhân hóa Journey**.

Câu hỏi Assessment mẫu:
- "Bạn đã từng làm việc này chưa?"
- "Bạn đang gặp khó khăn gì?"
- "Bạn muốn tạo kết quả gì?"

Nguyên tắc:
- Assessment không có đáp án đúng/sai — mọi câu trả lời đều hợp lệ.
- Kết quả Assessment ảnh hưởng tới: bỏ qua/rút gọn bước Learning (nếu đã
  biết), điều chỉnh Guided Example (nếu người học nêu rõ loại kết quả
  muốn tạo), điều chỉnh mức độ Companion Coaching (mục 8).
- Assessment ngắn — tối đa 2-3 câu hỏi, không phải form dài.

---

## 5. Learning Standard

Nhất quán với Knowledge Standard ở Learning Asset Standard mục 4: kiến
thức phải **ngắn, đúng, thực tế, có ví dụ thật, không sách giáo khoa,
không lý thuyết dài dòng**.

Trong Curriculum Flow, bước Learning chỉ cung cấp **vừa đủ để bắt đầu
Guided Example (mục 6)** — không cần giải thích toàn diện; phần sâu hơn
luôn dẫn qua Thư viện tri thức (Knowledge Connection, Journey Standard mục
8), không nhồi vào bước Learning của Mission.

---

## 6. Guided Example Standard

Mỗi Mission có ít nhất **một ví dụ hoàn chỉnh thật** trước khi người học tự
làm Practice — nhất quán với Example Standard ở Learning Asset Standard
mục 5.

Ví dụ: Proposal thật, Dashboard thật, Landing Page thật — không dùng ví dụ
giả/Lorem Ipsum. Guided Example phải đủ chi tiết để người học **thấy được
toàn bộ quá trình từ đầu vào tới đầu ra**, không chỉ xem kết quả cuối
cùng.

---

## 7. Practice Standard

Practice là **công việc thật** — không Quiz, không câu hỏi trắc nghiệm.
Nhất quán với Practice Standard ở Learning Asset Standard mục 7:

| Học | Practice |
|---|---|
| Viết Proposal | Proposal thật |
| Làm Dashboard | Dashboard thật |

Practice luôn có Assignment cụ thể (input/ngữ cảnh rõ ràng — không mơ hồ)
và luôn dẫn thẳng vào Companion Coaching + Workspace, không bao giờ đứng
độc lập.

---

## 8. Companion Coaching Standard

Companion **không làm thay**. Companion có nhiệm vụ:

- Chia nhỏ công việc thành bước dễ làm.
- Hướng dẫn từng bước khi người học cần.
- Nhắc (khi người học dừng giữa chừng).
- Phản hồi khi có bản nháp Output.
- Review sau khi có Output (mục 12).
- Điều phối AI Agent khi cần (mục 9).

Mức độ Coaching điều chỉnh theo kết quả Assessment (mục 4) — người đã có
kinh nghiệm nhận Coaching ngắn gọn hơn người mới, nhưng vai trò Companion
không đổi.

---

## 9. AI Agent Standard

Nếu Mission cần, Companion điều phối AI Agent theo vai trò chức năng
(nhất quán với AI Agent Standard ở Learning Asset Standard mục 9):

Research Agent, Writer Agent, Designer Agent, Reviewer Agent, Planner
Agent, Office Agent... — danh mục mở, không giới hạn.

Nguyên tắc:
- **Không phải Mission nào cũng cần Agent** — Mission thuần phản ánh/
  checklist thủ công có thể không cần Agent nào.
- Người học không tự chọn Agent — Companion chọn ngầm dựa trên
  `workspaceType`/`competency` của Mission, người học chỉ thấy kết quả
  điều phối.
- Một Mission có thể cần nhiều Agent phối hợp theo trình tự (vd Research
  Agent → Writer Agent → Reviewer Agent).

---

## 10. Workspace Standard

Practice luôn kết thúc tại Workspace. Workspace lưu:

- Mission (tham chiếu Mission ID)
- Timeline (Assessment → ... → Unlock, mốc thời gian từng bước)
- Context (module/nguồn/goal — theo cơ chế `startCompanionWorkspace` hiện
  có)
- Output (mục 11)
- Version (mỗi lần chỉnh sửa lại Output là 1 Version mới, không ghi đè)
- Review (kết quả Companion Review — mục 12)
- Reflection (câu trả lời — mục 13)
- History (toàn bộ phiên làm việc trước đó cho Mission này, không chỉ
  phiên hiện tại)
- Portfolio (tập hợp Output đã hoàn thành, dùng làm bằng chứng năng lực
  lâu dài)

**Không có Workspace, Mission chưa hoàn chỉnh** — đây là điều kiện cứng,
không có ngoại lệ.

---

## 11. Output Standard

Mission phải sinh Output. Loại Output hợp lệ: Word, Excel, PowerPoint,
PDF, Image, Video, Landing Page, Automation, Research Report, Proposal,
Prompt Pack... — danh mục mở.

Nguyên tắc: Output phải **lưu lại** trong Workspace (mục 10), không hiển
thị rồi mất — nhất quán tuyệt đối với Output Standard ở Learning Asset
Standard mục 10 và Mission Output Standard ở Mission Library Standard mục
8. Không có Mission nào hợp lệ nếu bước Output rỗng.

---

## 12. Review Standard

Companion review Output — **không chấm điểm**. Review theo 4 khía cạnh:

- **Chất lượng** — Output có đạt mức dùng được trong công việc thật không.
- **Tính ứng dụng** — Output có áp dụng được ngay vào tình huống người học
  nêu ở Assessment không.
- **Tính hoàn chỉnh** — Output có thiếu phần nào so với yêu cầu Assignment
  không.
- **Gợi ý cải thiện** — 1 gợi ý cụ thể cho lần sau (không chung chung).

Nhất quán với Review Standard ở Learning Asset Standard mục 11
(`strengths[]`/`improvements[]`/`nextTimeSuggestion`) — 4 khía cạnh trên
là cách diễn giải cụ thể hơn cho từng Mission.

---

## 13. Reflection Standard

Sau Mission, Portal hỏi — ví dụ chuẩn:

- "Bạn học được gì?"
- "Bạn tiết kiệm được gì?"
- "Điều gì khó nhất?"
- "Nếu làm lại, bạn sẽ thay đổi gì?"

Nguyên tắc: Reflection phải **ngắn nhưng bắt buộc** — không bỏ qua dù
Mission đơn giản đến đâu, không chấm điểm/đúng-sai. Nhất quán với
Reflection Standard ở Learning Asset Standard mục 12.

---

## 14. Capability Update

Capability **không tăng theo Video** — tăng theo tổ hợp:

```
CapabilityUpdate = f(Output, Practice, Review, Reflection)
```

Nhất quán với Learning Asset Standard mục 13 và Mission Library Standard
mục 9 — dùng chung thang đo `Introduced → Practiced → Applied → Mastered`.
Assessment (mục 4) không trực tiếp tính vào Capability — Assessment chỉ cá
nhân hóa đường đi, không phải bằng chứng năng lực.

---

## 15. Growth Event (Growth Integration)

Hoàn thành Mission → sinh Growth Event → hiển thị đồng thời tại:

```
Growth Event (vd MISSION_COMPLETED)
   ├── Nhật ký học tập
   ├── Hành trình
   ├── Khu vườn
   ├── Dashboard
   └── Portfolio
```

Nguyên tắc: **một Event, nhiều nơi tiêu thụ** — nhất quán với Growth
Integration ở Learning Journey Standard mục 11, chính là cơ chế vá gap đã
ghi nhận trong audit (Growth Event hiện chỉ ghi, không ai đọc).

---

## 16. Unlock Rules

Unlock theo **Output, Capability, Journey** — không Unlock theo Video.
Nhất quán với Unlock Rules ở Mission Library Standard mục 6/7 và Learning
Journey Standard mục 10 — dùng chung cơ chế điều kiện linh hoạt
(`requiresMission`/`requiresCapability`/`requiresAny`/`requiresAll`).

---

## 17. Personalization

Curriculum **không cố định**. Dựa trên Capability, Output, Reflection đã
có, Companion có thể đề xuất:

- Mission khác (thay vì Mission tiếp theo mặc định trong Collection).
- Journey khác (nếu Reflection cho thấy nhu cầu thực tế khác hướng ban
  đầu).
- Collection khác (trong cùng Journey, theo thứ tự linh hoạt).

Nguyên tắc: Personalization **không phải rẽ nhánh ngẫu nhiên** — luôn dựa
trên dữ liệu thật đã có (Assessment ban đầu + Capability/Output/Reflection
tích lũy), không phải logic đoán mò. Đây là điểm khác biệt cốt lõi giữa
"giáo trình" (cố định, tuyến tính) và "Curriculum" theo chuẩn này (thích
ứng theo từng người học, cùng một bộ Mission/Journey nền tảng).

---

## 18. AI Impact

Sau Mission, Portal đo: Time Saved, Quality Improved, Confidence, Business
Value, Automation — **không dùng điểm số**. Nhất quán với AI Impact Mapping
ở Mission Library Standard mục 10 — mỗi Mission khai báo trước sẽ đo metric
nào trong nhóm này (không bắt buộc đo đủ cả 5, nhưng phải đo ít nhất 1).

---

## 19. Curriculum Data Model

```
CurriculumRun {                 // một lần người học đi qua 1 Mission theo Curriculum Flow
  runId, userId, missionId

  assessment { questions[], answers[] }              // mục 4

  learning { knowledgeShown }                          // mục 5, tham chiếu Learning Asset

  example { guidedExampleRef }                          // mục 6

  practice { assignment, startedAt }                     // mục 7

  companion { coachingLog[] }                             // mục 8, lịch sử tương tác Companion

  workspace { workspaceId, timeline[], context, history[] } // mục 10

  agent { agentsInvoked[] }                                 // mục 9, có thể rỗng

  output { outputId, outputType, outputFormat, version }      // mục 11

  review { quality, applicability, completeness, suggestion }  // mục 12

  reflection { answers[] }                                       // mục 13

  capabilityUpdate { competencyId, newPracticeLevel }              // mục 14

  growthEvent { eventType, timestamp }                              // mục 15

  unlock { unlockedEntityId[], unlockedEntityType[] }                // mục 16

  aiImpact { metricType, value, measuredAt }                          // mục 18

  status  // in_progress | completed
}
```

Ghi chú: `CurriculumRun` là lớp **thực thi** (một lần chạy cụ thể của một
người học qua một Mission), khác với `Mission`/`LearningAsset` là lớp
**định nghĩa** (đã có schema đầy đủ ở 2 tài liệu trước) — `CurriculumRun`
tham chiếu `missionId`/`assetId`, không định nghĩa lại nội dung Mission.

---

## 20. Quality Checklist

Một Curriculum (áp dụng cho từng Mission cụ thể) chỉ được Publish khi có
đủ:

- ✔ Assessment
- ✔ Learning
- ✔ Example
- ✔ Practice
- ✔ Companion
- ✔ Workspace
- ✔ Output
- ✔ Review
- ✔ Reflection
- ✔ Growth
- ✔ Unlock

Thiếu bất kỳ mục nào trong 11 mục trên — Mission chưa đạt chuẩn Curriculum,
dù đã đạt Quality Checklist ở Learning Asset Standard (mục 17 của tài liệu
đó kiểm tra nội dung; checklist này kiểm tra **toàn bộ quy trình thực thi
13 bước**).

---

## Examples — áp dụng Curriculum Flow cho các lĩnh vực khác nhau

Minh họa cùng một Curriculum Flow (13 bước) áp dụng không đổi cho các loại
Mission khác nhau — chứng minh kiến trúc không cần thay đổi theo lĩnh vực:

| Bước | Word (Proposal) | Excel (Dashboard) | Marketing (Content Calendar) | Coding (Automation Script) |
|---|---|---|---|---|
| Assessment | "Bạn từng viết Proposal chưa?" | "Bạn có dữ liệu mẫu chưa?" | "Bạn muốn nhắm mục tiêu ai?" | "Bạn từng chạy script chưa?" |
| Learning | Cấu trúc Proposal 4 phần | Nguyên tắc chọn biểu đồ | Nguyên tắc lịch nội dung nhất quán | Nguyên tắc mô tả yêu cầu cho AI viết code |
| Guided Example | Proposal F&B thật | Dashboard doanh số thật | Content Calendar 1 tháng thật | Script tự động gửi báo cáo thật |
| Practice | Viết Proposal của chính mình | Làm Dashboard từ dữ liệu thật | Xây Calendar cho sản phẩm thật | Viết script cho tác vụ thật |
| Companion Coaching | Chia bước bối cảnh→cấu trúc→soạn | Chia bước làm sạch dữ liệu→biểu đồ | Chia bước chủ đề→lịch→nội dung | Chia bước mô tả→sinh code→test |
| Workspace | document | data | document | automation |
| AI Agent | Writer Agent | Office Agent | Planner Agent + Writer Agent | Office Agent (code) |
| Output | .docx Proposal | .xlsx Dashboard | .md/.docx Calendar | .json/.md Script + hướng dẫn chạy |
| Review | Rõ ràng/đúng ngữ cảnh/sẵn sàng gửi | Đúng số liệu/dễ đọc/đủ insight | Nhất quán/đúng đối tượng/khả thi | Chạy được/an toàn/dễ bảo trì |
| Reflection | 1-2 câu | 1-2 câu | 1-2 câu | 1-2 câu |
| Capability Update | AI Writing → Practiced | AI Data → Practiced | AI Marketing → Practiced | AI Coding/Automation → Practiced |
| Growth Event | MISSION_COMPLETED | MISSION_COMPLETED | MISSION_COMPLETED | MISSION_COMPLETED |
| Unlock | Proposal nâng cao | Dashboard nâng cao | Campaign đa kênh | Automation nhiều bước |

Bảng trên chứng minh Curriculum Flow (mục 3) áp dụng nguyên vẹn cho Word,
Excel, PowerPoint, Marketing, Research, Content, Coding, Automation,
Affiliate, Business — không cần thay đổi kiến trúc khi mở rộng sang lĩnh
vực mới, chỉ thay nội dung từng bước.

---

Tài liệu này hoàn thiện bộ 4 chuẩn kiến trúc: Learning OS Principle →
Learning Journey Standard → Mission Library Standard → Learning Asset
Standard → AI Curriculum Standard (quy trình thực thi). Bước tiếp theo
(ngoài phạm vi task A4) là áp dụng toàn bộ 4 tài liệu để tổ chức Mission
đầu tiên từ nội dung CKOS hiện có.
