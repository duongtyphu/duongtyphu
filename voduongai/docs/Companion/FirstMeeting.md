# The First Meeting™

Companion Design System™ — Layer 04. Hero của `/portal/companion` không phải banner giới
thiệu sản phẩm — đây là khoảnh khắc một con người gặp Companion lần đầu.

> Nếu người dùng bước vào Companion và ngay lập tức muốn kéo xuống đọc tiếp → Layer thành
> công. Nếu người dùng chỉ nhìn thấy một Hero đẹp → Layer thất bại.

## Hero Principle

Hero = **First Meeting**, không phải Landing Hero/Banner. Không nhồi feature/icon/statistic/
counter. Companion là trung tâm duy nhất — mọi thứ khác (chữ, CTA, navigation) chỉ xuất hiện
sau, theo đúng nhịp của một cuộc gặp gỡ thật:

```
Companion đã ở đó (Arrival — mờ dần, không nhảy vào)
        ↓ (khoảng lặng)
Lời đầu tiên: "Xin chào, mình là Companion."
        ↓ (khoảng lặng)
Câu thứ hai: "Mình không được tạo ra để thay bạn sống..."
        ↓ (khoảng lặng)
CTA: "Bước vào Không gian AI"
        ↓
Chapter Navigation (bookmark)
```

## First Impression (Nhiệm vụ 02-03)

- **Arrival**: `companion-anim-arrival` (2.1s, `cubic-bezier(0.16,1,0.3,1)`) — chỉ mờ dần hiện
  ra (opacity 0→1) + scale rất nhẹ (0.98→1), KHÔNG bounce/overshoot. Cảm giác: Companion đã ở
  đó từ trước, đang chờ, không phải "bay vào" màn hình.
- **Lời đầu tiên** (nguyên văn, không đổi):
  > "Xin chào, mình là Companion."
  >
  > "Mình không được tạo ra để thay bạn sống. Mình được tạo ra để đồng hành khi bạn muốn
  > trưởng thành."
- Không thêm marketing copy, không thêm câu nào khác vào Hero ngoài 2 câu trên.
- Mỗi dòng dùng `companion-anim-text-settle` (fade + dịch lên 8px, 0.9s) với `animationDelay`
  riêng (0.5s / 1.3s) để chữ xuất hiện lần lượt — không đồng thời — mô phỏng nhịp đọc.

## Eye Contact (Nhiệm vụ 07)

Không có mắt, không có khuôn mặt (Design Lock, One Character Principle — xem
`CompanionCharacterSystem.md`). Cảm giác "đang nhìn về phía người dùng" tạo bằng **glow tĩnh
rất nhẹ**: class `companion-orb--gaze` thêm một quầng sáng radial lệch nhẹ xuống phía dưới
(hướng người xem), không thêm chuyển động mới ngoài breathing đã có ở Layer 03.

## White Space Rule (Nhiệm vụ 04 — Silence)

- Hero container: `max-w-2xl` (hẹp hơn các layer trước — tập trung, không dàn trải), padding
  dọc lớn (`py-24 sm:py-36`).
- Khoảng cách giữa Orb → lời đầu tiên → câu thứ hai → CTA đều ≥ 16 (Tailwind spacing), tạo nhịp
  thở rõ ràng giữa từng khối.
- **Tuyệt đối không có** trong Hero: icon rời, feature list, statistic/counter, nhiều CTA cùng
  lúc. Foundation showcase (glass card/glow panel demo) từ Layer 01 đã được gỡ khỏi trang —
  từng đúng vai trò "shell để review", nay nhường chỗ cho trải nghiệm First Meeting thật.

## CTA Rule (Nhiệm vụ 05)

- Tên: **"Bước vào Không gian AI"**, route `/portal/khong-gian-ai`.
- Chỉ xuất hiện sau khi 2 câu đầu đã có đủ thời gian hiện ra (`animationDelay: 2.2s`) — không
  xuất hiện cùng lúc với lời chào.
- `CompanionGlowButton` nhận prop `pulse={false}` riêng cho CTA này — bỏ animation breathing vô
  hạn, chỉ còn `box-shadow` glow tĩnh nhẹ (`shadow-[0_0_28px_-8px_rgba(34,211,238,0.45)]`).
  Các nút Companion khác (VD: nút "Quay lại Companion Home" ở placeholder) vẫn giữ `pulse=true`
  mặc định — CTA First Meeting là trường hợp duy nhất cố tình tắt pulse.

## Chapter Navigation — Bookmark Rule (Nhiệm vụ 06)

`CompanionChapterNav.tsx` — 8 mục, đúng thứ tự: Xin chào · Mình là ai? · Ý nghĩa Companion ·
Những điều mình tin · Cuộc đời Companion · Book Notes · Tâm sự · Đồng hành.

Route cho 2 chương mới (chưa có nội dung — dùng `CompanionPlaceholderPage`, không để trắng):
- "Mình là ai?" → `/portal/companion/minh-la-ai`
- "Đồng hành" → `/portal/companion/dong-hanh`

Style **cố tình khác navbar**: mỗi mục là một "tab treo" độc lập (`companion-bookmark-tab`) —
bo góc trên, không bo góc dưới, có một tam giác nhỏ ở đáy (`::after`) tạo cảm giác dải ruy-băng
đánh dấu trang sách, không phải thanh menu phẳng liền mạch. Mục đang active có gradient tím-cyan
nhẹ + glow phía trên, không đổi màu chữ đột ngột.

## Motion Rule (tổng hợp riêng cho Layer 04)

- Không animation nào trong Hero nhanh hơn 0.9s (chữ) — chậm nhất là Arrival (2.1s).
- Không lặp vô hạn ở phần chữ/CTA — chỉ Orb mới có chuyển động vô hạn (breathing, đã có từ
  Layer 03), đúng vai trò "Companion luôn sống, còn lời nói thì có lúc bắt đầu và dừng".
  `prefers-reduced-motion` tắt toàn bộ animation Arrival/text-settle — nội dung hiện ngay ở
  trạng thái cuối, không mất chữ/CTA.
- Ambient life (Nhiệm vụ 08) không đổi so với Layer 03: aurora trôi, sao lấp lánh, nền thở nhẹ,
  orb breathing — không có gì đứng yên tuyệt đối, cũng không có gì chuyển động nhiều.

## Responsive (Nhiệm vụ 09)

- Desktop: Orb `hero` (256px), container rộng, nhịp đọc thong thả.
- Tablet: cùng cấu trúc, Orb tự co theo `max-w-2xl` (không đổi kích thước riêng cho tablet —
  breakpoint duy nhất là `sm`).
- Mobile: Orb `xl` (128px) đứng trên, chữ/CTA bên dưới (đã đúng cấu trúc từ Layer 02/03), CTA
  đủ lớn để bấm (padding ngang/dọc giữ nguyên `px-5 py-2.5`), không orb nào bị chữ che.

## Ranh giới với Layer 01-03

Không đổi: cosmic background, glass/typography system, CompanionOrb API, motion tokens, sidebar
theme, Design Lock LivingCore, One Character Principle. Layer 04 chỉ tổ chức lại nội dung/nhịp
xuất hiện của Hero + thêm Chapter Navigation — không route/page nào khác trong Portal bị ảnh
hưởng. 2 route mới (`minh-la-ai`, `dong-hanh`) tuân theo đúng pattern
`CompanionPlaceholderPage` đã có từ Layer 01, không phải "tính năng mới".
