# JOURNEY PLATFORM — FINAL AUDIT (post P6)

**Trạng thái**: Kiểm tra chéo toàn bộ 6 cửa Journey sau khi P6 (Journey Map)
hoàn tất. Đối chiếu trực tiếp với code thật tại thời điểm viết.
Ngày: 2026-07-10.

---

## 1. Kiểm tra từng cửa

| Cửa | Route | Nền/khí quyển riêng | Empty state trung thực | Companion (tối đa 1) | Dữ liệu thật |
|---|---|---|---|---|---|
| Journey Hub | `/portal/hanhtrinhcuatoi` | ⚠️ Vẫn dùng gradient nhạt chung (`slate-50→blue-50`) — **chưa redesign** theo mục 18.2 | Không cần (trang cổng, luôn hiện 5+1 cửa) | ✅ CompanionMemoryLine | ✅ |
| Garden | `/portal/khuvuoncuaban` | ✅ Midnight/emerald + chu kỳ ngày-đêm | ✅ Hạt mầm phát sáng | ✅ 1 dòng chứng kiến | ✅ |
| My Story | `/portal/story` | ✅ Giấy ấm/serif | ✅ "Trang đầu còn trắng" | ✅ Companion sentence | ✅ |
| Mirror | `/portal/mirror` | ✅ Kính khói/xanh lạnh | ✅ Câu đúng nguyên văn brief | ✅ LivingCore nhỏ + 1 câu hỏi | ✅ |
| Nhật ký học tập | `/portal/nhatkyhoctap` | ✅ Giấy xám ấm + bookmark cam | ✅ "Trang đầu tiên..." đúng nguyên văn | ✅ 1 ý định/ngày | ✅ |
| Journey Map | `/portal/hanhtrinhcuatoi/ban-do` | ✅ Giấy da cũ/la bàn/đường đồng mức | ✅ "Mỗi cuộc hành trình..." đúng nguyên văn | ✅ 1 lời khép | ✅ |

**Kết luận**: 5/6 cửa đạt đúng đặc tả thị giác đã đóng băng (mục 18). **Hub
là gap còn lại duy nhất** — đã tự phát hiện từ mục 18.1 khi viết Global Art
Direction nhưng chưa quay lại thực thi (P1 chỉ dựng cấu trúc, chưa redesign
thị giác).

## 2. Navigation & CTA

- Sidebar: đúng 1 mục Journey ("Hành trình của tôi") — không trùng lặp.
- Hub → 5 cửa: tất cả CTA đã có route thật, **không còn "coming soon"**
  (thẻ Journey Map trước đây "Bản đồ đang được vẽ" nay đã trỏ
  `/portal/hanhtrinhcuatoi/ban-do` thật).
- Cross-link liên cửa: My Story ↔ Mirror (2 chiều), Mirror → My Story,
  Journey Map → 5 route pillar thật (Học viện AI, AI Workspace, Workspace,
  Premium, Cộng đồng) + Hub. Không có link chết.
- Mọi CTA "một hành động tiếp theo" đều trỏ route thật, đã build-test.

## 3. Routes & Redirect

- `/portal/journey*` → `/portal/hanhtrinhcuatoi*` (có từ trước, giữ).
- `/portal/hanh-trinh-cua-toi` → `/portal/hanhtrinhcuatoi` (**mới, P6** —
  hoàn tất di dời Sanctuary, không còn 2 hệ Journey song song).
- Không phát hiện route trùng lặp nào khác trỏ tới cùng một cửa.

## 4. Companion consistency

Tất cả 6 cửa tuân thủ đúng quy tắc mục 12/18.8: tối đa MỘT sự hiện diện
Companion mỗi cửa, không phán xét/dán nhãn/chẩn đoán/tán dương, giọng đổi
theo khí quyển nhưng vai trò nhất quán (nhân chứng ở Garden/My Story/Mirror,
bạn học ở Journal, người dẫn đường ở Journey Map).

## 5. Data integrity (NO-FAKE-DATA)

- Toàn bộ 6 cửa chỉ đọc dữ liệu thật: Supabase (`reflections`,
  `memory_capsules`, `orders`) + localStorage (`growth-view`,
  `WorkspaceSessionRecord`, `PortfolioItemRecord`, `GrowthEvent`).
- Chương hiện tại (1-4) giờ THỐNG NHẤT qua `journey-chapter.ts` — Hub, My
  Story, Journey Map gọi cùng một hàm `resolveCurrentChapter`, cùng
  `premiumCount` server-side → không bao giờ hiển thị lệch chương giữa 3
  cửa này.
