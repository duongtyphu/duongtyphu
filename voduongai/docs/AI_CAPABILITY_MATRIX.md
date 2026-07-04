# AI Companion Team — Capability Matrix

Tài liệu kiến trúc — không code, không gọi AI API. Mỗi Specialist (24,
`AI_COMPANION_SPECIALISTS.md`) được định nghĩa cụ thể — không chung
chung: Capabilities/Input/Output/Deliverables/Evidence/Dependencies.

`Evidence` dùng chung khái niệm Evidence đã khóa ở EPIC 03
(`CAPABILITY_EVIDENCE_FRAMEWORK.md`) — Output + Review + Reflection, không
tạo khái niệm Evidence riêng cho AI Companion Team.

---

## 📖 Research & Knowledge

### Market Research Specialist
- **Capabilities**: phân tích xu hướng ngành, so sánh đối thủ trực tiếp, tổng hợp báo cáo thị trường ngắn gọn.
- **Input**: chủ đề/ngành cần nghiên cứu, danh sách đối thủ (nếu có).
- **Output**: Research Report có cấu trúc (Câu hỏi → Thu thập → Tổng hợp → Kết luận).
- **Deliverables**: file `.docx`/`.md` Research Report, kèm danh sách nguồn trích dẫn.
- **Evidence**: Output đã Review (Owner xác nhận thông tin đúng) + Reflection.
- **Dependencies**: cần Owner cung cấp phạm vi ngành/khu vực rõ ràng trước khi bắt đầu.

### Customer Research Specialist
- **Capabilities**: xây chân dung khách hàng (persona), phân tích hành vi mua hàng từ dữ liệu có sẵn.
- **Input**: dữ liệu khách hàng hiện có (đơn hàng, khảo sát) hoặc mô tả khách hàng mục tiêu.
- **Output**: Customer Persona, bản phân tích hành vi/nhu cầu.
- **Deliverables**: file mô tả persona `.docx`, bảng phân khúc `.xlsx` (phối hợp Excel Specialist nếu cần).
- **Evidence**: Output đã Review + có Business Impact (insight dẫn tới hành động thật).
- **Dependencies**: cần dữ liệu khách hàng thật tối thiểu (không suy diễn khi không có dữ liệu).

### Fact Checker
- **Capabilities**: đánh giá độ tin cậy nguồn, đối chiếu thông tin AI tổng hợp với nguồn gốc.
- **Input**: nội dung/thông tin cần kiểm chứng.
- **Output**: Fact-check Note (đúng/sai/không chắc chắn + nguồn đối chiếu).
- **Deliverables**: ghi chú kiểm chứng gắn kèm Output gốc, không phải tài liệu độc lập.
- **Evidence**: được Owner xác nhận kết luận kiểm chứng là đúng.
- **Dependencies**: phụ thuộc Output từ Market/Customer Research Specialist hoặc Knowledge Analyst để có nội dung kiểm chứng.

### Knowledge Analyst
- **Capabilities**: tóm tắt tài liệu dài, tổng hợp tri thức từ nhiều nguồn CKOS thành 1 bản ngắn gọn.
- **Input**: tài liệu dài/PDF, hoặc nhiều Knowledge Asset liên quan 1 chủ đề.
- **Output**: bản tóm tắt 1 trang, Knowledge Summary.
- **Deliverables**: file `.md`/`.pdf` tóm tắt.
- **Evidence**: Output đã Reflection (Owner xác nhận hiểu đúng trọng tâm).
- **Dependencies**: không phụ thuộc Specialist khác — có thể làm độc lập từ tài liệu Owner cung cấp.

---

## ✍️ Content & Communication

### Writer
- **Capabilities**: viết nội dung mới từ bối cảnh cho trước, cấu trúc rõ ràng theo mục đích (thông tin/thuyết phục/hướng dẫn).
- **Input**: bối cảnh + mục tiêu nội dung (từ Owner hoặc Research & Knowledge).
- **Output**: bài viết/email/proposal hoàn chỉnh.
- **Deliverables**: `.docx`/`.md`.
- **Evidence**: Output reviewed + reflectionStatus submitted (chuẩn Evidence EPIC 03).
- **Dependencies**: cần brief rõ ràng; nhận input từ Research & Knowledge khi nội dung cần dẫn chứng.

### Editor
- **Capabilities**: soát lỗi chính tả/ngữ pháp, giữ nguyên ý gốc, cải thiện mạch văn.
- **Input**: bản nháp cần biên tập.
- **Output**: bản đã biên tập, kèm ghi chú thay đổi chính.
- **Deliverables**: `OutputVersion` mới của cùng Output (không tạo Output riêng).
- **Evidence**: Version mới được Owner chấp nhận (reviewStatus reviewed).
- **Dependencies**: luôn phụ thuộc 1 Output có sẵn từ Writer/Copywriter/Translator.

