# JOURNEY PLATFORM ARCHITECTURE

**Portal 4.0 — Journey Platform Reconstruction**
**Trạng thái: BẢN THIẾT KẾ chờ Product Owner duyệt — CHƯA TRIỂN KHAI CODE**
Ngày: 2026-07-09 · Chế độ: DESIGN FIRST — NO CODE

> Tài liệu này là hợp đồng thiết kế. Sau khi Product Owner duyệt, việc
> triển khai mới bắt đầu, theo đúng các phase ở mục 18. Mọi khẳng định về
> hiện trạng trong tài liệu đều đã được đối chiếu với code thật tại thời
> điểm viết (đường dẫn file kèm theo).

---

## 1. Triết lý sản phẩm

Journey trả lời đúng một câu hỏi:

> **"Qua quá trình này, tôi đã trở thành ai?"**

Không trả lời: "tôi đã bấm gì", "tôi xong bao nhiêu phần trăm", "tôi được
huy hiệu nào". Journey không phải dashboard, không phải timeline, không
phải log. Journey là nơi **dữ liệu thật của Portal được chuyển hoá thành
suy ngẫm, ký ức và trưởng thành**.

Nguyên tắc bất biến (kế thừa NO-FAKE-DATA của toàn Portal):

1. **Không level giả, không progress giả, không thành tựu giả.** Chỉ hoạt
   động thật, output thật, bài học thật, suy ngẫm thật.
2. **Thiếu dữ liệu thì nói thật** — empty state trung thực là một phần của
   thiết kế, không phải lỗi.
3. **Companion là nhân chứng** (witness), không phải huấn luyện viên,
   không phải người dẫn chương trình, không phải diễn giả truyền động lực.
4. Cảm giác tổng thể: một cuốn sách cá nhân, một không gian suy ngẫm, một
   tấm bản đồ trưởng thành, một khu vườn — **không phải** màn hình
   analytics, trang LMS hay habit tracker.

---

## 2. Cấu trúc Journey chung cuộc

Một Journey Hub — **📖 Hành trình của tôi** — mở ra 5 cánh cửa của cùng
một nền tảng:

| # | Cánh cửa | Bản chất | Cảm giác |
|---|---|---|---|
| 1 | **My Story** | Cuốn sách cá nhân đang được viết theo thời gian | Ký ức |
| 2 | **Mirror** | Companion nhẹ nhàng phản chiếu bạn đang trở thành ai | Soi chiếu |
| 3 | **Nhật ký học tập** | Bản ghi đọc được về những gì đã học và đã tạo ra | Ghi nhớ |
| 4 | **Hành trình của tôi (Journey Map)** | Bản đồ các Chương cuộc đời | Định hướng |
| 5 | **Khu vườn của bạn** | Sự trưởng thành hiện thân thành khu vườn | Nuôi dưỡng |

Năm cánh cửa không phải 5 trang rời rạc — chúng đọc **cùng một lớp dữ liệu
thật** và kể **cùng một câu chuyện** bằng 5 ngôn ngữ khác nhau.

---

## 3. Information Architecture

```
📖 HÀNH TRÌNH CỦA TÔI (Journey Hub)
│
├── Lời chào của Companion (theo dữ liệu thật + thời điểm quay lại)
├── Chương hiện tại (từ Journey Map engine)
├── 5 thẻ cánh cửa (mỗi thẻ: là gì / vì sao quan trọng / dữ liệu thật nào / bước tiếp theo)
├── Hoạt động có ý nghĩa gần đây (lọc từ growth-view, KHÔNG phải raw log)
├── Câu hỏi suy ngẫm kế tiếp (reflection prompt — dẫn về Mirror/Story)
└── CTA "Tiếp tục hành trình" (điều hướng theo ngữ cảnh thật của người dùng)

    Cửa 1 — MY STORY            (cuốn sách: chương → khoảnh khắc → bước ngoặt)
    Cửa 2 — MIRROR              (nghi thức soi chiếu: tín hiệu → nhận định → câu hỏi)
    Cửa 3 — NHẬT KÝ HỌC TẬP     (dòng thời gian đọc được: sự kiện → bài học → sản phẩm → nên tiếp tục gì)
    Cửa 4 — JOURNEY MAP         (Chương cuộc đời: 5 chương, milestone thật, hướng đang đi)
    Cửa 5 — KHU VƯỜN CỦA BẠN    (giữ concept hiện có, tăng kết nối dữ liệu thật)
```

