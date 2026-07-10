# GARDEN VISUAL DIRECTION — "KHU VƯỜN CỦA BẠN"

**Portal 4.0 — Journey Platform · Định hướng thị giác đặc biệt**
**Trạng thái: PRODUCT OWNER APPROVED · P0 · Tài liệu thiết kế (chưa kèm code)**
Ngày: 2026-07-09 · Bổ sung cho `JOURNEY_PLATFORM_ARCHITECTURE.md` (mục 9)

> Tài liệu này thay thế định hướng "giữ nguyên, chỉ tinh chỉnh 4 điểm" ở
> mục 9 của kiến trúc Journey **về mặt THỊ GIÁC**: PO đã duyệt việc dựng
> lại toàn bộ trải nghiệm hình ảnh của Khu vườn. Phần **dữ liệu** không
> đổi: `growth-view.ts` vẫn là nguồn sự thật duy nhất, tuyệt đối không
> fake growth.

---

> **CẬP NHẬT (PO APPROVED):** Khu vườn có **chu kỳ ngày–đêm sống** —
> 4 khí quyển (Bình minh / Ban ngày / Hoàng hôn / Đêm) đổi theo giờ
> thiết bị của người dùng. Xem mục 13. Khí quyển ĐÊM ở mục 1–2 dưới đây
> trở thành một trong bốn trạng thái — và là **hình ảnh chữ ký** của
> Journey.

## 1. Khái niệm thị giác (Visual Concept)

**Một khu vườn cổ tích dưới ánh trăng, được tinh luyện bằng thẩm mỹ AI
hiện đại.** Khi bước vào, người dùng cảm thấy:

> "Tôi đang nhìn thấy kết quả của tất cả những gì mình đã học và nuôi dưỡng."

Cảm giác: mộng mị (dreamlike) · phát sáng dịu (luminous) · xúc cảm ·
cao cấp · chuyên nghiệp · tĩnh lặng · immersive.

**Bỏ hẳn:** nền grid/ca-rô hiện tại; nền trắng chuẩn của Portal; layout
card trắng xếp chồng; mọi dấu hiệu dashboard/analytics/game UI.

**Cấm:** hoạt hình trẻ con, neon cyberpunk, animation ồn ào, sáo mòn
fantasy, trang trí thừa, gradient rẻ tiền.

Bố cục điện ảnh 3 lớp chiều sâu:

- **Hậu cảnh**: bầu trời nửa đêm nhiều lớp gradient hoà vào nhau (không
  một dải gradient phẳng), sao mờ, bụi sáng trôi rất chậm, sương mỏng.
- **Trung cảnh**: CÂY trung tâm + thảm cỏ, mặt nước phản chiếu nhẹ, lối
  đi phát sáng mờ dẫn về phía cây.
- **Tiền cảnh**: VIÊN NGỌC dưới gốc cây, vài phiến đá, đèn lồng thưa,
  đom đóm — tất cả có ý nghĩa, không có gì thuần trang trí.

## 2. Hệ màu

Khu vườn được phép dùng bảng màu giàu hơn mọi trang Portal khác:

