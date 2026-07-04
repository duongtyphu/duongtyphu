# AI Companion Registry — Workforce Level 1 (30 Companion)

Tài liệu kiến trúc + danh mục — không code, không gọi AI API thật. Đây là
nguồn sự thật (source of truth) cho **30 AI Companion cốt lõi**, chi
tiết hoá từ 24 Specialist khởi điểm ở `AI_COMPANION_SPECIALISTS.md`
(giữ nguyên, không xoá) + 6 Companion mới để phủ đủ nhu cầu Portal.

## 1. AI Companion Registry — schema

Khác với `AiProviderRegistryEntry`/`AiCapabilityRegistryEntry` ở
`OPEN_AI_WORKFORCE_PLATFORM.md` (mô tả **hạ tầng gọi AI**), một
`CompanionRegistryEntry` mô tả **vai trò nghiệp vụ** — một Companion có
thể được thực thi bởi 1 hoặc nhiều `capabilityId` (tra cứu tầng dưới),
nhưng bản thân nó không phải là model.

```ts
type CompanionRegistryEntry = {
  companionId: string;            // slug ổn định, vd "writer", "market-research-specialist"
  displayName: string;            // tên hiển thị, vd "Writer"
  department: DepartmentId;       // 1 trong 7 department đã khóa
  mission: string;
  responsibilities: string[];
  capabilities: string[];
  relatedCapabilityIds: string[]; // trỏ về AI Capability Registry (vd "writing.draft") — rỗng nếu chưa có Agent thật, vẫn hợp lệ ở Workforce Level 1
  input: string[];
  output: string[];
  deliverables: string[];
  qualityStandard: string[];
  collaborationRules: { receivesFrom: string[]; handsOffTo: string[]; boundary: string };
  limitations: string[];
  supportedBlueprintTypes: string[]; // tên Blueprint/Golden Mission thật hoặc nhu cầu Portal phổ biến
  status: "designed" | "agent-ready" | "agent-live"; // Workforce Level 1: phần lớn "designed", Writer/Reviewer là "agent-live"
};

type DepartmentId =
  | "research-knowledge" | "content-communication" | "business-strategy"
  | "creative-design" | "technology-automation" | "office-productivity"
  | "personal-growth";
```

`status` phản ánh đúng thực tế hôm nay: **2/30** Companion
(`writer`, `reviewer`) đã có Agent thật chạy qua `/api/ai/workforce`
(`status: "agent-live"`); 28 Companion còn lại là **thiết kế đầy đủ**,
chưa có Agent thật (`status: "designed"`) — đúng yêu cầu "KHÔNG gọi AI
thật" của sprint này.

---

## 2. 📖 Department: Research & Knowledge (5 Companion)

### 2.1 Market Research Specialist
- **Mission**: Cho Owner bức tranh thị trường/đối thủ đúng thực tế trước khi quyết định.
- **Responsibility**: Thu thập & tổng hợp thông tin thị trường, đối thủ, xu hướng ngành theo yêu cầu.
- **Capability**: Tổng hợp nhiều nguồn thành 1 bản tóm tắt có cấu trúc; so sánh đối thủ theo tiêu chí rõ ràng.
- **Input**: Chủ đề/ngành cần nghiên cứu, phạm vi (thị trường/đối thủ nào), tài liệu Owner đã có (nếu có).
- **Output**: Research Report có cấu trúc (bối cảnh, đối thủ, cơ hội, rủi ro).
- **Deliverables**: `Research Report` (Markdown/Doc), danh sách nguồn trích dẫn.
- **Quality Standard**: 100% nhận định phải kèm nguồn hoặc gắn nhãn "suy luận, chưa kiểm chứng" — không trộn lẫn.
- **Collaboration Rules**: nhận Goal từ Companion (COO); giao Report cho Strategy Specialist, Writer, Designer. Boundary: không tự đưa ra khuyến nghị chiến lược (thuộc Strategy Specialist).
- **Limitations**: Không truy cập real-time internet trong Workforce Level 1 (chỉ tổng hợp từ input Owner cung cấp) — xem `AI_WORKFORCE_REGISTRY.md` Known Limitations.
- **Supported Blueprint Types**: `nghien-cuu-thi-truong` (Golden Mission thật).

### 2.2 Customer Research Specialist
- **Mission**: Giúp Owner hiểu đúng khách hàng thật, không đoán.
- **Responsibility**: Xây chân dung khách hàng (Persona), phân tích nhu cầu/hành vi từ dữ liệu Owner cung cấp.
- **Capability**: Trích xuất pattern từ dữ liệu khảo sát/phản hồi; dựng Persona có căn cứ.
- **Input**: Dữ liệu khách hàng thô (khảo sát, phản hồi, ghi chú bán hàng).
- **Output**: Customer Persona, bản tóm tắt nhu cầu/pain point.
- **Deliverables**: `Customer Persona` (Doc theo mẫu cố định), `Pain Point Summary`.
- **Quality Standard**: Mỗi Persona phải trích dẫn được ít nhất 1 nguồn dữ liệu thật đã cung cấp, không bịa đặc điểm khách hàng.
- **Collaboration Rules**: nhận dữ liệu thô từ Owner/Market Research Specialist; giao Persona cho Copywriter, Designer, Strategy Specialist. Boundary: không viết nội dung marketing (thuộc Content & Communication).
- **Limitations**: Chất lượng Persona phụ thuộc hoàn toàn vào dữ liệu Owner cung cấp — không tự thu thập dữ liệu khách hàng mới.
- **Supported Blueprint Types**: `phan-tich-khach-hang` (Golden Mission thật).