Quy tắc điều hướng: từ bất kỳ cửa nào cũng quay được về Hub bằng 1 chạm;
mỗi cửa liên kết chéo tối đa 2 cửa liên quan nhất (Story ↔ Mirror,
Journal ↔ Map, Garden ↔ Hub) — không tạo mê cung.

---

## 4. Route map

### Hiện trạng (đã đối chiếu code)

| Route | Hiện là gì | Ghi chú |
|---|---|---|
| `/portal/hanhtrinhcuatoi` | Trang Journey hub-sơ khai (JourneyHero, HubModuleGrid, GrowthActivityPanel, reflection prompts) | Canonical, có trong sidebar |
| `/portal/story` | My Story (timeline thật, thư tháng, ký ức Companion, nhật ký suy ngẫm, capsule form, Living Garden card) | Dữ liệu thật |
| `/portal/mirror` | Mirror Ceremony (tín hiệu thật, narrative, milestones) | Dữ liệu thật |
| `/portal/nhatkyhoctap` | Bài viết blog (admin store) + GrowthActivityPanel | ⚠️ Lệch bản chất — xem mục 7 |
| `/portal/khuvuoncuaban` | Garden (GardenScene + growth-view làm nguồn duy nhất) | Đã dọn seed giả |
| `/portal/hanh-trinh-cua-toi` | @archived — Sanctuary (route mồ côi, không nav nào trỏ tới) | Chờ quyết định — xem mục 13 |
| `/portal/journey` (+`/:path*`) | Redirect → `/portal/hanhtrinhcuatoi` (next.config.ts) | Giữ |

### Route map ĐỀ XUẤT sau tái cấu trúc

| Route | Vai trò | Hành động |
|---|---|---|
| `/portal/hanhtrinhcuatoi` | **Journey Hub** (mục 2) | Dựng lại theo mục "Journey Hub" |
| `/portal/story` | Cửa 1 — My Story | Giữ route, dựng lại trải nghiệm "cuốn sách" |
| `/portal/mirror` | Cửa 2 — Mirror | Giữ route, làm sâu thêm |
| `/portal/nhatkyhoctap` | Cửa 3 — Nhật ký học tập | Giữ route, đổi bản chất (mục 7) |
| `/portal/hanhtrinhcuatoi/ban-do` | Cửa 4 — Journey Map (MỚI) | Route mới, con của Hub |
| `/portal/khuvuoncuaban` | Cửa 5 — Garden | Giữ route |
| `/portal/hanh-trinh-cua-toi` | — | MERGE phần giá trị vào Mirror/Map rồi redirect 308 → `/portal/hanhtrinhcuatoi` (chờ PO duyệt, mục 13) |

Lý do không gộp 5 cửa thành route con của Hub ngay: 4/5 route đã canonical,
có backlink nội bộ khắp Portal; đổi URL hàng loạt tạo rủi ro không mang lại
giá trị người dùng. Chỉ Journey Map là route mới nên mới nằm dưới Hub.

---

## 5. Thiết kế My Story — "cuốn sách cá nhân"

**Ẩn dụ chủ đạo: một cuốn sách đang được viết, không phải một feed.**

Cấu trúc trang (từ trên xuống):

1. **Bìa sách** — tên người dùng + dòng khởi nguồn (origin line từ Core
   Memory nếu có) + "Chương hiện tại: …" (từ Journey Map engine). Typography
   lớn, tĩnh lặng, không số liệu.
2. **Mục lục chương** — các Chương cuộc đời đã đi qua (chỉ chương THẬT đã
   có bằng chứng; chương chưa tới hiển thị mờ "chưa viết").
3. **Những khoảnh khắc** (thân sách) — dòng kể chuyện thời gian từ dữ liệu
   thật: reflections, memory capsules (người dùng tự thêm — giữ nguyên
   AddMemoryCapsuleForm), milestone thật, output thật. Mỗi khoảnh khắc là
   một "đoạn văn" có ngày tháng, không phải một event log row.
4. **Bước ngoặt** — các khoảnh khắc được engine (growth-signals /
   human-understanding hiện có) đánh dấu là turning point, trình bày nổi
   bật như trang sách được gấp mép.
5. **Thư tháng** (MonthlyLetterCard — giữ) + **Ghi chú thấu hiểu**
   (UnderstandingNoteCard — giữ) đóng vai "lời bạt" cuối chương.
