# Garden Design Spec

**Tên thiết kế:** THE GARDEN OF GROWTH™
**Trang áp dụng:** `/portal/khuvuoncuaban` *(đường dẫn đã đổi từ `/portal/khu-vuon-cua-ban` — spec dưới đây chưa được cập nhật đầy đủ theo lần triển khai lại gần nhất, xem ghi chú Content Cleanup Sprint 7)*
**Reference chính:** `design-references/garden-reference-v1.png` *(chờ Founder import — xem mục "Bước tiếp theo" trong báo cáo sprint)*
**Component hiện tại triển khai spec này** *(danh sách bên dưới đã lỗi thời — component thật hiện nay là `GardenExperience.tsx` + `garden/scene/*`; `GardenTreeVisual.tsx` và `src/data/portal/knowledge-garden.ts` không còn tồn tại, đã bị xoá ở Sprint 3 (dữ liệu giả, orphaned) — danh sách gốc giữ nguyên bên dưới chỉ để tham chiếu lịch sử, cần một sprint riêng để viết lại đầy đủ theo implementation thật)*:
- `src/app/portal/khu-vuon-cua-ban/page.tsx`
- `src/components/portal/garden/GardenTreeVisual.tsx`
- `src/components/portal/garden/GardenProgressRing.tsx`
- `src/components/portal/garden/GardenWidget.tsx`
- `src/data/portal/knowledge-garden.ts`

## Yêu cầu tái hiện bố cục

- **Bên trái** (~35%): nội dung chữ — tiêu đề, subtitle, mô tả, card "Hành trình hôm nay", gợi ý chăm sóc, hoạt động gần đây.
- **Bên phải** (~65%): cây lớn — đây là linh hồn của trang, không phải minh họa phụ.
- Trên cây: các "lá" đại diện cho hành động người dùng (đọc bài, học bài, thực hành, lưu tài liệu, đặt câu hỏi, chia sẻ, hoàn thành thử thách, khám phá).
- Có ánh nắng chiếu xuống từ góc trên (tia nắng buổi sáng ấm áp, không phải glow công nghệ).
- Có lấp lánh ánh sáng rất nhẹ (sparkle), không phải hiệu ứng particle game.
- Bảng gỗ nhỏ dưới gốc cây: "Khu vườn này thuộc về bạn." / "Companion chỉ là người bạn giúp bạn chăm sóc nó."

## Cảm xúc bắt buộc

Chân thật, ấm áp, đang sống — như một khu vườn thật vào buổi sáng. **Không phải** một dashboard, không phải một app gamification.

## Cấm tuyệt đối

- Không cartoon.
- Không neon.
- Không cyberpunk.
- Không game UI (không thanh XP, không badge, không "Level Up").
- Không dashboard khô (không bảng số liệu trần trụi không có ngữ cảnh cảm xúc).

## Dòng subtitle — quy tắc bắt buộc

> "Mỗi hành động đều là một chiếc lá – mỗi chiếc lá là một bước bạn trưởng thành."

- Dùng **gradient xanh → tím → cam** (`#2563EB → #7C3AED → #F97316`), lấy cảm hứng từ Design Reference #2 mà Founder đã duyệt (cùng tông gradient dùng ở tiêu đề "Companion" trong Companion Sanctuary).
- Font mềm mại hơn body text thường, có thể dùng italic nhẹ.
- Không dùng màu đen cho dòng này.

## Garden Growth Stages (hệ thống tăng trưởng)

7 giai đoạn, xem chi tiết trong `src/data/portal/knowledge-garden.ts` (`GROWTH_STAGES`):

1. Hạt giống
2. Mầm non
3. Cây non
4. Cây trưởng thành
5. Cây nở hoa
6. Cây kết trái
7. Khu vườn lan tỏa

Mỗi giai đoạn có emoji, thông điệp cảm xúc riêng, màu ánh sáng riêng (`glowColor`), và ngưỡng số lá riêng — **không dựa trên đăng nhập hay thời gian trôi qua**, chỉ dựa trên hành động có ý nghĩa.

## Ngôn ngữ bắt buộc (Anti-Gamification)

Không bao giờ dùng: XP, Point, Coin, Gem (như đơn vị điểm số), Diamond, Reward, Badge, Level Up, Achievement, Score.

Luôn dùng ngôn ngữ khu vườn:
- "Một chiếc lá mới đã nở." thay vì "+10 XP"
- "Cây của bạn vừa lớn thêm." thay vì "Level Up"
- "Bạn vừa chăm sóc khu vườn." thay vì "Completed"

## Widget preview ở trang chủ Portal

`/portal` chỉ hiển thị bản tóm tắt (`GardenWidget.tsx`): cây nhỏ, giai đoạn hiện tại, tổng lá, % đến giai đoạn tiếp theo, CTA "Xem khu vườn" → `/portal/khu-vuon-cua-ban`. Không render toàn bộ cây lớn + lá hành động ở trang chủ.
