# Discovery Standard

EPIC 02 — Sprint 04.5, Nhiệm vụ 03. Chuẩn Discovery Layer áp dụng cho toàn Portal — cách Portal
tạo sự tò mò mà không popup, không quảng cáo, không spam. Cơ chế/luật chi tiết đã có ở
`DISCOVERY_RULES.md` (Sprint 04) — tài liệu này bổ sung ví dụ cụ thể theo từng module và chuẩn
đặt Discovery vào đúng vị trí UI.

## 3 điều Discovery không bao giờ là

1. **Không phải popup** — không modal, không overlay che nội dung, không chặn thao tác.
2. **Không phải quảng cáo** — không banner "Nội dung mới!", không badge đỏ (notification dot)
   trên icon.
3. **Không phải spam** — tối đa 1 Discovery/phiên (đã quy định ở `DISCOVERY_RULES.md`), không
   lặp lại cùng nội dung.

## Nơi Discovery xuất hiện (UI placement chuẩn)

Discovery tái dùng đúng các bề mặt Companion đã có, không tạo UI mới:

- `CompanionContextualNudge` (bong bóng nhỏ cạnh Companion orb, dismiss được) — vị trí ưu tiên.
- `CompanionQuickPanel` (khi người dùng chủ động bấm vào Companion) — Discovery có thể là một
  dòng trong Companion Message của Work Session/Task Entry, không phải một section riêng.

Discovery **không** xuất hiện: trong hero section của trang, trong sidebar, dưới dạng số đếm
trên icon.

## Ví dụ theo module (minh hoạ câu nói — xem đầy đủ ở `COMPANION_UNLOCK_LANGUAGE.md`)

| Module | Ví dụ Discovery |
|---|---|
| Không gian AI | "Có tài liệu đang chờ bạn — một cách dùng AI mà nhiều người hay bỏ qua." |
| CKOS | "Mình có một Prompt đặc biệt cho đúng kỹ năng bạn đang học." |
| Academy | "Có một Case Study mới dành cho bạn, liên quan tới Mission bạn vừa làm." |
| Dự án & Cơ hội | "Mình muốn chia sẻ một góc nhìn mình mới ghi nhận được về dự án này." |
| Premium | "Có một tài liệu mình vẫn giữ đến hôm nay, dành cho lúc bạn sẵn sàng đi sâu hơn." |
| Nhật ký học tập | "Companion có điều muốn chia sẻ về những gì bạn đã viết gần đây." |
| Hành trình của tôi | "Mình nhận ra một điều thú vị khi nhìn lại chặng đường của bạn." |
| Khu vườn của bạn | "Có một điều nhỏ mình muốn chỉ cho bạn thấy trong khu vườn này." |

Mỗi ví dụ trên PHẢI đi kèm hành động cụ thể ngay sau (không dừng ở câu mở, xem
`DISCOVERY_RULES.md` mục "câu mở đầu").

## Chuẩn tần suất (tóm tắt từ DISCOVERY_RULES.md, nhắc lại vì hay bị vi phạm nhất)

- Tối đa 1 Discovery / phiên truy cập.
- Không trùng thời điểm với Contextual Nudge hoặc khi có Work Session đang chạy.
- Không lặp lại cùng 1 Discovery item cho cùng 1 người dùng.

## Teaser nội dung file — ưu tiên cao nhất

Loại Discovery quan trọng nhất trong Portal: **bật mí một chi tiết thật bên trong một file đính
kèm đang LOCKED** (Prompt Pack/Checklist/Template — xem `JOURNEY_UNLOCK_BLUEPRINT.md` mục "Ưu
tiên hàng đầu"). Đây khác Discovery thông thường ở chỗ nó luôn gắn với MỘT file cụ thể sắp/đang
chờ mở khóa, không phải nội dung đã mở sẵn.

Quy tắc viết Teaser:

1. **Bật mí đúng MỘT chi tiết thật**, không tóm tắt toàn bộ file, không liệt kê mục lục.
2. **Chi tiết phải cụ thể với đúng file đó** — không dùng câu chung chung dùng lại được cho mọi
   file ("Có nội dung hay bên trong!").
3. **Không nói ra cách để mở ngay** (không phải "trả tiền để xem" hay "bấm vào đây để unlock
   ngay") — Teaser chỉ tăng tò mò, điều kiện mở khóa vẫn theo `UNLOCK_RULE_STANDARD.md`.
4. **Giữ lại phần hay nhất** — Teaser nên hé lộ một chi tiết THÚ VỊ nhưng không phải là phần giá
   trị nhất của file (giữ lý do để thực sự mở khóa và đọc toàn bộ).

Ví dụ:

> "Trong Checklist này có một bước mà rất nhiều người bỏ qua — mình nghĩ bạn sẽ thấy bất ngờ."
> "Prompt Pack này có một prompt mình viết riêng cho đúng tình huống bạn hay gặp."
> "Template này có một phần mở đầu mà mình nghĩ bạn sẽ dùng lại nhiều lần."

Vị trí hiển thị Teaser: ngay tại `DownloadPrepCard` (khu vực "Sẵn sàng để tải xuống") — không
cần bong bóng Companion riêng nếu Teaser đã nằm sẵn trong khu vực đó; dùng Contextual
Nudge/Quick Panel khi muốn Companion chủ động nhắc tới file này ở nơi khác trong Portal.

## Discovery vs Surprise vs Unlock — bảng phân biệt nhanh

| | Điều kiện | Có báo trước không | Ví dụ |
|---|---|---|---|
| **Discovery** | Không cần | Có — Companion chủ động nói ngay lúc đó | "Mình có một Prompt đặc biệt." |
| **Unlock** | Có (xem `UNLOCK_RULE_STANDARD.md`) | Có, ngay khi đạt điều kiện | "Mình nghĩ bạn đã sẵn sàng." |
| **Surprise** | Có, nhưng KHÔNG được gợi ý trước dưới bất kỳ hình thức nào | Không — chỉ Companion biết, xuất hiện đột ngột khi đủ điều kiện | Companion Secret, một số Real Story |

## Ranh giới

- Discovery không thay thế Proactive Thought/Story Matching Engine đã có (Sprint 13.x) — nó là
  MỘT loại moment cạnh tranh cùng Presence Coordinator/Thought Governance, không phải hệ thống
  riêng chạy song song.
- Nội dung Discovery lấy từ đâu, chọn thế nào — xem `DISCOVERY_RULES.md` mục "Chọn nội dung
  Discovery như thế nào".
