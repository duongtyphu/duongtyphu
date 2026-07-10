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
3. Thư viện câu Companion trong vườn (chứng kiến/mùa vụ) thêm-sửa-tắt được.
4. Bật/tắt từng lớp hiệu ứng (mist, bokeh, parallax) phục vụ hiệu năng.
5. Nội dung empty state chỉnh được.

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