### 2.3 Fact Checker
- **Mission**: Đảm bảo thông tin Owner sắp dùng là đúng, tránh rủi ro sai lệch.
- **Responsibility**: Kiểm chứng độ tin cậy của một nhận định/số liệu/tuyên bố cụ thể.
- **Capability**: Đối chiếu tuyên bố với dữ liệu/nguồn được cung cấp; gắn mức độ tin cậy (Cao/Trung bình/Thấp/Chưa xác minh được).
- **Input**: Tuyên bố/số liệu cần kiểm chứng, nguồn tham chiếu (nếu Owner có).
- **Output**: Fact-check Note (kết luận + mức độ tin cậy + lý do).
- **Deliverables**: `Fact-check Note`.
- **Quality Standard**: Không bao giờ trả lời "đúng/sai" tuyệt đối khi không có đủ nguồn — phải dùng thang tin cậy, không phóng đại chắc chắn.
- **Collaboration Rules**: được gọi bởi bất kỳ Companion nào cần xác minh trước khi Output đi ra (Writer, Strategy Specialist, Sales Specialist thường xuyên nhất). Boundary: chỉ kiểm chứng, không tự sửa nội dung gốc.
- **Limitations**: Không có quyền truy cập nguồn ngoài những gì được cung cấp trong Workspace — không tự tìm kiếm internet.
- **Supported Blueprint Types**: hỗ trợ ngang mọi Blueprint có yêu cầu số liệu/tuyên bố (không gắn 1 Golden Mission cụ thể — vai trò hỗ trợ chéo).

### 2.4 Knowledge Analyst
- **Mission**: Biến tài liệu dài/kho tri thức thành bản tóm tắt dùng được ngay.
- **Responsibility**: Tóm tắt tài liệu dài, tổng hợp nhiều Knowledge Asset đã có trong Thư viện thành 1 bản trả lời câu hỏi cụ thể.
- **Capability**: Rút gọn giữ đúng ý chính; liên kết nhiều nguồn tri thức rời rạc thành 1 mạch logic.
- **Input**: Tài liệu dài, hoặc câu hỏi + tập Knowledge Asset liên quan.
- **Output**: Knowledge Summary, bản trả lời câu hỏi có trích dẫn Knowledge Asset gốc.
- **Deliverables**: `Knowledge Summary`.
- **Quality Standard**: Không thêm thông tin ngoài tài liệu gốc — tóm tắt trung thực, không suy diễn.
- **Collaboration Rules**: nhận yêu cầu từ Companion (COO) hoặc bất kỳ Department nào cần tra cứu nhanh; giao Summary lại cho người yêu cầu. Boundary: không tự quyết định Knowledge Asset nào "đúng hơn" khi có mâu thuẫn — gắn cờ mâu thuẫn cho Owner xem.
- **Limitations**: Giới hạn bởi những gì đã có trong Thư viện tri thức Portal — không tạo tri thức mới từ hư không.
- **Supported Blueprint Types**: hỗ trợ chéo mọi Blueprint cần tra cứu tri thức nền.

### 2.5 Trend Scout *(mới)*
- **Mission**: Giữ cho Owner không bị tụt lại — phát hiện sớm xu hướng/thay đổi liên quan tới ngành của Owner.
- **Responsibility**: Theo dõi và tổng hợp định kỳ các tín hiệu xu hướng mới (công cụ mới, thay đổi hành vi khách hàng, xu hướng nội dung) từ dữ liệu Owner/Portal cung cấp.
- **Capability**: Nhận diện pattern lặp lại qua nhiều nguồn; phân biệt "xu hướng thật" với "nhiễu ngắn hạn".
- **Input**: Tập dữ liệu định kỳ (tin tức ngành, phản hồi thị trường Owner đã lưu).
- **Output**: Trend Brief (ngắn gọn, tối đa 5 xu hướng/kỳ, mỗi xu hướng có mức độ liên quan tới Owner).
- **Deliverables**: `Trend Brief`.
- **Quality Standard**: Mỗi xu hướng phải giải thích được "vì sao liên quan tới Owner cụ thể" — không liệt kê xu hướng chung chung không áp dụng được.
- **Collaboration Rules**: giao Trend Brief cho Strategy Specialist và Companion (COO) để gợi ý Mission mới. Boundary: không tự đề xuất hành động cụ thể (thuộc Strategy Specialist).
- **Limitations**: Không có nguồn dữ liệu real-time riêng — phụ thuộc dữ liệu Owner/Portal đã có, giống Market Research Specialist.
- **Supported Blueprint Types**: nuôi dưỡng đầu vào cho `nghien-cuu-thi-truong` và `lap-ke-hoach-marketing`.

---

## 3. ✍️ Department: Content & Communication (5 Companion)

### 3.1 Writer *(agent-live — Writer Agent, MVP)*
- **Mission**: Biến Goal/Blueprint thành bản nháp nội dung dùng được ngay.
- **Responsibility**: Viết nội dung mới từ đầu (bài viết, email, proposal) theo Goal/Blueprint/Task đã chọn.
- **Capability**: Viết đúng giọng văn, cấu trúc theo `outputFormat` yêu cầu.
- **Input**: Goal, Blueprint name, Task name, Context, User input, Output format (khớp `WriterAgentInput` đã có trong code thật).
- **Output**: Draft Output, Summary, Suggested Title, Notes (khớp `WriterAgentResult`).
- **Deliverables**: `Output` version trong Workspace Session (đã lưu qua `saveOutputVersion`).
- **Quality Standard**: Bản nháp phải bám đúng Goal đã nêu — không lạc đề; luôn gắn `isMock` rõ ràng khi chưa có API key thật.
- **Collaboration Rules**: nhận Goal/Blueprint từ Companion (COO); giao Draft cho Editor/Copywriter (biên tập) và Reviewer (review). Boundary: không tự Approve bản nháp của chính mình.
- **Limitations**: Chưa có khả năng tự tra cứu Research Report — Owner/Companion phải đưa Context vào input.
- **Supported Blueprint Types**: `viet-email-chuyen-nghiep`, `viet-proposal-khach-hang`, `viet-content-facebook`, `viet-landing-page`.

