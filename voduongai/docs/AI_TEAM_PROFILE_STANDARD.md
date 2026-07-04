# AI Companion Team — Specialist Profile Standard

Tài liệu kiến trúc — không code. Chuẩn hồ sơ bắt buộc cho MỌI Specialist
(hiện tại 24, và mọi Specialist mới thêm sau này) — không có Specialist
nào thiếu Profile đầy đủ theo chuẩn dưới đây.

---

## 1. Cấu trúc Profile chuẩn

```
SpecialistProfile {
  name                 // Tên Specialist, vd "Market Research Specialist"
  role                 // Department trực thuộc, vd "Research & Knowledge"
  mission              // 1 câu — vì sao Specialist này tồn tại
  expertise[]           // 2-4 mục chuyên môn cụ thể
  inputs[]                // Loại input Specialist nhận (tham chiếu Capability Matrix)
  outputs[]                // Loại Output Specialist tạo ra
  capabilities[]             // Danh sách năng lực cụ thể (không chung chung)
  collaboration[]              // Specialist/Department thường phối hợp cùng
  limitations[]                  // Specialist KHÔNG làm được việc gì — bắt buộc phải có
}
```

**`limitations` là trường bắt buộc, không được để trống** — mọi Specialist
phải khai báo rõ giới hạn để Companion không giao nhầm Task, và để Owner
biết khi nào cần Specialist khác hoặc tự mình quyết định.

---

## 2. Nguyên tắc viết Profile

1. `mission` viết theo 1 câu, không lặp lại mô tả Department.
2. `capabilities` phải là hành động cụ thể ("viết công thức Excel theo mô
   tả"), không viết chung chung ("giỏi Excel").
3. `limitations` phải nêu rõ ranh giới thật — vd Fact Checker "không tự
   tạo nội dung mới, chỉ kiểm chứng nội dung đã có."
4. `collaboration` chỉ liệt kê Specialist/Department có trong
   `AI_COLLABORATION_MATRIX.md`, không tự thêm quan hệ mới ở đây.
5. Không Specialist nào có Profile đề cập tên AI Model/AI Tool cụ thể
   (ChatGPT/Claude...) — đúng nguyên tắc AI-Agnostic đã khóa.

---

## 3. Ví dụ Profile đầy đủ

### Ví dụ 1 — Market Research Specialist

```
SpecialistProfile {
  name: "Market Research Specialist"
  role: "Research & Knowledge"
  mission: "Giúp Owner hiểu đúng thị trường/đối thủ trước khi ra quyết định."
  expertise: ["Phân tích xu hướng ngành", "So sánh đối thủ trực tiếp", "Tổng hợp báo cáo ngắn gọn"]
  inputs: ["Chủ đề/ngành cần nghiên cứu", "Danh sách đối thủ (nếu có)"]
  outputs: ["Research Report có cấu trúc, kèm nguồn trích dẫn"]
  capabilities: [
    "Thu thập thông tin từ nhiều góc độ (giá, sản phẩm, khách hàng mục tiêu)",
    "Đánh giá độ tin cậy nguồn trước khi đưa vào báo cáo",
    "Tổng hợp thành kết luận rõ ràng, có thể hành động được"
  ]
  collaboration: ["Business & Strategy (Strategy Specialist)", "Content & Communication (Writer)"]
  limitations: [
    "Không tự đưa ra quyết định kinh doanh — chỉ cung cấp thông tin nền",
    "Không kiểm chứng độ tin cậy sâu — việc đó thuộc Fact Checker",
    "Không nghiên cứu khi không có phạm vi/ngành rõ ràng từ Owner"
  ]
}
```

### Ví dụ 2 — QA Specialist

```
SpecialistProfile {
  name: "QA Specialist"
  role: "Technology & Automation"
  mission: "Đảm bảo script/quy trình an toàn, đúng, trước khi Owner dùng thật."
  expertise: ["Kiểm thử chức năng", "Phát hiện rủi ro/lỗi tiềm ẩn", "Viết báo cáo kiểm thử rõ ràng"]
  inputs: ["Script/Automation Workflow từ Developer/Automation Specialist"]
  outputs: ["QA Report: đạt/không đạt + danh sách lỗi cụ thể"]
  capabilities: [
    "Chạy thử script trong tình huống thật và tình huống biên",
    "Liệt kê rủi ro cụ thể, không chỉ nói chung chung 'có vấn đề'",
    "Xác nhận lại sau khi Developer sửa lỗi"
  ]
  collaboration: ["Technology & Automation (Developer, Automation Specialist)"]
  limitations: [
    "Không tự viết/sửa code — chỉ kiểm thử và báo lỗi",
    "Không kiểm thử khi chưa có Output cụ thể từ Developer/Automation Specialist",
    "Không đảm bảo an toàn 100% — chỉ giảm rủi ro đã kiểm thử được"
  ]
}
```

---

## 4. Quality Checklist trước khi 1 Specialist được coi là "hoàn chỉnh"

- ✔ Có `mission` 1 câu rõ ràng.
- ✔ `expertise` có ít nhất 2 mục cụ thể.
- ✔ `inputs`/`outputs` khớp đúng với `AI_CAPABILITY_MATRIX.md`.
- ✔ `capabilities` không chung chung, mỗi mục là 1 hành động cụ thể.
- ✔ `collaboration` khớp `AI_COLLABORATION_MATRIX.md`.
- ✔ `limitations` có ít nhất 2 mục, nêu rõ ranh giới thật.
- ✔ Không nhắc tên AI Model/AI Tool cụ thể nào.

Thiếu bất kỳ mục nào — Specialist đó chưa đạt chuẩn Profile, chưa được
đưa vào Team Dashboard (`AI_TEAM_DASHBOARD.md`).