6. **Companion trong Story**: chỉ xuất hiện ở lề sách với câu hỏi nhân
   chứng ("Điều này đã thay đổi gì trong bạn?") — không bình luận đánh giá.

Điều chỉnh nội dung hiện có: `LivingGardenCard` + `GardenSignalSync` đang
nằm trong Story tạo Garden bản thứ hai → **MOVE** phần hiển thị về
`/portal/khuvuoncuaban` (một Garden duy nhất), Story chỉ giữ 1 dòng liên
kết "Khoảnh khắc này đã tưới cho khu vườn của bạn →".

Không viết truyện hộ người dùng. Không thêm khoảnh khắc bịa. Sách trống là
sách trống (xem mục 11).

---

## 6. Thiết kế Mirror — "tấm gương"

Giữ nền tảng đã có (MirrorCeremony, growth-signals, mirror-narrative,
growth-milestones, first-footprint — toàn bộ đọc dữ liệu thật) và làm sâu
theo hướng:

1. **Một phiên soi chiếu = 3 nhịp**:
   - *Nhìn lại*: "Ba tháng trước, bạn thường… Hôm nay, bạn đang…" (so sánh
     hai lát cắt thời gian từ signals thật — nếu chưa đủ 2 lát cắt, nói
     thật là chưa đủ).
   - *Nhận ra*: patterns / điểm mạnh / hành vi lặp lại / tín hiệu tăng
     trưởng / điểm mù / dự định dang dở (unfinished intentions — lấy từ
     reflections có câu hỏi chưa quay lại, capsule loại "dự định").
   - *Tự hỏi*: đúng MỘT câu hỏi mở, người dùng có thể trả lời ngay (ghi
     thành reflection mới) hoặc im lặng rời đi — cả hai đều hợp lệ.
2. **Giọng**: bình thản, trung thực, không phán xét, không tâng bốc. Cấm
   từ vựng KPI ("hiệu suất", "top %", "vượt mục tiêu").
3. **Không biểu đồ.** Mirror nói bằng câu chữ, tối đa một dải "hơi thở
   thời gian" (mốc mờ theo tháng) làm nền.
4. Mirror là cửa duy nhất được phép nói về **điểm mù** — và chỉ dưới dạng
   quan sát ("Bạn hay bắt đầu vào buổi tối và hay dừng ở bước xuất bản"),
   không bao giờ dưới dạng khuyết điểm.

---

## 7. Thiết kế Nhật ký học tập — "bản ghi đọc được"

**Vấn đề hiện trạng (phát hiện khi khảo sát):** trang `/portal/nhatkyhoctap`
hiện hiển thị **bài viết blog từ admin store** (`useCollection("blog")`) —
tức là nội dung VO DUONG AI viết, không phải nhật ký của người dùng. Đây là
lệch bản chất lớn nhất trong 5 cửa.

**Thiết kế mới:** Nhật ký học tập = dòng thời gian CÁ NHÂN, mỗi entry trả
lời đủ 4 câu:

| Câu hỏi | Nguồn dữ liệu thật |
|---|---|
| Chuyện gì đã xảy ra? | growth-view events (foundation), phiên Workspace, hoạt động CKOS/Academy/Projects/Premium |
| Tôi đã học được gì? | reflection gắn kèm sự kiện (nếu có), bài học người dùng tự ghi |
| Tôi đã tạo ra gì? | output thật của phiên Workspace, capsule loại "sản phẩm" |
| Tôi nên tiếp tục gì? | intention/next-step người dùng tự ghi hoặc Companion gợi mở (đánh dấu rõ là gợi mở) |

Trình bày: theo tuần ("Tuần của ngày …"), mỗi tuần là một trang nhật ký;
entry nào thiếu 3/4 câu vẫn hiển thị trung thực phần có thật.

**Nội dung blog hiện tại:** không xoá — phân loại **MOVE**: chuyển thành
khối phụ "Bài viết dành cho bạn" cuối trang (hoặc về Blog AI feed), không
còn chiếm vai chính. Quyết định cuối thuộc PO (mục 13).

---

## 8. Thiết kế Journey Map — "Chương cuộc đời"

Khung 5 chương chuẩn (định nghĩa chương sẽ quản trị được từ Admin — mục 17):

