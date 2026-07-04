# AI Companion Collaboration Matrix

Tài liệu kiến trúc — không code. Mô tả chính xác **ai giao việc cho ai**
giữa 30 Companion (`AI_COMPANION_REGISTRY.md`), để Companion (COO) có
thể điều phối toàn bộ Workforce theo đúng Exit Criteria "Companion điều
phối được toàn bộ Workforce".

## 1. Nguyên tắc điều phối (không đổi)

- **Owner không tự chọn Companion.** Owner chỉ nói Goal → Companion
  (COO) chọn Blueprint (đã khóa, `startCompanionWorkspace`) → Blueprint
  tự biết cần chuỗi Companion nào (bảng §3 dưới).
- **Companion không tự giao việc chéo ngoài chuỗi đã định nghĩa.** Một
  Companion chỉ được liệt kê "handsOffTo" đúng như Registry — không tự
  ý gọi Companion khác ngoài danh sách, tránh hỗn loạn điều phối.
- **Fact Checker, Knowledge Analyst, Editor, QA Specialist là "hỗ trợ
  chéo"** (cross-cutting) — không thuộc 1 chuỗi Blueprint cố định, được
  gọi bởi bất kỳ Companion nào khi cần, không cần khai báo lại trong mỗi
  chuỗi.
- **Reflection Coach/Learning Coach luôn ở cuối mọi chuỗi** (sau
  Approve) — đã khóa từ kiến trúc Sprint B3/B4, áp dụng chung cho mọi
  Blueprint, không lặp lại trong từng dòng ma trận.

## 2. Ma trận giao tiếp trực tiếp (receivesFrom / handsOffTo)

Tổng hợp từ Collaboration Rules của từng Companion trong Registry —
dạng cạnh (edge) của đồ thị điều phối:

| Từ Companion | Giao việc cho (`handsOffTo`) |
|---|---|
| Market Research Specialist | Strategy Specialist, Writer, Designer, Partnership Specialist |
| Customer Research Specialist | Copywriter, Designer, Strategy Specialist, Sales Specialist |
| Trend Scout | Strategy Specialist, Companion (COO) |
| Writer | Editor, Copywriter (khi cần thuyết phục hơn), Reviewer (bước Review đã khóa) |
| Editor | người gửi ban đầu (Writer/Copywriter/Translator), hoặc Reviewer |
| Copywriter | Designer, Reviewer |
| Translator | Editor |
| SEO Specialist | Owner (bước cuối trước khi đăng) |
| Strategy Specialist | Writer (Proposal/Content brief), Finance Specialist |
| Sales Specialist | Copywriter (văn bản đi kèm) |
| Finance Specialist | Excel Specialist, Dashboard Specialist |
| Partnership Specialist | Writer/Copywriter (hoàn thiện văn bản đề xuất) |
| Designer | *(cuối chuỗi hình ảnh — giao Owner hoặc Brand Specialist rà soát)* |
| Presentation Specialist | PowerPoint Specialist |
| Video Specialist | Owner / Designer (hình ảnh tĩnh minh hoạ) |
| Brand Specialist | Companion (COO) + Owner (báo cáo lệch chuẩn) |
| Developer | QA Specialist |
| QA Specialist | người gửi ban đầu (Developer/Automation Specialist) + Companion (COO) nếu rủi ro cao |
| Automation Specialist | Developer, Integration Specialist |
| Integration Specialist | Developer (code tuỳ biến), QA Specialist (kiểm thử) |
| Excel Specialist | Dashboard Specialist, Finance Specialist |
| Word Specialist | Owner (rà soát pháp lý nếu là hợp đồng) |
| PowerPoint Specialist | Owner |
| Dashboard Specialist | Strategy Specialist, Owner |
| Report Specialist | Owner |
| Goal Coach | Companion (COO) |
| Reflection Coach | Learning Coach |
| Learning Coach | Companion (COO) |

**Companion hỗ trợ chéo (được gọi từ bất kỳ node nào ở trên, không lặp
lại từng cạnh)**: Fact Checker, Knowledge Analyst, Editor (khi không
phải người gửi gốc), QA Specialist (khi không phải chuỗi Technology).