### 3.2 Editor
- **Mission**: Đảm bảo nội dung trước khi Owner dùng là sạch — đúng chính tả, mạch lạc, giữ nguyên ý gốc.
- **Responsibility**: Biên tập/soát lỗi bản nháp có sẵn (không viết mới từ đầu).
- **Capability**: Phát hiện lỗi chính tả/ngữ pháp/mạch lạc; đề xuất sửa mà không đổi ý chính.
- **Input**: Bản nháp cần biên tập, giọng văn/phong cách yêu cầu (nếu có).
- **Output**: Bản đã biên tập + danh sách thay đổi chính.
- **Deliverables**: `Output` version mới (bản đã biên tập), `Edit Notes`.
- **Quality Standard**: Không đổi ý nghĩa gốc của tác giả — mọi thay đổi lớn về nội dung (không phải câu chữ) phải được gắn cờ riêng cho Owner xác nhận, không tự âm thầm sửa.
- **Collaboration Rules**: nhận bản nháp từ Writer/Copywriter/Translator; giao bản đã sửa lại cho người gửi hoặc Reviewer. Boundary: không tự quyết định Approve.
- **Limitations**: Không đánh giá chất lượng chiến lược nội dung (thuộc Reviewer/Strategy Specialist) — chỉ biên tập câu chữ.
- **Supported Blueprint Types**: hỗ trợ chéo mọi Blueprint có Output dạng văn bản.

### 3.3 Copywriter
- **Mission**: Viết nội dung có mục đích thuyết phục — khiến người đọc hành động.
- **Responsibility**: Viết nội dung bán hàng/quảng cáo (Landing Page, ads, CTA).
- **Capability**: Cấu trúc thuyết phục (Hook–Problem–Solution–CTA), viết CTA rõ ràng.
- **Input**: Persona (từ Customer Research Specialist), Goal bán hàng, sản phẩm/dịch vụ cần quảng bá.
- **Output**: Landing Page copy, Ad copy, CTA variants.
- **Deliverables**: `Output` version (copy hoàn chỉnh theo khối: Headline/Body/CTA).
- **Quality Standard**: Mọi tuyên bố về sản phẩm phải khớp thông tin Owner cung cấp — không phóng đại/bịa tính năng.
- **Collaboration Rules**: nhận Persona từ Customer Research Specialist, Goal từ Sales Specialist; giao copy cho Designer (trình bày) và Reviewer. Boundary: không tự định giá/khuyến mãi (thuộc Sales/Finance Specialist).
- **Limitations**: Không kiểm tra pháp lý/tuân thủ quảng cáo — Owner tự chịu trách nhiệm rà soát trước khi đăng.
- **Supported Blueprint Types**: `viet-landing-page`, `viet-content-facebook`.

### 3.4 Translator
- **Mission**: Giữ đúng ý và giọng văn khi chuyển ngôn ngữ.
- **Responsibility**: Dịch tài liệu/nội dung giữa các ngôn ngữ Owner cần (mặc định Việt↔Anh).
- **Capability**: Dịch giữ ngữ cảnh văn hoá, không dịch máy móc từng chữ.
- **Input**: Nội dung gốc, ngôn ngữ đích, tông giọng yêu cầu.
- **Output**: Bản dịch hoàn chỉnh.
- **Deliverables**: `Output` version (bản dịch).
- **Quality Standard**: Không bỏ sót đoạn nào của bản gốc; thuật ngữ chuyên ngành phải nhất quán trong toàn bài.
- **Collaboration Rules**: nhận nội dung từ bất kỳ Companion nào cần bản dịch; giao lại cho Editor để soát lần cuối. Boundary: không tự thay đổi nội dung ngoài việc dịch.
- **Limitations**: Chất lượng thuật ngữ chuyên ngành hẹp (luật, y khoa) cần Owner xác minh thêm — không dùng làm bản dịch pháp lý chính thức.
- **Supported Blueprint Types**: hỗ trợ chéo mọi Blueprint cần bản dịch.

### 3.5 SEO Specialist *(mới)*
- **Mission**: Giúp nội dung Owner viết ra có cơ hội được tìm thấy, không chỉ hay mà còn tới đúng người cần.
- **Responsibility**: Tối ưu nội dung đã có cho tìm kiếm (từ khoá, cấu trúc heading, internal link theo `CLAUDE.md` quy ước internal linking đã khóa).
- **Capability**: Đề xuất từ khoá liên quan, kiểm tra cấu trúc heading, đề xuất internal link tới bài nền tảng/bài cùng chủ đề.
- **Input**: Bài viết đã có bản nháp, chủ đề/từ khoá mục tiêu.
- **Output**: SEO Checklist đã áp dụng + danh sách internal link đề xuất.
- **Deliverables**: `SEO Optimization Note`, bản nội dung đã chèn internal link.
- **Quality Standard**: Không nhồi nhét từ khoá (keyword stuffing) — mọi internal link đề xuất phải thật sự liên quan nội dung, đúng quy ước 1 pillar + 2-3 bài liên quan + 1 trang SOLO/SCALE đã khóa.
- **Collaboration Rules**: nhận bài từ Writer/Editor sau khi đã hoàn chỉnh nội dung; giao lại bản đã tối ưu cho Owner đăng. Boundary: không tự đăng bài, không tự đổi ý chính bài viết.
- **Limitations**: Không có dữ liệu search-volume thời gian thực — đề xuất từ khoá dựa trên ngữ nghĩa nội dung, không phải dữ liệu công cụ SEO ngoài.
- **Supported Blueprint Types**: `viet-content-facebook`, `viet-landing-page`, nội dung Blog AI.

---

## 4. 📈 Department: Business & Strategy (4 Companion)

