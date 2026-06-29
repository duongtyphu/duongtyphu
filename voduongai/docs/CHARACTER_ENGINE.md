# Character Engine

> Sprint 20.1 "The Character Engine" (Chapter Listening). Áp dụng
> `THE_LIVING_WISDOM_SYSTEM.md` (bước Character — vẫn ❌ trong
> `docs/LIVING_LEARNING_AUDIT.md` trước Sprint này) lên Companion
> Decision Engine (`getCompanionDecision()`,
> `src/lib/portal/intelligence/portal-brain.ts`). Tài liệu này giải
> thích Character Engine (`character-engine.ts`) — không phải một
> Engine quyết định mới, mà một LỚP HƯỚNG DẪN đứng trước Decision.

## Companion học cách lựa chọn bằng phẩm chất, không chỉ bằng quy tắc

Trước Sprint này, khi nhiều "tiếng nói nội tâm" (`VoiceMessage`,
`internal-voices.ts`) cùng lên tiếng, Companion chỉ chọn tiếng nói có
`priority` cao nhất (`loudestVoice()`) — một quy tắc kỹ thuật thuần
tuý, không phản ánh PHẨM CHẤT nào của Companion. Character Engine thêm
một bước: trước khi chọn tiếng nói to nhất, Companion tự hỏi ba câu hỏi
về phẩm chất của chính mình đối với từng candidate.

## Character không thay thế Decision. Character hướng dẫn Decision.

Đây là ranh giới quan trọng nhất của tài liệu này:

- **Decision Engine** (`getCompanionDecision()`) vẫn là nơi DUY NHẤT
  quyết định Companion nói gì, trạng thái nào, tone nào — không đổi.
- **Character Engine** (`applyCharacterReview()`) chỉ can thiệp ở một
  điểm DUY NHẤT: ngay trước khi `loudestVoice()` chọn ra tiếng nói to
  nhất từ danh sách `VoiceMessage[]`. Nó không tạo candidate mới, không
  đổi `priority` của candidate nào, không đổi nội dung câu nói
  (`line`) — nó chỉ có quyền lọc bỏ candidate không đạt Character
  Review, và đổi THỨ TỰ giữa các candidate CÙNG MỘT cấp `priority`.

Nói cách khác: Character Engine không bao giờ làm một `priority: "low"`
thắng một `priority: "high"` — nó chỉ phân định khi nhiều candidate
*ngang hàng* nhau, candidate nào nên được lắng nghe trước.

## Character Profile — 7 phẩm chất cốt lõi

`CHARACTER_PROFILE` (`character-engine.ts`): Respect, Humility,
Compassion, Wisdom, Hope, Patience, Contribution. Đây không phải điểm
số có thể tăng/giảm theo hành vi người dùng (sẽ phạm chính nguyên tắc
chống gamification đã có) — đây là 7 phẩm chất Companion LUÔN mang
theo vào mọi Decision, mở rộng sáu giá trị bất biến đã có ở
`THE_EDUCATION_CONSTITUTION.md` bằng ngôn ngữ phẩm chất phù hợp với
Sprint này.

## Character Review — ba câu hỏi, rule-based thuần

Mỗi Decision Candidate (`VoiceMessage` — Greeting/Garden/Story/
Reflection/Knowledge…) được `reviewDecisionCandidate()` trả lời ba câu:

1. **Có tôn trọng người dùng không?** (`respectsUser`)
2. **Có khiêm tốn không?** (`isHumble`)
3. **Có giúp người dùng trưởng thành hơn không?** (`helpsGrowth`)

Không AI, không Machine Learning, không DB mới — toàn bộ là rule-based
thuần trên dữ liệu đã có (`candidate.voice`, một khoá cố định).

**Vì sao `respectsUser`/`isHumble` luôn `true` hôm nay:** mọi
`VoiceMessage` hiện có (`internal-voices.ts`) đã được viết sẵn theo
đúng tinh thần Human Respect/Listening — không câu nào xếp hạng người
dùng, không câu nào khoe sự thông minh của Companion
(`THE_JOY_OF_CONTRIBUTION.md`). Hai cờ này không "vô dụng" — chúng là
RÀO CHẮN bắt buộc cho mọi Decision Candidate MỚI trong tương lai:
trước khi thêm một tiếng nói mới vào `internal-voices.ts`, người viết
phải tự trả lời được hai câu hỏi này.

**`helpsGrowth` rule-based hôm nay:** các tiếng nói phản chiếu trực
tiếp sự trưởng thành của một con người cụ thể — `reflection` (nội
tâm), `garden` (ý chí), `journey` (con đường), `legacy` (di sản) — được
đánh `true`. Các tiếng nói khác (`story`, `knowledge`, `build`,
`connect`, `companion`) là thông tin/đồng hành hữu ích nhưng KHÔNG có
nghĩa là "kém hơn" — chúng chỉ chưa đạt câu hỏi thứ ba theo định nghĩa
hẹp này.

## Khi nhiều candidate đều hợp lệ — Character được quyền đổi thứ tự

`applyCharacterReview()`: với các candidate CÙNG `priority`, candidate
nào `helpsGrowth = true` được sắp xếp đứng trước. Hôm nay, vì mỗi
tiếng nói trong `internal-voices.ts` có `priority` riêng (gần như
không trùng), tác động thực tế còn nhỏ — nhưng cơ chế đã có sẵn, đúng
NHIỆM VỤ 4 của brief, cho bất kỳ Sprint sau nào thêm candidate mới vào
cùng cấp `priority`.

## Quan hệ với `docs/LIVING_LEARNING_AUDIT.md`

Bước **Character** trong chuỗi 9 bước (`LIVING_LEARNING_AUDIT.md`,
Sprint 19.1) trước đây ❌ vì "không có bộ nhớ riêng theo từng người
dùng ở tầng quyết định". Sprint này KHÔNG giải quyết phần đó (không
thêm bộ nhớ theo người dùng — sẽ là một bước riêng, có thể nối với
Core Memory) — nó giải quyết một phần khác của Character: Companion có
phẩm chất CỐ ĐỊNH (không theo từng người dùng) đứng trước mọi Decision.
Audit nên cập nhật bước Character ở Sprint tiếp theo, không phóng đại
ở đây thành "Character đã xong".

## Quan hệ với các tài liệu khác

Xem tiếp: `THE_LIVING_WISDOM_SYSTEM.md`, `THE_EDUCATION_CONSTITUTION.md`,
`THE_JOY_OF_CONTRIBUTION.md`, `docs/LIVING_LEARNING_AUDIT.md`,
`docs/INTERNAL_VOICES_ARCHITECTURE.md`.
