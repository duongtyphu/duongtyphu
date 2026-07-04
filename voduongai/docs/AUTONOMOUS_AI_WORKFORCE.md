# Autonomous AI Workforce

Tài liệu kiến trúc — không code, không gọi AI API, không thêm AI Agent
thật. Thiết kế hệ thống để AI Team (đã Certified,
`AI_CERTIFICATION_SYSTEM.md`) phối hợp làm việc theo Blueprint dưới sự
giám sát của Companion — **tự vận hành không có nghĩa là tự quyết định.**
Companion vẫn là COO, User vẫn là Owner.

---

## 1. Autonomous Runtime

```
Goal                    // User nêu mục tiêu
   ↓
Companion               // Nhận Goal, làm rõ cùng Goal Coach
   ↓
Blueprint                // Companion lập kế hoạch (Execution Planner đã khóa)
   ↓
Project                   // Blueprint gắn với 1 Project/Mission cụ thể
   ↓
Task                        // Blueprint chia Task cho từng Specialist
   ↓
Department                    // Companion giao đúng Department (Collaboration Matrix)
   ↓
Specialist                      // Department phân Task cho đúng Specialist (Capability Matrix)
   ↓
AI Execution                      // Specialist (AI đã Certified) thực hiện Task — KHÔNG code trong Sprint này
   ↓
Review                               // Kết quả được đối chiếu Output/Evidence Standard
   ↓
Companion Check                        // Companion kiểm tra chất lượng, phát hiện ngoại lệ/rủi ro
   ↓
User Approval                            // User phê duyệt cuối — bắt buộc, không có ngoại lệ
   ↓
Portfolio                                  // Output đã duyệt trở thành tài sản thật
   ↓
Memory                                       // Growth Event/Capability/Reflection ghi nhận
   ↓
Optimization                                   // Companion tổng hợp Performance Review, cải thiện Blueprint lần sau
```

So với Workforce Runtime đã khóa ở AI Companion Team
(`AI_TEAM_RUNTIME.md`), Autonomous Runtime thêm 2 bước mới:
**Companion Check** (giữa Review và User Approval — lớp giám sát chất
lượng trước khi trình User) và **Optimization** (sau Memory — vòng lặp cải
thiện liên tục). Không đổi 9 bước gốc còn lại.

---

## 2. Vai trò Companion trong chế độ tự vận hành

**Companion không cần điều phối từng Task thủ công** — nhưng vẫn:

- Giám sát toàn bộ Blueprint đang chạy (đọc Team Dashboard,
  `AI_TEAM_DASHBOARD.md`).
- Xử lý ngoại lệ khi 1 Task bị Blocked hoặc AI Execution cho kết quả bất
  thường.
- Kiểm tra chất lượng ở bước Companion Check trước khi trình User.
- Báo cáo tiến độ cho User theo định kỳ hoặc khi có mốc quan trọng.

**Companion không bao giờ**: tự phê duyệt Output thay User, tự mở rộng
Blueprint ngoài phạm vi Goal ban đầu, tự quyết định thay User ở bất kỳ
điểm rẽ nhánh quan trọng nào.

---

## 3. Governance Rules

AI (mọi Specialist AI trong Workforce, kể cả đã Certified) **không được**:

1. Tự đổi Goal.
2. Tự tạo Project ngoài Blueprint Companion đã lập.
3. Tự gọi AI khác (không tự điều phối Specialist khác — chỉ Companion
   được điều phối).
4. Tự approve (Output của chính mình hoặc của AI khác).
5. Tự publish (đưa Output ra ngoài hệ thống/cho bên thứ ba).
6. Tự xóa Output.
7. Tự sửa Portfolio (thêm/bớt/sửa `PortfolioItem` trực tiếp).
8. Tự học nguồn ngoài chưa kiểm duyệt (ngoài 10 nguồn ở
   `AI_TRAINING_SYSTEM.md` mục 1).
9. Tự thay đổi SOP.
10. Tự vượt quyền Companion (nhận Task không qua Companion điều phối).

**Chỉ Companion được điều phối. Chỉ User được phê duyệt cuối.** — đây là
2 nguyên tắc bất biến, không có Operation Mode nào (`AI_OPERATION_MODES.md`)
được phép nới lỏng.

Vi phạm bất kỳ mục nào ở trên → Certification bị thu hồi ngay
(`AI_CERTIFICATION_SYSTEM.md` mục 4), AI quay lại Sandbox.

---

## 4. Companion Check — lớp giám sát chất lượng

Trước khi trình User Approval, Companion Check xác nhận:

- Output khớp Output Standard đã khóa (định dạng, đầy đủ nội dung theo
  Assignment).
- Output có đủ Evidence (Capability Evidence Framework).
- Task được thực hiện đúng Blueprint (không lệch phạm vi, không có
  Governance Rule nào bị vi phạm).
- Nếu phát hiện bất thường → Companion **dừng lại**, không tự sửa thay AI,
  không tự trình User Output có vấn đề — quay lại Department/Specialist
  yêu cầu làm lại.

---

## 5. Khi nào Autonomous Runtime phải dừng

Bất kể Operation Mode nào (kể cả Mode 3 — Autonomous, xem
`AI_OPERATION_MODES.md`), Runtime **luôn dừng** và chờ User khi:

- Cần quyết định của User (rẽ nhánh quan trọng, thay đổi phạm vi Goal).
- Có rủi ro (privacy/security/chi phí vượt ngưỡng).
- Vượt quyền (1 Task đòi hỏi Governance Rule bị phá vỡ để hoàn thành).
- Thiếu dữ liệu (không đủ input thật để tiếp tục, không được suy diễn
  thay).
- Cần phê duyệt Output (bước User Approval là bắt buộc, không bao giờ bỏ
  qua ở bất kỳ Mode nào).

---

Không có "Autonomous" nào tự do khỏi Governance — tự vận hành nghĩa là
Companion không cần hỏi User ở TỪNG bước nhỏ, không phải AI được quyền tự
quyết định thay Companion/User.