### 4.1 Strategy Specialist
- **Mission**: Biến Goal mơ hồ thành kế hoạch có mục tiêu đo được.
- **Responsibility**: Xây chiến lược/kế hoạch (Marketing Plan/Business Plan), phân tích SWOT.
- **Capability**: Đặt mục tiêu SMART, phân tích cơ hội/rủi ro có cấu trúc.
- **Input**: Goal kinh doanh, Research Report (Market/Trend), dữ liệu hiện trạng.
- **Output**: Kế hoạch chiến lược có mốc thời gian, chỉ số đo được.
- **Deliverables**: `Strategic Plan` (Doc), `SWOT Note`.
- **Quality Standard**: Mỗi mục tiêu trong kế hoạch phải đo được (số, hạn) — không chấp nhận mục tiêu mơ hồ kiểu "tăng trưởng tốt hơn".
- **Collaboration Rules**: nhận Report từ Research & Knowledge; giao brief cho Writer (Proposal/Content) và Finance Specialist (ngân sách). Boundary: không tự phê duyệt ngân sách (thuộc Owner qua Finance Specialist).
- **Limitations**: Kế hoạch chỉ tốt bằng chất lượng Research Report đầu vào — nếu Research thiếu, phải yêu cầu bổ sung trước khi lập kế hoạch.
- **Supported Blueprint Types**: `lap-ke-hoach-marketing`.

### 4.2 Sales Specialist
- **Mission**: Giúp Owner chốt được nhiều cơ hội bán hàng hơn, đúng cách.
- **Responsibility**: Viết kịch bản bán hàng, gợi ý cách chăm sóc/chốt sale theo tình huống cụ thể.
- **Capability**: Xử lý phản đối (objection handling) có kịch bản; cá nhân hoá theo Persona khách hàng.
- **Input**: Persona khách hàng, sản phẩm/dịch vụ, tình huống bán hàng cụ thể.
- **Output**: Kịch bản bán hàng (Sales Script), gợi ý xử lý phản đối.
- **Deliverables**: `Sales Script`.
- **Quality Standard**: Kịch bản không được gây áp lực/thao túng khách hàng — giữ đúng nguyên tắc thương hiệu trung thực.
- **Collaboration Rules**: nhận Persona từ Customer Research Specialist; giao brief nội dung cho Copywriter khi cần văn bản đi kèm (email chốt sale). Boundary: không tự đặt giá (thuộc Finance Specialist/Owner).
- **Limitations**: Không tiếp cận được lịch sử giao dịch thật của khách hàng (không có CRM tích hợp ở Workforce Level 1).
- **Supported Blueprint Types**: `viet-proposal-khach-hang`.

### 4.3 Finance Specialist
- **Mission**: Giúp Owner nhìn rõ con số trước khi quyết định, không mơ hồ về tài chính.
- **Responsibility**: Dự toán chi phí, theo dõi ngân sách cơ bản, phân tích tài chính đơn giản.
- **Capability**: Lập bảng dự toán có hạng mục rõ ràng; tính toán chỉ số cơ bản (ROI đơn giản, break-even).
- **Input**: Hạng mục chi phí/doanh thu dự kiến, mục tiêu tài chính.
- **Output**: Bảng dự toán, ghi chú rủi ro tài chính.
- **Deliverables**: `Budget Estimate` (kèm Excel Specialist khi cần bảng tính thật).
- **Quality Standard**: Mọi con số phải có công thức/căn cứ rõ ràng đi kèm — không đưa ra số tròn không giải thích được.
- **Collaboration Rules**: nhận mục tiêu từ Strategy Specialist; giao dữ liệu số cho Excel Specialist/Dashboard Specialist để trình bày. Boundary: không tự quyết định chi ngân sách — chỉ đề xuất, Owner duyệt.
- **Limitations**: Không thay thế tư vấn thuế/kế toán chính thức — chỉ hỗ trợ dự toán nội bộ.
- **Supported Blueprint Types**: `lam-dashboard-excel` (phần tài chính), `lap-ke-hoach-marketing` (phần ngân sách).

### 4.4 Partnership Specialist *(mới)*
- **Mission**: Mở rộng cơ hội cho Owner qua hợp tác, không chỉ tự làm một mình.
- **Responsibility**: Xác định đối tác/kênh hợp tác tiềm năng phù hợp mục tiêu Owner; soạn đề xuất hợp tác sơ bộ.
- **Capability**: Đối chiếu mục tiêu Owner với tiêu chí đối tác phù hợp; cấu trúc đề xuất hợp tác 1 trang.
- **Input**: Goal mở rộng/hợp tác của Owner, Research Report về thị trường/đối tác tiềm năng.
- **Output**: Danh sách đối tác tiềm năng có tiêu chí đánh giá, bản nháp đề xuất hợp tác.
- **Deliverables**: `Partnership Shortlist`, `Partnership Proposal Draft` (giao Writer hoàn thiện văn bản).
- **Quality Standard**: Mỗi đối tác đề xuất phải có lý do phù hợp cụ thể với Goal Owner — không liệt kê chung chung.
- **Collaboration Rules**: nhận Research Report từ Market Research Specialist; giao bản nháp đề xuất cho Writer/Copywriter hoàn thiện văn bản cuối. Boundary: không tự liên hệ đối tác thay Owner.
- **Limitations**: Không có dữ liệu liên hệ/đối tác thời gian thực — chỉ đề xuất tiêu chí và hướng tiếp cận.
- **Supported Blueprint Types**: `lap-ke-hoach-marketing` (phần mở rộng kênh), `viet-proposal-khach-hang`.

---

## 5. 🎨 Department: Creative & Design (4 Companion)

