# AI Companion Team — Collaboration Matrix

Tài liệu kiến trúc — không code, không gọi AI API. Companion (COO) phải
biết trước **Department nào tham gia, theo thứ tự nào** cho từng loại
Project — không phải để tự động hoá quyết định (chưa có AI Agent thật ở
Sprint này), mà để chuẩn hóa luồng điều phối trước khi implement.

---

## 1. Nguyên tắc Collaboration

- Mỗi Project đi qua **1 chuỗi Department theo thứ tự cụ thể**, không phải
  toàn bộ 7 Department cho mọi Project.
- Companion (COO) là người duy nhất điều phối chuyển giao giữa các
  Department — Department không tự chuyển việc cho nhau.
- Mọi chuỗi Collaboration đều kết thúc ở **Review → Portfolio** (Owner
  phê duyệt cuối cùng, Output vào Portfolio) — nhất quán với Learning Loop
  đã khóa (EPIC 03).
- `Personal Growth` (Reflection Coach) tham gia **ngầm định ở cuối mọi
  chuỗi**, không liệt kê lặp lại trong từng ví dụ dưới đây.

---

## 2. Ví dụ chuỗi Collaboration theo loại Project

### Proposal (đề xuất gửi khách hàng)

```
Research & Knowledge (Market/Customer Research)
   ↓
Business & Strategy (Strategy Specialist — khung đề xuất)
   ↓
Content & Communication (Writer — soạn Proposal)
   ↓
Creative & Design (Designer — nếu cần trình bày hình ảnh)
   ↓
Review (Owner)
   ↓
Portfolio
```

### Website / Landing Page

```
Research & Knowledge (Customer Research — đối tượng mục tiêu)
   ↓
Content & Communication (Copywriter — nội dung trang)
   ↓
Creative & Design (Designer — bố cục/hình ảnh)
   ↓
Technology & Automation (Developer — dựng trang thật, QA Specialist kiểm thử)
   ↓
Review (Owner)
   ↓
Portfolio
```

### Kế hoạch Marketing

```
Research & Knowledge (Market Research)
   ↓
Business & Strategy (Strategy Specialist)
   ↓
Content & Communication (Writer — nội dung kế hoạch + Copywriter — nội dung Campaign)
   ↓
Creative & Design (Presentation Specialist — trình bày kế hoạch)
   ↓
Review (Owner)
   ↓
Portfolio
```

### Dashboard báo cáo kinh doanh

```
Office Productivity (Excel Specialist — làm sạch dữ liệu)
   ↓
Office Productivity (Dashboard Specialist — tổng hợp)
   ↓
Business & Strategy (Finance Specialist — phân tích số liệu)
   ↓
Review (Owner)
   ↓
Portfolio
```

### Video ngắn quảng bá

```
Research & Knowledge (Customer Research — đối tượng xem)
   ↓
Content & Communication (Writer — thông điệp chính)
   ↓
Creative & Design (Video Specialist — kịch bản/storyboard)
   ↓
Review (Owner)
   ↓
Portfolio
```

### Automation quy trình văn phòng

```
Office Productivity (Excel/Word Specialist — quy trình thủ công hiện tại)
   ↓
Technology & Automation (Automation Specialist — thiết kế quy trình)
   ↓
Technology & Automation (Developer — viết script nếu cần)
   ↓
Technology & Automation (QA Specialist — kiểm thử)
   ↓
Review (Owner)
   ↓
Portfolio
```

---

## 3. Collaboration Matrix tổng quát (Department × Department)

Ký hiệu: **●** = thường xuyên phối hợp trực tiếp, **○** = phối hợp khi cần,
trống = hiếm khi phối hợp trực tiếp (đi qua Companion điều phối lại nếu
phát sinh).

| Từ \ Đến | Research | Content | Business | Creative | Technology | Office | Growth |
|---|---|---|---|---|---|---|---|
| **Research & Knowledge** | — | ● | ● | ○ | | ○ | |
| **Content & Communication** | | — | ○ | ● | | ○ | |
| **Business & Strategy** | ● | ○ | — | ○ | ○ | ● | |
| **Creative & Design** | ○ | ● | | — | ○ | | |
| **Technology & Automation** | | | ○ | ○ | — | ○ | |
| **Office Productivity** | ○ | ○ | ● | | ○ | — | |
| **Personal Growth** | ○ | ○ | ○ | ○ | ○ | ○ | — |

`Personal Growth` phối hợp "khi cần" với **mọi** Department vì Reflection
Coach có thể được Companion gọi tới sau bất kỳ Output nào — đây là hàng
duy nhất không có ô "●" vì không có 1 Department cố định nào là đối tác
thường xuyên nhất, mà là toàn bộ.

---

## 4. Nguyên tắc mở rộng Collaboration

Khi có loại Project mới chưa có trong mục 2, Companion xác định chuỗi
Collaboration bằng cách trả lời 3 câu hỏi theo đúng thứ tự:

1. Có cần dữ liệu/thông tin nền không? → bắt đầu ở Research & Knowledge.
2. Output cuối cùng chủ yếu là văn bản, hình ảnh, số liệu, hay hệ thống
   tự động? → chọn Department chủ lực tương ứng (Content/Creative/
   Office/Technology).
3. Có liên quan quyết định kinh doanh không? → thêm Business & Strategy
   vào chuỗi trước bước tạo Output cuối cùng.

Không tạo chuỗi Collaboration mới nào bỏ qua bước Review (Owner) và
Portfolio — đây là 2 bước bắt buộc trong mọi chuỗi, không có ngoại lệ.