- Chương 5 ("Giúp người khác") **cố tình luôn "chưa bắt đầu"** — không có
  nguồn dữ liệu chia sẻ/cộng đồng thật, đánh dấu future integration thay vì
  suy đoán.
- Không phát hiện % / XP / Level / so sánh giữa người dùng ở bất kỳ cửa
  nào.

## 6. Empty states

Cả 6 cửa đều có trạng thái trống trung thực và "đẹp" (không cảm giác lỗi).
3 cửa dùng đúng nguyên văn câu đã duyệt trong brief (Mirror, Journal,
Journey Map).

## 7. Responsive

- Toàn bộ layout dùng lớp Tailwind responsive sẵn có (`sm:`/`md:`), kế thừa
  đúng khuôn đã kiểm ở Garden P2 (mobile giữ khung cảnh, không vỡ layout).
- **Chưa chạy kiểm tra thủ công trên thiết bị thật/DevTools cho Mirror,
  Journal, Journey Map** trong phiên này — khuyến nghị QA thủ công trước
  khi coi P7 là đóng hẳn.

## 8. Accessibility

- `:focus-visible` toàn cục (design system) áp dụng cho mọi link/nút mới.
- Vùng chạm Ngọc (Garden)/chip phần tử đã có `aria-label` mô tả nghĩa
  thật; Journey Map's waypoint có `aria-label` "Chương N: tên — trạng
  thái".
- `prefers-reduced-motion` đã tắt/giảm animation ở cả 6 cửa (đã verify code
  từng phase).
- **Chưa test bằng screen reader thật** (VoiceOver/NVDA) — khuyến nghị
  trước Portal Freeze.

## 9. Performance

- Không cửa nào dùng canvas/WebGL/thư viện animation nặng — toàn bộ khí
  quyển là CSS gradient/keyframes thuần.
- Build 248/248 route sạch mỗi phase, không tăng bundle đáng kể (chỉ thêm
  component/CSS, không thêm dependency mới).

---

## 10. Kế hoạch bảo tồn nội dung — tổng kết toàn Journey

| Nội dung | Phân loại | Đích đến |
|---|---|---|
| MyStoryTimeline, CompanionMemoryCard, ReflectionJournalCard, AddMemoryCapsuleForm, UnderstandingNoteCard, HumanGrowthDashboardCard | MERGE | Logic/hook dùng trực tiếp trong My Story mới |
| MonthlyLetterCard | KEEP+IMPROVE | `buildLetter` export, dùng lại trong My Story |
| LivingGardenCard, GardenSignalSync | MOVE | Đã có Garden thật (P2), gỡ khỏi Story |
| MirrorCeremony | MERGE | Mô hình ceremony thay bằng cuộn liên tục; LivingCore/OriginLineWhisper kế thừa |
| GrowthActivityPanel variant "journal"/"garden" | MERGE | Thay bằng trải nghiệm thật riêng; variant "journey" ở Hub vẫn dùng |
| Sanctuary — Thought Seeds | MERGE | → Mirror (P4) |
| Sanctuary — Reflection questions | MERGE | → Mirror "Tự hỏi" (P4) |
| Sanctuary — JOURNEY_STAGES/PRACTICE_TRACKS/gợi ý tiếp theo | MERGE (ý niệm, không copy nguyên văn vì là dữ liệu tĩnh/giả) | → Journey Map thật (P6) |
| Sanctuary — Legacy Seeds | ARCHIVE | Không có dữ liệu thật hậu thuẫn, không migrate |
| Route `/portal/hanh-trinh-cua-toi` | ARCHIVE + REDIRECT | File giữ nguyên (lịch sử), route redirect 308 về Hub |
| **DELETE** | *(không có)* | Không phát hiện nội dung nào đáng xoá trong toàn bộ Journey Platform |

---

## 11. Sẵn sàng cho Portal Freeze?

**Có, với 2 điều kiện còn treo:**

1. Journey Hub cần một lượt redesign thị giác (mục 18.2) — hiện là gap
   thị giác duy nhất trong 6 cửa.
2. QA thủ công (responsive thiết bị thật + screen reader) chưa chạy trong
   phiên này — nên thực hiện trước khi tuyên bố Freeze chính thức.

Không có nợ dữ liệu giả, không có route chết, không có 2 hệ Journey song
song. Nội dung cũ được bảo tồn đầy đủ (0 xoá), mọi cửa đọc cùng một lớp
dữ liệu thật và kể theo giọng riêng — đúng triết lý gốc của
`JOURNEY_PLATFORM_ARCHITECTURE.md` mục 1.