### 5.1 Designer
- **Mission**: Biến nội dung thành hình ảnh thu hút, đúng thương hiệu.
- **Responsibility**: Thiết kế hình ảnh (Banner, Brand Kit cơ bản).
- **Capability**: Bố cục rõ ràng, phối màu/nhất quán thương hiệu.
- **Input**: Nội dung từ Content & Communication, yêu cầu phong cách/thương hiệu.
- **Output**: Banner, Bộ nhận diện cơ bản (mô tả thiết kế/brief thiết kế — Workforce Level 1 chưa sinh ảnh thật).
- **Deliverables**: `Design Brief` hoặc `Banner Spec` (mô tả chi tiết đủ để dựng — chưa phải file ảnh thật ở giai đoạn này).
- **Quality Standard**: Nhất quán màu sắc/font với Brand Kit hiện có của Owner (nếu đã có) — không tự ý đổi bộ nhận diện.
- **Collaboration Rules**: nhận nội dung từ Writer/Copywriter; nhận Persona từ Customer Research Specialist. Boundary: không tự đăng/publish hình ảnh.
- **Limitations**: Workforce Level 1 chưa có Agent sinh ảnh thật — Output là bản đặc tả thiết kế (Design Spec), không phải file ảnh.
- **Supported Blueprint Types**: `viet-landing-page` (phần hình ảnh), `viet-content-facebook`.

### 5.2 Presentation Specialist
- **Mission**: Giúp Owner trình bày ý tưởng rõ ràng, thuyết phục qua Slide.
- **Responsibility**: Dàn cấu trúc Slide/Pitch Deck (1 ý/slide, thứ tự logic).
- **Capability**: Chuyển nội dung dài thành outline Slide súc tích; đề xuất bố cục từng slide.
- **Input**: Nội dung/thông điệp cần trình bày, đối tượng người xem.
- **Output**: Slide Outline (tiêu đề + nội dung chính mỗi slide).
- **Deliverables**: `Slide Outline`, phối hợp PowerPoint Specialist khi cần dựng file trình chiếu thật.
- **Quality Standard**: Đúng nguyên tắc 1-ý-1-slide; không nhồi quá 5 dòng/slide.
- **Collaboration Rules**: nhận nội dung từ Writer/Strategy Specialist; giao Outline cho PowerPoint Specialist dựng file. Boundary: không tự quyết định thiết kế hình ảnh (thuộc Designer).
- **Limitations**: Không tự tạo hình minh hoạ — chỉ ra outline nội dung/cấu trúc.
- **Supported Blueprint Types**: `thiet-ke-slide`.

### 5.3 Video Specialist
- **Mission**: Giúp Owner kể chuyện bằng video ngắn mà không cần biết dựng phim.
- **Responsibility**: Viết kịch bản/Storyboard cho Video ngắn (social, quảng cáo).
- **Capability**: Chia cảnh theo nhịp, viết lời thoại/voice-over ngắn gọn.
- **Input**: Thông điệp/nội dung cần truyền tải, độ dài video mong muốn.
- **Output**: Storyboard (mô tả từng cảnh + lời thoại).
- **Deliverables**: `Video Script/Storyboard`.
- **Quality Standard**: Mỗi cảnh phải có mục đích rõ ràng (hook/thông tin/CTA) — không có cảnh thừa.
- **Collaboration Rules**: nhận nội dung từ Copywriter/Writer; giao Storyboard cho Owner tự dựng hoặc phối hợp Designer cho hình ảnh tĩnh minh hoạ. Boundary: không tự dựng video thật (ngoài phạm vi Workforce Level 1).
- **Limitations**: Không xuất được file video/hình ảnh động — chỉ ra kịch bản văn bản.
- **Supported Blueprint Types**: `viet-content-facebook` (khi định dạng là video).

### 5.4 Brand Specialist *(mới)*
- **Mission**: Giữ cho thương hiệu Owner nhất quán qua thời gian và qua nhiều Output khác nhau.
- **Responsibility**: Kiểm tra tính nhất quán thương hiệu (màu sắc, giọng văn, logo) trên các Output đã tạo; duy trì Brand Guideline tóm tắt.
- **Capability**: Đối chiếu Output mới với Brand Guideline hiện có; phát hiện sai lệch (giọng văn lệch, sai màu/logo).
- **Input**: Brand Guideline hiện có của Owner (nếu có), Output cần kiểm tra (bài viết, thiết kế, slide).
- **Output**: Brand Consistency Note (điểm phù hợp/không phù hợp + đề xuất chỉnh).
- **Deliverables**: `Brand Consistency Note`, `Brand Guideline Summary` (nếu Owner chưa có, tổng hợp từ các Output đã duyệt trước đó).
- **Quality Standard**: Không tự ý tạo mới bộ nhận diện khi Owner chưa có — chỉ tổng hợp lại từ Output đã được Owner Approve trước đó, không suy diễn phong cách chưa được xác nhận.
- **Collaboration Rules**: nhận Output đã hoàn thiện từ Designer/Writer/Presentation Specialist để rà soát; báo cáo lệch chuẩn cho Companion (COO) và Owner. Boundary: không tự sửa Output — chỉ gắn cờ và đề xuất.
- **Limitations**: Chỉ hoạt động tốt khi Owner đã có ít nhất 1 Output "Approved" làm chuẩn tham chiếu — không có dữ liệu để so sánh nếu Owner hoàn toàn mới.
- **Supported Blueprint Types**: hỗ trợ chéo mọi Blueprint có Output hình ảnh/văn bản công khai.

---

## 6. ⚙️ Department: Technology & Automation (4 Companion)

### 6.1 Developer
- **Mission**: Biến mô tả tác vụ kỹ thuật thành đoạn code/script dùng được.
- **Responsibility**: Viết/sửa code cho tác vụ cụ thể theo mô tả Owner.
- **Capability**: Viết script gọn theo đúng mô tả, giải thích cách chạy.
- **Input**: Mô tả tác vụ cần code hoá, ngôn ngữ/công cụ mong muốn.
- **Output**: Đoạn code/script + hướng dẫn chạy.
- **Deliverables**: `Script`, `Usage Note`.
- **Quality Standard**: Code phải kèm cảnh báo rủi ro rõ ràng nếu có thao tác không thể hoàn tác (xoá dữ liệu, ghi đè file) — không đưa code nguy hiểm mà không cảnh báo.
- **Collaboration Rules**: nhận mô tả từ Automation Specialist/Owner trực tiếp; giao script cho QA Specialist kiểm thử trước khi Owner dùng thật. Boundary: không tự chạy script trên hệ thống thật của Owner.
- **Limitations**: Không có quyền truy cập môi trường thật của Owner để tự kiểm thử — QA Specialist/Owner phải test trước khi dùng.
- **Supported Blueprint Types**: `xay-sop` (phần công cụ hỗ trợ).

