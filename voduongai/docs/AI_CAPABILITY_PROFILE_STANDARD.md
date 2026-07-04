# AI Capability Profile Standard

Tài liệu kiến trúc — không code, không gọi AI API. Mỗi AI Agent/Tool/Model
được Companion đánh giá (Discover/Evaluate, `AI_WORKFORCE_ACADEMY.md`)
phải có hồ sơ đầy đủ theo chuẩn dưới đây trước khi được đề xuất Recruit.

---

## 1. Cấu trúc hồ sơ chuẩn

```
AiCapabilityProfile {
  name                     // Tên AI Agent/Tool/Model
  provider                 // Tổ chức cung cấp
  type                      // "Text" | "Image" | "Video" | "Code" | "Data" | "Multi-modal" | ...
  mainStrength[]              // Điểm mạnh cụ thể, không chung chung
  weakness[]                    // Điểm yếu cụ thể — bắt buộc phải có, không được để trống
  bestUseCases[]                  // Tình huống công việc phù hợp nhất
  inputType[]                       // Loại input AI này nhận (text/ảnh/file/dữ liệu...)
  outputType[]                       // Loại Output AI này tạo ra
  cost                                 // Mức chi phí (định tính: thấp/trung bình/cao, hoặc đơn giá nếu có)
  speed                                 // Tốc độ xử lý điển hình
  reliability                            // Độ ổn định (định tính, dựa trên Performance History nếu có)
  privacyRisk                             // Mức rủi ro về quyền riêng tư dữ liệu
  securityRisk                              // Mức rủi ro bảo mật
  suitableDepartment[]                        // Department phù hợp (tham chiếu AI_COMPANION_DEPARTMENTS.md)
  suitableSpecialistRole[]                      // Specialist role phù hợp (tham chiếu AI_CAPABILITY_MATRIX.md)
  capabilityMapping[]                             // Capability cụ thể AI này đảm nhận được
  trainingStatus                                    // "not_started" | "in_progress" | "completed"
  certificationStatus                                 // "sandbox" | "certified" | "revoked"
  performanceHistory[]                                  // Lịch sử đánh giá hiệu suất (tham chiếu AI_WORKFORCE_PERFORMANCE_REVIEW.md)
}
```

---

## 2. Nguyên tắc viết hồ sơ

1. **`weakness` bắt buộc phải có** — không có AI nào hoàn hảo; hồ sơ thiếu
   `weakness` bị coi là chưa hoàn chỉnh, không đủ điều kiện Recruit.
2. `mainStrength`/`weakness` phải cụ thể theo tình huống thật (vd "mạnh về
   tóm tắt tài liệu dài, yếu về tính toán số liệu chính xác"), không viết
   chung chung ("AI rất thông minh").
3. `privacyRisk`/`securityRisk` phải đánh giá riêng biệt — 1 AI có thể an
   toàn bảo mật nhưng rủi ro quyền riêng tư cao (vd lưu dữ liệu người dùng
   trên server bên thứ ba), hoặc ngược lại.
4. `suitableDepartment`/`suitableSpecialistRole` chỉ được chọn trong danh
   sách đã khóa ở `AI_COMPANION_DEPARTMENTS.md`/`AI_CAPABILITY_MATRIX.md`
   — không tự tạo Department/Specialist mới ở đây.
5. `trainingStatus`/`certificationStatus` là 2 field tách biệt —
   `trainingStatus: "completed"` không đồng nghĩa
   `certificationStatus: "certified"` (phải qua bài kiểm tra riêng, xem
   `AI_CERTIFICATION_SYSTEM.md`).
6. Không AI nào có hồ sơ mà chưa qua Evaluate — hồ sơ không phải do AI tự
   khai, mà do Companion đánh giá khách quan.

---

## 3. Ví dụ hồ sơ (minh họa cấu trúc, không phải Recruit thật)

```
AiCapabilityProfile {
  name: "[Ẩn danh — ví dụ minh họa]"
  provider: "[Ẩn danh]"
  type: "Text"
  mainStrength: ["Viết nội dung dài mạch lạc", "Tổng hợp tài liệu nhanh"]
  weakness: ["Dễ sai số liệu khi tính toán phức tạp", "Cần kiểm chứng lại thông tin thời sự mới"]
  bestUseCases: ["Viết Proposal, Email, tóm tắt tài liệu"]
  inputType: ["Text", "File văn bản"]
  outputType: ["Text"]
  cost: "Trung bình"
  speed: "Nhanh (vài giây tới vài chục giây mỗi Task)"
  reliability: "Cao cho Task viết, trung bình cho Task tính toán"
  privacyRisk: "Trung bình — cần xác nhận chính sách lưu trữ dữ liệu"
  securityRisk: "Thấp"
  suitableDepartment: ["Content & Communication", "Research & Knowledge"]
  suitableSpecialistRole: ["Writer", "Knowledge Analyst"]
  capabilityMapping: ["Viết nội dung mới", "Tóm tắt tài liệu dài"]
  trainingStatus: "not_started"
  certificationStatus: "sandbox"
  performanceHistory: []
}
```

Đây là ví dụ **minh họa cấu trúc**, không đại diện cho việc đã tuyển thật
bất kỳ AI cụ thể nào — không gọi AI API, không tuyển AI thật trong Sprint
này (đúng brief).

---

## 4. Quality Checklist trước khi hồ sơ được coi là hoàn chỉnh

- ✔ Có đủ cả 17 field ở mục 1.
- ✔ `weakness` không rỗng.
- ✔ `suitableDepartment`/`suitableSpecialistRole` khớp danh sách đã khóa.
- ✔ `privacyRisk`/`securityRisk` được đánh giá riêng biệt, không gộp
  chung 1 mục "rủi ro."
- ✔ `certificationStatus` mặc định `"sandbox"` cho tới khi qua đủ
  `AI_CERTIFICATION_SYSTEM.md`.

Thiếu bất kỳ mục nào — hồ sơ chưa đủ điều kiện để Companion đề xuất
Recruit lên User.
