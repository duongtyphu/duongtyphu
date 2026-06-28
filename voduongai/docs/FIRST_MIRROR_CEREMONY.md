# First Mirror Ceremony

Sprint 17.0 — The Living Ceremonies. Đây là nghi thức ĐẦU TIÊN được
code hóa đầy đủ trong Sprint này. Xem `docs/CEREMONY_FRAMEWORK.md`,
`docs/THE_MIRROR_OF_GROWTH.md`, `docs/COMPANION_REFLECTION_LETTER_FRAMEWORK.md`.

## Khoảnh khắc

Trước Sprint này, "Mirror" chỉ tồn tại như một lời mời văn bản
(`buildCompanionMirrorInvitation`) trong card ở trang My Story — không
có không gian riêng để thật sự "mở Mirror ra". First Mirror Ceremony
là lần đầu tiên người dùng thật sự bước vào không gian đó: một màn
hình riêng, nơi Companion mở lại những đối chiếu có ý nghĩa từ hành
trình đã có, không phải một bảng dữ liệu.

## Bốn nhịp (đã code)

- **Opening**: Companion mở lời mời người dùng nhìn lại
  (`buildCompanionMirrorInvitation`), trong một không gian riêng —
  không sidebar, không dashboard.
- **Reflection**: nội dung phản chiếu thật, lấy từ các engine đã có sẵn
  từ Sprint 14.0/15.0 — không tính toán lại logic:
  - `buildMirrorNarrative(signals)` — các dòng tường thuật gắn với
    milestone đã đạt.
  - `buildReflectionMoments(signals)` — tối đa 4 khoảnh khắc đối chiếu
    ("lúc mới bắt đầu... rồi một ngày...").
  - `buildFirstFootprintMirrorView(capsules)` — nếu người dùng có "The
    First Footprint" (Sprint 16.0), Mirror mở lại đúng dấu chân đó với
    câu "Đây là dấu chân đầu tiên của bạn."
  Nếu không có đủ nguyên liệu (chưa tới 3 signal), Reflection im lặng —
  không tạo nội dung giả.
- **Companion**: hiện diện suốt nghi thức qua `CompanionAvatar`.
- **Closing**: một câu giữ lại — không đánh giá, không gợi ý "hãy làm
  gì tiếp theo để tốt hơn". Người dùng có thể đóng Mirror bất cứ lúc
  nào.

## Thực hiện

- Component: `src/components/portal/mirror/MirrorCeremony.tsx`
- Trang: `src/app/portal/mirror/page.tsx` — route mới, server component
  lấy `reflections`/`capsules` theo đúng pattern của
  `src/app/portal/story/page.tsx`.
- Entry point: card "Bản Gương Trưởng Thành" tại `/portal/story` đổi
  link từ `#story-timeline` sang `/portal/mirror` khi đã có lời mời
  (`buildCompanionMirrorInvitation` trả về khác `null`).

## Boundary

Không có nút "chia sẻ Mirror". Không chấm điểm, không so sánh với
người khác (đúng Mirror Rules tại `docs/THE_MIRROR_OF_GROWTH.md`). Nếu
chưa đủ dấu chân, trang Mirror hiển thị một trạng thái yên tĩnh thay vì
ép tạo nội dung.