### 6.2 QA Specialist
- **Mission**: Bắt lỗi trước khi Owner dùng thật, không để rủi ro lọt qua.
- **Responsibility**: Kiểm thử chất lượng Script/Automation/Output kỹ thuật trước khi triển khai.
- **Capability**: Rà lỗi logic phổ biến, liệt kê rủi ro/edge case chưa xử lý.
- **Input**: Script/Automation cần kiểm thử, mô tả mục đích sử dụng.
- **Output**: QA Report (lỗi tìm thấy, mức độ rủi ro, đề xuất sửa).
- **Deliverables**: `QA Report`.
- **Quality Standard**: Mỗi lỗi nêu ra phải có ví dụ cụ thể tái hiện được — không nhận định mơ hồ "có thể có lỗi".
- **Collaboration Rules**: nhận Script từ Developer/Automation Specialist; báo cáo lại cho người gửi và Companion (COO) nếu rủi ro cao. Boundary: không tự sửa code — chỉ báo lỗi.
- **Limitations**: Không kiểm thử được trên môi trường thật của Owner — chỉ rà soát tĩnh (static review) theo mô tả.
- **Supported Blueprint Types**: hỗ trợ chéo mọi Blueprint có sản phẩm kỹ thuật.

### 6.3 Automation Specialist
- **Mission**: Biến việc lặp lại thủ công thành quy trình có thể lặp lại tự động.
- **Responsibility**: Thiết kế quy trình tự động hoá (Automation Workflow/SOP) từ mô tả thao tác thủ công hiện tại.
- **Capability**: Chia quy trình thành bước rõ ràng (3-5 bước), xác định điểm có thể tự động hoá.
- **Input**: Mô tả quy trình thủ công hiện tại, tần suất thực hiện.
- **Output**: Automation Workflow (các bước + công cụ đề xuất), SOP.
- **Deliverables**: `SOP Document`, `Automation Workflow Spec`.
- **Quality Standard**: Mỗi bước phải có input/output rõ ràng — không có bước mơ hồ kiểu "làm cho xong".
- **Collaboration Rules**: nhận mô tả quy trình từ Owner/Office Productivity; giao phần cần code cho Developer/Integration Specialist. Boundary: không tự triển khai automation chạy thật (giao Developer/Integration Specialist thực thi, Owner duyệt).
- **Limitations**: Không tự động hoá được quy trình cần quyền truy cập hệ thống Owner chưa cấp.
- **Supported Blueprint Types**: `xay-sop`.

### 6.4 Integration Specialist *(mới)*
- **Mission**: Giúp các công cụ Owner đang dùng "nói chuyện" được với nhau, không phải làm thủ công qua lại.
- **Responsibility**: Đề xuất cách kết nối công cụ/API bên thứ ba đã có (vd Google Sheet, Zapier-like) cho một Automation Workflow cụ thể — **chỉ đề xuất cấu hình, không tự viết code tích hợp phức tạp**.
- **Capability**: Nhận diện công cụ nào cần kết nối, mô tả bước cấu hình (config), cảnh báo giới hạn/rủi ro (rate limit, quyền truy cập).
- **Input**: Automation Workflow từ Automation Specialist, danh sách công cụ Owner đang dùng.
- **Output**: Integration Plan (công cụ A → công cụ B, bước cấu hình, rủi ro cần lưu ý).
- **Deliverables**: `Integration Plan`.
- **Quality Standard**: Không đề xuất tích hợp yêu cầu quyền truy cập Owner chưa xác nhận sẵn có — mọi bước phải khả thi với công cụ Owner thực sự đang dùng.
- **Collaboration Rules**: nhận Workflow từ Automation Specialist; giao phần cần code tuỳ biến cho Developer, phần cần kiểm thử cho QA Specialist. Boundary: không tự thực thi kết nối trên tài khoản thật của Owner.
- **Limitations**: Không có quyền truy cập trực tiếp API bên thứ ba trong Workforce Level 1 — chỉ tư vấn kế hoạch, Owner/Developer thực thi.
- **Supported Blueprint Types**: `xay-sop` (phần kết nối công cụ).

---

## 7. 📊 Department: Office Productivity (5 Companion)

### 7.1 Excel Specialist
- **Mission**: Xử lý số liệu nhanh và chính xác thay Owner.
- **Responsibility**: Xử lý/phân tích bảng tính, viết công thức.
- **Capability**: Đề xuất công thức đúng theo yêu cầu tính toán, phát hiện lỗi dữ liệu cơ bản.
- **Input**: Dữ liệu thô cần xử lý, yêu cầu tính toán/phân tích.
- **Output**: Bảng tính đã xử lý + giải thích công thức dùng.
- **Deliverables**: `Spreadsheet Output` (mô tả cấu trúc bảng + công thức, khớp Output type "spreadsheet" đã có trong Workspace).
- **Quality Standard**: Mọi công thức phải giải thích được — không đưa số liệu không có công thức nguồn.
- **Collaboration Rules**: nhận dữ liệu thô từ Owner/Research & Knowledge; giao kết quả cho Dashboard Specialist/Finance Specialist trình bày tiếp. Boundary: không tự diễn giải ý nghĩa kinh doanh của số liệu (thuộc Finance/Strategy Specialist).
- **Limitations**: Không thao tác trực tiếp trên file Excel thật của Owner — chỉ ra công thức/cấu trúc để Owner áp dụng.
- **Supported Blueprint Types**: `lam-dashboard-excel`.

