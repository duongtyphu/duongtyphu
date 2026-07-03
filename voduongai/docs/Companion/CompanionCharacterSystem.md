# Companion Character System™

Companion Design System™ — Layer 02. Companion Orb chính thức trở thành nhân vật trung
tâm có trạng thái, chuyển động và sự hiện diện nhất quán trên toàn bộ Companion Page —
không phải một mascot mới.

## One Character Principle

> Toàn bộ VO DUONG AI chỉ có một Companion duy nhất. Mọi nơi chỉ thay đổi trạng thái, ánh
> sáng, kích thước và chuyển động. Không thay đổi nhân vật.

Companion Character chính thức = **Living Core™** (`src/components/LivingCore.tsx`), Design
Lock v1.2, đã được Founder duyệt và khoá lại ("giống như logo Apple"). File đó **không bị
sửa geometry/màu sắc/hình dạng** ở Layer 02 này — mọi thứ trong tài liệu này được xây bằng
cách BỌC NGOÀI (wrapper component + CSS lớp ngoài), không đụng vào SVG lõi.

**Tuyệt đối không được:**
- Tạo mascot mới
- Dùng hình mặt cười khác
- Dùng robot
- Dùng avatar người
- Dùng icon AI generic (bóng đèn, chip, ổ cắm...)
- Thay đổi hình dạng lõi (tỷ lệ, số vòng quỹ đạo, gradient màu Companion Blue™)

**Được phép (chỉ ở lớp bọc ngoài, không sửa `LivingCore.tsx`):**
- Thêm animation (breathe, pulse, speaking pulse, celebrate spark, sleep dim)
- Thêm/ẩn glow, orbit, particles (qua props có sẵn hoặc CSS lớp ngoài)
- Thêm trạng thái mới ở tầng UI (`listening`) bằng cách ánh xạ về state gốc + class bổ sung
- Scale kích thước (qua size preset)
- Đổi cường độ ánh sáng theo trạng thái (qua intensity preset + filter CSS)

## CompanionOrb — component tái dùng

`src/components/portal/companion/CompanionOrb.tsx`. Đây là API duy nhất nên dùng ở các
trang Companion mới — không import thẳng `LivingCore` trừ khi cần chính xác API gốc (VD:
trang demo kỹ thuật `y-nghia-companion` giữ nguyên `LivingCore` vì đó là nội dung cũ, không
đổi theo yêu cầu "không xoá nội dung Companion hiện tại").

```tsx
<CompanionOrb
  size="hero"        // sm | md | lg | xl | hero
  state="idle"        // idle | thinking | speaking | listening | celebrating | sleeping | offline
  intensity="normal"  // calm | normal | active | radiant
  showOrbit           // boolean, mặc định true
  showParticles       // boolean, mặc định true
/>
```

### Bảng ánh xạ size

| CompanionOrb size | LivingCore size (px) | Dùng ở đâu |
|---|---|---|
| `sm` | 32 | Mini orb sidebar, story card nhỏ |
| `md` | 52 | Card vừa, panel nhỏ |
| `lg` | 64 | Khối nội dung nổi bật vừa |
| `xl` | 128 | Hero orb trên mobile |
| `hero` | 256 | Hero orb trên desktop, khoảnh khắc trung tâm |

### Bảng ánh xạ intensity

| CompanionOrb intensity | LivingCore intensity | Ghi chú |
|---|---|---|
| `calm` | low | + `saturate(0.92)` ở lớp bọc — dịu hơn mức "low" gốc một chút |
| `normal` | medium | Mặc định |
| `active` | high | |
| `radiant` | high | + `brightness(1.16) saturate(1.08)` ở lớp bọc — vượt mức "high" gốc, dùng cho Hero |

## 7 trạng thái (visual states)

Mỗi state thể hiện bằng **motion + light**, không dùng emoji.

| State | Cảm giác | Cách tạo (LivingCore gốc + lớp bọc CompanionOrb) |
|---|---|---|
| `idle` | thở nhẹ, glow ổn định, orbit chậm | LivingCore `idle` nguyên bản |
| `thinking` | glow tím/xanh sâu hơn, orbit rõ hơn, pulse nhẹ | LivingCore `thinking` nguyên bản |
| `speaking` | glow nhịp theo lời nói, aura hơi mở rộng | LivingCore `speaking` + class `companion-orb--speaking` (`companion-speaking-pulse`) |
| `listening` | ánh sáng mềm, ít chuyển động hơn, cảm giác đang lắng nghe | Ánh xạ về LivingCore `idle` + class `companion-orb--listening` (giảm saturation/brightness, giảm opacity orbit) |
| `celebrating` | glow sáng hơn, particles nhẹ, không lòe loẹt | LivingCore `celebrating` + class `companion-orb--celebrating` (`companion-celebrate-spark`) |
| `sleeping` | glow thấp, orbit gần dừng, cảm giác nghỉ | LivingCore `sleeping` + class `companion-orb--sleeping` (`companion-sleep-dim`) |
| `offline` | giảm saturation, glow rất thấp | LivingCore `offline` nguyên bản |

### Khi nào dùng state nào

- `idle` — mặc định mọi nơi không có tương tác cụ thể.
- `thinking` — khi Companion đang xử lý/lập kế hoạch (VD: Work Session `THINKING`/`PLANNING`, xem
  `docs/CompanionPresenceStandard.md`).
