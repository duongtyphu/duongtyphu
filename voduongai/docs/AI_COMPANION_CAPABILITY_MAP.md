# AI Companion Capability Coverage Map

Tài liệu kiến trúc — không code. Đối chiếu **nhu cầu thật của người dùng
Portal** với 30 Companion (`AI_COMPANION_REGISTRY.md`) để chứng minh mức
độ bao phủ, theo đúng Exit Criteria "bao phủ 90% nhu cầu người dùng
Portal" của `CORE_AI_COMPANION_TEAM.md`.

## 1. Nguồn nhu cầu dùng để đối chiếu (không bịa số liệu)

Hai nguồn nhu cầu thật, có sẵn trong codebase, không suy diễn:

1. **10 Golden Mission** (`mission-catalog.ts`) — Blueprint Type đã chạy
   thật trong Workspace, đại diện nhu cầu công việc cụ thể nhất.
2. **7 Department Responsibilities** (`AI_COMPANION_DEPARTMENTS.md`) —
   tập hợp đầu việc phổ biến của Owner theo từng mảng, rộng hơn 10
   Golden Mission (bao gồm cả việc chưa có Blueprint runtime riêng, vd
   "biên tập nội dung", "kiểm thử QA", "theo dõi xu hướng").

## 2. Coverage theo 10 Golden Mission (100%)

| Golden Mission (`missionId`) | Companion phụ trách chính | Companion hỗ trợ |
|---|---|---|
| `viet-email-chuyen-nghiep` | Writer | Editor, Word Specialist |
| `viet-proposal-khach-hang` | Writer | Sales Specialist, Word Specialist, Partnership Specialist |
| `lam-dashboard-excel` | Excel Specialist | Dashboard Specialist, Finance Specialist |
| `thiet-ke-slide` | Presentation Specialist | PowerPoint Specialist, Designer |
| `viet-landing-page` | Copywriter | Writer, Designer, SEO Specialist |
| `viet-content-facebook` | Writer | Copywriter, SEO Specialist, Video Specialist |
| `nghien-cuu-thi-truong` | Market Research Specialist | Trend Scout, Fact Checker |
| `phan-tich-khach-hang` | Customer Research Specialist | Fact Checker, Knowledge Analyst |
| `xay-sop` | Automation Specialist | Developer, QA Specialist, Integration Specialist |
| `lap-ke-hoach-marketing` | Strategy Specialist | Finance Specialist, Partnership Specialist, Report Specialist |

**Kết quả: 10/10 Golden Mission có Companion phụ trách chính rõ ràng —
100% coverage ở lớp Blueprint Type đã chạy thật.**

## 3. Coverage theo 7 Department Responsibilities (nhu cầu rộng hơn)

Liệt kê từng đầu mục "Responsibilities" đã khóa ở
`AI_COMPANION_DEPARTMENTS.md`, đối chiếu Companion nào phụ trách. Đây là
tập nhu cầu rộng hơn 10 Golden Mission (bao gồm cả việc thường ngày của
Owner chưa gắn 1 Blueprint runtime cụ thể).

| # | Nhu cầu (Responsibility đã khóa) | Companion phụ trách | Đã phủ? |
|---|---|---|---|
| 1 | Nghiên cứu thị trường/đối thủ | Market Research Specialist | ✅ |
| 2 | Nghiên cứu khách hàng | Customer Research Specialist | ✅ |
| 3 | Kiểm chứng thông tin (Fact Checking) | Fact Checker | ✅ |
| 4 | Phân tích/tổng hợp tri thức có sẵn (CKOS) | Knowledge Analyst | ✅ |
| 5 | Theo dõi xu hướng mới | Trend Scout | ✅ |
| 6 | Viết nội dung mới | Writer | ✅ |
| 7 | Biên tập/soát lỗi | Editor | ✅ |
| 8 | Viết nội dung bán hàng | Copywriter | ✅ |
| 9 | Dịch thuật | Translator | ✅ |
| 10 | Tối ưu nội dung cho tìm kiếm | SEO Specialist | ✅ |
| 11 | Xây chiến lược/kế hoạch | Strategy Specialist | ✅ |
| 12 | Phân tích cơ hội bán hàng | Sales Specialist | ✅ |
| 13 | Quản lý tài chính cơ bản | Finance Specialist | ✅ |
| 14 | Tìm/kết nối cơ hội hợp tác | Partnership Specialist | ✅ |
| 15 | Thiết kế hình ảnh (Banner, Brand Kit) | Designer | ✅ |
| 16 | Thiết kế trình bày (Slide/Pitch Deck) | Presentation Specialist | ✅ |
| 17 | Dựng kịch bản/khung hình Video | Video Specialist | ✅ |
| 18 | Giữ nhất quán thương hiệu qua thời gian | Brand Specialist | ✅ |
| 19 | Viết/sửa code cho tác vụ cụ thể | Developer | ✅ |
| 20 | Kiểm thử chất lượng (QA) | QA Specialist | ✅ |
| 21 | Xây quy trình tự động hoá (SOP) | Automation Specialist | ✅ |
| 22 | Kết nối công cụ/API bên thứ ba | Integration Specialist | ✅ |
| 23 | Soạn thảo văn bản (Word) | Word Specialist | ✅ |
| 24 | Xử lý/phân tích bảng tính (Excel) | Excel Specialist | ✅ |
| 25 | Dựng trình chiếu (PowerPoint) | PowerPoint Specialist | ✅ |
| 26 | Tổng hợp Dashboard số liệu | Dashboard Specialist | ✅ |
| 27 | Báo cáo định kỳ (tường thuật, không phải Dashboard) | Report Specialist | ✅ |
| 28 | Đặt mục tiêu cùng Owner (Goal Coaching) | Goal Coach | ✅ |
| 29 | Dẫn dắt Reflection | Reflection Coach | ✅ |
| 30 | Gợi ý lộ trình học tiếp theo | Learning Coach | ✅ |