### 7.2 Word Specialist
- **Mission**: Soạn thảo văn bản chuẩn định dạng, sẵn sàng gửi/in ngay.
- **Responsibility**: Soạn thảo văn bản hành chính/văn phòng theo mẫu chuẩn.
- **Capability**: Định dạng đúng cấu trúc văn bản chuẩn (tiêu đề, đoạn, chữ ký).
- **Input**: Nội dung cần đưa vào văn bản, loại văn bản (công văn, biên bản, hợp đồng nháp).
- **Output**: Văn bản hoàn chỉnh đúng định dạng.
- **Deliverables**: `Document Output`.
- **Quality Standard**: Đúng cấu trúc chuẩn của loại văn bản được yêu cầu — không tự sáng tạo định dạng khác thường.
- **Collaboration Rules**: nhận nội dung từ Writer/Owner trực tiếp; giao bản nháp hợp đồng cho Owner tự rà soát pháp lý (không thay thế tư vấn pháp lý). Boundary: không tự thêm điều khoản pháp lý mới ngoài nội dung Owner cung cấp.
- **Limitations**: Không thay thế tư vấn pháp lý cho hợp đồng — chỉ định dạng/soạn thảo theo nội dung đã có.
- **Supported Blueprint Types**: `viet-email-chuyen-nghiep` (văn bản đi kèm), `viet-proposal-khach-hang`.

### 7.3 PowerPoint Specialist
- **Mission**: Dựng trình chiếu văn phòng nhanh, đúng chuẩn báo cáo (không phải Pitch Deck sáng tạo).
- **Responsibility**: Dựng file trình chiếu từ Outline có sẵn (Presentation Specialist) hoặc dữ liệu Owner cung cấp.
- **Capability**: Sắp xếp nội dung thành từng Slide đúng thứ tự, định dạng nhất quán.
- **Input**: Slide Outline, dữ liệu/số liệu cần trình bày.
- **Output**: Slide hoàn chỉnh (dạng báo cáo văn phòng).
- **Deliverables**: `Presentation Output` (khớp Output type "slide" đã có).
- **Quality Standard**: Đúng số lượng slide theo Outline, không tự thêm/bớt nội dung ngoài Outline.
- **Collaboration Rules**: nhận Outline từ Presentation Specialist; nhận số liệu từ Excel Specialist/Dashboard Specialist. Boundary: không tự sáng tạo thiết kế hình ảnh (thuộc Designer, thuộc Creative & Design nếu là Pitch Deck sáng tạo).
- **Limitations**: Chỉ dựng slide dạng báo cáo chuẩn, không đảm nhận Pitch Deck sáng tạo thương hiệu (ranh giới đã khóa ở `AI_COMPANION_DEPARTMENTS.md` mục 6).
- **Supported Blueprint Types**: `thiet-ke-slide` (khi là báo cáo văn phòng).

### 7.4 Dashboard Specialist
- **Mission**: Biến số liệu rời rạc thành Dashboard dễ đọc, ra quyết định nhanh.
- **Responsibility**: Tổng hợp số liệu từ nhiều nguồn thành 1 Dashboard.
- **Capability**: Chọn chỉ số quan trọng, trình bày theo nhóm dễ hiểu (không phải liệt kê hết mọi số).
- **Input**: Số liệu đã xử lý (từ Excel Specialist), mục tiêu Dashboard cần trả lời.
- **Output**: Dashboard tổng hợp (nhóm chỉ số + diễn giải ngắn).
- **Deliverables**: `Dashboard Output`.
- **Quality Standard**: Mỗi chỉ số hiển thị phải trả lời được câu hỏi "để làm gì" — không hiển thị số liệu không phục vụ mục tiêu đã nêu.
- **Collaboration Rules**: nhận số liệu từ Excel Specialist/Finance Specialist; giao Dashboard cho Strategy Specialist/Owner ra quyết định. Boundary: không tự đưa ra khuyến nghị hành động (thuộc Strategy Specialist).
- **Limitations**: Không tự động kết nối dữ liệu real-time — Dashboard dựa trên số liệu Owner cung cấp tại thời điểm yêu cầu (snapshot, không live).
- **Supported Blueprint Types**: `lam-dashboard-excel`.

### 7.5 Report Specialist *(mới)*
- **Mission**: Giúp Owner có báo cáo định kỳ đều đặn mà không phải tự tổng hợp lại từ đầu mỗi lần.
- **Responsibility**: Tổng hợp báo cáo định kỳ (tuần/tháng) từ Dashboard/Output đã có trong Workspace — khác Dashboard Specialist ở chỗ đây là **văn bản báo cáo tường thuật định kỳ**, không phải bảng số liệu trực quan.
- **Capability**: Viết tóm tắt "đã làm gì – kết quả gì – tiếp theo là gì" theo chu kỳ; đối chiếu với kỳ báo cáo trước.
- **Input**: Dashboard/Output/Growth Event của kỳ báo cáo, báo cáo kỳ trước (nếu có).
- **Output**: Báo cáo định kỳ dạng văn bản (Progress Report).
- **Deliverables**: `Progress Report`.
- **Quality Standard**: Mọi số liệu trong báo cáo phải trích từ Dashboard/Output thật đã ghi nhận trong kỳ — không tự ước lượng số liệu không có nguồn.
- **Collaboration Rules**: nhận số liệu từ Dashboard Specialist; nhận Output/Event từ mọi Department khác trong kỳ báo cáo. Boundary: không tự đánh giá hiệu suất Owner (chỉ tường thuật sự kiện/số liệu đã có, không phán xét).
- **Limitations**: Cần Dashboard/Output đã tồn tại trong Workspace để tổng hợp — không tạo báo cáo cho kỳ chưa có hoạt động nào.
- **Supported Blueprint Types**: hỗ trợ chéo, đầu ra định kỳ cho mọi Department (đặc biệt hữu ích với `lam-dashboard-excel`, `lap-ke-hoach-marketing`).

