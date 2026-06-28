# Ceremony Framework

Sprint 17.0 — The Living Ceremonies. Xem `docs/LIVING_CEREMONIES.md`
trước khi đọc tài liệu này.

## Vì sao cần một khung chung

The First Footprint Ceremony (Sprint 16.0) chứng minh một mẫu hình
hiệu quả: Opening → nội dung phản chiếu → Companion → Closing. Nếu mỗi
nghi thức sau này tự phát minh lại cấu trúc của riêng nó, VO DUONG AI
sẽ có nhiều "trải nghiệm đẹp" rời rạc, không một "văn hóa" nhất quán.
Ceremony Framework định nghĩa bốn nhịp chung mà mọi Living Ceremony
phải có — không phải để ép khuôn sáng tạo, mà để mọi nghi thức đều
được người dùng nhận ra là "một phần của cùng một VO DUONG AI", dù nội
dung từng nghi thức khác nhau.

## Bốn nhịp của một Ceremony

### 1. Opening

Một khởi đầu có chủ ý — không bắt đầu ngay bằng nội dung/dữ liệu.
Companion nói một câu mở, đặt người dùng vào một không gian khác với
luồng sử dụng bình thường (một màn hình riêng, một khoảng lặng, không
sidebar/dashboard cạnh tranh sự chú ý). Opening không bao giờ là một
banner, một popup quảng cáo, hay một CTA.

### 2. Reflection

Nội dung thật của nghi thức — luôn ở dạng phản chiếu (cho thấy lại
điều đã thật sự xảy ra), không bao giờ ở dạng đo lường (điểm số, cấp
độ, xếp hạng, % tiến độ). Nếu nghi thức không có đủ "nguyên liệu thật"
(chưa có signal/milestone/ký ức nào), Reflection có quyền im lặng —
không bị ép tạo nội dung giả để lấp đầy khoảng trống.

### 3. Companion

Companion là sự hiện diện xuyên suốt nghi thức, không phải một icon
trang trí xuất hiện một lần ở Opening rồi biến mất. Companion có thể
lặng lẽ "có mặt" (CompanionAvatar hiển thị suốt nghi thức) hoặc chủ
động nói ở các nhịp chuyển — nhưng không bao giờ phân tích, đánh giá,
hay chấm điểm nội dung Reflection.

### 4. Closing

Một kết thúc rõ ràng — không phải "đóng popup". Một lời hứa, một câu
giữ lại, hoặc một sự im lặng có chủ ý — không bao giờ là một CTA bán
hàng hoặc một lời mời "làm thêm điều gì để tốt hơn". Người dùng phải
luôn có quyền rời khỏi nghi thức ở Closing mà không bị dẫn sang một
luồng activation/conversion nào.

## Quy tắc chung cho mọi Ceremony

- Không ép tương tác — mọi bước đều có lối thoát (skip, đóng, im lặng).
- Không gamification — không điểm, không cấp độ, không huy hiệu, không
  thanh tiến trình hiển thị.
- Không AI phân tích hoặc đánh giá nội dung người dùng viết/chia sẻ
  trong nghi thức.
- Không quảng cáo, không giới thiệu sản phẩm, không CTA bán hàng.
- Một Ceremony chỉ nên xuất hiện khi có nguyên liệu thật (dữ liệu/tín
  hiệu con người đã tồn tại) — không bao giờ dựng nội dung giả để kích
  hoạt nghi thức đúng lịch.

## Cấu trúc kỹ thuật chung (tham chiếu, không bắt buộc tuyệt đối)

Mỗi Ceremony component nên theo mẫu đã thiết lập ở
`FirstFootprintCeremony.tsx`:

- `CeremonyStep` union (named string, không phải số) đại diện cho các
  nhịp Opening/Reflection/Companion-moment/Closing.
- Một flag "đã xem" lưu cục bộ (localStorage) để nghi thức không lặp
  lại mỗi lần — hydration-safe (`useEffect` quyết định hiển thị sau
  mount).
- `CompanionAvatar` làm điểm neo hình ảnh duy nhất, không dùng
  CompanionSpace/CompanionPresence (quá nặng cho một không gian riêng,
  tối giản).
- Dữ liệu Reflection luôn lấy từ các adapter/engine đã có sẵn
  (`growth-signals.ts`, `growth-milestones.ts`, `mirror-narrative.ts`,
  v.v.) — Ceremony không tự tính toán lại logic phản chiếu, nó chỉ
  trình bày những gì các engine đó đã trả về.

## Danh sách Ceremony đã định nghĩa

Xem `docs/LIVING_CEREMONIES.md` để có danh sách đầy đủ và trạng thái
hiện thực hóa của từng nghi thức.