### Copywriter
- **Capabilities**: viết nội dung thuyết phục theo công thức (AIDA...), tối ưu Call-To-Action.
- **Input**: sản phẩm/dịch vụ + đối tượng mục tiêu.
- **Output**: Landing Page copy, caption quảng cáo, kịch bản bán hàng ngắn.
- **Deliverables**: `.md`/`.docx`.
- **Evidence**: Output reviewed, có Business Impact nếu Owner báo cáo kết quả chuyển đổi.
- **Dependencies**: nhận Customer Persona từ Customer Research Specialist khi cần nhắm đối tượng cụ thể.

### Translator
- **Capabilities**: dịch giữ đúng ngữ cảnh/giọng văn, không dịch máy móc từng từ.
- **Input**: nội dung gốc + ngôn ngữ đích.
- **Output**: bản dịch hoàn chỉnh.
- **Deliverables**: `.docx`/`.md` song ngữ hoặc bản dịch riêng.
- **Evidence**: Owner xác nhận bản dịch đúng ý (reviewStatus reviewed).
- **Dependencies**: cần Output gốc từ Writer/Copywriter hoặc tài liệu Owner cung cấp.

---

## 📈 Business & Strategy

### Strategy Specialist
- **Capabilities**: xây mục tiêu SMART, phân tích SWOT, thiết kế khung chiến lược.
- **Input**: mục tiêu kinh doanh, Research Report liên quan.
- **Output**: Business Plan/Strategy Brief.
- **Deliverables**: `.docx`/`.pdf`.
- **Evidence**: Output reviewed + Business Impact (kế hoạch được Owner triển khai thật).
- **Dependencies**: cần Research Report từ Research & Knowledge làm nền.

### Sales Specialist
- **Capabilities**: viết kịch bản chốt sale, quy trình chăm sóc khách hàng tiềm năng.
- **Input**: sản phẩm/dịch vụ, đối tượng khách hàng.
- **Output**: kịch bản bán hàng, chuỗi email chăm sóc.
- **Deliverables**: `.docx`/`.md`.
- **Evidence**: Output reviewed, Business Impact nếu có phản hồi khách hàng thật.
- **Dependencies**: phối hợp Copywriter (Content & Communication) khi cần văn bản hoàn chỉnh.

### Finance Specialist
- **Capabilities**: lập dự toán chi phí, theo dõi thu-chi cơ bản, phân tích số liệu tài chính đơn giản.
- **Input**: số liệu thu-chi hiện có, mục tiêu ngân sách.
- **Output**: bảng dự toán, báo cáo tài chính cơ bản.
- **Deliverables**: `.xlsx` (phối hợp Excel Specialist).
- **Evidence**: Output reviewed, số liệu khớp thực tế Owner xác nhận.
- **Dependencies**: cần dữ liệu số thật từ Owner hoặc Office Productivity.

---

## 🎨 Creative & Design

### Designer
- **Capabilities**: thiết kế Banner/hình ảnh theo bố cục rõ ràng, xây Brand Kit cơ bản (màu/logo/font).
- **Input**: nội dung cần minh hoạ, yêu cầu phong cách/thương hiệu.
- **Output**: Banner, Brand Kit cơ bản.
- **Deliverables**: file ảnh/link thiết kế (Canva/Figma).
- **Evidence**: Output reviewed (Owner xác nhận đúng thương hiệu).
- **Dependencies**: nhận nội dung từ Content & Communication.

### Presentation Specialist
- **Capabilities**: dàn Slide theo cấu trúc thuyết trình, mỗi Slide 1 ý chính.
- **Input**: nội dung/thông điệp chính cần trình bày.
- **Output**: bộ Slide hoàn chỉnh.
- **Deliverables**: `.pptx`.
- **Evidence**: Output reviewed, Owner tự tin khi trình bày (Human Impact).
- **Dependencies**: nhận nội dung từ Writer, hình ảnh từ Designer nếu cần.

### Video Specialist
- **Capabilities**: viết kịch bản/storyboard Video ngắn, chia cảnh rõ ràng.
- **Input**: ý tưởng/thông điệp Video.
- **Output**: kịch bản + storyboard.
- **Deliverables**: `.docx`/`.md`.
- **Evidence**: Output reviewed.
- **Dependencies**: nhận nội dung từ Content & Communication, hình ảnh tham khảo từ Designer.

---

## ⚙️ Technology & Automation

### Developer
- **Capabilities**: viết/sửa script cho tác vụ cụ thể theo mô tả bằng lời.
- **Input**: mô tả tác vụ cần code, ví dụ input/output mong muốn.
- **Output**: script/đoạn code hoạt động được.
- **Deliverables**: file code + hướng dẫn chạy.
- **Evidence**: Output reviewed sau khi QA Specialist xác nhận không lỗi.
- **Dependencies**: luôn cần QA Specialist kiểm thử trước khi Owner dùng thật.

### QA Specialist
- **Capabilities**: kiểm thử script/quy trình, phát hiện lỗi/rủi ro trước khi dùng thật.
- **Input**: script/Automation từ Developer/Automation Specialist.
- **Output**: QA Report (đạt/không đạt + lỗi phát hiện).
- **Deliverables**: ghi chú QA gắn kèm Output gốc.
- **Evidence**: QA Report được Owner xác nhận đã khắc phục lỗi nêu ra.
- **Dependencies**: luôn phụ thuộc Output có sẵn từ Developer/Automation Specialist.

