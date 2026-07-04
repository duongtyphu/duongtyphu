# AI Workforce Performance Review

Tài liệu kiến trúc — không code, không gọi AI API. Companion phải theo
dõi hiệu suất từng AI (Specialist đã Certified) liên tục — không chỉ 1 lần
ở Certification. AI hoạt động kém phải được đưa về Training hoặc đề xuất
Retirement.

---

## 1. Chỉ số theo dõi (10 chỉ số)

```
PerformanceRecord {
  specialistId
  aiName                    // AI cụ thể đang đảm nhận Specialist role này
  taskCompleted              // Số Task đã hoàn thành
  outputQuality                // Tỷ lệ Output đạt "reviewed" ngay lần đầu (không chấm điểm — Evidence-based, giống Team Dashboard)
  revisionCount                  // Số lần trung bình phải sửa lại mỗi Output
  speed                             // Thời gian trung bình hoàn thành 1 Task
  cost                                // Chi phí trung bình mỗi Task
  reliability                          // Tỷ lệ Task hoàn thành đúng hạn, không lỗi hệ thống
  errorRate                              // Tỷ lệ Task lỗi/phải hủy
  collaborationQuality                     // Mức độ phối hợp đúng Collaboration Matrix (không làm việc cô lập, không bỏ sót input)
  blueprintCompliance                        // Tỷ lệ tuân thủ Blueprint (không tự đổi thứ tự/phạm vi)
  userApprovalRate                             // Tỷ lệ Output được User phê duyệt không cần sửa
}
```

---

## 2. Nguyên tắc đo lường

- Toàn bộ 10 chỉ số đều **định lượng được từ dữ liệu thật** (số Task, số
  lần sửa, thời gian, tỷ lệ) — không có chỉ số nào là "cảm nhận chủ quan"
  của Companion.
- `outputQuality`/`blueprintCompliance`/`userApprovalRate` dùng chung
  nguyên tắc Evidence-based đã khóa xuyên suốt EPIC 03 (không chấm điểm
  theo thang điểm tùy ý — luôn là tỷ lệ/số đếm thật).
- Performance Review được cập nhật liên tục (mỗi khi 1 Task hoàn thành),
  không phải đánh giá định kỳ 1 lần rồi thôi.

---

## 3. Ngưỡng hành động

```
Performance đạt chuẩn (blueprintCompliance cao, errorRate thấp, userApprovalRate cao)
   → Tiếp tục hoạt động trong Workforce, có thể xem xét mở rộng Specialist role

Performance dưới ngưỡng ở 1-2 chỉ số
   → Companion đưa AI trở lại Training (AI_TRAINING_SYSTEM.md mục 4 — Re-training)
   → Không cần thu hồi Certification ngay nếu vi phạm chưa nghiêm trọng

Performance dưới ngưỡng liên tục, nhiều chỉ số, hoặc vi phạm Governance Rule
   → Certification bị thu hồi (AI_CERTIFICATION_SYSTEM.md mục 4)
   → Companion đề xuất Retirement lên User — KHÔNG tự loại bỏ AI khỏi Workforce
```

**Retirement luôn là đề xuất, không phải hành động tự động** — đúng
nguyên tắc "Companion chỉ đề xuất, User phê duyệt" xuyên suốt AI Workforce
Academy.

---

## 4. Vòng lặp Continuous Improvement

```
Performance Review ghi nhận dữ liệu
   ↓
Companion phân tích xu hướng (AI nào đang cải thiện, AI nào đang xuống)
   ↓
Đề xuất: giữ nguyên / Re-training / mở rộng role / Retirement
   ↓
User quyết định
   ↓
Áp dụng thay đổi → tiếp tục theo dõi Performance Review
```

Vòng lặp này chính là bước **Continuous Improvement** trong vòng đời AI
Workforce Academy (`AI_WORKFORCE_ACADEMY.md` mục 1) và bước
**Optimization** trong Autonomous Runtime (`AUTONOMOUS_AI_WORKFORCE.md`
mục 1) — không phải 2 cơ chế khác nhau, cùng 1 vòng lặp nhìn từ 2 góc
tài liệu.

---

## 5. Dữ liệu nguồn (không tạo bảng mới)

Nhất quán với nguyên tắc "không tạo model dữ liệu song song" đã áp dụng
xuyên suốt AI Companion Team — `PerformanceRecord` là **view tính toán**
từ dữ liệu Task/Output/Review đã có trong Foundation Data Layer đã khóa,
không phải bảng lưu trữ độc lập cần đồng bộ riêng.
