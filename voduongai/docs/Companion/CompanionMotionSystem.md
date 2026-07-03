# Companion Motion System™

Companion Design System™ — Layer 03. Layer này không thêm nội dung/section/route mới — chỉ
mang sự sống vào những gì Layer 01/02 đã dựng (cosmic background, glass system, CompanionOrb).

> Animation không tồn tại để gây ấn tượng. Animation tồn tại để người dùng cảm thấy:
> "Companion luôn hiện diện."

## Art Direction (tham chiếu 2 concept image)

Giữ lại mood/atmosphere: cosmic navy-tím, glow ấm ở điểm nhấn, glass card mềm, nhịp chuyển động
chậm rãi — **không copy pixel**, không đổi bố cục/route/nội dung đã chốt ở Layer 01/02. Khi
concept và Product Rule (One Character Principle, Design Lock, không thêm nội dung) mâu thuẫn,
Product Rule luôn thắng — vì vậy Motion System KHÔNG thêm nhân vật có mặt cười, KHÔNG đổi màu
Companion Blue™, KHÔNG thêm layout mới dù concept có gợi ý.

## 1. Motion Language

8 trạng thái chuyển động khái niệm — một số ánh xạ trực tiếp vào `CompanionOrb` state (Layer
02), một số là hành vi ở tầng trang/route:

| Motion | Khi nào | Cách thể hiện |
|---|---|---|
| **Arrival** | Hero Orb vừa mount (lần đầu vào `/portal/companion`) | `companion-anim-arrival` — scale+opacity+brightness một lần (~1.1s), sau đó chuyển sang Presence |
| **Presence** | Mặc định, không có tương tác | `CompanionOrb state="idle"` + `companion-motion-breathe` — thở nhẹ vô hạn |
| **Listening** | Người dùng đang nhập nội dung cho Companion | `CompanionOrb state="listening"` — dịu sáng, orbit mờ hơn (xem `CompanionCharacterSystem.md`) |
| **Thinking** | Companion đang xử lý | `CompanionOrb state="thinking"` — glow sâu hơn, orbit rõ hơn (LivingCore gốc) |
| **Speaking** | Đang hiển thị lời Companion nói | `CompanionOrb state="speaking"` — `companion-speaking-pulse`, nhịp theo "lời nói" |
| **Celebrating** | Người dùng vừa hoàn thành một điều | `CompanionOrb state="celebrating"` — `companion-celebrate-spark`, particles sáng, không loè loẹt |
| **Waiting** | Idle kéo dài, không phải "ngủ" | Cùng `idle` + breathing, cường độ `calm` — kiên nhẫn, không rung/nhấp nháy |
| **Leaving** | Rời trang/route Companion | Xử lý ở tầng route — xem mục 7 (Transition System) |

Không state nào dùng emoji thay thế — toàn bộ thể hiện bằng motion (transform/opacity) + light
(filter/box-shadow), đúng nguyên tắc đã có từ Layer 02.

## 2. Hero Motion

Hero Orb (`/portal/companion`) = `CompanionOrb size="hero"` (desktop) / `size="xl"` (mobile),
bọc trong `companion-anim-arrival` (một lần) + `companion-motion-breathe` (vô hạn). Glow/orbit/
aura/particles đến từ chính LivingCore (Design Lock) theo size ≥128 — không cấu hình thêm.

Giới hạn tốc độ (đã kiểm tra trong `companion-theme.css`):
- Breathing: chu kỳ 5s (chậm, không rung).
- Orbit (bên trong LivingCore): tốc độ gốc đã được Design Lock chốt, không đổi.
- Không animation nào ở Layer 03 nhanh hơn ~1.4s/chu kỳ (companion-speaking-pulse) — nhanh
  nhất trong toàn hệ thống, vẫn đủ chậm để không gây mất tập trung.

## 3. Cosmic Background Motion

| Lớp | Chuyển động | Chu kỳ |
|---|---|---|
| Aurora blob | Trôi rất chậm (translate + scale nhẹ) | 22s |
| Stars | Twinkle (opacity) + float rất nhẹ (translateY ±6px) trong cùng 1 keyframe — "particle bay nhẹ" | 4.5s (twinkle) + 7s (float), lệch pha nên không đồng bộ máy móc |
| Nền cosmic tổng | Glow "thở" rất nhẹ (brightness/saturate dao động ~4%) | 14s |

Không thêm hiệu ứng mới ngoài 3 lớp trên — không particle system phức tạp, không giống game
(không có hiệu ứng nổ/spark ngẫu nhiên nhiều màu).

## 4. Scroll Experience

Component dùng chung: `CompanionRevealOnScroll` (`src/components/portal/companion/
CompanionRevealOnScroll.tsx`, Framer Motion `whileInView`, `viewport={{ once: true }}` — chỉ
chạy 1 lần khi cuộn tới, không lặp lại mỗi lần cuộn qua lại).

| Loại nội dung | Variant | Hiệu ứng |
|---|---|---|
| Section (`CompanionSectionShell`) | `fade-up` | Fade + dịch lên nhẹ (18px) |
| Glass card | `float` | Fade + dịch lên rất nhẹ (10px) |
| Chapter card | `slide` | Fade + trượt ngang nhẹ (16px), có `delay` so le theo thứ tự |
| Quote | `fade` | Chỉ fade, không dịch chuyển |
| Panel nhấn mạnh ("Hôm nay Companion nghĩ gì?") | `glow` | Fade kèm brightness tăng dần — cảm giác "sáng dần lên" |