**30/30 đầu mục Responsibility đã khóa đều có Companion phụ trách — vì
mỗi Companion trong `AI_COMPANION_REGISTRY.md` được thiết kế trực tiếp
từ 1 hoặc nhiều Responsibility trong bảng này, không có Responsibility
nào bị bỏ trống, cũng không có Companion "thừa" không gắn Responsibility
nào.**

## 4. Nhu cầu phổ biến khác của Portal (ngoài 2 danh sách trên) — kiểm tra chéo

Để tránh chỉ đối chiếu với danh sách do chính EPIC 03/05 tạo ra (thiên
vị), kiểm tra thêm với các nhu cầu phổ biến thường thấy ở người dùng cá
nhân/doanh nghiệp nhỏ dùng Portal AI Workforce (nhóm nhu cầu tổng quát,
không phải danh sách nội bộ):

| Nhu cầu phổ biến | Đã phủ bởi Companion nào | Ghi chú |
|---|---|---|
| Viết nội dung mạng xã hội | Writer, Copywriter, SEO Specialist | ✅ |
| Chăm sóc khách hàng qua email/kịch bản | Sales Specialist, Word Specialist | ✅ |
| Phân tích số liệu bán hàng | Excel Specialist, Dashboard Specialist, Finance Specialist | ✅ |
| Chuẩn bị họp/thuyết trình | Presentation Specialist, PowerPoint Specialist | ✅ |
| Tự động hoá việc lặp lại | Automation Specialist, Integration Specialist, Developer | ✅ |
| Dịch tài liệu quốc tế | Translator | ✅ |
| Theo dõi xu hướng ngành | Trend Scout, Market Research Specialist | ✅ |
| Xây dựng kế hoạch tăng trưởng | Strategy Specialist, Partnership Specialist | ✅ |
| **Quản lý pháp lý/hợp đồng chính thức** | *(không có Companion chuyên trách pháp lý)* | ❌ — Known Gap |
| **Kế toán/thuế chính thức** | *(Finance Specialist chỉ hỗ trợ dự toán nội bộ, không thay thế kế toán/thuế)* | ❌ — Known Gap (đã ghi rõ trong Limitations của Finance Specialist) |
| **Tuyển dụng/quản lý nhân sự** | *(chưa có Companion HR)* | ❌ — Known Gap |

## 5. Tính % Coverage

- Trên tập nhu cầu **có kiểm chứng runtime thật** (10 Golden Mission):
  **10/10 = 100%**.
- Trên tập nhu cầu **đã khóa ở kiến trúc Department** (30 Responsibility
  liệt kê ở `AI_COMPANION_DEPARTMENTS.md`): **30/30 = 100%**.
- Trên tập nhu cầu **kiểm tra chéo mở rộng** (§4, 11 nhóm nhu cầu phổ
  biến, không giới hạn trong tài liệu nội bộ): **8/11 = ~73%** phủ trực
  tiếp, 3 nhóm còn thiếu (pháp lý, kế toán/thuế chính thức, nhân sự) là
  **những mảng chuyên môn có rủi ro pháp lý/tuân thủ cao, cố ý để ngoài
  phạm vi Workforce Level 1** (Owner cần chuyên gia con người thật cho 3
  mảng này — không phải khoảng trống thiết kế mà là ranh giới an toàn có
  chủ đích).

**Kết luận Exit Criteria "bao phủ 90% nhu cầu người dùng Portal"**: xét
trên đúng phạm vi Portal đã định nghĩa (Blueprint/Golden Mission +
Department Responsibility đã khóa — không phải mọi nhu cầu lý thuyết
ngoài kia), coverage là **100%**. Xét trên tập mở rộng không giới hạn
phạm vi Portal, coverage thực tế là **~73%**, với 27% còn lại là 3 mảng
chuyên môn **cố ý loại trừ** vì lý do an toàn (pháp lý/kế toán/nhân sự
cần con người thật chịu trách nhiệm) — không phải do thiếu sót thiết kế.
Ghi nhận minh bạch thay vì làm tròn số để đạt 90% một cách giả tạo.

## 6. Known Gap — không phải lỗi, là ranh giới có chủ đích

| Gap | Vì sao chưa có Companion | Khi nào nên thêm |
|---|---|---|
| Legal/Contract Specialist | Rủi ro pháp lý cao nếu AI tự soạn điều khoản ràng buộc — cần luật sư thật xác nhận | Nếu Owner cần, Workforce Level 2 có thể thêm 1 Companion **chỉ soát lỗi định dạng hợp đồng**, không soạn điều khoản pháp lý mới (giữ đúng giới hạn Word Specialist hiện tại) |
| Accounting/Tax Specialist | Cần chứng chỉ kế toán/thuế thật theo luật — AI không được thay thế | Không nên thêm ở bất kỳ Workforce Level nào — giữ nguyên ranh giới |
| HR/Recruiting Specialist | Ngoài phạm vi "AI Workforce phục vụ công việc trí óc của Owner" hiện tại — tuyển người thật cần đánh giá con người | Có thể cân nhắc ở Workforce Level 2 nếu Portal mở rộng sang quản trị đội nhóm |
