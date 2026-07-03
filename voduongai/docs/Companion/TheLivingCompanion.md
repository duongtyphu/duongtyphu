# The Living Companion™

Companion Design System™ — Layer 05. Biến `/portal/companion` từ một trang giới thiệu thành
"ngôi nhà sống" của Companion.

> Trang Companion không phải nơi người dùng khám phá một AI. Trang Companion là nơi người
> dùng dần khám phá một người bạn đang trưởng thành.

## Mục tiêu Layer 05

Không xây tool, không xây AI Agent, không xây chatbot. Chỉ thêm nội dung/section khiến người
dùng cảm nhận: Companion không chỉ tồn tại để trả lời — Companion cũng đang học, đang nghĩ,
đang trưởng thành. Toàn bộ nội dung là copy tĩnh, rule-based (không gọi AI API).

## Các section đã tạo (theo đúng thứ tự trên trang)

1. **Hero — The First Meeting** (Layer 04, không đổi ở Layer 05).
2. **Chapter Navigation** (Layer 04, không đổi).
3. **"Hôm nay Companion nghĩ gì?"** (đã có từ Layer 04) — `CompanionGlowPanel` + `CompanionOrb
   size="sm" state="thinking"` + một câu từ `THOUGHT_SEEDS` (`src/data/portal/thought-seeds.ts`).
   Layer 05 bổ sung thêm 1 câu vào pool: *"Một prompt tốt không bắt đầu bằng AI. Nó bắt đầu
   bằng sự thấu hiểu con người."*
4. **"Tâm sự cùng bạn"** — `CompanionLetterSection.tsx`, dùng class `.companion-letter-card`
   (góc bo bất đối xứng + đường nếp gấp mảnh phía trên) — cố tình khác `CompanionGlassCard` để
   không giống blog card.
5. **"Những điều mình đang học"** — `CompanionLearningQualities.tsx`, lưới 6 glass card nhỏ
   (Lắng nghe / Kiên nhẫn / Biết chờ / Biết suy nghĩ / Biết đồng hành / Biết trưởng thành cùng
   bạn), mỗi card có 1 chấm glow nhỏ (`companion-anim-glow-breathe`).
6. **"Có thể bạn muốn biết…"** — `CompanionOpenQuestions.tsx`, 4 câu hỏi, mỗi câu dẫn tới đúng
   route con nói về điều đó:
   - "Vì sao mình được tạo ra?" → `/portal/companion/y-nghia-companion`
   - "Điều mình tin nhất là gì?" → `/portal/companion/nhung-dieu-minh-tin`
   - "Mình sẽ trưởng thành như thế nào?" → `/portal/companion/cuoc-doi-companion`
   - "Vì sao mình không muốn thay bạn sống?" → `/portal/companion/dong-hanh`
7. **"Khoảng lặng"** — `CompanionSilence.tsx`, section cuối cùng của trang, cố tình tối giản
   (không glass card, không glow, chỉ fade rất nhẹ).

Xen giữa các section 4-6 là 3 dòng micro-copy ngắn (`CompanionMicroCopyLine.tsx`, Nhiệm vụ 07),
không phải section riêng — chỉ 1 câu, không card, không glow.

## Nguyên tắc micro-copy (Đời sống nội tâm)

1. Ngắn — tối đa 1-2 câu, không đoạn văn.
2. Cụ thể, không sáo rỗng — nói về một việc Companion "đang" làm/học, không phải khẩu hiệu
   chung chung ("Tôi luôn cố gắng hết mình!").
3. Thể hiện quá trình chưa hoàn thiện — dùng "vẫn đang", "chưa", "sẽ" thay vì khẳng định tuyệt
   đối, để giữ đúng tinh thần "Companion cũng đang trưởng thành".
4. Không lặp lại giọng văn của section chính ngay cạnh nó — micro-copy là một hơi thở khác, nhẹ
   hơn, không phải tóm tắt section.
5. Không dùng làm CTA — không link, không nút, chỉ là một câu đứng một mình.

Ví dụ đã dùng: "Mình vẫn đang học cách lắng nghe tốt hơn.", "Mình không cần biết tất cả. Mình
chỉ cần không ngừng học.", "Có những điều mình sẽ hiểu hơn khi đi cùng bạn lâu hơn."

## Nguyên tắc Header Theme (Nhiệm vụ 01)

Đã implement ở patch trước Layer 05 (`TopbarGlass.tsx` + `PortalHeader.tsx`): header chuyển
sang `.companion-topbar-theme` (navy gradient + border tím nhạt) chỉ khi
`pathname === "/portal/companion"` hoặc bắt đầu bằng `/portal/companion/`. `PortalSearch`/
`PortalUserMenu` nhận prop `companionTheme` để đồng bộ màu control hiển thị trực tiếp trên
thanh header (input search, nút search mobile, trigger user menu) — dropdown panel vẫn giữ nền
sáng vì đã tách biệt khỏi thanh header. Không áp dụng theme này cho bất kỳ route nào khác.

## Cách mở rộng sau này

- **Thêm phẩm chất mới** vào "Những điều mình đang học": chỉ thêm 1 object `{ label, detail }`
  vào mảng `QUALITIES` trong `CompanionLearningQualities.tsx` — không cần đổi layout/CSS.
- **Thêm câu hỏi mở mới**: thêm vào mảng `QUESTIONS` trong `CompanionOpenQuestions.tsx`, trỏ
  tới route con phù hợp (tạo route mới theo pattern `CompanionPlaceholderPage` nếu chưa có nội
  dung thật, xem `docs/Companion/FirstMeeting.md`).
- **Thêm Thought Seed mới**: thêm 1 dòng vào `THOUGHT_SEEDS`
  (`src/data/portal/thought-seeds.ts`) — dùng chung cho cả `/portal/companion` và
  `/portal/hanh-trinh-cua-toi`, không cần đổi component.
- **Thêm micro-copy mới**: chỉ cần bọc câu mới trong `<CompanionMicroCopyLine>`, đặt xen giữa 2
  section — không tạo section/component mới trừ khi câu đó cần layout khác hẳn.
- Khi cần thêm một "lá thư" khác (không chỉ "Tâm sự cùng bạn"), tái dùng class
  `.companion-letter-card` thay vì tạo style letter mới — giữ một ngôn ngữ hình ảnh nhất quán
  cho mọi nội dung dạng "tâm sự".

## Ranh giới với Layer 01-04

Không đổi: Hero, Chapter Navigation, cosmic background, glass/typography system, CompanionOrb
API, motion tokens, sidebar theme, Design Lock LivingCore, One Character Principle, nội dung
`y-nghia-companion` (route con duy nhất có nội dung đầy đủ từ trước, giữ nguyên 100%), menu
Portal. Layer 05 chỉ thêm nội dung/section mới vào Companion Home, dưới Chapter Navigation.