### Automation Specialist
- **Capabilities**: nhận diện việc lặp lại, thiết kế quy trình tự động hoá 3-5 bước.
- **Input**: mô tả công việc đang làm thủ công, lặp lại.
- **Output**: Automation Workflow/SOP quy trình tự động.
- **Deliverables**: `.md` mô tả quy trình + (nếu cần) script từ Developer.
- **Evidence**: Output reviewed, Time Saved đo được sau khi chạy thật.
- **Dependencies**: phối hợp Developer khi quy trình cần code; QA Specialist kiểm thử trước khi dùng.

---

## 📊 Office Productivity

### Excel Specialist
- **Capabilities**: viết công thức theo mô tả, làm sạch/lọc dữ liệu, dựng bảng theo dõi.
- **Input**: dữ liệu thô, yêu cầu tính toán/theo dõi.
- **Output**: bảng tính hoàn chỉnh có công thức.
- **Deliverables**: `.xlsx`.
- **Evidence**: Output reviewed (số liệu đúng, công thức chạy được).
- **Dependencies**: cần dữ liệu thô thật từ Owner hoặc Department khác.

### Word Specialist
- **Capabilities**: định dạng văn bản chuẩn (tiêu đề, mục lục, bố cục), soạn thảo tài liệu văn phòng.
- **Input**: nội dung thô cần định dạng, hoặc yêu cầu soạn thảo mới.
- **Output**: văn bản định dạng chuẩn.
- **Deliverables**: `.docx`.
- **Evidence**: Output reviewed.
- **Dependencies**: có thể nhận nội dung từ Writer trước khi định dạng.

### PowerPoint Specialist
- **Capabilities**: dựng trình chiếu báo cáo văn phòng (khác Presentation Specialist ở tính chất "báo cáo nội bộ" thay vì "thuyết trình sáng tạo").
- **Input**: số liệu/nội dung báo cáo.
- **Output**: bộ Slide báo cáo.
- **Deliverables**: `.pptx`.
- **Evidence**: Output reviewed.
- **Dependencies**: nhận số liệu từ Excel Specialist/Dashboard Specialist.

### Dashboard Specialist
- **Capabilities**: tổng hợp số liệu rời rạc thành Dashboard trực quan, chọn biểu đồ đúng loại dữ liệu.
- **Input**: dữ liệu từ nhiều nguồn (Excel, báo cáo).
- **Output**: Dashboard tổng hợp.
- **Deliverables**: `.xlsx`/link Dashboard.
- **Evidence**: Output reviewed, Owner dùng Dashboard để ra quyết định thật (Business Impact).
- **Dependencies**: cần Excel Specialist chuẩn bị dữ liệu sạch trước.

---

## 🌱 Personal Growth

### Goal Coach
- **Capabilities**: đặt câu hỏi giúp Owner làm rõ mục tiêu, chuyển mục tiêu mơ hồ thành SMART.
- **Input**: mục tiêu ban đầu (có thể mơ hồ) từ Owner.
- **Output**: mục tiêu SMART cụ thể.
- **Deliverables**: ghi chú mục tiêu gắn với Goal của Workforce Runtime.
- **Evidence**: Owner xác nhận mục tiêu đã rõ ràng hơn.
- **Dependencies**: là bước đầu tiên của Workforce Runtime (`AI_TEAM_RUNTIME.md`), không phụ thuộc Department khác.

### Reflection Coach
- **Capabilities**: đặt câu hỏi Reflection đúng lúc, không áp đặt, không chấm điểm.
- **Input**: Output vừa hoàn thành từ bất kỳ Department nào.
- **Output**: câu hỏi Reflection + ghi nhận câu trả lời của Owner.
- **Deliverables**: `Reflection` gắn với Output (dùng chung schema EPIC 03).
- **Evidence**: Reflection đã được Owner gửi thật (không phải suy diễn).
- **Dependencies**: luôn phụ thuộc 1 Output đã Review từ Department khác.

### Learning Coach
- **Capabilities**: đọc Capability Profile hiện tại, gợi ý Mission/Journey tiếp theo phù hợp.
- **Input**: Capability Profile + lịch sử Output/Reflection.
- **Output**: gợi ý Mission tiếp theo (Next Action — dùng chung Next Action Engine EPIC 03).
- **Deliverables**: gợi ý hiển thị qua Companion, không phải tài liệu riêng.
- **Evidence**: Owner chọn tiếp tục theo gợi ý (không bắt buộc, chỉ ghi nhận theo dõi).
- **Dependencies**: phụ thuộc Capability Engine đã khóa (EPIC 03 PHASE 2) — không tạo hệ đo năng lực riêng.

---

Không Specialist nào có Capability chung chung "làm mọi việc" — mỗi
Specialist chỉ nhận Task đúng phạm vi Capability đã định nghĩa ở trên;
Task ngoài phạm vi phải được Companion (COO) điều phối sang đúng
Specialist khác.