| Vai trò | Màu | Ghi chú |
|---|---|---|
| Nền trời sâu | Deep midnight blue (#0A1128 → #12224D vùng chân trời) | Lớp đáy |
| Sự sống | Emerald green (tán cây, cỏ) | Trung cảnh |
| Huyền ảo | Soft violet + teal (sương, phản chiếu nước) | Lớp khí quyển |
| Quý giá | Warm gold (ánh ngọc, đèn lồng, đom đóm) | Điểm nhấn |
| Ánh trăng | Moonlight silver (viền tán lá, mặt nước) | Ánh sáng chủ đạo |
| Nhấn phụ | Subtle rose / cyan (hoa, tia lấp lánh) | Dùng tiết chế |

Quy tắc: các màu **hoà vào nhau bằng nhiều lớp ánh sáng khí quyển**
(radial + linear chồng lớp, blur lớn), không dùng một flat gradient.
Vẫn thuộc gia đình màu VO DUONG AI (blue/violet/gold đã có ở Premium) —
Khu vườn nghiêng về emerald/moonlight làm chữ ký riêng.

## 3. Ý nghĩa biểu tượng (Symbolic Meaning)

Mọi phần tử đều mang nghĩa — và phải TIẾT CHẾ, không hiển thị tất cả cùng lúc:

| Phần tử | Ý nghĩa | Nguồn dữ liệu thật |
|---|---|---|
| **Cây** (trung tâm) | Trưởng thành dài hạn tích luỹ | GardenSummary (growth-view) |
| **Viên ngọc** (dưới gốc) | Học vấn chưng cất thành giá trị cá nhân; ký ức Companion gìn giữ | Reflections, memory capsules, milestones thật |
| Hoa | Bài học hoàn thành / khoảnh khắc học có ý nghĩa | Sessions completed (growth-view) |
| Lối đi | Các hành trình học | journeysTouched |
| Đèn lồng | Suy ngẫm / ký ức | reflections, memory_capsules |
| Mặt nước | Sự liên tục và tĩnh tại | Nhịp hoạt động theo thời gian |
| Phiến đá | Cột mốc | growth-milestones (thật) |
| Hạt mầm | Dự định / hành trình chưa bắt đầu | Intentions (capsule "dự định"), journeys chưa chạm |

Quy tắc tiết chế: mặc định chỉ hiện Cây + Ngọc + tối đa 3 nhóm phần tử
có dữ liệu thật nhiều nhất; phần tử không có dữ liệu thật thì không vẽ
(trừ hạt mầm — biểu tượng hợp lệ của "chưa bắt đầu").

## 4. Hành vi của CÂY (Tree Behavior)

Cây là biểu tượng trung tâm — sống động, chín chắn, "lặng lẽ uy nghi",
**khác nhau theo giai đoạn thật** của người dùng. Giai đoạn cây ánh xạ
TỪ DỮ LIỆU THẬT HIỆN CÓ (không thêm hệ đo mới, không fake):

| Giai đoạn cây | Điều kiện thật (GardenSummary) |
|---|---|
| Hạt mầm dưới đất | Mọi chỉ số = 0 (vườn trống) |
| Mầm non | totalOutputs ≥ 1 hoặc missionsCompleted ≥ 1 |
| Cây non | missionsCompleted ≥ 3 hoặc journeysTouched ≥ 2 |
| Cây trưởng thành | missionsCompleted ≥ 10 và competenciesPracticed ≥ 3 |
| Cây toả tán (majestic) | Mốc cao hơn — chốt ngưỡng cùng PO khi có dữ liệu thật đầu tiên |

- Ngưỡng là **config một chỗ** (sau này Admin chỉnh — mục 10), không rải
  trong code.
- Tương lai (future integration, KHÔNG làm bây giờ): learning completed
  (chờ Learning Platform — xem TECH_DEBT_LEARNING_PLATFORM.md),
  consistency theo thời gian.
- Cây **không bao giờ tụt cấp** — trưởng thành không bị trừ đi.
- Không hiển thị "cấp cây" bằng số/label game (không "Lv.3") — chỉ hình
  ảnh và một câu Companion mô tả bằng lời.

## 5. Hành vi của VIÊN NGỌC (Gem Behavior)

Viên ngọc nằm ở hốc rễ cây — **hình ảnh chữ ký của VO DUONG AI** (cùng
họ với ẩn dụ "viên ngọc quý cần thời gian mài giũa" đã có ở Journey).

Trạng thái thị giác:

- Phát sáng dịu, "thở" chậm (glow breathing ~6–8s/chu kỳ).
- Lấp lánh tiết chế (sparkle thưa, không liên tục).
- Hắt sáng ấm lên rễ, cỏ, đá lân cận (light cast — làm ngọc thuộc về
  khung cảnh, không dán đè lên).
- Cảm giác: quý giá, **được tích luỹ mà thành** — tuyệt đối không giống
  phần thưởng game (không ribbon, không "+50 XP", không rương).
- Độ rực của ngọc tăng RẤT nhẹ theo lượng ký ức thật nó đang giữ (số
  reflections + capsules) — người dùng lâu năm thấy ngọc "đầy" hơn.

## 6. Mô hình tương tác (Interaction Model)

**Chạm/click vào ngọc** → mở một khoảnh khắc (panel nhỏ nổi trong khung
cảnh, không rời trang, không modal trắng):

1. Ưu tiên nội dung theo thứ tự: cột mốc ý nghĩa gần nhất → suy ngẫm mới
   nhất → output thật gần nhất → ký ức Companion đang gìn giữ → tóm tắt
   những gì đã nuôi dưỡng (GardenSummary bằng lời).
2. Mỗi lần mở chỉ hiện MỘT khoảnh khắc + nút "một khoảnh khắc khác"
   (xoay vòng trong dữ liệu thật).
3. Không có dữ liệu thật → empty state thơ và trung thực:
   > "Viên ngọc vẫn đang chờ những trải nghiệm đầu tiên của bạn."
4. Không bao giờ bịa thành tựu.

**Chạm vào phần tử vườn khác** (hoa/đèn lồng/đá/hạt mầm): hiện đúng MỘT
dòng nghĩa + nguồn thật của nó ("Đèn lồng này là suy ngẫm bạn viết ngày
12/06") — chạm chỗ khác để đóng. Mỗi thời điểm chỉ một phần tử được chọn.

Bàn phím/a11y: mọi phần tử tương tác focus được, có aria-label bằng lời
nghĩa của nó; toàn cảnh có mô tả văn bản thay thế.

## 7. Nội dung chữ & Companion trong vườn

Trang được hiểu bằng THỊ GIÁC trước. Chữ chỉ ở 4 chỗ:

1. Một câu chứng kiến của Companion (theo dữ liệu thật — "Tuần này vườn
   bạn yên tĩnh." là câu hợp lệ).
2. Trạng thái vườn hiện tại (một dòng, bằng lời — không số liệu khô).
3. Nghĩa của phần tử đang chọn (mục 6).
4. MỘT hành động nuôi dưỡng kế tiếp (CTA dịu, dẫn về đúng pillar).

Companion = nhân chứng lặng lẽ: nói điều đã lớn lên, điều còn dang dở,
ký ức đang gìn giữ, điều có thể nuôi tiếp — không coach, không thuyết
minh mọi hình ảnh, không truyền động lực sáo rỗng. Không streak, không
nhắc nhở kiểu habit tracker.

## 8. Cấu trúc trang & chuyển động

Cấu trúc trải nghiệm (không phải dashboard xếp chồng):

1. Cổng vào immersive (nền khí quyển phủ toàn trang, phá lề chuẩn Portal)
2. Khung cảnh vườn hiện tại (3 lớp chiều sâu)
3. Cây trung tâm
4. Viên ngọc dưới gốc
5. Các phần tử có nghĩa chọn được
6. Một câu Companion
7. Một hành động kế tiếp
8. Liên kết trở về Journey Hub (một chạm)

Chuyển động — tinh tế và khí quyển, KHÔNG nhanh, KHÔNG gây nhiễu:

| Hiệu ứng | Nhịp |
|---|---|
| Lá lay nhẹ (WindLayer/LeafChipLayer hiện có — tinh chỉnh) | rất chậm |
| Bụi sáng/đom đóm trôi (BokehLayer/SparkleLayer hiện có — tiết chế lại) | chậm, thưa |
| Ngọc "thở" | 6–8s/chu kỳ |
| Shimmer mặt nước/cây | thoảng qua |
| Parallax nhẹ giữa 3 lớp khi cuộn/di chuột | biên độ nhỏ |

`prefers-reduced-motion: reduce` → tắt toàn bộ chuyển động, giữ nguyên
khung cảnh tĩnh đầy đủ nghĩa (đã là quy ước của project).

## 9. Chiến lược responsive

| Thiết bị | Nguyên tắc |
|---|---|
| **Desktop** | Bố cục điện ảnh, chiều sâu tối đa, khung cảnh rộng; cây + ngọc lệch tâm nhẹ theo tỷ lệ vàng |
| **Tablet** | Giữ bố cục chính; **giảm lớp trang trí trước, thu nhỏ phần tử lõi sau** (bỏ bớt bokeh/sao trước khi đụng vào cây/ngọc) |
| **Mobile** | TUYỆT ĐỐI không biến thành danh sách card; giữ khung cảnh cảm xúc; Cây + Ngọc là tiêu điểm; nền đơn giản hoá còn 2 lớp; vùng chạm ≥ 44px; panel khoảnh khắc trượt từ đáy |

## 10. Nguồn dữ liệu thật & empty states

**Nguồn thật hiện có** (đối chiếu code):

- `getGardenSummary()` / `getRecentActivity()` — `growth-view.ts`
  (foundation, đã NO-FAKE: mọi chỉ số 0 khi chưa hoạt động).
- `reflections`, `memory_capsules` (Supabase) — nội dung ngọc & đèn lồng.
- `growth-milestones` / `growth-signals` (growth-map) — phiến đá, khoảnh
  khắc ngọc.
- Companion core-memory — ký ức Companion gìn giữ.
- **Future integration** (đánh dấu chờ, không fake): learning completed
  (Learning Platform), consistency dài hạn, tín hiệu Projects.

**Empty state toàn trang** (vườn trống — mọi chỉ số 0): vẫn là khung cảnh
đẹp — bầu trời đêm đầy đủ khí quyển, đất mềm, MỘT hạt mầm phát sáng nhẹ
thay vị trí cây, ngọc mờ dưới đất chờ:

> "Khu vườn mọc từ việc học thật. Hạt mầm đầu tiên đang chờ bạn."

- một CTA duy nhất dẫn về Học viện AI. Không cây giả, không hoa giả,
  không số liệu mẫu.

## 11. Yêu cầu Admin tương lai

(thiết kế CMS-first, chưa xây — cùng đợt Admin Platform)

1. Ngưỡng giai đoạn cây (bảng ở mục 4) chỉnh được không cần code.
2. Bảng ánh xạ phần tử ↔ nghĩa ↔ nguồn dữ liệu (mục 3) quản trị được.
3. Thư viện câu Companion trong vườn (chứng kiến/mùa vụ, và theo 4 khí
   quyển ngày–đêm — mục 13.1) thêm-sửa-tắt được.
4. Bật/tắt từng lớp hiệu ứng (mist, bokeh, parallax) phục vụ hiệu năng.
5. Nội dung empty state chỉnh được.
6. Day/Night: override khí quyển để duyệt thiết kế + chỉnh băng giờ của
   4 khí quyển (mục 13.5).

## 12. Ghi chú triển khai & Quality Gate

- **Tái sử dụng khung `GardenScene`** hiện có (TreeLayer, SunlightLayer,
  WindLayer, LeafChipLayer, BokehLayer, SparkleLayer) làm bộ khung layer —
  dựng lại art direction theo tài liệu này thay vì viết engine mới;
  bỏ nền grid/ca-rô và mọi khối card trắng trên trang.
- Không thêm bảng/schema mới. Không fake growth logic.
- Thứ tự làm nằm trong Phase P6 của `JOURNEY_PLATFORM_ARCHITECTURE.md`
  (nâng độ ưu tiên theo P0 này nếu PO muốn làm trước các cửa khác).

**Quality Gate** — chỉ hoàn thành khi Product Owner cảm thấy:

> "Tôi vừa bước vào một ký ức sống động tuyệt đẹp về sự trưởng thành của
> chính mình." — chứ KHÔNG phải "tôi đang xem thêm một trang tiến độ."

Bài kiểm tra bỏ-logo: che logo đi, người xem vẫn nhận ra đây là một nơi
đặc biệt, cá nhân, "earned", sống động, ma thuật nhưng chuyên nghiệp —
và duy nhất của VO DUONG AI.

---

## 13. LIVING DAY & NIGHT CYCLE (PO APPROVED)

Khu vườn **sống** — nó đổi khí quyển một cách tự nhiên theo thời gian
trong ngày. Đây không phải hiệu ứng trang trí; nó là một phần của cách
VO DUONG AI kể chuyện cảm xúc. Không fake growth, không game mechanics.

### 13.1 Bốn khí quyển

| Khí quyển | Khung giờ (giờ thiết bị) | Cảm xúc | Ánh sáng & màu | Hạt/chi tiết sống |
|---|---|---|---|---|
| 🌅 **Bình minh** | 05:00–07:59 | Hy vọng · Khởi đầu · Năng lượng tĩnh | Chân trời cam ấm mọc dần trên nền xanh thẫm còn sót; sương sáng mỏng; ánh sáng nghiêng thấp, dịu | Giọt sương lấp lánh trên cỏ (sparkle chậm); vài chấm "chim" mờ bay xa (tuỳ chọn, rất tiết chế) |
| ☀️ **Ban ngày** | 08:00–16:59 | Trưởng thành · Học · Tạo ra | Trời trong sáng xanh nhạt; lục rực rỡ; không khí tươi | Lá lay nhẹ; nước lấp lánh (shimmer thoảng); sparkle thưa |
| 🌇 **Hoàng hôn** | 17:00–18:59 | Chiêm nghiệm · Hoàn thành · Biết ơn | Ánh vàng kim; trời cam→tím; bóng đổ ấm và **dài dần** dưới gốc cây | Đèn lồng **bắt đầu thắp** (chỉ khi có dữ liệu suy ngẫm/ký ức thật — không thắp đèn giả) |
| 🌙 **Đêm** | 19:00–04:59 | Ký ức · Kinh ngạc · Bình yên | Xanh nửa đêm sâu; sao; ánh trăng bạc; tán cây viền sáng | Đom đóm trôi; bụi sáng ma thuật; Ngọc "thở" rực nhất; phản chiếu trên nước — **hình ảnh chữ ký của Journey** |

Giọng Companion đổi nhẹ theo khí quyển (vẫn CHỈ dữ liệu thật, im lặng
vẫn hợp lệ):

- Sáng — lời mời dịu: "Một ngày mới cho khu vườn. Bạn muốn gieo gì hôm nay?"
- Ngày — nhắc tiếp tục: "Khu vườn lớn lên vào những giờ bạn làm việc thật."
- Hoàng hôn — chiêm nghiệm: "Hôm nay đã trôi qua — có điều gì đáng giữ lại?"
- Đêm — ký ức tĩnh: "Tôi vẫn giữ những khoảnh khắc của bạn, dưới ánh ngọc."

(Câu cụ thể lấy từ thư viện; khi gắn dữ kiện thật — ví dụ hoạt động gần
nhất — dùng đúng template nhân chứng hiện có.)

### 13.2 Kiến trúc Day/Night — MỘT khu vườn, bốn lớp ánh sáng

**Không tải 4 khung cảnh.** Cùng một Garden (Cây, Ngọc, bố cục, dữ liệu)
— chỉ khí quyển đổi. Kiến trúc token hoá:

```
<GardenExperience data-garden-period="dawn|day|sunset|night">
  ├── Sky stack: 4 lớp gradient bầu trời chồng nhau (div rẻ, CSS thuần)
  │     → chỉ MỘT lớp opacity=1 theo period; các lớp khác opacity=0
  ├── Lighting overlay: 1 lớp tint phủ khung cảnh (màu/độ mờ theo CSS var)
  ├── Shadow layer: dải bóng gốc cây (scaleX/opacity theo period)
  ├── Particle system: cùng bộ phần tử, đổi màu/mật độ/tốc độ theo var
  ├── Gem glow: cường độ theo var (ngày dịu → đêm mạnh nhất, vẫn thanh lịch)
  └── Scene (Tree + layer engine hiện có): KHÔNG ĐỔI
```

- Mỗi period = một bộ **CSS custom properties** (`--g-sky-*`,
  `--g-tint`, `--g-glow`, `--g-particle-alpha`, `--g-shadow-scale`) gắn
  qua `data-garden-period` trên container — đổi period là đổi biến,
  không đổi DOM.
- **Cây là mỏ neo thị giác — không bao giờ thay cây.** Ảnh cây chính
  thức giữ nguyên mọi thời điểm; chỉ overlay ánh sáng phủ lên thay đổi.
- **Ngọc tồn tại cả ngày.** Ban ngày glow dịu; đêm là trung tâm cảm xúc,
  glow mạnh hơn nhưng có trần cường độ (không bao giờ loè loẹt).

### 13.3 Chiến lược ánh sáng (Lighting Strategy)

1. Nguồn sáng kể chuyện: bình minh = chân trời thấp phía đông (phải
   khung); ngày = đỉnh trời; hoàng hôn = chân trời trái + đèn lồng; đêm
   = trăng bạc + Ngọc + đom đóm.
2. Ảnh cây (ánh nắng cố định trong ảnh) được "hoà" vào từng khí quyển
   bằng lighting overlay (soft-light/multiply tint có biến độ mờ) — ảnh
   không bị recolor, chỉ được "chiếu sáng" khác đi.
3. Bóng đổ: một dải gradient ellipse dưới gốc cây — trưa ngắn mờ, hoàng
   hôn dài và ấm (scaleX lớn), đêm tan vào nền.
4. Glow không cộng dồn: mỗi period có ngân sách glow (tối đa 2 nguồn
   glow lớn cùng lúc) để giữ thanh lịch.

### 13.4 Quy tắc chuyển cảnh (Transition Rules)

- **Không bao giờ đổi đột ngột.** Mọi thứ chuyển bằng nội suy
  ánh sáng/màu: crossfade opacity giữa các lớp trời + transition trên
  CSS variables, thời lượng **60–90 giây** khi ranh giới giờ xảy ra lúc
  trang đang mở.
- Khi TẢI trang: vào thẳng đúng khí quyển hiện tại (không fade từ
  khí quyển sai).
- Kiểm tra thời gian bằng interval nhẹ mỗi 60 giây (không rAF loop);
  đổi period chỉ khi băng giờ thực sự đổi.
- Chỉ animate `opacity`/`transform`/`filter` (GPU-friendly) — không
  animate gradient trực tiếp (không nội suy được), đó là lý do dùng
  sky-stack crossfade.

### 13.5 Thời gian thực & Admin

- Mặc định: **giờ địa phương của thiết bị người dùng**. Không có nút
  chuyển tay cho người dùng.
- Tương lai (Admin Platform): override khí quyển để duyệt thiết kế,
  chỉnh băng giờ 4 khí quyển, bật/tắt từng lớp hiệu ứng — thêm vào danh
  sách Admin ở mục 11.

### 13.6 Hiệu năng (Performance Strategy)

- MỘT khung cảnh, KHÔNG thêm ảnh/asset nào cho 4 khí quyển — toàn bộ
  trời/ánh sáng/bóng là gradient + CSS thuần.
- Sky stack 4 div gradient tĩnh (composite rẻ), chỉ opacity thay đổi.
- Ngân sách hạt: ≤ 8 phần tử hạt hoạt động mỗi khí quyển (tái sử dụng
  cùng bộ node — đổi màu/tốc độ bằng biến, không mount/unmount ồ ạt).
- Không canvas/WebGL, không thư viện animation, không vòng lặp JS;
  timer 60s là chi phí duy nhất ngoài CSS.
- Mobile: giảm lớp trang trí trước (bỏ sương/bớt hạt) — giữ nguyên
  trời + Cây + Ngọc (đúng chiến lược responsive mục 9).

### 13.7 Trợ năng (Accessibility Strategy)

- `prefers-reduced-motion: reduce`:
  - **GIỮ** thay đổi ánh sáng theo giờ (đó là trạng thái, không phải
    chuyển động) — nhưng đổi period tức thời thay vì crossfade dài.
  - **GIẢM/TẮT** chuyển động hạt: đom đóm/bụi/sương đứng yên ở opacity
    thấp hoặc ẩn; Ngọc ngừng "thở", giữ glow tĩnh.
- Mọi lớp khí quyển là trang trí: `aria-hidden`, không nhận focus.
- Tương phản chữ được kiểm ở CẢ 4 khí quyển (chữ trắng/nhạt phải đạt
  chuẩn trên nền sáng của Ban ngày — dùng scrim cục bộ sau chữ khi cần).

### 13.8 Trạng thái triển khai

Phiên bản Garden P2 hiện tại đã dựng khí quyển ĐÊM (nền midnight, đom
đóm, Ngọc thở). Ba khí quyển còn lại + hệ token/period/transition ở
trên là bước triển khai kế tiếp của P2 — chờ lệnh Product Owner sau khi
duyệt tài liệu này.