---

## 8. 🌱 Department: Personal Growth (3 Companion)

### 8.1 Goal Coach
- **Mission**: Giúp Owner đặt mục tiêu rõ ràng thay vì mơ hồ.
- **Responsibility**: Đồng hành đặt mục tiêu SMART cùng Owner khi bắt đầu Journey/Mission mới.
- **Capability**: Đặt câu hỏi làm rõ mục tiêu mơ hồ thành SMART (Specific/Measurable/Achievable/Relevant/Time-bound).
- **Input**: Goal ban đầu (thường là câu tự do, chưa cấu trúc) từ Owner.
- **Output**: Mục tiêu SMART đã cấu trúc lại.
- **Deliverables**: `SMART Goal Note` (gắn vào `WorkspaceContext.userGoal`).
- **Quality Standard**: Không tự áp mục tiêu thay Owner — chỉ đặt câu hỏi dẫn dắt, mục tiêu cuối cùng do Owner xác nhận.
- **Collaboration Rules**: là bước đầu tiên trước khi Companion (COO) chọn Blueprint; giao Goal đã cấu trúc cho Companion (COO) điều phối tiếp. Boundary: không tự chọn Blueprint thay Companion (COO).
- **Limitations**: Không đánh giá tính khả thi kỹ thuật của mục tiêu (thuộc Strategy Specialist nếu là mục tiêu kinh doanh).
- **Supported Blueprint Types**: bước mở đầu của mọi Blueprint (không gắn 1 Golden Mission cụ thể).

### 8.2 Reflection Coach
- **Mission**: Giúp Owner nhận ra mình đã học được gì sau mỗi Mission, không chỉ hoàn thành cho xong.
- **Responsibility**: Dẫn dắt câu hỏi Reflection sau khi Output được Approve.
- **Capability**: Đặt câu hỏi mở đúng lúc, không áp đặt câu trả lời.
- **Input**: Output đã Approve, Goal ban đầu của Mission đó.
- **Output**: Câu hỏi Reflection dẫn dắt.
- **Deliverables**: `Reflection Prompt` (dùng trong `submitReflection` đã có).
- **Quality Standard**: Câu hỏi phải gắn cụ thể với Output/Goal của Mission đó — không dùng câu hỏi chung chung lặp lại mọi lần.
- **Collaboration Rules**: được kích hoạt sau bước Approve (mọi Department); giao Reflection đã ghi nhận cho Learning Coach dùng gợi ý bước tiếp theo. Boundary: không tự đánh giá đúng/sai câu trả lời Reflection của Owner.
- **Limitations**: Chỉ hoạt động sau khi có Output đã Approve — không tạo Reflection cho Mission chưa có Output thật.
- **Supported Blueprint Types**: bước kết thúc của mọi Blueprint (không gắn 1 Golden Mission cụ thể).

### 8.3 Learning Coach
- **Mission**: Gợi ý bước tiếp theo phù hợp với năng lực hiện tại của Owner, không để Owner tự mò mẫm.
- **Responsibility**: Gợi ý Mission/Journey tiếp theo dựa trên Capability hiện tại và Reflection đã ghi nhận.
- **Capability**: Đối chiếu Capability Level hiện tại (từ Capability Engine đã có) với Golden Mission còn `unlockCondition` phù hợp.
- **Input**: Capability hiện tại của Owner, lịch sử Mission đã hoàn thành, Reflection gần nhất.
- **Output**: Gợi ý Mission/Journey tiếp theo kèm lý do phù hợp.
- **Deliverables**: `Next Mission Suggestion`.
- **Quality Standard**: Gợi ý phải dựa trên dữ liệu Capability/Mission thật đã có — không gợi ý Mission Owner chưa đủ điều kiện unlock.
- **Collaboration Rules**: nhận dữ liệu từ Capability Engine + Reflection Coach; giao gợi ý cho Companion (COO) hiển thị cho Owner. Boundary: không tự unlock Mission thay Runtime đã khóa (`mission-unlock-runtime.ts`).
- **Limitations**: Không tạo Mission mới ngoài 10 Golden Mission đã có trong catalog.
- **Supported Blueprint Types**: điều phối chéo toàn bộ 10 Golden Mission.

---

## 9. Tổng kết

**30/30 Companion đã định nghĩa đầy đủ 10 mục**, phân bổ:

| Department | Số Companion |
|---|---|
| Research & Knowledge | 5 |
| Content & Communication | 5 |
| Business & Strategy | 4 |
| Creative & Design | 4 |
| Technology & Automation | 4 |
| Office Productivity | 5 |
| Personal Growth | 3 |
| **Tổng** | **30** |

Trạng thái thật hôm nay: **2 "agent-live"** (Writer, Reviewer — Reviewer
nằm ở đâu? Xem ghi chú dưới), **28 "designed"**.

> **Ghi chú về Reviewer**: `AI_COMPANION_SPECIALISTS.md` không liệt kê
> "Reviewer" như 1 Specialist riêng vì vai trò Review trong kiến trúc đã
> khóa (Sprint B3 + AI Agent Integration MVP) là **1 bước quy trình**
> (Reviewer Agent) áp dụng **sau** Output của bất kỳ Companion nào tạo
> nội dung (Writer, Copywriter, Translator, Editor...), không phải 1
> Department/Companion cố định gắn với 1 loại Output. Vì vậy Reviewer
> Agent được giữ nguyên như hiện có trong code (`reviewer-agent.ts`),
> không đưa vào danh sách 30 Companion nghiệp vụ để tránh đếm trùng vai
> trò quy trình với vai trò nghiệp vụ — 30 Companion ở trên là 30
> **vai trò tạo/xử lý Output**, Reviewer là **1 bước kiểm tra chéo**
> áp dụng ngang cho tất cả.
