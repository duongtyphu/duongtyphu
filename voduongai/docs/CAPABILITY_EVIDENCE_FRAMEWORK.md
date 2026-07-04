# Capability Evidence Framework

Tài liệu đồng hành với `docs/ASSESSMENT_CAPABILITY_STANDARD.md` — đi sâu
vào **Evidence Framework** (mục 10 của tài liệu đó) và **Portfolio
Validation** (mục 12). Tài liệu kiến trúc — không code, không UI, không
route, không Component, không AI API, không Agent, không Placeholder,
không dữ liệu giả.

**Nguyên tắc cốt lõi**: Không có Evidence, không công nhận Capability.
Capability không phải điều gì đó "được cấp" — Capability là điều gì đó
"được chứng minh."

---

## 1. Evidence Framework

Evidence là bằng chứng cụ thể, có thể truy vết, chứng minh một Capability
là thật. Gồm 8 loại:

| Loại Evidence | Là gì | Vì sao đủ tin cậy |
|---|---|---|
| **Output** | Artefact thật đã tạo (Proposal, Dashboard, Email...) | Bằng chứng trực tiếp nhất — kết quả cụ thể, không thể giả mạo bằng lời nói |
| **Workspace** | Bối cảnh + quá trình tạo ra Output (Timeline, Context) | Chứng minh Output được tạo qua đúng quy trình thật, không phải copy-paste sẵn |
| **Version** | Lịch sử chỉnh sửa Output (v1 → v2 → v3) | Chứng minh có quá trình cải thiện thật, không phải một lần ăn may |
| **Reflection** | Người học tự nhận biết điều mình học/thay đổi | Bằng chứng nhận thức — người học ý thức được năng lực của mình |
| **Companion Review** | Nhận xét điểm mạnh/cần cải thiện từ Companion | Góc nhìn thứ ba (dù rule-based), đối chiếu với tự đánh giá của người học |
| **AI Impact** | Số liệu Before/After (Time Saved, Quality...) | Bằng chứng định lượng/định tính về hiệu quả thật |
| **Growth Event** | Sự kiện hệ thống ghi lại Mission hoàn thành | Dấu vết thời gian, không thể chỉnh sửa ngược, dùng để dựng Long Term Growth |
| **Portfolio** | Tập hợp nhiều Output cùng Competency theo thời gian | Bằng chứng bền vững — một Output có thể là may mắn, nhiều Output cùng loại thì không |

Nguyên tắc tổng hợp: **Capability không dựa trên một loại Evidence duy
nhất.** Một Output đơn lẻ không đủ; phải kết hợp ít nhất Output + Reflection
+ Companion Review + Growth Event (điều kiện tối thiểu — xem Quality
Checklist ở `docs/ASSESSMENT_CAPABILITY_STANDARD.md` mục 15), và để đạt
mức Capability cao hơn (mục 9 tài liệu đó, mức 5-7) bắt buộc thêm Version
+ AI Impact + Portfolio.

### 1.1 Evidence theo từng mức Capability

| Mức Capability | Evidence tối thiểu cần có |
|---|---|
| 1. Biết | Không cần Evidence hành động — chỉ cần đã qua bước Learning (chưa phải Capability được công nhận) |
| 2. Làm được | 1 Output + 1 Reflection |
| 3. Làm độc lập | Output được tạo với Companion Coaching mức thấp (ít bước hướng dẫn hơn lần đầu) + Companion Review |
| 4. Làm nhanh | ≥2 Output cùng Competency, có AI Impact cho thấy thời gian giảm dần |
| 5. Làm ổn định | ≥3 Output cùng Competency, Companion Review nhất quán "đạt chất lượng" | 
| 6. Tối ưu | Version cho thấy người học tự cải tiến cách làm mà không cần Companion gợi ý thêm |
| 7. Có thể hướng dẫn người khác | Output đủ chất lượng để dùng làm Guided Example (Learning Asset Standard mục 6) cho Mission tương tự |

Đây là cách diễn giải cụ thể **"Evidence nào ứng với mức nào"** — trả lời
câu hỏi thực thi cho Capability Framework đã định nghĩa ở
`docs/ASSESSMENT_CAPABILITY_STANDARD.md` mục 9.