Áp dụng tại `/portal/companion` (Companion Home) cho: foundation showcase, 2 glass card mẫu,
quote mẫu, panel "Hôm nay Companion nghĩ gì?", và lưới 5 chapter card. Không áp dụng cho nội
dung `y-nghia-companion` (giữ nguyên 100% từ Layer 01, không retrofit hiệu ứng mới vào đó).

## 5. Emotion Motion

Bảng ánh xạ trạng thái Companion → cảm giác chuyển động (chi tiết implement ở
`CompanionCharacterSystem.md`, đây là góc nhìn cảm xúc):

```
Idle         → Calm breathing (thở đều, ổn định)
Listening    → Glow dịu (giảm saturation/brightness, orbit mờ hơn)
Thinking     → Orbit sáng hơn (glow sâu hơn — LivingCore gốc)
Speaking     → Pulse nhẹ theo nhịp (companion-speaking-pulse)
Celebrating  → Particle sáng hơn (companion-celebrate-spark, không loè loẹt)
Sleeping     → Glow mờ (companion-sleep-dim, opacity 0.7–0.82)
Offline      → Motion gần như dừng (LivingCore tắt animation ở state này)
```

## 6. Interaction Motion (Hover)

| Đối tượng | Hiệu ứng hover | Vị trí định nghĩa |
|---|---|---|
| Glass card | Lift nhẹ (`translateY(-3px)`) + border/shadow sáng hơn | `.companion-glass-card:hover` |
| Glow panel | Shadow sáng hơn (không lift, để phân biệt với glass card) | `.companion-glow-panel:hover` |
| Button (`CompanionGlowButton`) | Gradient sáng hơn khi hover, cộng với breathing glow luôn bật | Tailwind hover classes trong component |
| Chapter card | Dùng chung hiệu ứng Glass card (border sáng + lift) — không cần rule riêng | — |
| Orb | Không có hover riêng ở Layer 03 (chưa có orb nào đặt trong vùng hover tương tác riêng biệt ngoài Hero tĩnh) — để dành cho Layer sau nếu cần | — |

**Không có bounce, không có spring quá mạnh** — mọi transition dùng `ease`/cubic-bezier êm
(`cubic-bezier(0.22, 1, 0.36, 1)` cho arrival/scroll reveal), không dùng elastic/spring physics
phóng đại.

## 7. Transition System (route)

`src/app/portal/companion/template.tsx` — Next.js `template.tsx` tạo lại instance mới mỗi lần
điều hướng trong `/portal/companion/*`, bọc children bằng class `companion-route-enter`
(fade + blur 6px→0 + dịch lên nhẹ, ~420ms). Kết quả: chuyển trang trong thế giới Companion luôn
mượt, không nháy trắng, không đổi màu đột ngột — đúng yêu cầu "Companion World phải liền mạch".

Không dùng `AnimatePresence`/exit animation phức tạp — `template.tsx` chỉ hỗ trợ enter tự
nhiên, đã đủ để đạt hiệu ứng liền mạch mong muốn mà không cần thêm state quản lý transition.

## 8. Companion Presence (ngay cả khi không tương tác)

Đúng nguyên tắc "đang chờ, đang quan sát, đang đồng hành":
- Hero Orb luôn breathing (Presence) — không bao giờ đứng yên tuyệt đối.
- Mini orb sidebar (Layer 02) luôn ở trạng thái `idle`/`calm` — hiện diện nhẹ, không rung lắc.
- **Không** có popup tự mở, không chat tự bật, không animation nào chen ngang nội dung người
  dùng đang đọc — mọi motion ở Layer 03 chỉ tác động lên chính Companion Orb/nền/thẻ nội dung,
  không tạo lớp UI mới nào che khuất.

## 9. Performance Rules

Thứ tự ưu tiên: **CSS animation (transform/opacity/filter) → Framer Motion → SVG animation**.
Không dùng Three.js, không dùng video ở bất kỳ đâu trong Layer 03.

- Mọi keyframe mới đều dùng `transform`/`opacity`/`filter` (GPU-friendly), không animate
  `width`/`height`/`top`/`left` trực tiếp.
- `CompanionRevealOnScroll` chỉ chạy 1 lần (`viewport.once: true`) — không tính toán lại khi
  cuộn qua lại nhiều lần, tránh tốn CPU trên mobile.
- Toàn bộ animation Layer 03 (bg breathe, particle float, arrival, route-enter, hover lift, tất
  cả `companion-orb--*`) đều bị tắt dưới `prefers-reduced-motion: reduce` — xem block cuối
  `companion-theme.css`. Route transition khi giảm chuyển động vẫn fade ngay (không mất nội
  dung, không nháy trắng) nhưng bỏ blur/dịch chuyển.
- `CompanionRevealOnScroll` tự bỏ animation hoàn toàn khi `useReducedMotion()` trả `true` —
  hiện nội dung ngay ở trạng thái cuối, không delay/ẩn.

## Ranh giới với Layer 01/02

Không đổi: route architecture, cosmic background base gradient, glass/typography system, Design
Lock LivingCore, One Character Principle, sidebar theme, menu. Layer 03 chỉ thêm/chỉnh **chuyển
động** trên đúng những gì đã tồn tại.