- `speaking` — khi hiển thị một câu Companion vừa nói (bong bóng greeting/thought/celebration).
- `listening` — khi người dùng đang nhập nội dung cho Companion (Task Entry, Reflection input).
- `celebrating` — sau khi người dùng xác nhận hoàn thành (Work Session `CELEBRATING`).
- `sleeping` — khi Companion ở trạng thái không hoạt động lâu (minimized, vắng mặt dài).
- `offline` — khi không có kết nối/dữ liệu Companion (fallback an toàn).

## Motion tokens riêng cho Companion Character (Nhiệm vụ 06)

Định nghĩa tại `src/styles/companion-theme.css`:

| Token (class) | Mô tả |
|---|---|
| `companion-motion-breathe` | Scale nhẹ 1 → 1.035, chu kỳ 5s — dùng cho Hero Orb |
| `companion-motion-orbit-slow` | Rotate 360° chu kỳ 30s — dùng khi cần quỹ đạo phụ ở lớp bọc |
| `companion-motion-glow-pulse` | Brightness pulse nhẹ, chu kỳ 4s |
| `companion-orb--speaking` (dùng `companion-speaking-pulse`) | Scale + brightness nhịp nhanh hơn (1.4s) khi đang nói |
| `companion-orb--celebrating` (dùng `companion-celebrate-spark`) | Brightness/saturation nhấn 2 nhịp, chu kỳ 2.2s |
| `companion-orb--sleeping` (dùng `companion-sleep-dim`) | Opacity dao động nhẹ 0.7–0.82, chu kỳ 6s |

**Nguyên tắc**: các token này là lớp CỘNG THÊM lên animation gốc của LivingCore (breathing/
orbit/aura đã có sẵn trong `globals.css`), không thay thế. Ưu tiên CSS animation nhẹ (transform/
opacity/filter — GPU-friendly), không dùng Framer Motion cho orb (đã đủ mượt bằng CSS thuần,
đúng tinh thần "animation nhẹ").

## Reduced Motion (Nhiệm vụ 07)

`LivingCore.tsx` đã tự tắt orbit/pulse/aura/mote khi `prefers-reduced-motion: reduce` (xem
`globals.css`, block cuối file). CompanionOrb bổ sung thêm ở lớp bọc: mọi animation phụ thêm ở
Layer 02 (`companion-orb--speaking/celebrating/sleeping`, `companion-motion-*`) đều bị tắt
trong cùng media query, tại `companion-theme.css`. Kết quả: khi người dùng bật giảm chuyển
động, Companion Orb vẫn hiện diện đẹp — glow/màu sắc giữ nguyên tĩnh, chỉ chuyển động dừng lại.

## Sidebar usage (Nhiệm vụ 04)

`CompanionSidebarOrb.tsx` — hiện ở cuối sidebar khi route là `/portal/companion` hoặc
`/portal/companion/*` (Layer 01 đã có theme riêng cho sidebar này). Dùng
`CompanionOrb size="sm" state="idle" intensity="calm" showOrbit={false}` — nhỏ, dịu, không
quỹ đạo (đỡ rối ở kích thước nhỏ), kèm dòng chữ "Mình luôn ở đây để đồng hành." Không chiếm
nhiều diện tích, không cạnh tranh với menu.

## Hero usage (Nhiệm vụ 03)

Trên `/portal/companion`, Hero dùng `CompanionOrb size="hero"` (desktop) / `size="xl"`
(mobile), `state="idle"`, `intensity="radiant"`, bọc thêm class `companion-motion-breathe`.
Đủ orbit ring (3 vòng ở size ≥128), aura, particles (tự động theo `detailForSize` trong
LivingCore — không cấu hình thêm). Không che text: orb luôn đứng trên cùng, heading/subtitle
nằm ngay dưới, không chồng lấp.

## Mobile rules

- Hero: dùng preset `xl` (128px) thay vì `hero` (256px) dưới breakpoint `sm` — orb nhỏ hơn,
  nằm phía trên text, không đẩy hero quá cao (đã áp dụng bằng 2 block `sm:hidden`/`hidden
  sm:block`, không dùng JS đo viewport).
- Sidebar orb: luôn `sm` (32px) bất kể breakpoint — khi sidebar bị collapse trên desktop
  (`showLabel=false`), orb căn giữa, ẩn phần chữ.
- Story card orb (Nhiệm vụ 05): luôn `sm`, không phóng to trên mobile.

## Story card usage (Nhiệm vụ 05)

Hai nơi dùng orb nhỏ, đúng cảm giác "tâm sự" — không dùng tràn lan:

1. **`/portal/companion/tam-su`** — `CompanionPlaceholderPage` nhận prop `showOrb`, hiển thị
   `CompanionOrb size="sm" state="listening"` cạnh dòng "Companion đang tâm sự cùng bạn".
2. **"Hôm nay Companion nghĩ gì?"** trên Companion Home (`/portal/companion`) — `CompanionOrb
   size="sm" state="thinking"` cạnh một câu từ `THOUGHT_SEEDS` (`src/data/portal/
   thought-seeds.ts`, đã có sẵn từ trước — không tạo nguồn nội dung mới).

Các placeholder route khác (`nhung-dieu-minh-tin`, `cuoc-doi-companion`, `book-notes`)
**không** bật `showOrb` — tránh spam orb ở nơi không có cảm giác tâm sự thật sự.

## Ranh giới với Layer 01

Layer 02 không đổi: route architecture, cosmic background, glass system, typography, sidebar
theme switch (đã xong ở Layer 01) — chỉ bổ sung nhân vật Companion Character có chiều sâu hơn
vào các bề mặt đó. Không redesign lại toàn bộ page, không làm sâu Book Notes/Timeline (để dành
cho Layer sau).