---

## 2. Portfolio Validation

Capability chỉ **hợp lệ đầy đủ** (đạt mức 5 trở lên) khi có Portfolio —
tập hợp nhiều Output cùng Competency, không phải một Output đơn lẻ.

Ví dụ — Competency "AI Writing":

```
Portfolio (Competency: AI Writing) {
  entries: [
    { outputType: "Landing Page", missionId: "viet-landing-page", createdAt: ... },
    { outputType: "Facebook Post", missionId: "viet-caption-ban-hang", createdAt: ... },
    { outputType: "Email", missionId: "viet-email-chuyen-nghiep", createdAt: ... },
    { outputType: "Proposal", missionId: "viet-proposal-khach-hang", createdAt: ... }
  ]
}
```

4 Output khác nhau, cùng rèn Competency "AI Writing" — đây là **bằng
chứng bền vững** rằng người học không chỉ làm tốt một lần, mà có năng lực
áp dụng nhất quán qua nhiều tình huống công việc thật khác nhau.

### 2.1 Nguyên tắc Portfolio

- Portfolio nhóm theo **Competency**, không nhóm theo Journey/Mission —
  một Portfolio "AI Writing" có thể chứa Output từ nhiều Journey khác
  nhau (Học viện AI, AI Workspace...).
- Portfolio không giới hạn số lượng, không có "Portfolio đầy" — càng nhiều
  Output thật càng củng cố Capability.
- Portfolio là dữ liệu **của người học**, không phải nội dung Portal biên
  tập — mọi entry đều xuất phát từ Output thật người học tự tạo.
- Portfolio là điểm neo cho khái niệm "Portfolio" đã được nhắc tới nhưng
  chưa xây ở `docs/SMART_AI_CURRICULUM_AUDIT.md` — khi implement, Portfolio
  đọc từ danh sách Output đã lưu trong Workspace (không tạo cấu trúc dữ
  liệu Output riêng biệt).

---

## 3. Evidence & Portfolio Data Model

```
Evidence {
  evidenceId, userId, missionId, competencyId
  evidenceType    // Output | Workspace | Version | Reflection
                  // | CompanionReview | AiImpact | GrowthEvent | Portfolio
  evidenceRef      // ID tham chiếu tới bản ghi gốc (outputId/reflectionId/reviewId...)
  createdAt
}

PortfolioEntry {
  portfolioId, userId, competencyId
  outputId, outputType, missionId
  createdAt
}

CapabilityValidation {
  competencyId, userId
  currentLevel        // 1-7, theo Evidence tối thiểu ở mục 1.1
  evidenceChecklist {  // ánh xạ trực tiếp Quality Checklist
    output: boolean
    reflection: boolean
    companionReview: boolean
    aiImpact: boolean
    workspace: boolean
    growthEvent: boolean
    portfolio: boolean
  }
  validatedAt
}
```

`Evidence`/`PortfolioEntry`/`CapabilityValidation` không thay thế
`Capability`/`Portfolio` đã định nghĩa ở
`docs/ASSESSMENT_CAPABILITY_STANDARD.md` mục 14 — đây là lớp **chi tiết
hoá** cách một `Capability` được validate, dùng chung ID/tham chiếu với
Data Model gốc.

---

## 4. Future Expansion

Framework này mở rộng được cho bất kỳ Competency mới nào (AI Coding, AI
Video, AI Business...) mà không cần đổi cấu trúc:

- Thêm Competency mới → chỉ thêm `competencyId`, Evidence Framework/
  Portfolio Validation áp dụng nguyên vẹn.
- Thêm loại Evidence mới (nếu có nhu cầu, vd "Peer Review" trong tương
  lai) → thêm vào danh mục mở ở mục 1, không phá vỡ Evidence đã ghi nhận
  trước đó.
- Mức Capability (1-7) không đổi theo Competency — cùng 7 mức áp dụng cho
  mọi kỹ năng, giữ trải nghiệm nhất quán trên toàn Portal.

---

Không có Quiz, không có điểm số, không có chứng chỉ trong toàn bộ Evidence
Framework này — mọi công nhận Capability đều bắt nguồn từ hành động và kết
quả thật của người học.