| Chương | Tên | Bằng chứng THẬT để một chương được tính là "đang mở" |
|---|---|---|
| 1 | Bắt đầu làm quen với AI | Tài khoản tồn tại + hoạt động đầu tiên bất kỳ (first footprint) |
| 2 | Biết sử dụng AI | Có phiên Workspace/bài học hoàn thành thật đầu tiên |
| 3 | Tạo ra Output đầu tiên | Có output thật đầu tiên (Workspace output / capsule "sản phẩm") |
| 4 | Xây hệ thống | Chuỗi output lặp lại có chủ đích / sở hữu chương trình hệ thống (V-Solo…) + hoạt động thật kèm theo |
| 5 | Giúp người khác | Tín hiệu chia sẻ/cộng đồng thật (future integration — đánh dấu chờ) |

Nguyên tắc:

- **Không có % chương.** Một chương chỉ có 3 trạng thái: `chưa viết` /
  `đang viết` / `đã đi qua` — dựa trên bằng chứng thật ở bảng trên.
- Người dùng có thể **tự xác nhận hoặc từ chối** việc sang chương ("Bạn có
  cảm thấy mình đã sang chương mới chưa?") — máy đề xuất, người quyết định.
- Trang gồm: dải 5 chương (chapter strip) → chương hiện tại phóng to
  (milestone thật + bước ngoặt + hướng đang đi) → "bước trưởng thành kế
  tiếp" (đúng MỘT bước, dẫn sang đúng pillar).
- Không vẽ chương giả: người mới chỉ thấy Chương 1 "đang viết" và 4 chương
  mờ — trung thực và đầy hứa hẹn cùng lúc.

---

## 9. Thiết kế Garden — giữ và tinh chỉnh

Garden (`/portal/khuvuoncuaban`) **giữ nguyên cấu trúc** — đã qua
reconstruction, dùng `growth-view.ts` làm nguồn duy nhất, đã dọn seed giả.
Chỉ cải thiện 4 điểm:

1. **Rõ nghĩa từng thực thể**: mỗi cây/mầm/tín hiệu có tooltip "vì sao nó
   ở đây" trỏ về đúng hoạt động thật đã nuôi nó (legend of meaning).
2. **Kết nối học tập thật**: hoạt động ở CKOS/Academy/Workspace hiện rõ
   ràng là "nước tưới" — dòng liên kết ngược về entry Nhật ký tương ứng.
3. **Companion trong vườn**: một câu quan sát mùa vụ theo dữ liệu thật
   ("Tuần này vườn bạn yên tĩnh" là câu hợp lệ), không nhắc nhở kiểu habit
   tracker, không streak.
4. **Hợp nhất Garden**: bản Garden phụ trong Story (LivingGardenCard) MOVE
   về đây (mục 5) — toàn Portal chỉ một khu vườn.

Không đập đi làm lại. Không thêm gamification mới.

---

## 10. Nguồn dữ liệu

| Nguồn | Hiện trạng trong code | Dùng cho |
|---|---|---|
| `reflections` (bảng Supabase) | ✅ Có, đang dùng ở Story/Mirror | Story, Mirror, Journal, Hub |
| `memory_capsules` (bảng Supabase) | ✅ Có, người dùng tự thêm | Story, Journal, Map |
| Companion memory (core-memory, origin, story-memory, living-stories) | ✅ Có | Hub greeting, Story bìa sách, Mirror |
| Growth view / foundation events (`growth-view.ts`) | ✅ Có (nguồn Garden) | Garden, Journal, Hub activity |
| Growth signals/milestones/narrative (`growth-map/*`) | ✅ Có | Mirror, Map, Story bước ngoặt |
| Human Story Engine (`supabase-human-story-engine.sql`, human-understanding) | ✅ Có | Story (ghi chú thấu hiểu), Mirror |
| Premium ownership (`orders` confirmed) | ✅ Có | Map (bằng chứng chương 4), Journal |
| Hoạt động CKOS | ⚠️ Một phần (saved/collection) | Journal — phần thiếu: **future integration** |
| Tiến độ Academy | ⚠️ Một phần (lesson mua lẻ; chưa có completion tracking) | Journal/Map — **future integration** (phụ thuộc Learning Platform — xem TECH_DEBT_LEARNING_PLATFORM.md) |
| Output Workspace | ⚠️ Phiên Companion Workspace có, việc lưu output bền vững cần xác minh khi triển khai | Journal, Map chương 3 |
| Hoạt động Projects | ❌ Chưa có tracking | **future integration** |
| Tín hiệu "giúp người khác" | ❌ Chưa có | Map chương 5 — **future integration** |

Quy tắc: nguồn nào ❌/⚠️ thì cửa tương ứng thiết kế empty state trung thực
(mục 11), TUYỆT ĐỐI không sinh dữ liệu thay thế.

---

## 11. Empty states — thiết kế sự trống trải trung thực

Empty state của Journey không phải màn hình lỗi — nó là **trang đầu của
cuốn sách chưa viết**. Chuẩn chung: (1) nói thật điều chưa có, (2) nói vì
sao nó sẽ có ý nghĩa, (3) chỉ MỘT hành động thật để bắt đầu.

| Cửa | Empty state |
|---|---|
| Hub | "Hành trình của bạn bắt đầu từ hôm nay. Chưa có gì để kể lại — và đó là điểm khởi đầu đẹp nhất." + CTA về Học viện AI |
| My Story | Bìa sách + trang trắng: "Trang đầu tiên đang chờ khoảnh khắc thật đầu tiên của bạn." + form capsule |
| Mirror | "Tấm gương cần thời gian mới phản chiếu được điều gì đó thật. Hãy quay lại sau khi bạn đã đi thêm vài bước." — không bịa nhận định |
| Journal | Tuần trống: "Tuần này chưa có gì được ghi lại." (không tô đỏ, không cảnh báo) |
| Map | Chương 1 "đang viết", 4 chương mờ "chưa viết" — chính empty state là bản đồ |
| Garden | Đất trống + một mầm: "Khu vườn mọc từ việc học thật — không thể tưới bằng dữ liệu giả." |

---

## 12. Trải nghiệm Companion trong Journey

**Companion = nhân chứng.** Bảng giọng:

| Được | Không được |
|---|---|
| "Tôi nhớ ngày bạn…" (chỉ khi có dữ liệu thật) | "Bạn đã đạt 80% mục tiêu!" |
| "Ba tháng trước bạn thường… hôm nay bạn đang…" | "Cố lên, đừng bỏ cuộc!" (động viên sáo rỗng) |
| "Điều này đã thay đổi gì trong bạn?" | "Bạn nên mua V-Solo để tiến bộ nhanh hơn" (bán hàng) |
| Im lặng khi không có gì đáng nói | Lấp đầy khoảng trống bằng lời khuyên chung chung |

Vị trí xuất hiện: Hub (lời chào theo ngữ cảnh thật), Story (câu hỏi lề
sách), Mirror (người dẫn nghi thức 3 nhịp), Journal (một dòng chứng kiến
cuối tuần), Map (đề xuất sang chương — người dùng quyết), Garden (quan sát
mùa vụ). Mỗi cửa tối đa MỘT sự hiện diện Companion — không rải khắp trang.

---

## 13. Kế hoạch bảo tồn nội dung (phân loại)

| Nội dung hiện có | Phân loại | Ghi chú |
|---|---|---|
| My Story: timeline thật, MonthlyLetter, CompanionMemory, ReflectionJournal, AddMemoryCapsuleForm, UnderstandingNote, HumanGrowthDashboard | **KEEP + IMPROVE** | Tái bố cục theo ẩn dụ cuốn sách (mục 5) |
| LivingGardenCard + GardenSignalSync (trong Story) | **MOVE** | Về Garden — một khu vườn duy nhất |
| Mirror Ceremony + toàn bộ growth-map engine | **KEEP + IMPROVE** | Nền của Mirror 3 nhịp |
| Reflection Journal / Memory Capsule / Human Story Engine | **KEEP** | Xương sống dữ liệu của cả platform |
| `/portal/nhatkyhoctap` — GrowthActivityPanel | **KEEP + IMPROVE** | Thành nguồn entry Journal |
| `/portal/nhatkyhoctap` — bài viết blog (admin store) | **MOVE** | Xuống khối phụ "Bài viết dành cho bạn" hoặc về Blog AI — PO chọn |
| `/portal/hanhtrinhcuatoi` — JourneyHero, HubModuleGrid, prompts | **KEEP + IMPROVE** | Thành Journey Hub |
| `/portal/hanh-trinh-cua-toi` (Sanctuary @archived) | **MERGE → ARCHIVE** | Đề xuất: thought-seeds + reflection questions + không khí tĩnh lặng MERGE vào Mirror/Map; sau đó route redirect về Hub. Cần PO duyệt vì trước đây PO yêu cầu giữ nguyên chờ đánh giá |
| Garden (`/portal/khuvuoncuaban`) + GardenScene | **KEEP + IMPROVE** | Mục 9 |
| KnowledgeJourneyStrip / CompanionMemoryLine trên trang Journey | **KEEP** | Điều hướng chéo |
| **DELETE** | *(không có)* | Không phát hiện nội dung vô giá trị cần xoá ở phase thiết kế này |

---

## 14. Trang nào nên GỘP

1. **Garden phụ trong Story** gộp về Garden chính (một nguồn hiển thị).
2. **Sanctuary** (`/portal/hanh-trinh-cua-toi`) gộp phần giá trị vào
   Mirror (không khí tĩnh + câu hỏi suy ngẫm) và Map (journey stages làm
   tham khảo cho chapter strip) — sau khi PO duyệt.
3. **GrowthActivityPanel** đang lặp ở 3 trang (Journey, Garden, Journal) —
   gộp về một biến thể duy nhất đặt ở Journal (nơi nó đúng bản chất nhất),
   Hub hiển thị bản rút gọn "hoạt động có ý nghĩa".

## 15. Trang nào GIỮ RIÊNG

Cả 5 cửa giữ route riêng (lý do ở mục 4). Đặc biệt **không** gộp Mirror
vào Story: một bên là ký ức (nhìn lại), một bên là soi chiếu (nhìn vào
trong) — gộp sẽ giết cả hai trải nghiệm. Garden giữ riêng vì là trải
nghiệm thị giác độc lập đã hoạt động.

## 16. Route nào REDIRECT

| Redirect | Đích | Khi nào |
|---|---|---|
| `/portal/journey`, `/portal/journey/:path*` | `/portal/hanhtrinhcuatoi` | ✅ Đã có — giữ |
| `/portal/hanh-trinh-cua-toi` | `/portal/hanhtrinhcuatoi` | Sau khi MERGE Sanctuary được PO duyệt (Phase 5) |
| *(không thêm redirect nào khác)* | | 5 route cửa giữ nguyên URL |

---

## 17. Yêu cầu Admin tương lai (CMS-first)

Thiết kế để về sau quản trị được từ Admin Platform (chưa xây — cùng đợt
với Learning Platform, xem TECH_DEBT_LEARNING_PLATFORM.md):

1. **Định nghĩa Chương cuộc đời**: tên, mô tả, quy tắc bằng chứng của từng
   chương — sửa được không cần code.
2. **Thư viện reflection prompts** (Hub + Mirror): thêm/sửa/tắt câu hỏi.
3. **Khung Thư tháng**: mẫu lời bạt Companion theo tháng.
4. **Bảng ánh xạ "hoạt động → ý nghĩa"** cho Journal/Garden (sự kiện nào
   được coi là có ý nghĩa, nghĩa là gì).
5. **Feature flag từng cửa** (bật/tắt Journey Map khi chưa sẵn sàng…).
6. **Kiểm duyệt hiển thị**: quyền ẩn một capsule/entry nếu có vấn đề.
7. Nội dung blog trong Journal (nếu giữ khối phụ) tiếp tục quản trị qua
   admin store hiện có.

---

## 18. Các phase triển khai (sau khi tài liệu này được duyệt)

| Phase | Nội dung | Phụ thuộc |
|---|---|---|
| **P0** | PO duyệt tài liệu này + chốt 2 quyết định mở: (a) số phận khối blog trong Journal, (b) MERGE Sanctuary | — |
| **P1** | Journey Hub mới tại `/portal/hanhtrinhcuatoi` (greeting, chương hiện tại, 5 thẻ cửa, hoạt động ý nghĩa, prompt, CTA) | P0 |
| **P2** | Journey Map engine (trạng thái 3 mức của chương, bằng chứng thật) + trang `/ban-do` | P1 |
| **P3** | My Story tái bố cục "cuốn sách" + MOVE Garden card | P1 |
| **P4** | Nhật ký học tập đổi bản chất (entry 4 câu, tuần nhật ký, blog xuống khối phụ) | P1 |
| **P5** | Mirror 3 nhịp + MERGE Sanctuary + redirect route cũ | P2 |
| **P6** | Garden tinh chỉnh (legend nghĩa, liên kết Journal, Companion mùa vụ) | P4 |
| **P7** | Audit chéo toàn platform: giọng Companion, empty states, cross-links, responsive, NO-FAKE-DATA final check | P1–P6 |

Mỗi phase: build sạch + audit trung thực dữ liệu trước khi sang phase sau.
Không phase nào đụng vào Learning Platform (nợ kỹ thuật đã phê duyệt).

---

*Tài liệu design-only. Không có dòng code nào được thay đổi kèm theo nó.*
