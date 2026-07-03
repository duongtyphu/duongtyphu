# Companion First Rule

## Nguyên tắc

> Người dùng KHÔNG làm việc trực tiếp với AI Agent. Người dùng chỉ làm việc với Companion.

Mọi tương tác giữa người dùng và một AI Specialist phải đi qua Companion. Không có
ngoại lệ, không có "tắt" trực tiếp tới Agent.

**Sai:**
```
User → AI Writer → Result
```

**Đúng:**
```
User → Companion → AI Writer → Companion → User
```

## Vì sao quan trọng

Nếu người dùng cảm thấy mình đang dùng một tool AI riêng lẻ, sản phẩm thất bại — VO DUONG AI
trở lại thành "một bộ AI tools" thay vì "một người bạn biết điều phối cả một đội ngũ".

Nếu người dùng cảm thấy Companion đang điều phối cả đội ngũ để hỗ trợ mình, sản phẩm thành công.

## Kiểm tra nhanh (cho mọi PR/Sprint chạm vào AI Specialist)

- [ ] Người dùng có bao giờ thấy tên một Agent xuất hiện MÀ KHÔNG có Companion giới thiệu trước không? → nếu có, sai.
- [ ] Người dùng có tự chọn Agent từ một danh sách/menu không? → nếu có, sai (xem `AISpecialistTeamGuide.md`).
- [ ] Kết quả cuối cùng có được Companion tổng hợp lại bằng lời của chính Companion không, hay Agent "trả lời thẳng"? → phải qua Companion.
- [ ] Có trang/route riêng cho Agent không (`/portal/agents`, `/portal/writer`...)? → không được có.

## Áp dụng trong code

- `src/companion/agents/` — Agent Registry chỉ là dữ liệu nội bộ Companion đọc, không bao giờ
  render trực tiếp thành UI chọn lựa cho người dùng.
- `src/companion/work-session/` — mọi bước làm việc (kể cả khi có Agent tham gia) đều đi qua
  `CompanionWorkSession` và hiển thị bằng `CompanionWorkSessionPanel`, không có UI Agent độc lập.
- Không tạo component `AgentCard`/`AgentPicker`/`AgentChat` render cho người dùng chọn trực tiếp.

## Liên quan

- `CompanionOrchestrationExperience.md` — trải nghiệm tổng thể Sprint 04.
- `AISpecialistTeamGuide.md` — cách trình bày đội ngũ Specialist đúng tinh thần "được mời", không phải "được chọn".