## 3. Chuỗi điều phối theo Blueprint Type (Golden Mission) — góc nhìn Companion COO

Đây là thứ Companion (COO) thực sự tra cứu khi Owner chọn 1 Blueprint —
chuỗi tuần tự các Companion tham gia, khớp với `EXECUTION_TIMELINE`
(mission_started → preparing → research → draft → review → revision →
completed) đã khóa trong `execution-orchestrator.ts`:

| Blueprint (`missionId`) | Chuỗi Companion (thứ tự thực thi) |
|---|---|
| `viet-email-chuyen-nghiep` | Goal Coach → Writer → Editor → Word Specialist → *(Reviewer)* → Reflection Coach |
| `viet-proposal-khach-hang` | Goal Coach → Market Research Specialist → Sales Specialist → Writer → Word Specialist → *(Reviewer)* → Reflection Coach |
| `lam-dashboard-excel` | Goal Coach → Excel Specialist → Finance Specialist (nếu tài chính) → Dashboard Specialist → *(Reviewer)* → Reflection Coach |
| `thiet-ke-slide` | Goal Coach → Presentation Specialist → PowerPoint Specialist/Designer (tuỳ báo cáo hay sáng tạo) → *(Reviewer)* → Reflection Coach |
| `viet-landing-page` | Goal Coach → Customer Research Specialist → Copywriter → SEO Specialist → Designer → *(Reviewer)* → Reflection Coach |
| `viet-content-facebook` | Goal Coach → Writer → SEO Specialist/Video Specialist (tuỳ định dạng) → *(Reviewer)* → Reflection Coach |
| `nghien-cuu-thi-truong` | Goal Coach → Market Research Specialist → Trend Scout → Fact Checker → *(Reviewer)* → Reflection Coach |
| `phan-tich-khach-hang` | Goal Coach → Customer Research Specialist → Fact Checker → *(Reviewer)* → Reflection Coach |
| `xay-sop` | Goal Coach → Automation Specialist → Integration Specialist → Developer → QA Specialist → *(Reviewer)* → Reflection Coach |
| `lap-ke-hoach-marketing` | Goal Coach → Trend Scout → Market Research Specialist → Strategy Specialist → Finance Specialist → Partnership Specialist → *(Reviewer)* → Reflection Coach |

`*(Reviewer)*` giữ nguyên vị trí đã có trong kiến trúc AI Agent
Integration MVP — áp dụng ngang cho mọi chuỗi, không lặp lại logic
review riêng cho từng Blueprint.

## 4. Ma trận theo cặp — khi nào 2 Companion cùng Department phối hợp trực tiếp

| Cặp cùng Department | Tình huống phối hợp |
|---|---|
| Writer ↔ Editor | Mọi bản nháp trước khi qua Review |
| Writer ↔ Copywriter | Khi 1 nội dung cần cả phần thông tin (Writer) và phần thuyết phục bán hàng (Copywriter) — vd Proposal có đoạn giới thiệu + đoạn chốt sale |
| Strategy Specialist ↔ Finance Specialist | Mọi kế hoạch có cấu phần ngân sách |
| Excel Specialist ↔ Dashboard Specialist | Mọi yêu cầu "biến số liệu thành Dashboard" |
| Automation Specialist ↔ Integration Specialist | Khi Automation Workflow cần kết nối công cụ bên ngoài |
| Presentation Specialist ↔ PowerPoint Specialist | Mọi Slide — Outline trước, dựng file sau |

## 5. Ranh giới điều phối (không được vi phạm)

1. Không Companion nào được **bỏ qua Reviewer** để tự đưa Output thẳng
   tới Approve.
2. Không Companion nào được **tự gọi Reflection Coach** trước khi Owner
   Approve — Reflection chỉ khởi động sau Approve (đã khóa).
3. **Fact Checker/QA Specialist không có quyền "hạ gục" Output** — họ
   chỉ báo cáo, quyết định sửa/dùng tiếp vẫn là Companion gốc + Owner.
4. Khi 2 Companion cho kết quả mâu thuẫn (vd Fact Checker nói sai,
   Writer không sửa) — Companion (COO) là nơi trung gian trình lên
   Owner quyết định, không Companion nào tự "thắng" Companion khác.
